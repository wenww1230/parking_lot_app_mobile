import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'parking_lot.db';

async function openDatabase(): Promise<SQLiteDatabase> {
  return SQLite.openDatabase({name: DB_NAME, location: 'default'});
}

async function runMigration(db: SQLiteDatabase): Promise<void> {
  try {
    await db.executeSql('ALTER TABLE parking_history ADD COLUMN estado_pago TEXT DEFAULT \'PENDIENTE\'');
  } catch {}
  try {
    await db.executeSql('ALTER TABLE parking_history ADD COLUMN tariff_amount REAL');
  } catch {}
  try {
    await db.executeSql('CREATE TABLE IF NOT EXISTS tariffs (id INTEGER PRIMARY KEY AUTOINCREMENT, vehicle_type_id INTEGER UNIQUE, amount REAL, FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id))');
  } catch {}
  try {
    await db.executeSql('ALTER TABLE parking_history ADD COLUMN paid_amount REAL DEFAULT 0');
  } catch {}
  try {
    await db.executeSql(
      "UPDATE parking_history SET paid_amount = soles WHERE estado_pago = 'PAGADO' AND COALESCE(paid_amount, 0) = 0"
    );
  } catch {}
  try {
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        fecha TEXT NOT NULL,
        detalle TEXT,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  } catch {}
}

export async function initDatabase(): Promise<SQLiteDatabase> {
  const db = await openDatabase();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role_id TEXT NOT NULL,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS vehicle_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS tariffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_type_id INTEGER UNIQUE,
      amount REAL,
      FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id)
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type_id INTEGER,
      color TEXT,
      placa TEXT,
      marca TEXT,
      FOREIGN KEY (type_id) REFERENCES vehicle_types(id)
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS client_vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      UNIQUE(client_id, vehicle_id),
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS parking_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_vehicle_id INTEGER,
      hora_ingreso TEXT,
      hora_salida TEXT,
      detalle TEXT,
      soles REAL,
      tariff_amount REAL,
      estado_pago TEXT DEFAULT 'PENDIENTE',
      FOREIGN KEY (client_vehicle_id) REFERENCES client_vehicles(id)
    );
  `);
  await runMigration(db);
  await db.executeSql(`
    INSERT OR IGNORE INTO roles (id, name) VALUES ('support', 'Support User'), ('normal', 'Normal User');
  `);
  const [vehicleTypesResult] = await db.executeSql('SELECT COUNT(*) as c FROM vehicle_types');
  if (vehicleTypesResult.rows.item(0).c === 0) {
    await db.executeSql(`
      INSERT INTO vehicle_types (name) VALUES
        ('Auto'), ('Moto'), ('Camión'), ('Camioneta'), ('Mototaxi');
    `);
    const [vtRows] = await db.executeSql('SELECT id, name FROM vehicle_types');
    const types: {id: number; name: string}[] = [];
    for (let i = 0; i < vtRows.rows.length; i++) {
      const r = vtRows.rows.item(i);
      types.push({id: r.id, name: r.name});
    }
    const tariffMap: Record<string, number> = {
      'Auto': 7, 'Camión': 10, 'Moto': 5, 'Mototaxi': 5, 'Camioneta': 8,
    };
    for (const t of types) {
      const amount = tariffMap[t.name] ?? 7;
      await db.executeSql('INSERT OR REPLACE INTO tariffs (vehicle_type_id, amount) VALUES (?, ?)', [t.id, amount]);
    }
  }
  const [usersResult] = await db.executeSql('SELECT COUNT(*) as c FROM users');
  if (usersResult.rows.item(0).c === 0) {
    await db.executeSql(`
      INSERT INTO users (username, password, role_id) VALUES
        ('admin', 'admin123', 'support'),
        ('user', 'user123', 'normal');
    `);
  }
  return db;
}

let dbInstance: SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

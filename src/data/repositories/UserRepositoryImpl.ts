import {getDb} from '../datasources/SqliteDatabase';
import {User} from '../../domain/entities/User';
import {IUserRepository} from '../../domain/repositories/IUserRepository';

export class UserRepositoryImpl implements IUserRepository {
  async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
    const db = await getDb();
    const [result] = await db.executeSql(
      'SELECT id, username, role_id as roleId FROM users WHERE username = ? AND password = ?',
      [username.trim(), password.trim()]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return {
      id: row.id,
      username: row.username,
      roleId: row.roleId,
    };
  }
}

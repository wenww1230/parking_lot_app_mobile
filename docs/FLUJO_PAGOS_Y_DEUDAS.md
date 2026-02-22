# Flujo de pagos y relación Historial de Tarifas / Historial de Aparcamientos

## Resumen del modelo

El sistema maneja dos conceptos centrales:

1. **Tarifas** (tariffs): definen el precio por tipo de vehículo (Auto, Moto, etc.)
2. **Historial de aparcamientos** (parking_history): cada registro es un estacionamiento concreto de un vehículo de un cliente

La relación entre ambos es: al registrar un aparcamiento, el **precio lo define la tarifa** según el tipo de vehículo. Ese valor se guarda como `soles` (y `tariff_amount`) en el registro.

---

## 1. Tarifas (tabla `tariffs`)

| Campo             | Descripción                                   |
|-------------------|-----------------------------------------------|
| id                | Identificador                                 |
| vehicle_type_id   | Tipo de vehículo (Auto, Moto, Camión, etc.)   |
| amount            | Monto en soles por estacionamiento            |

- Una tarifa por tipo de vehículo.
- Se editan en la pantalla "Tarifas".
- Al crear un nuevo registro de aparcamiento, se busca la tarifa del tipo de vehículo y se usa como precio base.

---

## 2. Historial de aparcamientos (tabla `parking_history`)

| Campo             | Descripción                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| id                | Identificador del registro                                                  |
| client_vehicle_id | Relación cliente-vehículo (quién aparcó qué)                                |
| hora_ingreso      | Hora de ingreso (Perú UTC-5)                                                |
| hora_salida       | Hora de salida (al cerrar el registro)                                      |
| detalle           | Detalle opcional                                                            |
| soles             | Precio según tarifa (lo que debe pagar)                                     |
| tariff_amount     | Copia del monto de la tarifa al momento del registro                        |
| paid_amount       | Lo que el cliente ya ha pagado (abonos parciales o totales)                 |

### Estado de pago (calculado)

- **PAGADO**: `paid_amount >= soles`
- **DEUDA**: `paid_amount < soles`, debe `soles - paid_amount`

---

## 3. Flujo de negocio

### 3.1 Al registrar el aparcamiento (entrada)

1. Usuario elige cliente y vehículo.
2. La tarifa del tipo de vehículo define el monto (`soles`).
3. El cliente puede pagar:
   - **Total**: se guarda `pagoAlMomento = soles` → registro pagado.
   - **Parcial**: se guarda `pagoAlMomento` (ej. 3 de 7) → queda deuda.
   - **Nada**: `pagoAlMomento = 0` → queda deuda completa.

### 3.2 Al día siguiente (cuando el cliente va a sacar el vehículo)

1. Usuario abre el registro desde el historial (Editar registro).
2. Se muestran dos datos:
   - **Deuda este aparcamiento**: `soles - paid_amount` del registro actual.
   - **Deuda histórica**: suma de `(soles - paid_amount)` de *otros* registros del mismo cliente (cualquier vehículo), distintos al actual.
3. **Total a cobrar** = Deuda este aparcamiento + Deuda histórica.

### 3.3 Formas de cobrar

- **Abonar**: se suma un monto a `paid_amount` del registro actual.
- **Marcar como pagado**: se pone `paid_amount = soles` (solo para el registro actual).
- **Registrar pago** (pantalla Clientes que deben): se registra un pago general del cliente; se reparte automáticamente (FIFO) entre registros con deuda.

---

## 4. Diagrama de relaciones

```
vehicle_types (Auto, Moto, ...)
       │
       ▼
   tariffs (monto por tipo)
       │
       │  Al crear registro: se usa para "soles"
       ▼
parking_history ◄── client_vehicles ──► clients
       │                    │
       │  paid_amount       │
       │  (lo pagado)       └── vehicles
       │
       └── balance = soles - paid_amount
```

### Deuda por cliente

La **deuda total de un cliente** es la suma de `(soles - paid_amount)` de todos sus registros de aparcamiento con saldo pendiente (vía `client_vehicles` → `client_id`).

---

## 5. Tabla `payments`

Registra pagos realizados por el cliente (no ligados a un registro concreto):

| Campo    | Descripción        |
|----------|--------------------|
| client_id| Cliente que paga   |
| amount   | Monto pagado       |
| fecha    | Fecha del pago     |
| detalle  | Detalle opcional   |

Al registrar un pago, el sistema asigna el monto a los registros con deuda del cliente (orden FIFO por `hora_ingreso`), actualizando `paid_amount` de cada registro hasta agotar el monto.

---

## 6. Resumen rápido

| Concepto                     | Dónde se define        | Dónde se usa                        |
|-----------------------------|------------------------|--------------------------------------|
| Precio por tipo de vehículo | Pantalla Tarifas       | Al crear registro ( campo soles )    |
| Lo que debe por registro    | `soles` en parking_history | En historial y pantalla de edición |
| Lo que ha pagado por registro | `paid_amount`       | Actualizado con abonos o asignación  |
| Deuda histórica             | Suma de registros con saldo | En pantalla Editar registro      |
| Deuda del aparcamiento actual | `soles - paid_amount` del registro | En pantalla Editar registro   |

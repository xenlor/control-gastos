# Estructura de la Base de Datos

La aplicación utiliza PostgreSQL como base de datos relacional y Prisma como ORM.

## Modelos Principales

### Usuarios y Autenticación
- **User**: Almacena la información de los usuarios (nombre, username, contraseña hasheada, rol).
- **Session**: Gestiona las sesiones de usuario para la autenticación.

### Finanzas
- **Ingreso**: Registros de ingresos monetarios.
- **Gasto**: Registros de gastos, vinculados a una categoría.
- **Categoria**: Categorías para clasificar los gastos (ej: Comida, Transporte).
- **Ahorro**: Registros de ahorros.
- **Prestamo**: Gestión de préstamos personales (dinero prestado a otros).
- **Plazo**: Gestión de compras a plazos o deudas.

### Gastos Compartidos
- **GastoCompartido**: Un gasto que se divide entre varios miembros.
- **Miembro**: Personas que participan en los gastos compartidos.
- **MiembroGastoCompartido**: Snapshot de la participación de un miembro en un gasto específico en el momento de su creación.

### Configuración
- **Configuracion**: Preferencias del usuario (ej: porcentaje de ahorro objetivo).

## Diagrama Entidad-Relación

```mermaid
erDiagram
    User ||--o{ Session : "has"
    User ||--o{ Gasto : "creates"
    User ||--o{ Ingreso : "creates"
    User ||--o{ Prestamo : "creates"
    User ||--o{ GastoCompartido : "creates"
    User ||--o{ Ahorro : "creates"
    User ||--o{ Categoria : "creates"
    User ||--o{ Plazo : "creates"
    User ||--o{ Miembro : "creates"
    User ||--o| Configuracion : "has"

    Gasto }|--|| Categoria : "belongs to"
    Gasto }|--o| GastoCompartido : "part of"
    
    GastoCompartido ||--o{ MiembroGastoCompartido : "includes"
    GastoCompartido ||--o{ Gasto : "contains"
    
    MiembroGastoCompartido }|--|| GastoCompartido : "belongs to"

    User {
        string id PK
        string username
        string role
    }

    Gasto {
        int id PK
        float monto
        string descripcion
        int categoriaId FK
        int gastoCompartidoId FK
    }

    Ingreso {
        int id PK
        float monto
        string descripcion
    }

    Categoria {
        int id PK
        string nombre
        string color
    }

    GastoCompartido {
        int id PK
        string descripcion
        float montoTotal
        datetime fecha
    }

    Prestamo {
        int id PK
        string persona
        float monto
        datetime fechaPrestamo
        datetime fechaRecordatorio
        boolean pagado
    }

    Ahorro {
        int id PK
        float monto
        string descripcion
        datetime fecha
    }

    Plazo {
        int id PK
        string descripcion
        float montoTotal
        int totalCuotas
        int cuotasPagadas
        float montoCuota
        datetime fechaInicio
        string estado
    }

    Miembro {
        int id PK
        string nombre
        float ingresoMensual
        boolean esUsuario
    }

    Configuracion {
        int id PK
        float porcentajeAhorro
    }

    Session {
        string id PK
        string sessionToken
        datetime expires
    }

    MiembroGastoCompartido {
        int id PK
        string nombre
        float ingresoMensual
        boolean esUsuario
    }
```

## Relaciones Clave
- Todos los modelos financieros (`Gasto`, `Ingreso`, etc.) están vinculados a un `User` mediante `userId`, asegurando el aislamiento de datos.
- Los `Gastos` pueden estar vinculados a un `GastoCompartido` para reflejar la parte proporcional que le corresponde al usuario.

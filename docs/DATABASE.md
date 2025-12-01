# Documentación de Base de Datos

## Acceso por Consola (CLI)

Para acceder a la base de datos PostgreSQL corriendo en Docker y ejecutar consultas SQL directamente:

1.  Abre una terminal (PowerShell o CMD).
2.  Ejecuta el siguiente comando:

```bash
docker exec -it control-gastos-db psql -U admin -d control_gastos
```

### Comandos Útiles de `psql`

*   `\dt`: Listar todas las tablas.
*   `\d nombre_tabla`: Ver la estructura de una tabla específica.
*   `SELECT * FROM "User";`: Ver todos los usuarios (nota las comillas dobles si la tabla tiene mayúsculas).
*   `\q`: Salir.

---

## Esquema Relacional (ERD)

A continuación se muestra el diagrama entidad-relación de la base de datos actual:

```mermaid
erDiagram
    User ||--o{ Account : "has"
    User ||--o{ Session : "has"
    User ||--o{ Ingreso : "creates"
    User ||--o{ Gasto : "creates"
    User ||--o{ Prestamo : "creates"
    User ||--o{ Plazo : "creates"
    User ||--o{ GastoCompartido : "creates"
    User ||--o{ Ahorro : "creates"
    User ||--o{ Categoria : "defines"

    Gasto }|--|| Categoria : "belongs to"
    Gasto }o--|| GastoCompartido : "part of"
    GastoCompartido ||--|{ MiembroGastoCompartido : "has members"

    User {
        String id PK
        String name
        String email
        String password
        String image
    }

    Account {
        String id PK
        String userId FK
        String provider
        String providerAccountId
    }

    Session {
        String id PK
        String userId FK
        String sessionToken
    }

    Ingreso {
        Int id PK
        Float monto
        String descripcion
        DateTime fecha
        String userId FK
    }

    Gasto {
        Int id PK
        Float monto
        String descripcion
        Int categoriaId FK
        Int gastoCompartidoId FK
        String userId FK
    }

    Categoria {
        Int id PK
        String nombre
        String color
        String icono
        String userId FK
    }

    Prestamo {
        Int id PK
        String persona
        Float monto
        Boolean pagado
        String userId FK
    }

    Plazo {
        Int id PK
        String descripcion
        Float montoTotal
        Int totalCuotas
        String estado
        String userId FK
    }

    GastoCompartido {
        Int id PK
        String descripcion
        Float montoTotal
        String userId FK
    }

    MiembroGastoCompartido {
        Int id PK
        String nombre
        Float ingresoMensual
        Boolean esUsuario
        Int gastoCompartidoId FK
    }

    Ahorro {
        Int id PK
        Float monto
        String descripcion
        String userId FK
    }

    Configuracion {
        Int id PK
        Float porcentajeAhorro
    }
```

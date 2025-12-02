# API Reference - Server Actions

Esta documentación detalla todas las Server Actions disponibles en la aplicación. Todas las actions están protegidas y requieren autenticación.

## 📋 Índice

- [Autenticación](#autenticación)
- [Administración](#administración)
- [Gastos](#gastos)
- [Ingresos](#ingresos)
- [Ahorros](#ahorros)
- [Inversiones](#inversiones)
- [Préstamos](#préstamos)
- [Plazos](#plazos)
- [Gastos Compartidos](#gastos-compartidos)
- [Configuración](#configuración)
- [General](#general)

---

## Autenticación

### `signIn(credentials)`
Autentica un usuario con username y contraseña.

**Parámetros:**
- `username` (string) - Nombre de usuario
- `password` (string) - Contraseña

**Retorna:** Sesión o error

---

## Administración

Ubicación: `src/app/actions/admin.ts`

### `getUsers()`
Obtiene todos los usuarios registrados con sus estadísticas.

**Retorna:**
```typescript
{
  id: string
  username: string
  name: string
  role: string
  createdAt: Date
  _count: {
    gastos: number
    ingresos: number
  }
}[]
```

### `resetPassword(userId, newPassword)`
Resetea la contraseña de un usuario (solo ADMIN).

**Parámetros:**
- `userId` (string) - ID del usuario
- `newPassword` (string) - Nueva contraseña (mínimo 6 caracteres)

**Retorna:** `{ success: boolean, error?: string }`

### `deleteUser(userId)`
Elimina un usuario y todos sus datos (solo ADMIN).

**Parámetros:**
- `userId` (string) - ID del usuario a eliminar

**Retorna:** `{ success: boolean, error?: string }`

---

## Gastos

Ubicación: `src/app/actions/gastos.ts`

### `getGastos(month?, year?)`
Obtiene los gastos del usuario, opcionalmente filtrados por mes/año.

**Parámetros:**
- `month` (number, opcional) - Mes (0-11)
- `year` (number, opcional) - Año

**Retorna:** Array de gastos con categoría incluida

### `addGasto(formData)`
Crea un nuevo gasto.

**FormData:**
- `monto` (number) - Cantidad gastada
- `descripcion` (string) - Descripción del gasto
- `categoriaId` (number) - ID de la categoría
- `fecha` (string) - Fecha en formato ISO
- `gastoCompartidoId` (number, opcional) - ID del gasto compartido

**Retorna:** `{ success: boolean, error?: string }`

### `deleteGasto(id)`
Elimina un gasto del usuario.

**Parámetros:**
- `id` (number) - ID del gasto

**Retorna:** `{ success: boolean }`

---

## Ingresos

Ubicación: `src/app/actions/ingresos.ts`

### `getIngresos(month?, year?)`
Obtiene los ingresos del usuario.

**Parámetros:**
- `month` (number, opcional) - Mes (0-11)
- `year` (number, opcional) - Año

**Retorna:** Array de ingresos

### `addIngreso(formData)`
Crea un nuevo ingreso.

**FormData:**
- `monto` (number) - Cantidad ingresada
- `descripcion` (string) - Descripción
- `fecha` (string) - Fecha en formato ISO

**Retorna:** `{ success: boolean, error?: string }`

### `deleteIngreso(id)`
Elimina un ingreso.

**Parámetros:**
- `id` (number) - ID del ingreso

**Retorna:** `{ success: boolean }`

---

## Ahorros

Ubicación: `src/app/actions/ahorros.ts`

### `getAhorros(month?, year?)`
Obtiene los ahorros del usuario.

**Parámetros:**
- `month` (number, opcional)
- `year` (number, opcional)

**Retorna:** Array de ahorros

### `getSavingsAnalysis(month, year)`
Calcula estadísticas de ahorro del mes.

**Parámetros:**
- `month` (number) - Mes (0-11)
- `year` (number) - Año

**Retorna:**
```typescript
{
  totalAhorrado: number          // Ahorrado este mes
  accumulatedSavings: number    // Total acumulado
  percentageSaved: number       // % ahorrado vs ingresos
  target: number                // Meta de ahorro
  progress: number              // Progreso hacia la meta
}
```

### `addAhorro(formData)`
Registra un ahorro.

**FormData:**
- `monto` (number)
- `descripcion` (string)
- `fecha` (string)

**Retorna:** `{ success: boolean }`

### `deleteAhorro(id)`
Elimina un ahorro.

**Parámetros:**
- `id` (number)

**Retorna:** `{ success: boolean }`

---

## Inversiones

Ubicación: `src/app/actions/inversiones.ts`

### `getInversiones(month?, year?)`
Obtiene las inversiones del usuario.

**Parámetros:**
- `month` (number, opcional)
- `year` (number, opcional)

**Retorna:** Array de inversiones

### `getInvestmentSummary(month?, year?)`
Calcula resumen de inversiones.

**Retorna:**
```typescript
{
  totalInvertido: number        // Total invertido (histórico)
  invertidoEsteMes: number     // Invertido en el mes especificado
  count: number                 // Número de inversiones
}
```

### `addInversion(formData)`
Registra una inversión.

**FormData:**
- `tipo` (string) - `ETF`, `Cripto`, `Accion`, `Fondo`
- `nombre` (string) - Nombre del activo
- `monto` (number) - Monto invertido
- `fecha` (string)
- `notas` (string, opcional)

**Retorna:** `{ success: boolean, error?: string }`

### `deleteInversion(id)`
Elimina una inversión.

**Parámetros:**
- `id` (number)

**Retorna:** `{ success: boolean }`

---

## Préstamos

Ubicación: `src/app/actions/prestamos.ts`

### `getPrestamos()`
Obtiene todos los préstamos del usuario.

**Retorna:** Array de préstamos

### `addPrestamo(formData)`
Crea un préstamo.

**FormData:**
- `persona` (string) - Persona a quien se presta
- `monto` (number)
- `fechaPrestamo` (string)
- `fechaRecordatorio` (string)

**Retorna:** `{ success: boolean }`

### `togglePrestamoPagado(id, pagado)`
Marca un préstamo como pagado/pendiente.

**Parámetros:**
- `id` (number) - ID del préstamo
- `pagado` (boolean) - Nuevo estado

**Retorna:** `{ success: boolean, error?: string }`

**Comportamiento:**
- Si `pagado = true`: Crea un ingreso automático con la devolución
- Si `pagado = false`: Elimina el ingreso asociado

### `deletePrestamo(id)`
Elimina un préstamo.

**Parámetros:**
- `id` (number)

**Retorna:** `{ success: boolean }`

---

## Plazos

Ubicación: `src/app/actions/plazos.ts`

### `getPlazos()`
Obtiene todos los plazos del usuario.

**Retorna:** Array de plazos

### `addPlazo(formData)`
Crea un plazo.

**FormData:**
- `descripcion` (string)
- `montoTotal` (number)
- `totalCuotas` (number)
- `montoCuota` (number)
- `fechaInicio` (string)

**Retorna:** `{ success: boolean }`

### `pagar Cuota(id)`
Paga una cuota del plazo.

**Parámetros:**
- `id` (number) - ID del plazo

**Retorna:** `{ success: boolean, error?: string }`

**Comportamiento:**
- Incrementa `cuotasPagadas`
- Crea un gasto automático por el monto de la cuota
- Si completa todas las cuotas, marca como "Pagado"

### `revertCuota(id)`
Revierte el pago de la última cuota.

**Parámetros:**
- `id` (number)

**Retorna:** `{ success: boolean }`

### `deletePlazo(id)`
Elimina un plazo.

**Parámetros:**
- `id` (number)

**Retorna:** `{ success: boolean }`

---

## Gastos Compartidos

Ubicación: `src/app/actions/gastos-compartidos.ts`

### `getGastosCompartidos()`
Obtiene todos los gastos compartidos del usuario.

**Retorna:** Gastos compartidos con miembros incluidos

### `addGastoCompartido(formData)`
Crea un gasto compartido.

**FormData:**
- `descripcion` (string)
- `montoTotal` (number)
- `fecha` (string)
- `miembros` (string) - JSON array de `{ miembroId: number, proporcion: number }[]`

**Retorna:** `{ success: boolean, error?: string }`

**Comportamiento:**
- Calcula proporción de cada miembro según su ingreso mensual
- Crea un gasto individual para el usuario con su parte
- Guarda snapshot de participación de cada miembro

### `updateGastoCompartido(id, formData)`
Actualiza un gasto compartido existente.

**Parámetros:**
- `id` (number)
- `formData` - Igual que `addGastoCompartido`

**Retorna:** `{ success: boolean }`

### `deleteGastoCompartido(id)`
Elimina un gasto compartido y sus registros asociados.

**Parámetros:**
- `id` (number)

**Retorna:** `{ success: boolean }`

---

## Configuración

Ubicación: `src/app/actions/configuracion.ts` y `src/app/actions/settings.ts`

### `getConfiguracion()`
Obtiene la configuración del usuario.

**Retorna:**
```typescript
{
  id: number
  porcentajeAhorro: number
  userId: string
}
```

### `updateConfiguracion(porcentajeAhorro)`
Actualiza el porcentaje de ahorro objetivo.

**Parámetros:**
- `porcentajeAhorro` (number) - Porcentaje (0-100)

**Retorna:** `{ success: boolean }`

### `updateProfile(formData)`
Actualiza el perfil del usuario.

**FormData:**
- `name` (string) - Nombre del usuario

**Retorna:** `{ success: boolean }`

### `changePassword(formData)`
Cambia la contraseña del usuario.

**FormData:**
- `currentPassword` (string)
- `newPassword` (string)
- `confirmPassword` (string)

**Retorna:** `{ success: boolean, error?: string }`

---

## General

Ubicación: `src/app/actions/general.ts`

### `getAvailableMonths()`
Obtiene todos los meses que tienen datos (gastos, ingresos, ahorros o inversiones).

**Retorna:**
```typescript
{
  month: number    // 0-11
  year: number
  label: string    // "Enero 2024"
}[]
```

**Uso:** Para poblar selectores de mes en filtros

---

## Seguridad y Validación

### Autenticación
Todas las Server Actions validan que el usuario esté autenticado usando `getCurrentUser()`:

```typescript
const user = await getCurrentUser()
if (!user) throw new Error('Not authenticated')
```

### Aislamiento de Datos
Todas las queries filtran por `userId` para garantizar que los usuarios solo accedan a sus propios datos:

```typescript
where: { userId: user.id }
```

### Validación de Permisos
Las operaciones de modificación (update, delete) verifican que el registro pertenezca al usuario:

```typescript
const record = await prisma.model.findUnique({ where: { id } })
if (record.userId !== user.id) throw new Error('Unauthorized')
```

### Roles
- **USER**: Acceso a todas las funciones personales
- **ADMIN**: Acceso completo + panel de administración de usuarios

---

## Manejo de Errores

Todas las Server Actions siguen un patrón consistente:

```typescript
try {
  // Lógica de negocio
  return { success: true }
} catch (error) {
  console.error('Error:', error)
  return { success: false, error: 'Mensaje de error' }
}
```

Los errores se registran en consola para debugging y se devuelven mensajes user-friendly al cliente.

## Revalidación

Las actions que modifican datos llaman a `revalidatePath()` para actualizar la UI:

```typescript
revalidatePath('/gastos')      // Revalida página específica
revalidatePath('/')            // Revalida dashboard
```

Esto asegura que los cambios se reflejen inmediatamente sin necesidad de refresh manual.


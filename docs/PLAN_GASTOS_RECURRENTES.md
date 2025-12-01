# Plan de Implementación: Gastos Recurrentes y Fijos

## 1. El Concepto: "Plantillas de Gastos"

Para manejar gastos que se repiten (alquiler, luz, Netflix), la mejor estrategia no es crear los gastos automáticamente "a ciegas", sino tener **Plantillas de Gastos Recurrentes**.

### ¿Por qué Plantillas?
Porque, como bien dices, la luz no siempre cuesta lo mismo.
*   **Netflix (Fijo):** Siempre son 15€.
*   **Luz (Variable):** Un mes son 40€, otro 60€.

## 2. Flujo de Trabajo Propuesto

1.  **Configuración:** Creas una "Suscripción" o "Gasto Recurrente" indicando:
    *   Nombre: "Luz Endesa"
    *   Monto Estimado: 50€ (Referencia)
    *   Día de cobro: 5 de cada mes
    *   Es Compartido: Sí/No

2.  **El Dashboard (La Magia):**
    *   Al inicio del mes, el sistema te muestra una tarjeta: **"Gastos Pendientes de este Mes"**.
    *   Aparece una lista con tus recurrentes: Alquiler, Luz, Netflix.

3.  **La Acción "Confirmar/Pagar":**
    *   Cada ítem tiene un botón **"Registrar"**.
    *   **Caso Fijo (Netflix):** Al hacer clic, se crea el gasto de 15€ inmediatamente.
    *   **Caso Variable (Luz):** Al hacer clic, se abre una ventanita preguntando: *"¿Cuánto vino de luz este mes?"*. El campo viene con los 50€ estimados, pero tú lo corriges a 54.30€ y guardas.

## 3. Cambios Técnicos Necesarios

### A. Base de Datos (Schema)
Necesitamos una nueva tabla `GastoRecurrente` (o `Subscription`):

```prisma
model GastoRecurrente {
  id            Int      @id @default(autoincrement())
  descripcion   String
  montoEstimado Float    // Valor por defecto
  diaCobro      Int      // 1-31
  esVariable    Boolean  @default(false) // Si es true, siempre pide confirmar monto
  
  // Relaciones existentes
  categoriaId   Int
  categoria     Categoria @relation(...)
  
  esCompartido  Boolean @default(false)
  
  userId        String
  user          User    @relation(...)
}
```

### B. Interfaz de Usuario (UI)
1.  **Nueva Página:** `/gastos/recurrentes` para crear y editar estas plantillas.
2.  **Widget en Dashboard:** "Vencimientos del Mes".
    *   Lógica: Busca todos los `GastoRecurrente`.
    *   Verifica si ya existe un `Gasto` real creado este mes con ese nombre/categoría.
    *   Si no existe, lo muestra como "Pendiente".

## 4. Ventajas de este enfoque
*   **Control Total:** Nunca se registra un gasto de luz incorrecto.
*   **Flexibilidad:** Sirve para gastos fijos (Internet) y variables (Gas).
*   **Recordatorio:** Funciona como una "Lista de Tareas" financiera mensual. Si ves que falta registrar la luz, te acuerdas de pagarla.
*   **Compartidos:** Al confirmar el gasto, se usa la misma lógica de "Gasto Compartido" que ya tenemos, dividiéndolo entre los miembros configurados.

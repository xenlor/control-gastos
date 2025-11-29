# 💰 Control de Gastos Personales

Una aplicación web moderna y completa para la gestión de finanzas personales, construida con **Next.js 14**, **TypeScript** y **Prisma**. Diseñada para ofrecer una experiencia de usuario fluida, visual y eficiente.

![Dashboard Preview](/public/dashboard-preview.png) *Nota: Añadir captura de pantalla aquí*

## 🚀 Tecnologías Utilizadas

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Base de Datos:** SQLite (vía [Prisma ORM](https://www.prisma.io/))
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Manejo de Fechas:** [date-fns](https://date-fns.org/)
*   **Gráficos:** Recharts (para visualización de datos)

## 🏛️ Arquitectura del Proyecto

El proyecto sigue una arquitectura basada en **Server Actions** y **React Server Components (RSC)**, aprovechando las últimas capacidades de Next.js para un rendimiento óptimo y menor carga de JavaScript en el cliente.

### Principios Clave:
1.  **Server-First:** La mayoría de los componentes son renderizados en el servidor. La obtención de datos se realiza directamente en los componentes de página (`page.tsx`) o mediante Server Actions.
2.  **Server Actions:** Las mutaciones de datos (Crear, Actualizar, Eliminar) se manejan a través de funciones asíncronas en `src/app/actions/`, garantizando seguridad y tipado fuerte.
3.  **Base de Datos Local:** Utiliza SQLite para una configuración sencilla y portátil, ideal para uso personal.
4.  **Diseño Modular:** Componentes reutilizables en `src/components/ui` y lógica de negocio separada.

## 📂 Estructura de Carpetas

```
control-gastos/
├── prisma/
│   └── schema.prisma      # Definición del modelo de datos
├── public/                # Archivos estáticos
├── src/
│   ├── app/
│   │   ├── actions/       # Lógica de negocio y Server Actions (Backend)
│   │   ├── ahorros/       # Módulo de Ahorros
│   │   ├── gastos/        # Módulo de Gastos
│   │   ├── ingresos/      # Módulo de Ingresos
│   │   ├── prestamos/     # Módulo de Préstamos
│   │   ├── plazos/        # Módulo de Compras a Plazos
│   │   ├── layout.tsx     # Layout principal (Nav, ThemeProvider)
│   │   └── page.tsx       # Dashboard principal
│   ├── components/
│   │   ├── ui/            # Componentes UI genéricos (Input, Dialog, etc.)
│   │   └── ...            # Componentes específicos de funcionalidad
│   └── lib/
│       └── prisma.ts      # Instancia singleton de Prisma Client
└── ...
```

## ✨ Funcionalidades Principales

### 1. 📊 Dashboard General
Vista general de tu salud financiera. Muestra el balance total, resumen de ingresos vs. gastos, ahorros y gráficos de distribución de gastos por categoría.

### 2. 💸 Gestión de Gastos
*   Registro detallado de gastos con fecha, descripción y categoría.
*   **Categorías Personalizables:** Cada categoría tiene un color e icono asociado.
*   **Filtro Mensual:** Navegación sencilla entre meses para ver históricos.

### 3. 💰 Ingresos
Registro de todas las fuentes de ingresos para calcular el balance mensual.

### 4. 🐷 Ahorros (Nuevo)
*   **Meta Inteligente:** Calcula automáticamente una meta de ahorro del 20% basada en tus ingresos mensuales.
*   **Seguimiento:** Barra de progreso visual y KPIs para motivar el ahorro.
*   **Historial:** Registro manual de aportaciones al ahorro.

### 5. 🤝 Gastos Compartidos
Ideal para parejas o compañeros de piso.
*   Permite registrar gastos que se dividen entre miembros.
*   Cálculo automático de "quién debe a quién" basado en ingresos proporcionales o división equitativa.

### 6. 💳 Compras a Plazos
Seguimiento de compras financiadas (tarjetas de crédito, préstamos de consumo). Muestra cuántas cuotas faltan y el monto restante.

### 7. 👤 Préstamos Personales
Control de dinero prestado a amigos o familiares, con recordatorios de fecha de cobro y estado de pago.

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd control-gastos
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Base de Datos:**
    El proyecto usa SQLite, por lo que no requiere configuración externa. Solo inicializa la BD:
    ```bash
    npx prisma db push
    ```

4.  **Iniciar Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎨 Personalización

*   **Temas:** Soporte nativo para Modo Claro y Oscuro.
*   **Colores:** La paleta de colores se define en `globals.css` usando variables CSS de Tailwind.

---
Desarrollado con ❤️ para una mejor salud financiera.

# 💰 Control de Gastos

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-Private-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)

Aplicación web moderna para gestión de finanzas personales con dashboard interactivo, categorización de gastos, tracking de ahorros e informes exportables.

## 🚀 Características

- 📊 **Dashboard Interactivo** - Visualiza tus finanzas con gráficos en tiempo real
- 💸 **Gestión de Gastos e Ingresos** - Registra y categoriza todas tus transacciones
- 🏦 **Sistema de Préstamos** - Control de préstamos personales con plazos
- 👥 **Gastos Compartidos** - Divide gastos entre varios miembros
- 🐷 **Ahorro Inteligente** - Seguimiento de metas de ahorro (20% recomendado)
- 📈 **Informes Exportables** - Descarga tus datos en formato Excel
- 🔐 **Sistema de Autenticación** - Login seguro con NextAuth v5
- 🌙 **Interfaz Moderna** - Diseño dark mode con efectos glassmorphism

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca UI con React Compiler
- **TailwindCSS 4** - Estilos utility-first
- **Recharts** - Gráficos interactivos
- **Lucide Icons** - Iconos modernos
- **date-fns** - Manipulación de fechas

### Backend
- **Next.js Server Actions** - API serverless integrada
- **Prisma ORM** - Gestión de base de datos type-safe
- **PostgreSQL** - Base de datos relacional
- **NextAuth.js v5** - Autenticación y sesiones
- **bcryptjs** - Hash de contraseñas
- **Zod** - Validación de datos

### Infraestructura
- **Docker & Docker Compose** - Containerización
- **Nginx** - Reverse proxy
- **Let's Encrypt (Certbot)** - Certificados SSL/TLS

## 📋 Requisitos Previos

- **Node.js 20+** (para desarrollo local)
- **Docker & Docker Compose** (para producción)
- **Git** (para clonar el repositorio)

## 🏃 Inicio Rápido (Desarrollo Local)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/xenlor/control-gastos.git
   cd control-gastos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar entorno**
   Crea un archivo `.env`:
   ```env
   DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/control_gastos"
   AUTH_SECRET="genera-uno-con-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Levantar base de datos**
   ```bash
   docker-compose up -d postgres
   ```

5. **Inicializar base de datos**
   ```bash
   npx prisma db push
   ```

6. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

7. **Abrir navegador** en http://localhost:3000

## 🐳 Despliegue en Producción (VPS con Docker)

### 1. Preparación del Servidor

Instalar Docker y Docker Compose:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable --now docker
```

### 2. Despliegue

1. **Clonar el proyecto** en tu servidor:
   ```bash
   ```bash
   git clone https://github.com/xenlor/control-gastos.git
   cd control-gastos
   ```

2. **Configurar variables de entorno**:
   Crea un archivo `.env` con tus credenciales seguras:
   ```env
   # Configuración App
   APP_PORT="3000" # O el puerto que prefieras

   # Base de Datos
   POSTGRES_USER="usuario_seguro"
   POSTGRES_PASSWORD="contraseña_muy_segura_123"
   POSTGRES_DB="control_gastos"
   DATABASE_URL="postgresql://usuario_seguro:contraseña_muy_segura_123@postgres:5432/control_gastos"
   
   # Seguridad
   AUTH_SECRET="genera_uno_largo_con_openssl_rand_-base64_32"
   NEXTAUTH_URL="https://tudominio.com"
   ```

3. **Levantar la aplicación**:
   ```bash
   docker-compose up -d --build
   ```

4. **Inicializar la base de datos**:
   ```bash
   docker-compose exec app npx prisma db push
   ```

## 👤 Gestión de Usuarios (Scripts)

La aplicación incluye scripts para gestionar usuarios desde la terminal (útil para el administrador).

### Crear Usuario
Crea un nuevo usuario con configuración por defecto.

```bash
# Uso: node scripts/crear-usuario.js <email> <password> [nombre]
docker-compose exec app node scripts/crear-usuario.js admin@ejemplo.com 123456 "Admin User"
```

### Eliminar Usuario
Script interactivo para borrar un usuario y TODOS sus datos asociados.

```bash
docker-compose exec app node scripts/eliminar-usuario.js
```

## 🔐 Credenciales por Defecto

Si has usado los scripts de ejemplo o la configuración por defecto, estas podrían ser tus credenciales (¡CÁMBIALAS EN PRODUCCIÓN!):

| Usuario | Email | Contraseña | Rol |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@admin.com` | `123456` | Administrador |

> **Nota:** Para cambiar la contraseña, lo más seguro es eliminar el usuario y volver a crearlo con el script `crear-usuario.js`.

## 📄 Licencia

Este proyecto es software privado. Todos los derechos reservados.

## ✉️ Contacto

**Esteban** - [xenlor.dev](https://xenlor.dev)

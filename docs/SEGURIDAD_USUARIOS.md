# Seguridad y Gestión de Usuarios

Este documento explica de forma sencilla cómo funciona el sistema de usuarios y seguridad de tu aplicación **Control Gastos**.

## 1. ¿Qué tecnología usamos?
Utilizamos **NextAuth.js (v5)**, que es el estándar actual de la industria para aplicaciones Next.js. Es una librería robusta y mantenida por una gran comunidad, lo que garantiza que las mejores prácticas de seguridad se apliquen automáticamente.

## 2. ¿Dónde se guardan los usuarios?
Los datos de los usuarios (nombre, email, contraseña cifrada) se almacenan en tu **Base de Datos** (actualmente SQLite, pronto PostgreSQL).

No utilizamos servicios externos de terceros para guardar tus datos; tú tienes el control total de la información en tu propia base de datos.

## 3. ¿Cómo se guardan las contraseñas?
**NUNCA guardamos las contraseñas en texto plano.**

Si alguien lograra acceder a tu base de datos, **no podría leer las contraseñas**.
Utilizamos una técnica llamada **Hashing** con una librería llamada `bcrypt`.

*   **Cómo funciona:** Cuando creas un usuario con la contraseña `123456`, el sistema la transforma en una cadena ininteligible como `$2b$10$EixZaYVK1fsbw1ZfbX3OXePaW...`.
*   **Al iniciar sesión:** El sistema toma la contraseña que escribes, la transforma de nuevo y compara los códigos. Si coinciden, entras. Es imposible revertir el código para saber cuál era la contraseña original.

## 4. Medidas de Seguridad Implementadas

### 🛡️ Protección de Rutas (Middleware)
Tenemos un "portero" digital (Middleware) que verifica cada vez que intentas entrar a una página privada (como el Dashboard). Si no tienes una sesión activa válida, te envía automáticamente al Login.

### 🚦 Límite de Intentos (Rate Limiting)
Para evitar que hackers intenten adivinar tu contraseña probando miles de combinaciones por segundo, hemos implementado un límite.
*   Si alguien falla el login 5 veces seguidas en un minuto, el sistema bloqueará temporalmente los intentos desde esa conexión.

### 🍪 Cookies Seguras
La "llave" que mantiene tu sesión abierta se guarda en una Cookie especial con atributos de seguridad:
*   **HttpOnly:** El navegador no permite que scripts (código malicioso) lean esta cookie.
*   **Secure:** Solo se envía a través de conexiones seguras (HTTPS).
*   **SameSite:** Previene que otros sitios web intenten usar tu sesión.

### ✅ Validación de Datos (Zod)
Antes de procesar cualquier dato (como tu email o contraseña al registrarte), utilizamos una librería llamada `Zod` que se asegura de que la información tenga el formato correcto. Esto evita errores y ataques comunes de inyección de datos.

# Guía de Despliegue Automatizado

Esta guía explica cómo utilizar los scripts de PowerShell incluidos en la carpeta `scripts/` para gestionar el ciclo de vida de la aplicación en el servidor VPS.

## Resumen de Scripts

| Script | Ubicación | Descripción |
|--------|-----------|-------------|
| **Generar ZIP** | `scripts/generate-zip.ps1` | Crea el paquete `control-gastos-update.zip` localmente. |
| **Desplegar** | `scripts/deploy-vps.ps1` | Sube el ZIP, detiene servicios y despliega en el VPS. |

---

## Flujo de Trabajo (Paso a Paso)

### 1. Preparar Actualización
Cuando hayas terminado de programar cambios y quieras subirlos a producción:

1. Abre PowerShell en la raíz del proyecto.
2. Ejecuta el empaquetador:
   ```powershell
   .\scripts\generate-zip.ps1
   ```
   *Esto limpiará versiones antiguas y creará un nuevo archivo ZIP optimizado.*

### 2. Desplegar en VPS
Una vez generado el ZIP:

1. Asegúrate de tener acceso SSH al servidor (usando `ssh-agent` es recomendable).
2. Ejecuta el desplegado:
   ```powershell
   .\scripts\deploy-vps.ps1
   ```

**¿Qué hace este script?**
1. **Sube** el archivo `control-gastos-update.zip` a `/var/www/gastos.xenlor.dev` (o la ruta configurada).
2. **Detiene** los contenedores actuales (`docker-compose down`).
3. **Descomprime** el nuevo código sobrescribiendo el anterior.
4. **Ejecuta** `deploy.sh` para reconstruir las imágenes y levantar el servicio (`docker compose up -d --build`).

---

## Configuración Avanzada

Si cambias de servidor, IP o dominio, edita las primeras líneas de `scripts/deploy-vps.ps1`:

```powershell
$VPS_USER = "root"
$VPS_HOST = "gastos.xenlor.dev"  <-- Cambiar aquí
$REMOTE_PATH = "/var/www/gastos.xenlor.dev"
```

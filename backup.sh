#!/bin/bash

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Nombre del contenedor de la base de datos
DB_CONTAINER="gastos-db"

# Directorio de backups
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Nombre del archivo de backup con fecha
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo -e "${BLUE}📦 Iniciando backup de la base de datos...${NC}"

# Realizar el backup
docker exec $DB_CONTAINER pg_dump -U postgres gastos > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup completado exitosamente${NC}"
    echo -e "${GREEN}📁 Archivo: $BACKUP_FILE${NC}"
    
    # Mostrar tamaño del backup
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${BLUE}📊 Tamaño: $SIZE${NC}"
else
    echo -e "${YELLOW}❌ Error al crear el backup${NC}"
    exit 1
fi

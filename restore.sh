#!/bin/bash

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Nombre del contenedor de la base de datos
DB_CONTAINER="gastos-db"

# Directorio de backups
BACKUP_DIR="./backups"

echo -e "${BLUE}🔄 Restauración de base de datos${NC}"

# Listar backups disponibles
if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR)" ]; then
    echo -e "${RED}❌ No se encontraron backups en $BACKUP_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Backups disponibles:${NC}"
select BACKUP_FILE in "$BACKUP_DIR"/*.sql; do
    if [ -n "$BACKUP_FILE" ]; then
        break
    else
        echo -e "${YELLOW}Selección inválida. Inténtalo de nuevo.${NC}"
    fi
done

echo -e "${YELLOW}⚠️  ADVERTENCIA: Esto sobrescribirá la base de datos actual${NC}"
read -p "¿Estás seguro de que deseas continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}Operación cancelada${NC}"
    exit 0
fi

echo -e "${BLUE}🔄 Restaurando desde: $BACKUP_FILE${NC}"

# Eliminar la base de datos existente y recrearla
docker exec $DB_CONTAINER psql -U postgres -c "DROP DATABASE IF EXISTS gastos;"
docker exec $DB_CONTAINER psql -U postgres -c "CREATE DATABASE gastos;"

# Restaurar el backup
docker exec -i $DB_CONTAINER psql -U postgres gastos < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Restauración completada exitosamente${NC}"
else
    echo -e "${RED}❌ Error al restaurar el backup${NC}"
    exit 1
fi

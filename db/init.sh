#!/bin/sh
# Corre una sola vez, cuando el volumen de PostgreSQL nace vacío. Crea una base por
# sistema interno y la siembra con su archivo. Para resembrar: `docker compose down -v`.
set -e

# El servicio se conecta con este rol, que solo puede leer. La contraseña es de
# demostración: el servidor de bases no se publica fuera de la red de compose.
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres -c "CREATE ROLE lector LOGIN PASSWORD 'lector'"

for sistema in ventas almacen soporte; do
    createdb -U "$POSTGRES_USER" "$sistema"
    psql -v ON_ERROR_STOP=1 -q -U "$POSTGRES_USER" -d "$sistema" \
        -f "/semilla/$sistema.sql" \
        -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO lector"
done

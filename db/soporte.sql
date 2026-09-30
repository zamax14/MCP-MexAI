-- Mesa de ayuda de Distribuidora Aurora, una empresa que no existe.
-- Todos los datos son SINTÉTICOS: folios, asuntos y agentes son inventados.

SELECT setseed(0.73);

-- Igual que en ventas: se siembra hacia adelante y la vista `tickets` solo deja ver hasta
-- hoy. Un ticket cuyo cierre todavía no llega se ve abierto.
CREATE TABLE tickets_sembrados AS
WITH dado AS (
    SELECT CURRENT_DATE + d AS abierto_en,
           random() AS area, random() AS asunto, random() AS prioridad,
           random() AS agente, random() AS duracion, random() AS sin_cerrar
    FROM generate_series(-90, 180) AS d, generate_series(1, 6) AS n
    WHERE n <= 2 + (random() * 4)::int
), armado AS (
    SELECT abierto_en, duracion, sin_cerrar, asunto,
           (ARRAY['Facturación', 'Entregas', 'Garantías', 'Sistemas'])[1 + floor(area * 4)::int] AS area,
           CASE WHEN prioridad < 0.10 THEN 'urgente' WHEN prioridad < 0.35 THEN 'alta'
                WHEN prioridad < 0.75 THEN 'media' ELSE 'baja' END AS prioridad,
           (ARRAY['Paola Núñez', 'Héctor Vidal', 'Rocío Aguilar', 'Tomás Garza', 'Elena Cano'])[1 + floor(agente * 5)::int] AS agente
    FROM dado
)
SELECT 'T-' || lpad(row_number() OVER (ORDER BY abierto_en, asunto)::text, 5, '0') AS folio,
       abierto_en,
       -- Entre más urgente, más rápido se cierra; uno de cada doce se queda rezagado.
       CASE WHEN sin_cerrar < 0.08 THEN NULL
            ELSE abierto_en + CASE prioridad
                WHEN 'urgente' THEN floor(duracion * 3)::int
                WHEN 'alta' THEN 1 + floor(duracion * 4)::int
                WHEN 'media' THEN 2 + floor(duracion * 7)::int
                ELSE 3 + floor(duracion * 13)::int END
       END AS cerrado_en,
       area, prioridad,
       (CASE area
            WHEN 'Facturación' THEN ARRAY['Factura con RFC incorrecto', 'Solicitud de nota de crédito', 'Cobro duplicado']
            WHEN 'Entregas' THEN ARRAY['Pedido incompleto', 'Entrega retrasada', 'Producto dañado en el envío']
            WHEN 'Garantías' THEN ARRAY['Tóner defectuoso', 'Silla con falla en el pistón', 'Teclado que no enciende']
            ELSE ARRAY['No puede entrar al portal de pedidos', 'Error al descargar la factura', 'Restablecer contraseña']
        END)[1 + floor(asunto * 3)::int] AS asunto,
       agente
FROM armado;

CREATE VIEW tickets AS
SELECT folio, abierto_en,
       CASE WHEN cerrado_en <= CURRENT_DATE THEN cerrado_en END AS cerrado_en,
       CASE WHEN cerrado_en <= CURRENT_DATE THEN 'cerrado' ELSE 'abierto' END AS estado,
       area, prioridad, asunto, agente
FROM tickets_sembrados
WHERE abierto_en <= CURRENT_DATE;

-- Punto de venta de Distribuidora Aurora, una empresa que no existe.
-- Todos los datos son SINTÉTICOS: nombres, precios y ventas son inventados.

CREATE TABLE sucursales (
    sucursal text PRIMARY KEY,
    ciudad   text NOT NULL
);
INSERT INTO sucursales VALUES
    ('Centro', 'Guadalajara'), ('Norte', 'Zapopan'), ('Sur', 'Tlaquepaque'), ('Poniente', 'Zapopan');

CREATE TABLE productos (
    sku       text PRIMARY KEY,
    producto  text NOT NULL,
    categoria text NOT NULL,
    precio    numeric(10, 2) NOT NULL,
    rotacion  numeric NOT NULL          -- unidades que se venden en un día normal por sucursal
);
INSERT INTO productos VALUES
    ('P-001', 'Papel bond carta (caja)',        'Papelería',  890.00, 9),
    ('P-002', 'Bolígrafos azules (caja de 50)', 'Papelería',  185.00, 7),
    ('P-003', 'Carpetas de archivo (paq. 25)',  'Papelería',  240.00, 4),
    ('P-004', 'Tóner láser negro',              'Cómputo',   1450.00, 5),
    ('P-005', 'Mouse inalámbrico',              'Cómputo',    320.00, 4),
    ('P-006', 'Teclado USB',                    'Cómputo',    410.00, 3),
    ('P-007', 'Memoria USB 64 GB',              'Cómputo',    210.00, 6),
    ('P-008', 'Detergente multiusos 5 L',       'Limpieza',   165.00, 6),
    ('P-009', 'Papel higiénico (caja de 12)',   'Limpieza',   295.00, 8),
    ('P-010', 'Cloro 4 L',                      'Limpieza',    78.00, 5),
    ('P-011', 'Silla ejecutiva',                'Mobiliario', 2890.00, 1),
    ('P-012', 'Escritorio 1.2 m',               'Mobiliario', 3650.00, 0.6);

CREATE TABLE vendedores (
    vendedor text PRIMARY KEY,
    sucursal text NOT NULL REFERENCES sucursales
);
INSERT INTO vendedores VALUES
    ('Ana Torres', 'Centro'),     ('Luis Méndez', 'Centro'),
    ('Carla Ríos', 'Norte'),      ('Diego Salas', 'Norte'),
    ('Marta Lozano', 'Sur'),      ('Iván Pineda', 'Sur'),
    ('Sofía Campos', 'Poniente'), ('Raúl Ortega', 'Poniente');

-- Semilla fija: la demo muestra los mismos números cada vez que se levanta.
SELECT setseed(0.42);

-- Se siembran 90 días hacia atrás y 180 hacia adelante; la vista `ventas` solo deja ver
-- hasta hoy. Así la demo siempre tiene ventas de ayer, se levante el día que se levante.
CREATE TABLE ventas_sembradas AS
SELECT CURRENT_DATE + d AS fecha, s.sucursal, p.sku,
       -- Dos vendedores por sucursal; el primero se lleva seis de cada diez ventas.
       (ARRAY(SELECT vendedor FROM vendedores WHERE sucursal = s.sucursal ORDER BY vendedor))[1 + (random() < 0.4)::int] AS vendedor,
       u.unidades,
       u.unidades * p.precio AS total
FROM generate_series(-90, 180) AS d
CROSS JOIN sucursales s
CROSS JOIN productos p
CROSS JOIN LATERAL (
    SELECT round(
        p.rotacion
        -- Se vende menos en fin de semana.
        * CASE EXTRACT(isodow FROM CURRENT_DATE + d) WHEN 6 THEN 0.6 WHEN 7 THEN 0.35 ELSE 1 END
        -- Norte viene creciendo; Sur cayó hace dos semanas. El resto va parejo.
        * CASE s.sucursal
              WHEN 'Norte' THEN 0.85 + 0.005 * least(d + 90, 120)
              WHEN 'Sur' THEN CASE WHEN d >= -14 THEN 0.7 ELSE 1 END
              WHEN 'Centro' THEN 1.2
              ELSE 1
          END
        * (0.6 + random() * 0.8)
    )::int AS unidades
) u
WHERE u.unidades > 0;

CREATE VIEW ventas AS
SELECT v.fecha, v.sucursal, v.sku, p.producto, p.categoria, v.vendedor, v.unidades, v.total
FROM ventas_sembradas v JOIN productos p USING (sku)
WHERE v.fecha <= CURRENT_DATE;

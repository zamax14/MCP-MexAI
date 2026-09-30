-- Almacén de Distribuidora Aurora, una empresa que no existe.
-- Todos los datos son SINTÉTICOS. Los SKU son los mismos del punto de venta, pero esta es
-- otra base: cada sistema guarda lo suyo.

SELECT setseed(0.17);

CREATE TABLE existencias AS
SELECT p.sku, p.producto, p.categoria, a.almacen,
       round(random() * p.minimo * 3)::int AS existencia,
       p.minimo,
       p.costo_unitario
FROM (VALUES
    ('P-001', 'Papel bond carta (caja)',        'Papelería',  40,  610.00),
    ('P-002', 'Bolígrafos azules (caja de 50)', 'Papelería',  30,  120.00),
    ('P-003', 'Carpetas de archivo (paq. 25)',  'Papelería',  20,  155.00),
    ('P-004', 'Tóner láser negro',              'Cómputo',    25,  980.00),
    ('P-005', 'Mouse inalámbrico',              'Cómputo',    20,  205.00),
    ('P-006', 'Teclado USB',                    'Cómputo',    15,  270.00),
    ('P-007', 'Memoria USB 64 GB',              'Cómputo',    30,  130.00),
    ('P-008', 'Detergente multiusos 5 L',       'Limpieza',   30,  102.00),
    ('P-009', 'Papel higiénico (caja de 12)',   'Limpieza',   35,  190.00),
    ('P-010', 'Cloro 4 L',                      'Limpieza',   25,   46.00),
    ('P-011', 'Silla ejecutiva',                'Mobiliario',  6, 1950.00),
    ('P-012', 'Escritorio 1.2 m',               'Mobiliario',  4, 2480.00)
) AS p (sku, producto, categoria, minimo, costo_unitario)
CROSS JOIN (VALUES ('Centro'), ('Norte'), ('Sur'), ('Poniente')) AS a (almacen);

-- Para que la demo tenga una historia: los dos productos que más se venden están por
-- agotarse en el almacén de la sucursal que más crece.
UPDATE existencias SET existencia = 6 WHERE sku = 'P-001' AND almacen = 'Norte';
UPDATE existencias SET existencia = 3 WHERE sku = 'P-004' AND almacen = 'Norte';

-- Datos SINTÉTICOS de demostración. Los municipios y sus claves INEGI son reales;
-- todos los valores son aleatorios y no corresponden a ninguna cifra oficial.
-- Corre una sola vez, cuando el volumen de PostgreSQL nace vacío.

CREATE TABLE municipios (
    cve_mun   text PRIMARY KEY,
    municipio text NOT NULL
);

INSERT INTO municipios VALUES
    ('14023', 'Zapotlán el Grande'),
    ('14039', 'Guadalajara'),
    ('14053', 'Lagos de Moreno'),
    ('14067', 'Puerto Vallarta'),
    ('14070', 'El Salto'),
    ('14093', 'Tepatitlán de Morelos'),
    ('14097', 'Tlajomulco de Zúñiga'),
    ('14098', 'San Pedro Tlaquepaque'),
    ('14101', 'Tonalá'),
    ('14120', 'Zapopan');

-- Semilla fija: la demo muestra los mismos números cada vez que se levanta.
SELECT setseed(0.14);

CREATE TABLE empleo_municipal AS
SELECT m.cve_mun, m.municipio, anio,
       round((2 + random() * 4)::numeric, 2)   AS tasa_desocupacion,
       round((35 + random() * 25)::numeric, 2) AS tasa_informalidad
FROM municipios m CROSS JOIN generate_series(2017, 2024) AS anio
ORDER BY m.cve_mun, anio;

CREATE TABLE pobreza_municipal AS
SELECT m.cve_mun, m.municipio, anio,
       round((20 + random() * 30)::numeric, 1) AS pobreza_pct
FROM municipios m CROSS JOIN unnest(ARRAY[2010, 2015, 2020]) AS anio
ORDER BY m.cve_mun, anio;

CREATE TABLE seguridad_municipal AS
SELECT m.cve_mun, m.municipio, anio,
       (5 + random() * 120)::int AS homicidios
FROM municipios m CROSS JOIN generate_series(2017, 2024) AS anio
ORDER BY m.cve_mun, anio;

-- El servicio se conecta con este rol, que solo puede leer. La contraseña es de
-- demostración: la base no se publica fuera de la red de compose.
CREATE ROLE lector LOGIN PASSWORD 'lector';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO lector;

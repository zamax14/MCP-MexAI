# Catálogo de consultas: de API REST a MCP

Los sistemas internos de una empresa ya tienen la información. Este proyecto la expone como un
catálogo de consultas declarado en manifiestos YAML, servido por una API REST, y convierte esa misma
API en un servidor **MCP** con un archivo de diez líneas.

El resultado: alguien conecta el MCP a su ChatGPT o a su Claude y pregunta «¿cuánto vendimos ayer?»,
«grafícame las ventas del mes por sucursal» o «hazme un reporte de lo que hay que resurtir». El
servicio solo entrega filas; las gráficas y los reportes los arma el asistente.

Es la demo de la charla «MCP: deja de reinventar la rueda». La empresa, **Distribuidora Aurora**, no
existe y todos sus datos son sintéticos.

```
docker compose up --build
```

## Dos productos, un servicio

```
  Portal web ─────── REST ──┐
  (localhost:8080)          ├──►  API REST  ──►  ventas · almacén · soporte
  ChatGPT / Claude ── MCP ──┘     (localhost:8000)   (una base por sistema)
```

| Qué | Dónde | Para quién |
| --- | --- | --- |
| Portal de consultas | http://localhost:8080 | Una persona que elige una consulta y ve una tabla |
| API REST | http://localhost:8000/v1/consultas, consola en `/docs` | Cualquier programa |
| Servidor MCP | http://localhost:8000/mcp | Un asistente de IA |

El portal y el MCP no se conocen entre sí. Los dos son clientes de la misma API: el portal es un HTML
estático en su propio contenedor que solo usa tres rutas REST, y el MCP es una capa que traduce esas
mismas tres rutas a tools.

## El bloque

La API vive en [`app/api.py`](app/api.py) y no sabe nada de MCP. Todo lo que se agregó para tenerlo
está en [`app/main.py`](app/main.py):

```python
from fastapi import FastAPI
from fastmcp import FastMCP

from app.api import app as api

mcp = FastMCP.from_fastapi(app=api, name="Consultas de Distribuidora Aurora")
mcp_app = mcp.http_app(path="/mcp")

app = FastAPI(routes=[*mcp_app.routes, *api.routes], lifespan=mcp_app.lifespan)
```

Cada ruta se vuelve una tool. El nombre sale de su `operation_id`, la descripción de su docstring y
el esquema de sus tipos:

| Ruta REST | Tool MCP |
| --- | --- |
| `GET /v1/consultas?sistema=` | `listar_consultas` |
| `GET /v1/consultas/{id}` | `describir_consulta` |
| `POST /v1/consultas/{id}/datos` | `ejecutar_consulta` |

Para ver el «antes», cambia `app.main:app` por `app.api:app` en `compose.yaml`: la API y el portal
siguen igual, y `/mcp` deja de existir.

## Los sistemas de ejemplo

| Sistema | Base | Consultas |
| --- | --- | --- |
| Punto de venta | `ventas` | `ventas_por_dia`, `productos_mas_vendidos`, `ventas_por_vendedor` |
| Almacén | `almacen` | `existencias_bajo_minimo`, `valor_inventario` |
| Mesa de ayuda | `soporte` | `tickets_abiertos`, `tickets_por_semana` |

Las fechas se siembran alrededor del día en que se crea la base, así que siempre hay ventas de ayer
durante los seis meses siguientes. Para resembrar desde cero: `docker compose down -v`.

Preguntas para probar desde el asistente:

- ¿Cuánto vendimos ayer en cada sucursal?
- Grafica las ventas diarias de las últimas ocho semanas por sucursal. ¿Alguna va a la baja?
- De los cinco productos que más se venden, ¿cuáles están por debajo del mínimo en algún almacén?
- Hazme un reporte de los tickets urgentes y de prioridad alta que siguen abiertos.

La tercera cruza dos sistemas que no se conocen entre sí: el asistente llama una consulta de ventas,
otra de almacén, y las une por SKU.

## Agregar una consulta

Un YAML en `catalogo/<sistema>/<id>.yaml` y cero líneas de Python. El servidor recarga solo, y la
consulta aparece en el portal, en REST y en MCP al mismo tiempo.

```yaml
id: ventas_por_categoria             # igual que el nombre del archivo
nombre: Ventas por categoría
sistema: ventas                      # igual que la carpeta; se conecta con la variable DSN_VENTAS
descripcion: Importe vendido por categoría de producto en el periodo.
notas: Importes en pesos mexicanos.  # opcional: la letra chica que debe acompañar al dato
parametros:
  - nombre: desde
    tipo: date                       # str, int o date
    descripcion: Primer día a incluir, en formato AAAA-MM-DD. Omitir para los últimos 30 días.
sql: |
  SELECT categoria, SUM(total)::numeric AS importe
  FROM ventas
  WHERE fecha >= COALESCE(CAST(:desde AS date), CURRENT_DATE - 30)
  GROUP BY categoria
  ORDER BY importe DESC
```

La `descripcion` de la consulta y la de cada parámetro son lo que lee el asistente para decidir qué
llamar y con qué valores: vale la pena escribirlas bien.

Un manifiesto inválido impide arrancar y el error nombra el archivo. Se valida que no haya campos
desconocidos, que el `sql` empiece con `SELECT` o `WITH` y que los `parametros` declarados sean
exactamente los binds (`:nombre`) que usa el `sql`.

Para conectar otro sistema, agrega `DSN_<SISTEMA>` al servicio `api` y crea la carpeta
`catalogo/<sistema>/` con sus manifiestos.

## Conectarlo a un asistente

**Claude Code**, en local:

```
claude mcp add --transport http aurora http://localhost:8000/mcp
```

**ChatGPT, claude.ai** y cualquier cliente que corra en la nube necesitan una URL HTTPS pública. Con
[Tailscale Funnel](https://tailscale.com/kb/1223/funnel):

```
tailscale funnel 8000
```

y se registra `https://<tu-equipo>.<tu-tailnet>.ts.net/mcp` como conector personalizado, sin
autenticación. Los pasos exactos y el plan que lo permite cambian con cada cliente: revisa su
documentación vigente.

## Lo que sí cuida, y lo que no

- El asistente no escribe SQL ni ve el esquema: elige una consulta del catálogo y le pasa valores.
- El `sql` nunca sale del servidor: ni en REST ni en MCP.
- Los valores viajan como binds; no se arma SQL con cadenas.
- La transacción es de solo lectura y el rol de las bases solo tiene `SELECT`.
- Un resultado que excede el límite de filas falla y dice con qué acotar, en vez de truncarse.

**No tiene autenticación.** Compose lo publica solo en `localhost`; al abrir el Funnel cualquiera con
la URL puede consultarlo. Sirve para una demo con datos de prueba, no para datos reales.

## Pruebas

```
docker compose exec api python -m pytest -p no:cacheprovider
```

## Licencia

[MIT](LICENSE).

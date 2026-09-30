# Banco de indicadores: de API REST a MCP

Un catálogo de consultas declarado en manifiestos YAML, servido por una API REST con su mini web — y
el mismo servicio expuesto como servidor **MCP** con un archivo de diez líneas.

Es la demo de la charla «MCP: deja de reinventar la rueda». Los datos son **sintéticos**.

```
docker compose up --build
```

| Qué | Dónde |
| --- | --- |
| Web de consulta | http://localhost:8000 |
| API REST | http://localhost:8000/v1/indicadores · consola en `/docs` |
| Servidor MCP | http://localhost:8000/mcp |

## El bloque

La API vive en [`app/api.py`](app/api.py) y no sabe nada de MCP. Todo lo que se agregó está en
[`app/main.py`](app/main.py):

```python
from fastapi import FastAPI
from fastmcp import FastMCP

from app.api import app as api

mcp = FastMCP.from_fastapi(app=api, name="Banco de indicadores")
mcp_app = mcp.http_app(path="/mcp")

app = FastAPI(routes=[*mcp_app.routes, *api.routes], lifespan=mcp_app.lifespan)
```

Cada ruta se vuelve una tool. El nombre sale de su `operation_id`, la descripción de su docstring y
el esquema de sus tipos:

| Ruta REST | Tool MCP |
| --- | --- |
| `GET /v1/indicadores?tema=` | `listar_indicadores` |
| `GET /v1/indicadores/{id}` | `describir_indicador` |
| `POST /v1/indicadores/{id}/datos` | `consultar_indicador` |

Para ver el «antes», cambia `app.main:app` por `app.api:app` en `compose.yaml`: la web sigue
funcionando y su pie de página avisa que ya no hay MCP.

## Agregar un indicador

Un YAML en `catalogo/<tema>/<id>.yaml` y cero líneas de Python. El servidor recarga solo, y el
indicador aparece en la web, en REST y en MCP al mismo tiempo.

```yaml
id: tasa_desocupacion_municipal      # igual que el nombre del archivo
nombre: Tasa de desocupación municipal
tema: empleo                         # igual que la carpeta
definicion: Porcentaje de la población económicamente activa que se encuentra desocupada.
unidad: porcentaje
fuente: Datos sintéticos de demostración
base: demo                           # clave de conexión: usa la variable DSN_DEMO
periodicidad: anual
parametros:
  - nombre: anio_min
    tipo: int                        # str o int
    descripcion: Año inicial de la serie. Omitir para la serie completa.
sql: |
  SELECT cve_mun AS cve_geo, municipio AS nombre_geo, anio::text AS periodo, tasa_desocupacion AS valor
  FROM empleo_municipal
  WHERE (CAST(:anio_min AS integer) IS NULL OR anio >= CAST(:anio_min AS integer))
```

Un manifiesto inválido impide arrancar y el error nombra el archivo. Se valida que no haya campos
desconocidos, que el `sql` empiece con `SELECT` o `WITH` y que los `parametros` declarados sean
exactamente los binds (`:nombre`) que usa el `sql`.

Para leer de otra base, agrega `DSN_<CLAVE>` al servicio `api` y pon `base: <clave>` en el manifiesto.

## Conectarlo a un asistente

**Claude Code**, en local:

```
claude mcp add --transport http indicadores http://localhost:8000/mcp
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

- El `sql` nunca sale del servidor: ni en REST ni en MCP.
- Los valores viajan como binds; no se arma SQL con cadenas.
- La transacción es de solo lectura y el rol de la base solo tiene `SELECT`.
- Un resultado que excede el límite de filas falla y dice con qué acotar, en vez de truncarse.

**No tiene autenticación.** Compose lo publica solo en `localhost`; al abrir el Funnel cualquiera con
la URL puede consultarlo. Sirve para una demo con datos de prueba, no para datos reales.

## Pruebas

```
docker compose exec api python -m pytest -p no:cacheprovider
```

## Licencia

[MIT](LICENSE).

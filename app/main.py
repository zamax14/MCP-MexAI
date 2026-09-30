"""De API REST a servidor MCP. Este archivo es todo lo que hubo que agregar.

`app.api` sigue intacta y sigue sirviendo REST; aquí se le pone MCP encima.
"""

from fastapi import FastAPI
from fastmcp import FastMCP

from app.api import app as api

# 1. Cada ruta de la API se vuelve una tool: nombre, descripción y esquema salen del OpenAPI.
mcp = FastMCP.from_fastapi(app=api, name="Banco de indicadores")
mcp_app = mcp.http_app(path="/mcp")

# 2. Un solo proceso sirve las dos superficies: MCP en /mcp y la API de siempre en /v1.
app = FastAPI(routes=[*mcp_app.routes, *api.routes], lifespan=mcp_app.lifespan)

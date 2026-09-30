from fastmcp import FastMCP
import httpx

mcp = FastMCP("Mesa de ayuda")

@mcp.tool
def listar_tickets() -> list[dict]:
    """Consulta los tickets de la API."""
    r = httpx.get("http://127.0.0.1:8000/tickets")
    r.raise_for_status()
    return r.json()

mcp.run(transport="http", port=8001)

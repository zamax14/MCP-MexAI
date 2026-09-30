"""Comprobación mínima, sin base de datos: `docker compose exec api python -m pytest -p no:cacheprovider`."""

import asyncio

from fastapi.testclient import TestClient
from fastmcp import Client

from app.catalog import load
from app.main import app, mcp

client = TestClient(app)


def test_catalog_loads_every_manifest():
    assert len(load()) == len(client.get("/v1/consultas").json()) >= 7
    assert {q["sistema"] for q in client.get("/v1/consultas", params={"sistema": "almacen"}).json()} == {"almacen"}


def test_sql_never_leaves_the_server():
    for id in load():
        assert "sql" not in client.get(f"/v1/consultas/{id}").json()


def test_invalid_requests_say_why():
    assert client.get("/v1/consultas/no_existe").status_code == 404

    unknown = client.post("/v1/consultas/ventas_por_dia/datos", json={"parametros": {"tienda": "Norte"}})
    assert unknown.status_code == 400
    assert "sucursal" in unknown.json()["detail"]  # nombra los que sí acepta

    bad_date = client.post("/v1/consultas/ventas_por_dia/datos", json={"parametros": {"desde": "ayer"}})
    assert bad_date.status_code == 400
    assert "desde" in bad_date.json()["detail"]


def test_every_route_is_an_mcp_tool():
    async def names() -> set[str]:
        async with Client(mcp) as session:
            return {tool.name for tool in await session.list_tools()}

    assert asyncio.run(names()) == {"listar_consultas", "describir_consulta", "ejecutar_consulta"}

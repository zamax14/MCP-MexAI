"""Comprobación mínima, sin base de datos: `docker compose exec api python -m pytest -p no:cacheprovider`."""

import asyncio

from fastapi.testclient import TestClient
from fastmcp import Client

from app.catalog import load
from app.main import app, mcp

client = TestClient(app)


def test_catalog_loads_every_manifest():
    assert len(load()) == len(client.get("/v1/indicadores").json()) >= 4
    assert [i["tema"] for i in client.get("/v1/indicadores", params={"tema": "pobreza"}).json()] == ["pobreza"]


def test_sql_never_leaves_the_server():
    for id in load():
        assert "sql" not in client.get(f"/v1/indicadores/{id}").json()


def test_invalid_requests_say_why():
    assert client.get("/v1/indicadores/no_existe").status_code == 404

    unknown = client.post("/v1/indicadores/pobreza_municipal/datos", json={"parametros": {"anio": 2020}})
    assert unknown.status_code == 400
    assert "cve_geo" in unknown.json()["detail"]  # nombra los que sí acepta

    bad_type = client.post("/v1/indicadores/pobreza_municipal/datos", json={"parametros": {"anio_min": "dosmil"}})
    assert bad_type.status_code == 400


def test_every_route_is_an_mcp_tool():
    async def names() -> set[str]:
        async with Client(mcp) as session:
            return {tool.name for tool in await session.list_tools()}

    assert asyncio.run(names()) == {"listar_indicadores", "describir_indicador", "consultar_indicador"}

"""La API REST «de siempre»: tres rutas sobre el catálogo, más la web que las consume.

Corre sola con `uvicorn app.api:app`. Este archivo no sabe nada de MCP.

Los `operation_id` y los docstrings no son adorno: son el nombre y la descripción con
los que un agente va a descubrir cada operación.
"""

from pathlib import Path
from typing import Optional

from fastapi import Body, FastAPI
from fastapi.staticfiles import StaticFiles

from app import engine
from app.catalog import find, get, load

app = FastAPI(title="Banco de indicadores", description="Catálogo de indicadores declarado en manifiestos YAML.")

# Un manifiesto inválido revienta aquí, al arrancar.
load()


@app.get("/v1/indicadores", operation_id="listar_indicadores")
def list_indicators(tema: Optional[str] = None) -> list[dict]:
    """Lista los indicadores del catálogo, opcionalmente filtrados por tema.

    Es el punto de entrada: devuelve id, nombre, tema, unidad y periodicidad. La
    definición y los parámetros de uno se piden con `describir_indicador`.
    """
    return find(tema=tema)


@app.get("/v1/indicadores/{id}", operation_id="describir_indicador")
def describe_indicator(id: str) -> dict:
    """Metadata completa de un indicador: definición, unidad, fuente, notas y parámetros.

    Lee `parametros` antes de consultar: ahí está el nombre, el tipo y si es requerido
    cada valor que acepta `consultar_indicador`.
    """
    return get(id).metadata()


@app.post("/v1/indicadores/{id}/datos", operation_id="consultar_indicador")
def query_indicator(id: str, parametros: dict[str, str | int | None] = Body(default={}, embed=True)) -> dict:
    """Consulta los datos de un indicador y los devuelve con su unidad, fuente y notas.

    `parametros` lleva los valores de los parámetros que declara el indicador; los
    opcionales que se omitan no filtran. Si el resultado excede el límite de filas la
    consulta falla en vez de truncar, y el error dice con qué parámetros acotar.
    """
    return engine.execute(id, parametros)


# Al final: un mount en "/" atrapa todo lo que no haya coincidido antes.
app.mount("/", StaticFiles(directory=Path(__file__).resolve().parents[1] / "web", html=True))

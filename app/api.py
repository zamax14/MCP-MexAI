"""La API REST «de siempre»: tres rutas sobre el catálogo de consultas de la empresa.

Corre sola con `uvicorn app.api:app`. Este archivo no sabe nada de MCP ni de la web:
los dos son clientes suyos.

Los `operation_id` y los docstrings no son adorno: son el nombre y la descripción con
los que un agente va a descubrir cada operación.
"""

from pathlib import Path
from typing import Optional

from fastapi import Body, FastAPI
from fastapi.staticfiles import StaticFiles

from app import engine
from app.catalog import find, get, load

app = FastAPI(
    title="Consultas de Distribuidora Aurora",
    description="Catálogo de consultas sobre los sistemas internos, declarado en manifiestos YAML.",
)

# Un manifiesto inválido revienta aquí, al arrancar.
load()


@app.get("/v1/consultas", operation_id="listar_consultas")
def list_queries(sistema: Optional[str] = None) -> list[dict]:
    """Lista las consultas disponibles sobre los sistemas internos de la empresa.

    Es el punto de entrada: devuelve id, nombre, sistema y descripción de cada una. Se
    puede filtrar por sistema: "ventas", "almacen" o "soporte". Los parámetros que acepta
    una consulta se piden con `describir_consulta`.
    """
    return find(sistema=sistema)


@app.get("/v1/consultas/{id}", operation_id="describir_consulta")
def describe_query(id: str) -> dict:
    """Detalle de una consulta: qué devuelve, sus notas y los parámetros que acepta.

    Lee `parametros` antes de ejecutarla: ahí está el nombre, el tipo (str, int o date en
    formato AAAA-MM-DD) y si es requerido cada valor que acepta `ejecutar_consulta`.
    """
    return get(id).metadata()


@app.post("/v1/consultas/{id}/datos", operation_id="ejecutar_consulta")
def run_query(id: str, parametros: dict[str, str | int | None] = Body(default={}, embed=True)) -> dict:
    """Ejecuta una consulta y devuelve sus filas con datos al momento, directo del sistema.

    `parametros` lleva los valores de los parámetros que declara la consulta; los
    opcionales que se omitan no filtran. Si el resultado excede el límite de filas la
    consulta falla en vez de truncar, y el error dice con qué parámetros acotar.
    """
    return engine.execute(id, parametros)


# Al final: un mount en "/" atrapa todo lo que no haya coincidido antes.
app.mount("/", StaticFiles(directory=Path(__file__).resolve().parents[1] / "web", html=True))

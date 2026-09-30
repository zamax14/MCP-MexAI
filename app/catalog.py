"""El catálogo: un manifiesto YAML por consulta. Sin base de datos, aquí solo se lee.

Se carga y valida una sola vez, al arrancar. Un manifiesto inválido impide el arranque
con un mensaje que nombra el archivo, en vez de fallar al servir la primera consulta.
"""

import re
from functools import lru_cache
from pathlib import Path
from typing import Literal, Optional

import yaml
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, ValidationError

CATALOG_DIR = Path(__file__).resolve().parents[1] / "catalogo"

# Lo que devuelve el listado: lo justo para que un agente (o una persona) elija.
SUMMARY_FIELDS = ("id", "nombre", "sistema", "descripcion")

# Binds de SQLAlchemy (:param) ignorando los casts de PostgreSQL (total::numeric).
BINDS = re.compile(r"(?<!:):([a-zA-Z_][a-zA-Z0-9_]*)")


class Parameter(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str
    tipo: Literal["str", "int", "date"]
    requerido: bool = False
    descripcion: str


class Query(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    nombre: str
    # De qué sistema interno lee: agrupa el catálogo y elige la conexión DSN_<SISTEMA>.
    sistema: str
    descripcion: str
    notas: Optional[str] = None
    parametros: list[Parameter] = []
    sql: str

    def metadata(self) -> dict:
        """Todo menos el SQL, que es lo único que nunca sale del servidor."""
        return self.model_dump(exclude={"sql"})


class InvalidCatalog(Exception):
    pass


def _read(path: Path) -> Query:
    try:
        query = Query(**yaml.safe_load(path.read_text(encoding="utf-8")))
    except (yaml.YAMLError, TypeError, ValidationError) as exc:
        raise InvalidCatalog(f"{path}: manifiesto inválido: {exc}") from None

    if path.stem != query.id:
        raise InvalidCatalog(f"{path}: el id no coincide con el nombre del archivo")
    if path.parent.name != query.sistema:
        raise InvalidCatalog(f"{path}: el sistema no coincide con la carpeta")
    if not query.sql.lstrip().upper().startswith(("SELECT", "WITH")):
        raise InvalidCatalog(f"{path}: el sql debe empezar con SELECT o WITH")

    declared = {p.nombre for p in query.parametros}
    used = set(BINDS.findall(query.sql))
    if declared != used:
        raise InvalidCatalog(f"{path}: los parametros {sorted(declared)} no coinciden con los binds {sorted(used)}")
    return query


@lru_cache(maxsize=None)
def load(root: Path = CATALOG_DIR) -> dict[str, Query]:
    return {query.id: query for query in map(_read, sorted(root.glob("*/*.yaml")))}


def find(sistema: Optional[str] = None) -> list[dict]:
    return [
        {field: getattr(query, field) for field in SUMMARY_FIELDS}
        for query in load().values()
        if sistema is None or query.sistema == sistema
    ]


def get(id: str) -> Query:
    try:
        return load()[id]
    except KeyError:
        raise HTTPException(404, f"La consulta '{id}' no existe en el catálogo") from None

"""El catálogo: un manifiesto YAML por indicador. Sin base de datos, aquí solo se lee.

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

# Lo que devuelve el listado: una vista reducida, para no gastar contexto del agente.
SUMMARY_FIELDS = ("id", "nombre", "tema", "unidad", "periodicidad")

# Binds de SQLAlchemy (:param) ignorando los casts de PostgreSQL (valor::numeric).
BINDS = re.compile(r"(?<!:):([a-zA-Z_][a-zA-Z0-9_]*)")


class Parameter(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nombre: str
    tipo: Literal["str", "int"]
    requerido: bool = False
    descripcion: str


class Indicator(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    nombre: str
    tema: str
    definicion: str
    unidad: str
    fuente: str
    # Clave de conexión: resuelve a la variable de entorno DSN_<BASE>.
    base: str
    periodicidad: str
    notas: Optional[str] = None
    parametros: list[Parameter] = []
    sql: str

    def metadata(self) -> dict:
        """Todo menos el SQL, que es lo único que nunca sale del servidor."""
        return self.model_dump(exclude={"sql"})


class InvalidCatalog(Exception):
    pass


def _read(path: Path) -> Indicator:
    try:
        ind = Indicator(**yaml.safe_load(path.read_text(encoding="utf-8")))
    except (yaml.YAMLError, TypeError, ValidationError) as exc:
        raise InvalidCatalog(f"{path}: manifiesto inválido: {exc}") from None

    if path.stem != ind.id:
        raise InvalidCatalog(f"{path}: el id no coincide con el nombre del archivo")
    if path.parent.name != ind.tema:
        raise InvalidCatalog(f"{path}: el tema no coincide con la carpeta")
    if not ind.sql.lstrip().upper().startswith(("SELECT", "WITH")):
        raise InvalidCatalog(f"{path}: el sql debe empezar con SELECT o WITH")

    declared = {p.nombre for p in ind.parametros}
    used = set(BINDS.findall(ind.sql))
    if declared != used:
        raise InvalidCatalog(f"{path}: los parametros {sorted(declared)} no coinciden con los binds {sorted(used)}")
    return ind


@lru_cache(maxsize=None)
def load(root: Path = CATALOG_DIR) -> dict[str, Indicator]:
    return {ind.id: ind for ind in map(_read, sorted(root.glob("*/*.yaml")))}


def find(tema: Optional[str] = None) -> list[dict]:
    return [
        {field: getattr(ind, field) for field in SUMMARY_FIELDS}
        for ind in load().values()
        if tema is None or ind.tema == tema
    ]


def get(id: str) -> Indicator:
    try:
        return load()[id]
    except KeyError:
        raise HTTPException(404, f"El indicador '{id}' no existe en el catálogo") from None

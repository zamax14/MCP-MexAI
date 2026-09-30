"""Ejecución acotada y de solo lectura. La única capa que toca las bases.

Los valores viajan siempre como binds del driver: nunca se arma SQL concatenando
cadenas. Los filtros opcionales ya los resuelve cada manifiesto con
`(CAST(:param AS tipo) IS NULL OR ...)`, así que no existe superficie de inyección.
"""

import os
from datetime import date
from decimal import Decimal
from functools import lru_cache
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import Engine, create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from app.catalog import Query, get

TYPES = {"str": str, "int": int, "date": date.fromisoformat}
EXPECTED = {"str": "un texto", "int": "un número entero", "date": "una fecha en formato AAAA-MM-DD"}
ROW_LIMIT = int(os.environ.get("ROW_LIMIT", "5000"))


@lru_cache(maxsize=None)
def pool(sistema: str) -> Engine:
    """El pool de un sistema, creado en la primera consulta. El manifiesto nombra el sistema
    y el entorno pone el DSN: conectar otro sistema es agregar una variable `DSN_<SISTEMA>`."""
    dsn = os.environ.get(f"DSN_{sistema.upper()}")
    if not dsn:
        raise HTTPException(503, f"El sistema '{sistema}' no está conectado en este despliegue")
    return create_engine(dsn, pool_pre_ping=True)


def _binds(query: Query, params: dict) -> dict:
    """Valida los valores contra los parámetros declarados; un opcional ausente va como NULL."""
    declared = {p.nombre: p for p in query.parametros}

    unknown = sorted(set(params) - set(declared))
    if unknown:
        # Ignorarlo en silencio haría creer al cliente que su filtro se aplicó.
        raise HTTPException(400, f"{query.id}: parámetros desconocidos {unknown}; acepta {sorted(declared)}")

    binds = {}
    for name, param in declared.items():
        value = params.get(name)
        if value is None or value == "":
            if param.requerido:
                raise HTTPException(400, f"{query.id}: falta el parámetro requerido '{name}'")
            binds[name] = None
        else:
            try:
                binds[name] = TYPES[param.tipo](value)
            except (TypeError, ValueError):
                raise HTTPException(400, f"{query.id}: el parámetro '{name}' debe ser {EXPECTED[param.tipo]}") from None
    return binds


def execute(id: str, params: Optional[dict] = None) -> dict:
    query = get(id)
    binds = _binds(query, params or {})

    # Se pide una fila de más que el límite: es lo que distingue «cabe justo» de «está cortado».
    bounded = text(f"SELECT * FROM (\n{query.sql.rstrip().rstrip(';')}\n) _q LIMIT {ROW_LIMIT + 1}")
    try:
        with pool(query.sistema).connect() as conn:
            conn = conn.execution_options(postgresql_readonly=True)
            # NUMERIC llega como Decimal y saldría en el JSON como cadena ("4.70").
            rows = [
                {key: float(value) if isinstance(value, Decimal) else value for key, value in row.items()}
                for row in conn.execute(bounded, binds).mappings()
            ]
    except SQLAlchemyError:
        # Genérico a propósito: el texto de la excepción trae el SQL.
        raise HTTPException(502, f"{query.id}: error al consultar el sistema '{query.sistema}'") from None

    # El límite falla ruidoso: un resultado cortado en silencio se reportaría como completo.
    if len(rows) > ROW_LIMIT:
        raise HTTPException(
            400, f"{query.id}: el resultado excede {ROW_LIMIT} filas; acota con {sorted(p.nombre for p in query.parametros)}"
        )

    return {
        "consulta": query.id,
        "nombre": query.nombre,
        "notas": query.notas,
        "parametros_aplicados": binds,
        "filas": rows,
    }

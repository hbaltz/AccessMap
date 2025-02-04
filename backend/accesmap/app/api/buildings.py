from typing import Any, List, Sequence, Tuple

from fastapi import APIRouter, Depends
from sqlalchemy import Row
from sqlalchemy.ext.asyncio import AsyncSession

from accesmap.app.api.utils.execute_query import execute_query_with_error_handling
from accesmap.app.models.buildings import Building
from accesmap.app.schemas.buildings import BuildingResponse
from accesmap.database.database import get_db

router = APIRouter(prefix="/v1/buildings")


@router.get(
    "/{uuid}",
    response_model=BuildingResponse,
)
async def get_one(
    uuid: str,
    db_session: AsyncSession = Depends(get_db),  # noqa: B008
) -> Row[Tuple[str, str, Any]]:
    stmt = Building.get_fields_query(Building.uuid == uuid)
    not_found_message = f"Record not found for requested uuid: {uuid}"
    result = await execute_query_with_error_handling(db_session, stmt, not_found_message)
    return result[0]


@router.get(
    "/",
    response_model=List[BuildingResponse],
)
async def get_all(
    db_session: AsyncSession = Depends(get_db),  # noqa: B008
) -> Sequence[Row[Tuple[str, str, Any]]]:
    stmt = Building.get_fields_query()
    not_found_message = "No buildings record found"
    result = await execute_query_with_error_handling(db_session, stmt, not_found_message)
    return result

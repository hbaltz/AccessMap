from typing import Any, Tuple
import psycopg
from fastapi import APIRouter, Depends, HTTPException
from psycopg_pool import AsyncConnectionPool
from sqlalchemy import Row, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2.functions import ST_Area, ST_Perimeter, ST_AsGeoJSON

from accesmap.database.database import get_db

from accesmap.app.models.buildings import Building
from accesmap.app.schemas.buildings import BuildingResponse

from fastapi import status


router = APIRouter(prefix="/v1/buildings")


@router.get(
    "/{uuid}",
    response_model=BuildingResponse,
)
async def get_one(
    uuid: str, db_session: AsyncSession = Depends(get_db)
) -> Row[Tuple[str, str, Any]]:  # noqa: B008
    # FIXME use other function to do that
    try:
        # Querying the database using SQLAlchemy's async API
        stmt = select(
            Building.uuid,
            Building.name,
            ST_AsGeoJSON(Building.gps_coord).label("gps_coord"),
        ).filter(Building.uuid == uuid)
        result = await db_session.execute(stmt)
        building = result.first()  # Get the first result

        if building is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Record not found for requested uuid: {uuid}",
            )

        return building

    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ex),
        ) from ex

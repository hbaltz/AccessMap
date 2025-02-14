import asyncpg
from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import ORJSONResponse

from accesmap.app.api.formatters.formatter_accessibility import (
    format_build_accessibility_response,
)
from accesmap.app.api.formatters.formatter_building import (
    format_bulding_list_response,
)
from accesmap.app.api.sql_query_builder.sql_accessibility import (
    build_sql_query_building_accessibility,
)
from accesmap.app.api.sql_query_builder.sql_building import (
    build_sql_query_building_list,
)
from accesmap.database.database import get_db

router = APIRouter(prefix="/v1/buildings")


@router.get("/", response_class=ORJSONResponse)
async def get_all_buildings(
    request: Request,
    conn: asyncpg.Connection = Depends(get_db),  # noqa
    page_size: int = Query(100, ge=1),
    page: int = Query(1, ge=1),
    postal_code: int = Query(None),
    zone: str = Query(
        None,
        description="Bounding box in format 'min_longitude,min_latitude,max_longitude,max_latitude'",
    ),
) -> ORJSONResponse:
    count_query, query, params_where, offset = build_sql_query_building_list(
        postal_code=postal_code, zone=zone, page=page, page_size=page_size
    )

    total_count = await conn.fetchval(count_query, *params_where)
    rows = await conn.fetch(query, *params_where, page_size, offset)

    return format_bulding_list_response(
        rows=rows,
        request=request,
        total_count=total_count,
        page_size=page_size,
        page=page,
    )


@router.get("/accessibility/{building_uuid}", response_class=ORJSONResponse)
async def get_building_accessibility(
    building_uuid: str,
    conn: asyncpg.Connection = Depends(get_db),  # noqa
) -> ORJSONResponse:
    query = build_sql_query_building_accessibility()

    # fetch row because building_id is unique on accessibility table
    result = await conn.fetchrow(query, building_uuid)

    return format_build_accessibility_response(row=result, building_uuid=building_uuid)

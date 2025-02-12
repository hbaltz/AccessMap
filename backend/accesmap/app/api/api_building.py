import asyncpg
from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import ORJSONResponse

from accesmap.app.api.formatters.formatter_building import format_bulding_list_response
from accesmap.app.api.sql_query_builder.sql_building import build_sql_query_building_list
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

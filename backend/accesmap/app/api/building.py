import math
from urllib.parse import urlencode

import asyncpg
from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import ORJSONResponse

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
    offset = (page - 1) * page_size  # Convert page number to offset

    where_conditions: list[str] = []
    params_where: list[int | float] = []

    if postal_code:
        where_conditions.append(f"bd.postal_code = ${len(params_where) + 1}")
        params_where.append(postal_code)

    if zone:
        try:
            min_lon, min_lat, max_lon, max_lat = map(float, zone.split(","))
            where_conditions.append(
                f"ST_Within(bd.gps_coord, ST_MakeEnvelope(${len(params_where) + 1}, ${len(params_where) + 2}, ${len(params_where) + 3}, ${len(params_where) + 4}, 4326))"
            )
            params_where.extend([min_lon, min_lat, max_lon, max_lat])
        except ValueError:
            return ORJSONResponse(
                {"error": "Invalid zone format. Use 'min_lat,min_lon,max_lat,max_lon'."},
                status_code=400,
            )

    where_query = f" WHERE {' AND '.join(where_conditions)}" if where_conditions else ""

    # Get total count of buildings for pagination metadata
    count_query = f"SELECT COUNT(*) FROM building AS bd {where_query};"
    total_count = await conn.fetchval(count_query, *params_where)

    query = f"""
        SELECT 
            bd.uuid, 
            bd.name, 
            bd.postal_code, 
            bd.num_street, 
            bd.street, 
            bd.city,  
            ST_X(bd.gps_coord) AS longitude, 
            ST_Y(bd.gps_coord) AS latitude,
            act.name AS activity_name,
            act.icon_name AS activity_icon
        FROM 
            building AS bd
        INNER JOIN
            activity AS act ON act.id = bd.activity_id
        {where_query}
        ORDER BY bd.uuid
        LIMIT ${len(params_where) + 1} OFFSET ${len(params_where) + 2};
    """

    rows = await conn.fetch(query, *params_where, page_size, offset)

    buildings = [
        {
            "uuid": row["uuid"],
            "name": row["name"],
            "latitude": row["latitude"],
            "longitude": row["longitude"],
            "address": " ".join(
                str(value)
                for value in [
                    row["num_street"],
                    row["street"],
                    row["postal_code"],
                    row["city"],
                ]
                if value
            ),
            "activity": {"name": row["activity_name"], "icon": row["activity_icon"]},
        }
        for row in rows
    ]

    base_url = str(request.url).split("?")[0]  # Base API URL

    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1

    next_page = page + 1 if page < total_pages else None
    prev_page = page - 1 if page > 1 else None

    query_params = dict(request.query_params)

    if next_page:
        query_params.update({"page": str(next_page)})
        next_url = f"{base_url}?{urlencode(query_params)}"
    else:
        next_url = None

    if prev_page:
        query_params.update({"page": str(prev_page)})
        prev_url = f"{base_url}?{urlencode(query_params)}"
    else:
        prev_url = None

    return ORJSONResponse(
        {
            "count": len(buildings),
            "total_count": total_count,
            "total_pages": total_pages,
            "current_page": page,
            "next": next_url,
            "previous": prev_url,
            "results": buildings,
        }
    )

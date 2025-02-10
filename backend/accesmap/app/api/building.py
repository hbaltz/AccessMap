import math

import asyncpg
from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import ORJSONResponse

from accesmap.database.database import get_db

router = APIRouter(prefix="/v1/buildings")


@router.get("/", response_class=ORJSONResponse)
async def get_all_buildings(
    request: Request,
    conn: asyncpg.Connection = Depends(get_db),  # noqa
    limit: int = Query(100, ge=1),
    page: int = Query(1, ge=1),
) -> ORJSONResponse:
    offset = (page - 1) * limit  # Convert page number to offset

    # Get total count of buildings for pagination metadata
    count_query = "SELECT COUNT(*) FROM building;"
    total_count = await conn.fetchval(count_query)  # Fetch single value (count)

    query = """
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
        ORDER BY bd.uuid
        LIMIT $1 OFFSET $2;
    """

    rows = await conn.fetch(query, limit, offset)

    buildings = [
        {
            "uuid": row["uuid"],
            "name": row["name"],
            "latitude": row["latitude"],
            "longitude": row["longitude"],
            "address": f"{row['num_street']} {row['street']} {row['postal_code']} {row['city']}",
            "activity": {"name": row["activity_name"], "icon": row["activity_icon"]},
        }
        for row in rows
    ]

    base_url = str(request.url).split("?")[0]  # Base API URL

    total_pages = math.ceil(total_count / limit) if total_count > 0 else 1

    next_page = page + 1 if page < total_pages else None
    prev_page = page - 1 if page > 1 else None

    next_url = f"{base_url}?limit={limit}&page={next_page}" if next_page else None
    prev_url = f"{base_url}?limit={limit}&page={prev_page}" if prev_page else None

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

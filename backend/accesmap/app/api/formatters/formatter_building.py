import math
from urllib.parse import urlencode

from fastapi import Request
from fastapi.responses import ORJSONResponse


def format_bulding_list_response(
    rows: list,
    request: Request,
    total_count: int,
    page_size: int,
    page: int,
) -> ORJSONResponse:
    """
    Format the building list response to be returned as an API response.

    Parameters:
    - rows (list): List of building data rows fetched from the database.
    - request (Request): The incoming HTTP request, used to extract query parameters.
    - total_count (int): Total number of buildings matching the filter criteria.
    - page_size (int): The number of items to display per page for pagination.
    - page (int): The current page number for pagination.

    Returns:
    - ORJSONResponse: A formatted response containing building details and pagination information.
    """

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

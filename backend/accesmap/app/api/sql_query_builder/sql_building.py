from typing import Tuple


def build_sql_query_building_list(
    postal_code: int, zone: str, page: int, page_size: int
) -> Tuple[str, str, list[int | float], int]:
    """
    Builds SQL queries and parameters for retrieving buildings based on postal code, zone,
    pagination information (page number and page size).

    Parameters:
    - postal_code (int): The postal code to filter the buildings.
    - zone (str): The zone (or region) to filter the buildings.
    - page (int): The page number to retrieve for pagination.
    - page_size (int): The number of items per page for pagination.

    Returns:
    - Tuple[str, str, List[Union[int, float]], int]:
        - A SQL query to get the total count of buildings.
        - A SQL query to retrieve the list of buildings.
        - A list of parameters to be passed to the SQL queries.
        - An integer representing the offset to apply for pagination.
    """
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
            raise ValueError(
                "Invalid zone format. Use 'min_longitude,min_latitude,max_longitude,max_latitude'."
            ) from None

    where_query = f"WHERE {' AND '.join(where_conditions)}" if where_conditions else ""

    # Get total count of buildings for pagination metadata
    count_query = f"SELECT COUNT(*) FROM building AS bd {where_query};"

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

    offset = (page - 1) * page_size  # Convert page number to offset

    return (count_query, query, params_where, offset)

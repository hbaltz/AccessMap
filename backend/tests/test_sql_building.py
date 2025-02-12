import textwrap

import pytest

from accesmap.app.api.sql_query_builder.sql_building import build_sql_query_building_list


@pytest.mark.parametrize(
    "postal_code, zone, page, page_size, expected_count_query, expected_query, expected_params, expected_offset",
    [
        (
            12345,
            "10.0,-10.0,20.0,20.0",  # Valid zone format
            2,
            10,
            "SELECT COUNT(*) FROM building AS bd WHERE bd.postal_code = $1 AND ST_Within(bd.gps_coord, ST_MakeEnvelope($2, $3, $4, $5, 4326));",
            """
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
            WHERE bd.postal_code = $1 AND ST_Within(bd.gps_coord, ST_MakeEnvelope($2, $3, $4, $5, 4326))
            ORDER BY bd.uuid
            LIMIT $6 OFFSET $7;
            """,
            [12345, 10.0, -10.0, 20.0, 20.0],
            10,
        ),
        (
            0,  # No postal code
            "10.0,-10.0,20.0,20.0",
            2,
            10,
            "SELECT COUNT(*) FROM building AS bd WHERE ST_Within(bd.gps_coord, ST_MakeEnvelope($1, $2, $3, $4, 4326));",
            """
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
            WHERE ST_Within(bd.gps_coord, ST_MakeEnvelope($1, $2, $3, $4, 4326))
            ORDER BY bd.uuid
            LIMIT $5 OFFSET $6;
            """,
            [10.0, -10.0, 20.0, 20.0],
            10,
        ),
        (
            12345,
            "invalid_zone_format",  # Invalid zone format
            2,
            10,
            ValueError,
            None,
            None,
            None,
        ),
        (
            12345,  # No zone
            "",
            2,
            10,
            "SELECT COUNT(*) FROM building AS bd WHERE bd.postal_code = $1;",
            """
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
            WHERE bd.postal_code = $1
            ORDER BY bd.uuid
            LIMIT $2 OFFSET $3;
            """,
            [12345],
            10,
        ),
        (
            12345,
            "10.0,-10.0,20.0,20.0",  # Edge case for page=1 and page_size=1
            1,
            1,
            "SELECT COUNT(*) FROM building AS bd WHERE bd.postal_code = $1 AND ST_Within(bd.gps_coord, ST_MakeEnvelope($2, $3, $4, $5, 4326));",
            """
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
            WHERE bd.postal_code = $1 AND ST_Within(bd.gps_coord, ST_MakeEnvelope($2, $3, $4, $5, 4326))
            ORDER BY bd.uuid
            LIMIT $6 OFFSET $7;
            """,
            [12345, 10.0, -10.0, 20.0, 20.0],
            0,
        ),
    ],
)
def test_build_sql_query_building_list(
    postal_code: int,
    zone: str,
    page: int,
    page_size: int,
    expected_count_query: str,
    expected_query: str,
    expected_params: list[int | float],
    expected_offset: int,
) -> None:
    if expected_count_query == ValueError:
        with pytest.raises(ValueError):
            build_sql_query_building_list(postal_code, zone, page, page_size)
    else:
        count_query, query, params, offset = build_sql_query_building_list(
            postal_code, zone, page, page_size
        )
        # Using textwrap.dedent to normalize indentation
        count_query = textwrap.dedent(count_query).strip()
        query = textwrap.dedent(query).strip()
        expected_count_query = textwrap.dedent(expected_count_query).strip()
        expected_query = textwrap.dedent(expected_query).strip()

        assert count_query == expected_count_query
        assert query == expected_query
        assert params == expected_params
        assert offset == expected_offset

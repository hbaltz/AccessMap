import math
from unittest.mock import MagicMock

import orjson
import pytest
from fastapi import Request
from fastapi.responses import ORJSONResponse

from accesmap.app.api.formatters.formatter_building import format_bulding_list_response


@pytest.fixture
def mock_request() -> MagicMock:
    # Create a mock Request object
    mock_req = MagicMock(Request)
    mock_req.url = "http://testserver/buildings?page=2&page_size=10"
    mock_req.query_params = {"page": "2", "page_size": "10", "postal_code": "75001"}
    return mock_req


def test_format_bulding_list_response(mock_request: MagicMock) -> None:
    """
    It should format the data passed as parameters and return an ORJSONResponse object.
    """
    rows = [
        {
            "uuid": "123",
            "name": "Building A",
            "latitude": 45.0,
            "longitude": 4.0,
            "num_street": "123",
            "street": "Main St",
            "postal_code": "75001",
            "city": "Paris",
            "activity_name": "Office",
            "activity_icon": "office",
        },
        {
            "uuid": "456",
            "name": "Building B",
            "latitude": 46.0,
            "longitude": 5.0,
            "num_street": None,
            "street": "Broadway",
            "postal_code": "75002",
            "city": "Paris",
            "activity_name": "Retail",
            "activity_icon": "shop",
        },
    ]
    total_count = 25
    page_size = int(mock_request.query_params["page_size"])
    page = int(mock_request.query_params["page"])

    # Call the function to test
    response = format_bulding_list_response(
        rows, mock_request, total_count, page_size, page
    )

    # Check that the response is an instance of ORJSONResponse
    assert isinstance(response, ORJSONResponse)

    # Check the structure of the response
    response_data = orjson.loads(response.body)
    assert "count" in response_data
    assert response_data["count"] == len(rows)

    assert "total_count" in response_data
    assert response_data["total_count"] == total_count

    assert "total_pages" in response_data
    assert response_data["total_pages"] == math.ceil(total_count / page_size)

    assert "current_page" in response_data
    assert response_data["current_page"] == page

    # Check next and previous URLs based on the page and total pages
    assert "next" in response_data
    assert (
        response_data["next"]
        == "http://testserver/buildings?page=3&page_size=10&postal_code=75001"
    )

    assert "previous" in response_data
    print(response_data["previous"])
    assert (
        response_data["previous"]
        == "http://testserver/buildings?page=1&page_size=10&postal_code=75001"
    )

    # Check if the buildings data is correctly formatted
    assert "results" in response_data
    buildings = response_data["results"]
    assert len(buildings) == len(rows)

    # Check if data are well formatted
    building0 = buildings[0]

    assert "uuid" in building0
    assert building0["uuid"] == "123"
    assert "name" in building0
    assert building0["name"] == "Building A"
    assert "latitude" in building0
    assert building0["latitude"] == 45.0
    assert "longitude" in building0
    assert building0["longitude"] == 4.0
    assert "address" in building0
    assert building0["address"] == "123 Main St 75001 Paris"
    assert "activity" in building0
    activity0 = building0["activity"]
    assert "name" in activity0
    assert activity0["name"] == "Office"
    assert "icon" in activity0
    assert activity0["icon"] == "office"

    building1 = buildings[1]

    assert "uuid" in building1
    assert building1["uuid"] == "456"
    assert "name" in building1
    assert building1["name"] == "Building B"
    assert "latitude" in building1
    assert building1["latitude"] == 46.0
    assert "longitude" in building1
    assert building1["longitude"] == 5.0
    assert "address" in building1
    assert building1["address"] == "Broadway 75002 Paris"
    assert "activity" in building1
    activity1 = building1["activity"]
    assert "name" in activity1
    assert activity1["name"] == "Retail"
    assert "icon" in activity0
    assert activity1["icon"] == "shop"

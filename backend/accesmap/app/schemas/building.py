from typing import Optional

from geojson_pydantic import Point
from pydantic import BaseModel, ConfigDict, Json


class BuildingResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        extra="ignore",
    )
    uuid: str
    name: Optional[str]
    gps_coord: Json[Point]

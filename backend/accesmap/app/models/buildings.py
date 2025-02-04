from typing import Optional, Tuple

from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy import Column, ColumnExpressionArgument, Index, Select, String, select

from accesmap.app.models.base import AccessBase


class Building(AccessBase):
    __tablename__ = "building"
    uuid = Column(
        String(36),
        unique=True,
        primary_key=True,
    )
    name = Column(String(256))
    gps_coord = Column(Geometry("POINT", spatial_index=False))

    @classmethod
    def get_fields_query(
        cls,
        where_conditions: Optional[ColumnExpressionArgument] = None,
    ) -> Select[Tuple]:
        query = select(
            Building.uuid,
            Building.name,
            ST_AsGeoJSON(Building.gps_coord).label("gps_coord"),
        )

        if where_conditions is not None:
            query = query.where(where_conditions)

        return query


# We add index manually so it's well detected by Alembic
Index("idx_centre_gps_coord", Building.__table__.c.gps_coord, postgresql_using="gist")

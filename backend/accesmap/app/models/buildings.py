from accesmap.app.models.base import AccessBase
from geoalchemy2 import Geometry

from sqlalchemy import Column, String, Index


class Building(AccessBase):
    __tablename__ = "building"
    uuid = Column(
        String(36),
        unique=True,
        primary_key=True,
    )
    name = Column(String(256))
    gps_coord = Column(Geometry("POINT", spatial_index=False))


# We add index manually so it's well detected by Alembic
Index("idx_centre_gps_coord", Building.__table__.c.gps_coord, postgresql_using="gist")

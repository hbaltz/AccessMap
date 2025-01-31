import sqlalchemy as sa
from sqlalchemy.orm import declarative_base
from geoalchemy2 import Geometry

from sqlalchemy import Column, String, Index

MetaData = sa.MetaData
meta = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(column_0_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)
Base = declarative_base(metadata=meta)


class Centre(Base):
    __tablename__ = "building"
    uuid = Column(
        String(36),
        unique=True,
        primary_key=True,
    )
    name = Column(String(256))
    gps_coord = Column(Geometry("POINT", spatial_index=False))


# We add index manually so it's well detected by Alembic
Index("idx_centre_gps_coord", Centre.__table__.c.gps_coord, postgresql_using="gist")

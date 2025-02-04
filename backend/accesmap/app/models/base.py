from abc import abstractmethod
from typing import Tuple

from sqlalchemy import ColumnExpressionArgument, MetaData, Select
from sqlalchemy.orm import declarative_base

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


class AccessBase(Base):
    __abstract__ = True  # Mark it as abstract so it's not used directly

    @classmethod
    @abstractmethod
    def get_fields_query(
        cls,
        where_conditions: ColumnExpressionArgument,
    ) -> Select[Tuple]:
        """Implements in subclasses to define create the sql query to recover the fields"""
        pass

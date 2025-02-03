from typing import Any, Tuple, Sequence
from sqlalchemy import MetaData, Row
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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
    async def get_all(
        cls, where_conditions: list[Any], database_session: AsyncSession
    ) -> Sequence[Row[Tuple[Any]]]:
        _stmt = select(cls).where(*where_conditions)
        _result = await database_session.execute(_stmt)
        return _result.fetchall()

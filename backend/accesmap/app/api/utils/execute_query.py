from typing import Sequence, Tuple

from fastapi import HTTPException, status
from sqlalchemy import Row, Select
from sqlalchemy.ext.asyncio import AsyncSession


async def execute_query_with_error_handling(
    db_session: AsyncSession, stmt: Select[Tuple], not_found_message: str
) -> Sequence[Row[Tuple]]:
    try:
        # Execute the query
        result = await db_session.execute(stmt)
        records = result.all()

        if not records:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=not_found_message,
            )

        return records

    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ex),
        ) from ex

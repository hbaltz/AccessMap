from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import asyncpg

from accesmap.app.config import settings as global_settings

db_pool: asyncpg.Pool | None = None


# Create a connection pool globally
async def create_pool() -> asyncpg.Pool | None:
    try:
        pool = await asyncpg.create_pool(
            dsn=global_settings.sql_url.unicode_string(),
            min_size=1,  # Adjust based on load
            max_size=20,  # Adjust based on concurrency
        )
        return pool
    except Exception as e:
        print(f"Error creating the pool: {e}")
        raise


async def startup_db_con() -> None:
    global db_pool
    if db_pool is None:
        db_pool = await create_pool()


async def shutdown_db_con() -> None:
    global db_pool
    if db_pool:
        await db_pool.close()


async def get_db() -> AsyncGenerator:
    if db_pool is not None:
        async with db_pool.acquire() as conn:
            yield conn
    else:
        raise Exception("No connection pool available")


@asynccontextmanager
async def async_session() -> AsyncGenerator:
    """
    Creates an asynchronous session-like context with asyncpg for managing
    database connections.
    """
    # Connect to the database
    conn = await asyncpg.connect(global_settings.sql_url.unicode_string())

    try:
        yield conn  # This allows us to use the connection like a session
    finally:
        # Ensure the connection is closed after usage
        await conn.close()

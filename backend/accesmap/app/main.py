from collections.abc import AsyncGenerator

from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends

from psycopg_pool import AsyncConnectionPool

from accesmap.app.config import settings as global_settings
from accesmap.app.api.buildings import router as buildings_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    _conninfo = global_settings.get_conn_str()
    try:
        # Load the async pool connection
        app.async_pool = AsyncConnectionPool(conninfo=_conninfo)  # type: ignore[attr-defined]
        yield
    finally:
        # close redis connection and release the resources
        await app.async_pool.close()  # type: ignore[attr-defined]


app = FastAPI(title="Acces Map API", version="0.0.1", lifespan=lifespan)

app.include_router(buildings_router)

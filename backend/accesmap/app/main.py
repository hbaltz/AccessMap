from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from accesmap.app.api.building import router as buildings_router
from accesmap.app.config import settings as global_settings
from accesmap.database.database import shutdown_db_con, startup_db_con


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator:
    try:
        # Load the async pool connection
        await startup_db_con()
        yield
    finally:
        # close redis connection and release the resources
        await shutdown_db_con()


app = FastAPI(title="Acces Map API", version="0.0.1", lifespan=lifespan)

app.include_router(buildings_router)


origins = [
    global_settings.frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

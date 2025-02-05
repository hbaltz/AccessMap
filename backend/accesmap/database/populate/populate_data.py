from argparse import _SubParsersAction
from typing import Callable

from accesmap.database.database import AsyncSessionFactory
from accesmap.database.populate.data_loader import DataLoader
from accesmap.utils.argurment_parser import ConfigurableArgumentParser

DEFAULT_URL = (
    "https://www.data.gouv.fr/fr/datasets/r/93ae96a7-1db7-4cb4-a9f1-6d778370b640"
)


async def populate_data(url: str = DEFAULT_URL) -> None:
    async with AsyncSessionFactory() as session:
        data_loader = DataLoader(session)
        data = data_loader.read_csv(url)
        print("Populating activity ...", end="")
        activity_name_id_dict = await data_loader.populate_activity(data)
        print("Done")
        print("Populating building and accessibility ...", end="")
        await data_loader.populate_building_and_accessibility(data, activity_name_id_dict)
        print("Done")
        print("Commit to database ...", end="")
        await session.commit()
        print("Done")


class PopulateData(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: dict) -> None:
        import asyncio

        if args["file-path"]:
            url = args["file-path"]
        else:
            url = DEFAULT_URL

        asyncio.run(populate_data(url))

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "populate_db"
        parser = subparsers.add_parser(name, help="populate the databse")

        parser.add_argument(
            "-fp",
            "--file-path",
            dest="file-path",
            type=str,
            help="path to the file containing the data to be loaded",
            default=None,
        )

        return name, PopulateData.handle_args

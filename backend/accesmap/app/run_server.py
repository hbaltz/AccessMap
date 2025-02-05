from argparse import _SubParsersAction
from typing import Callable

from accesmap.utils.argurment_parser import ConfigurableArgumentParser


class RunServer(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: dict) -> None:
        import uvicorn

        uvicorn.run("accesmap.app.main:app", host="127.0.0.1", port=8000, reload=True)

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "start"
        subparsers.add_parser(name, help="start the web server")

        return name, RunServer.handle_args

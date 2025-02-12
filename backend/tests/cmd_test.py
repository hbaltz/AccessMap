from argparse import _SubParsersAction
from typing import Callable

from accesmap.utils.argurment_parser import ConfigurableArgumentParser


class Test(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(_args: dict, *extra_args: list[str]) -> None:
        import pytest

        argv = ["-v", "-p", "no:warnings"]
        argv.extend(extra_args)  # type: ignore

        err = pytest.main(argv)
        print(f"PYTHON EXIT CODE = {err}")
        exit(err)

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "test"
        subparsers.add_parser(name, help="launch tests")
        return name, Test.handle_args

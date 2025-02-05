from argparse import _SubParsersAction
from typing import Callable

from accesmap.utils.argurment_parser import ConfigurableArgumentParser


class TypeChecker(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: dict) -> None:
        import subprocess

        try:
            subprocess.run(["mypy", args["path"]], check=True)
            print("✅ Type checking completed successfully.")
        except subprocess.CalledProcessError:
            print("❌ Error during type checking.")

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "type_check"
        parser = subparsers.add_parser(
            name,
            help="check the types in the codebase in the current directory",
        )

        parser.add_argument(
            "path",
            type=str,
            nargs="?",
            default=".",  # Default to the current directory
            help="Path to the file or directory to check type (default: current directory).",
        )

        return name, TypeChecker.handle_args

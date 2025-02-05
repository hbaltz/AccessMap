from argparse import _SubParsersAction
from typing import Callable

from accesmap.utils.argurment_parser import ConfigurableArgumentParser


class Formatter(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: dict) -> None:
        import subprocess

        try:
            subprocess.run(["ruff", "format", args["path"]], check=True)
            print("✅ Formatting completed successfully.")
        except subprocess.CalledProcessError:
            print("❌ Error during formatting.")

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "format"
        parser = subparsers.add_parser(
            name, help="format the codebase in the current directory"
        )

        parser.add_argument(
            "path",
            type=str,
            nargs="?",
            default=".",  # Default to the current directory
            help="Path to the file or directory to format (default: current directory).",
        )

        return name, Formatter.handle_args

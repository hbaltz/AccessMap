from argparse import _SubParsersAction
from typing import Callable

from accesmap.utils.argurment_parser import ConfigurableArgumentParser


class Linter(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: dict) -> None:
        import subprocess

        command_args = ["ruff", "check", args["path"]]

        if args["fix"]:
            command_args.append("--fix")

        try:
            subprocess.run(command_args, check=True)
            print("✅ Linting check completed successfully.")
        except subprocess.CalledProcessError:
            print("❌ Error during linting.")

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "lint"
        parser = subparsers.add_parser(name, help="lint the codebase")

        parser.add_argument(
            "-f",
            "--fix",
            dest="fix",
            action="store_true",
            help="si on veut appliquer les corrections automatiques",
        )

        parser.add_argument(
            "path",
            type=str,
            nargs="?",
            default=".",  # Default to the current directory
            help="Path to the file or directory to lint (default: current directory).",
        )

        return name, Linter.handle_args

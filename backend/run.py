#!/usr/bin/env python3
import argparse
from typing import Callable

CMD_HANDLERS: dict[str, Callable] = {}


def register_parser(
    subparsers: argparse.ArgumentParser, parser: argparse.ArgumentParser
) -> None:
    name, handler = parser.setup_parser(subparsers)
    if name in CMD_HANDLERS:
        raise Exception(f"duplicate name for command : '{name}' already exists")
    CMD_HANDLERS[name] = handler


def parse_parameters(
    argv: list[str],
) -> tuple[dict[str, str], list[str], argparse.ArgumentParser]:
    from accesmap.database.make_migrations import MakeMigrations
    from accesmap.database.migrate import Migrate, Downgrade

    parser = argparse.ArgumentParser(
        description="run accesmap commands and tests", allow_abbrev=False
    )
    subparsers = parser.add_subparsers(dest="command")

    register_parser(subparsers, MakeMigrations)
    register_parser(subparsers, Migrate)
    register_parser(subparsers, Downgrade)

    args, unknown = parser.parse_known_args(argv)
    return vars(args), unknown, parser


def main() -> None:
    import sys

    argv = sys.argv[1:]
    argv_extra = []
    if "--" in argv:
        index_sep = argv.index("--")
        argv, argv_extra = argv[:index_sep], argv[index_sep + 1 :]

    if len(argv_extra) > 0:
        print("ignored argument : ", argv_extra)

    args, unknown, parser = parse_parameters(argv)

    command = args["command"]
    if command is None:
        parser.print_help()
        exit(1)

    handler = CMD_HANDLERS[command]
    if len(unknown) > 0:
        try:
            handler(args, *unknown)
        except TypeError:
            handler(args)
    else:
        handler(args)


if __name__ == "__main__":
    main()

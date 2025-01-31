from argparse import _SubParsersAction, ArgumentParser
from typing import Callable

from accesmap.utils.argurment_parser import ConfigurableArgumentParser


class Migrate(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: list[str]) -> None:
        import os
        import argparse

        from alembic.config import Config
        from alembic import command

        from accesmap.app.config import settings as global_settings

        this_file_directory = os.path.dirname(os.path.realpath(__file__))
        ini_path = os.path.realpath(
            os.path.join(this_file_directory, "..", "..", "alembic.ini")
        )

        db_url = str(global_settings.sql_url)

        # create Alembic config
        config = Config(ini_path, ini_section="alembic")
        config.cmd_opts = argparse.Namespace()  # arguments stub
        config.set_section_option("alembic", "sqlalchemy.url", db_url)

        command.upgrade(config, "head", tag=db_url)

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "migrate"
        subparsers.add_parser(name, help="apply the migration file to the db")

        return name, Migrate.handle_args


class Downgrade(ConfigurableArgumentParser):
    @staticmethod
    def handle_args(args: list[str]) -> None:
        parser = ArgumentParser()
        parser.add_argument("--revision", required=True, help="Specify the revision")
        parsed_args = parser.parse_args(args)
        revision = parsed_args.revision
        if revision is None:
            raise Exception("you must specify a revision(-h for help)")

        from accesmap.app.config import settings as global_settings
        import os
        import argparse

        from alembic.config import Config
        from alembic import command

        db_url = str(global_settings.sql_url)

        this_file_directory = os.path.dirname(os.path.realpath(__file__))
        ini_path = os.path.join(this_file_directory, "..", "..", "alembic.ini")

        # create Alembic config
        config = Config(ini_path, ini_section="alembic")
        config.cmd_opts = argparse.Namespace()  # arguments stub
        config.set_section_option("alembic", "sqlalchemy.url", db_url)

        command.downgrade(config, revision=revision, tag=db_url)

    @staticmethod
    def setup_parser(subparsers: _SubParsersAction) -> tuple[str, Callable]:
        name = "downgrade"
        subparsers.add_parser(name, help="downgrade the db to a specific version")

        return name, Downgrade.handle_args

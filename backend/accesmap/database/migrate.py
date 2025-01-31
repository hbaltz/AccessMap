from argparse import ArgumentParser


class Migrate:
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
    def setup_parser(subparsers: ArgumentParser) -> tuple[str, callable]:
        name = "migrate"
        subparsers.add_parser(name, help="apply the migration file to the db")

        return name, Migrate.handle_args


class Downgrade:
    @staticmethod
    def handle_args(args: list[str]) -> None:
        revision = args["revision"]
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
    def setup_parser(subparsers: ArgumentParser) -> tuple[str, callable]:
        name = "downgrade"
        subparsers.add_parser(name, help="downgrade the db to a specific version")

        return name, Downgrade.handle_args

from argparse import ArgumentParser


class MakeMigrations:
    @staticmethod
    def handle_args(args: list[str]) -> None:
        import os
        import argparse
        from alembic.config import Config
        from alembic import command
        from accesmap.app.config import settings as global_settings

        this_file_directory = os.path.dirname(os.path.realpath(__file__))
        root_directory = os.path.join(this_file_directory, "../..")
        ini_path = os.path.join(root_directory, "alembic.ini")

        # create Alembic config
        config = Config(ini_path, ini_section="alembic")
        config.cmd_opts = argparse.Namespace()  # arguments stub
        config.set_section_option(
            "alembic", "sqlalchemy.url", str(global_settings.sql_url)
        )

        command.revision(
            config, message=args["message"], autogenerate=args["autogenerate"]
        )

    @staticmethod
    def setup_parser(subparsers: ArgumentParser) -> tuple[str, callable]:
        name = "makemigrations"
        parser = subparsers.add_parser(name, help="create migration files")

        parser.add_argument(
            "-ag",
            "--auto-generate",
            dest="autogenerate",
            action="store_true",
            help="vrai si l'on veut générer automatiquement le fichier de révision",
        )

        parser.add_argument(
            "-m",
            "--message",
            dest="message",
            type=str,
            help="nom de la révision",
            default=None,
        )

        return name, MakeMigrations.handle_args

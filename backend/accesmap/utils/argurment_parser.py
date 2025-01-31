from argparse import ArgumentParser, _SubParsersAction

from abc import ABC, abstractmethod
from typing import Callable


class ConfigurableArgumentParser(ABC, ArgumentParser, _SubParsersAction):
    @abstractmethod
    def setup_parser(self, subparsers: _SubParsersAction) -> tuple[str, Callable]:
        pass

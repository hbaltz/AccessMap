## Create db migration files

```bash
./run.py makemigrations -ag -m <DESCRIPTION_OF_CHANGES>
```

## Migrate db

```bash
./run.py migrate
```

## Downgrade db

```bash
./run.py downgrade <VERSION_ID>
```

## Launch application

```bash
./run.py start
```

## Lint

```bash
./run.py lint
```

or for a specific file/folder

```bash
./run.py lint <PATH_TO_FILE>
```

add argument --fix or -f to fix errors that can be fix

```bash
./run.py lint -f
```

## Format

```bash
./run.py format
```

or for a specific file/folder

```bash
./run.py format <PATH_TO_FILE>
```

## Type checking

```bash
./run.py type_check
```

or for a specific file/folder

```bash
./run.py type_check <PATH_TO_FILE>
```
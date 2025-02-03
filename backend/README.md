## Create db migration files

```bash
./run.py makemigrations -ag -m <DESCRIPTION_OF_CHANGES>
```

## Migrate db

```bash
./run.py migrate
```

## Downgrade fdb

```bash
```

## Launch application

<!-- TODO: add a command in run.py -->
```bash
uvicorn main:app --reload
```
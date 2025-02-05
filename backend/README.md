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
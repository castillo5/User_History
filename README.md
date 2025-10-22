# User_History

Consulta el flujo de ramas propuesto en `docs/branching.md` para mantener `main` siempre estable.

## Puesta en marcha local con Docker

1. Copia el archivo de variables: `cp .env.example .env` y actualiza credenciales si es necesario.
2. Lanza los servicios: `docker compose up --build`.
3. La API quedará disponible en `http://localhost:3000` y PostgreSQL en `localhost:5432`.

El archivo `docker-compose.yml` levanta la aplicación junto con PostgreSQL, crea una red interna (`app-network`), persiste la data en el volumen `db_data` y limita el uso a 0.5 CPU y 512 MB de RAM por servicio.

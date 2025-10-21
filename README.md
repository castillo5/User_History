# User_History

Consulta el flujo de ramas propuesto en `docs/branching.md` para mantener `main` siempre estable.

## Puesta en marcha con Docker

1. Copia las variables de entorno base: `cp .env.example .env` y ajusta credenciales según tu entorno.
2. Levanta los contenedores (app + Postgres): `docker compose up --build`.
3. La API quedará disponible en `http://localhost:3000` con la base de datos en `localhost:5432`.
4. Ejecuta el sembrado si lo necesitas: `docker compose exec app npm run db:seed`.

La imagen se construye con TypeScript compilado a `dist/`, instalando solo dependencias de producción en el contenedor final.

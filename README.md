# User_History

Consulta el flujo de ramas propuesto en `docs/branching.md` para mantener `main` siempre estable.

## Variables de entorno

Duplicá el archivo `.env.example` como `.env` y ajustá los valores para tu entorno (base de datos Postgres y firma JWT).

Variables relevantes:
- `JWT_SECRET`: Clave usada para firmar los tokens.
- `JWT_EXPIRES_IN`: Tiempo de expiración (ej. `1h`, `3600`).
- `BCRYPT_SALT_ROUNDS`: Rondas de hash para contraseñas (por defecto 10).
- `REFRESH_TOKEN_TTL`: Vigencia del refresh token (ej. `7d`, `12h`).

## Endpoints de autenticación

- `POST /auth/register`: Crea un usuario (`name`, `email`, `password`, `role?`).
- `POST /auth/login`: Devuelve token JWT y datos del usuario (`email`, `password`).

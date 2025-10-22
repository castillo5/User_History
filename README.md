# SportsLine API

API REST construida con Node.js, TypeScript y Express para gestionar productos, clientes y pedidos de la empresa ficticia **SportsLine**. Incluye autenticación JWT con refresh tokens, roles, cifrado híbrido (AES-256-GCM + RSA), documentación Swagger, tests con Jest y despliegue contenedorizado con Docker.

## Arquitectura

- **Express + TypeScript** con estructura modular (`src/modules`) separando controladores, servicios, DAO y DTO.
- **Sequelize** como ORM sobre PostgreSQL con modelos `User`, `Product`, `Client`, `Order`, `OrderProduct` y `RefreshToken`.
- **Autenticación JWT** con refresh tokens almacenados con hash (SHA-256) y roles `admin` y `vendedor`.
- **Cifrado híbrido** para datos sensibles de pedidos usando AES-256-GCM para payload y RSA-2048 para la clave simétrica.
- **Swagger/OpenAPI** expuesto en `/api-docs` con ejemplos de respuestas 200/201/400/404/500.
- **Jest** con pruebas unitarias (>40 % cobertura) para servicios principales.
- **Docker & Docker Compose** con límites de recursos y secrets para llaves RSA.

## Requisitos previos

- Node.js 20.x
- PostgreSQL 13+
- npm 9+

## Configuración

1. Clonar el repositorio y crear el archivo `.env`:
   ```bash
   cp .env.example .env
   ```
2. Editar `.env` y ajustar credenciales/secretos. Asegúrate de definir `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` y rutas a llaves RSA.
3. Generar llaves RSA (2048 bits) para cifrado híbrido:
   ```bash
   npx ts-node scripts/keys/generate-rsa.ts ./secrets
   ```
   - Monta estas llaves en los paths definidos en `.env` (`RSA_PRIVATE_KEY_PATH`, `RSA_PUBLIC_KEY_PATH`).

## Instalación y ejecución local

```bash
npm ci
npm run dev
```

El servidor expone `http://localhost:3000`. La documentación interactiva está en `http://localhost:3000/api-docs`.

### Base de datos y seed

Ejecuta el seed para crear un usuario admin y productos de ejemplo:
```bash
npm run seed
```

### Pruebas

Ejecutar pruebas con cobertura:
```bash
npm run test:coverage
```

## Ejecución con Docker

Genera el Swagger JSON y construye la imagen:
```bash
npm run swagger:gen
docker compose up --build
```

- El servicio `app` expone el puerto `3000`.
- PostgreSQL se ejecuta en el puerto `5432` con datos persistentes en el volumen `pg_data`.
- Limites de recursos: `0.5` CPU, `512M` RAM.
- Monta llaves RSA como secrets en `./secrets/rsa_private.pem` y `./secrets/rsa_public.pem`.

## Ramas y Gitflow

- Ramas principales: `main` (producción) y `develop` (integración).
- Para nuevas funcionalidades, crear ramas `feature/<nombre>` y usar Conventional Commits (`feat:`, `fix:`, etc.).
- Al finalizar la HU, abrir PR hacia `develop` con resumen, pruebas ejecutadas y referencias de issues.

## Endpoints clave

- `POST /api/v1/auth/register` — Registro de usuarios (roles `admin`/`vendedor`).
- `POST /api/v1/auth/login` — Login con emisión de access/refresh tokens.
- `POST /api/v1/auth/refresh` — Renovación de access token.
- CRUD de productos `/api/v1/products` (requiere rol `admin` para mutaciones).
- CRUD de clientes `/api/v1/clients`.
- Gestión de pedidos `/api/v1/orders` con validación de stock y cifrado de datos sensibles.

## Seguridad

- Nunca versionar archivos `.env` ni llaves reales.
- Los refresh tokens se almacenan hashados.
- El cifrado híbrido requiere asegurar rutas a llaves RSA.
- Configura `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` diferentes en cada entorno.

## Scripts útiles

- `npm run dev`: nodemon + ts-node.
- `npm run build`: compila a `dist/`.
- `npm run start`: ejecuta build.
- `npm run lint`: ESLint.
- `npm run test:coverage`: jest con cobertura.
- `npm run seed`: resetea esquema y carga datos iniciales.
- `npm run swagger:gen`: genera `docs/swagger.json`.
- `npx ts-node scripts/keys/generate-rsa.ts <directorio>`: crea llaves RSA de prueba.

## Notas finales

- Ajusta niveles de log y `sequelize.sync` según el entorno (`NODE_ENV=production` deshabilita `alter`).
- Para despliegues productivos, gestionar migraciones con Sequelize CLI o equivalente.

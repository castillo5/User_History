# User_History

Consulta el flujo de ramas propuesto en `docs/branching.md` para mantener `main` siempre estable.

## Puesta en marcha con Docker

1. Copia las variables de entorno base: `cp .env.example .env`.
2. Completa `DATABASE_URL` con el string de conexión de Supabase (Project Settings ▸ Database ▸ Connection string ▸ URI) y mantén `DB_SSL=true` para conexiones alojadas.
3. Levanta el contenedor: `docker compose up --build` o `npm run docker:start`.
4. La API quedará disponible en `http://localhost:3000`, usando Supabase como base de datos.
5. Si necesitas poblar datos ejecuta (⚠️ Borra tablas con `sync({ force: true })`): `docker compose exec app npm run db:seed`.

La imagen se construye con TypeScript compilado a `dist/`, instalando solo dependencias de producción en el contenedor final. Asegúrate de que tu instancia de Supabase (local via CLI o alojada) esté accesible antes de iniciar el contenedor.

#!/usr/bin/env bash
set -euo pipefail

if [ ! -f ".env" ]; then
  echo "⚠️  Archivo .env no encontrado. Ejecuta 'cp .env.example .env' y actualiza las variables antes de continuar."
  exit 1
fi

docker compose up --build "$@"

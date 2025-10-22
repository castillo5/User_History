# Branch Strategy

We use a simplified Git Flow to keep `main` stable and production-ready.

- `main`: protected branch for deployments and tagged releases. No direct commits.
- `develop`: default working branch that gathers completed feature work to stabilize before release.
- `feature/*`: short-lived branches for individual tasks. Rebase on `develop`, open PRs back into `develop`.
- `hotfix/*`: emergency fixes branched off `main`, merged into both `main` and `develop`.

## Workflow

1. Pull latest `develop`: `git switch develop && git pull`.
2. Create a feature branch: `git switch -c feature/short-description`.
3. Work and commit locally, keeping scope small; rebase (`git pull --rebase`) if `develop` moves.
4. Open a PR targeting `develop`. Require review and passing checks.
5. When ready to release, open a PR from `develop` into `main`, tag the release after merge.
6. For hotfixes, branch from `main`, then merge back into both `main` and `develop`.

## Recommended Settings

- Protect `main` and `develop` on GitHub: require PR reviews, status checks, forbid force-pushes.
- Delete feature branches on merge to keep the repo tidy.

## GitHub Configuration Checklist

1. Crea las ramas `main` y `develop` en GitHub y verifica que `develop` sea la predeterminada para trabajo diario.
2. En **Settings ▸ Branches**, agrega reglas de protección para `main` y `develop` (prohibir force push, requerir PR aprobado y passing checks).
3. Habilita la opción "Automatically delete head branches" para limpiar ramas feature al hacer merge.
4. Vincula issues o user stories a los PR utilizando el formato `feature/<hu>-<task>` para facilitar el seguimiento.
5. Configura acciones (si aplica) para ejecutar pruebas y linters en cada PR hacia `develop` o `main`.

## Branch Naming Guidelines

- `feature/<hu>-<task>` para trabajo funcional (ej. `feature/setup-task2`).
- `bugfix/<id>` para correcciones menores detectadas en QA.
- `release/<version>` para preparar entregas empaquetadas.
- `hotfix/<issue>` para parches urgentes que deben llegar a producción.

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

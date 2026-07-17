# Directives de Contribution (Contributing Guidelines)

Bienvenue sur le projet Athena de la société ABYSS. Pour assurer la qualité et la cohérence de notre dépôt, veuillez respecter les règles de contribution suivantes.

## Langue
- **Documentation destinée aux humains :** Doit être rédigée exclusivement en **français**.
- **Code, identifiants techniques et messages Git :** Doivent être rédigés en **anglais**.

## Gestion des branches
- La branche principale est `main`.
- Toute modification doit passer par une branche dédiée et être intégrée via une Pull Request (PR) validée.
- Les branches doivent être nommées de façon explicite (ex: `docs/initial-setup`, `feature/analytics-telemetry`).

## Directives Git & Commits
- Les commits doivent être atomiques et précis.
- Nous suivons le format **Conventional Commits** :
  - `feat(scope): ...` pour une nouvelle fonctionnalité.
  - `fix(scope): ...` pour la correction d'un bug.
  - `docs(scope): ...` pour des changements de documentation uniquement.
- Pas de secrets dans les commits.
- Pas de push forcé (`git push --force`) ni de modification de l'historique public.

## Processus de Pull Request
1. Créez votre branche à partir de `main`.
2. Appliquez vos modifications en respectant les standards de style définis dans `.editorconfig`.
3. Documentez vos modifications et mettez à jour les index documentaires si nécessaire.
4. Soumettez votre PR en remplissant le template disponible.
5. Attendez la relecture et l'approbation d'un des mainteneurs avant la fusion.

## Tests
- Tous les tests automatisés (qui seront mis en place lors de la phase d'architecture) doivent passer au vert avant la validation d'une PR.

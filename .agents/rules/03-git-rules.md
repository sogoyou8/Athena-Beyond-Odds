# 03 - Git Rules

- **Commits atomiques :** Effectuer des commits ciblés et de petite taille.
- **Conventional Commits :** Respecter le standard Conventional Commits pour la rédaction des messages de validation (ex: `docs(scope): message`, `feat(scope): message`, `fix(scope): message`).
- **Zéro secret :** Ne jamais indexer ou commiter de secrets (clés d'API, mots de passe, tokens, etc.).
- **Pas de push forcé :** Ne jamais exécuter de `git push --force`.
- **Pas de réécriture d'historique :** Ne jamais modifier l'historique public existant du dépôt Git.
- **Validation humaine avant push :** Demander une confirmation à l'utilisateur avant d'effectuer tout push sur le dépôt distant.
- **État propre :** Laisser le dépôt Git dans un état propre, sans fichiers intermédiaires inutiles non suivis.

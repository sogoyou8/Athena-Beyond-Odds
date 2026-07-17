# 04 - Security Rules

- **Gestion des clés :** Interdiction stricte d'introduire des clés privées, secrets ou identifiants dans le dépôt.
- **Moindre privilège :** Appliquer le principe du moindre privilège pour toutes les opérations système, d'intégration ou d'accès.
- **Validation des entrées :** Valider rigoureusement toutes les données reçues de l'extérieur pour prévenir les injections ou corruptions.
- **Dépendances vérifiées :** Ne pas installer de dépendances sans audit préalable de leur provenance et sécurité.
- **Journalisation prudente :** Ne journaliser aucune donnée sensible (mots de passe, tokens, informations personnelles des utilisateurs).

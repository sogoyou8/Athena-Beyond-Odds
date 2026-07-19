> **Statut :** Mis à jour
> **Version :** 1.2

# Decision Log

## DEC-001 — Arbitrage conditionnel sur les données sportives et le périmètre des compétitions MVP

- **Date :** 2026-07-17
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision conditionnelle
- **Contexte :** Les questions ouvertes OQ-003 (Fournisseurs de données) et OQ-006 (Compétitions du MVP) bloquaient le passage à la Phase 2 (Architecture technique).
- **Décision :**
  - Approbation de l'orientation pour OQ-003 et OQ-006 sous forme d'une option intermédiaire resserrée de 2 à 3 compétitions maximum.
  - Le passage à la Phase 2 est autorisé sous conditions.
- **Conditions de validation factuelle :**
  - Confirmer une source de données acceptable (couverture, qualité, continuité, coût soutenable).
  - Confirmer la liste exacte des compétitions sélectionnées.
  - Vérifier les droits d'usage et d'affichage des données.
- **Conséquences :**
  - La préparation de la Phase 2 (Architecture technique) peut démarrer.
  - Aucun développement dépendant d'une source ou d'une compétition précise ne doit être considéré comme définitivement validé avant confirmation.
  - Le périmètre pilote pourra être réduit ou adapté si les conditions ci-dessus ne sont pas satisfaites.

## DEC-002 — Passage conditionnel en Phase 2 et arbitrage du fournisseur de données de prototype

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision validée (Sous conditions de prototype)
- **Contexte :** À la suite de la découverte des accès réels (Phase 1.20), il est établi que le plan d'essai Sportmonks ne couvre pas la Ligue 1, la Premier League ni l'UEFA Champions League. football-data.org donne accès à ces compétitions mais les saisons retournées ne démontrent pas encore de saison commune. Le test complet des 18 rencontres est donc suspendu.
- **Décision :**
  - **Option A + B + C autorisée :** Poursuite du développement du prototype de Phase 2 avec *football-data.org* de manière provisoire.
  - Engagement de démarches parallèles auprès de *Sportmonks* pour demander un accès d'évaluation temporaire et un devis écrit.
  - Autorisation d'évaluer un troisième fournisseur uniquement si Sportmonks refuse l'accès d'évaluation.
  - **OQ-003 (Source de données) :** football-data.org validée provisoirement pour le prototype.
  - **OQ-006 (Compétitions MVP) :** Périmètre validé (Ligue 1, Premier League, UEFA Champions League).
- **Conditions, garde-fous et budget :**
  - **Budget et dépenses :**
    - Budget maximal autorisé : 0 €
    - Dépense immédiate autorisée : aucune
    - Actions autorisées : demandes de devis et d’accès d’évaluation uniquement
    - Souscription payante : non autorisée
    - Engagement financier : non autorisé
  - **Garde-fous d'intégration :**
    - L'intégration de *football-data.org* doit être traitée comme un prototype temporaire, et non comme un choix définitif.
    - L'architecture de la Phase 2 doit implémenter une couche de normalisation et d'abstraction des données indépendante du fournisseur afin de préserver la possibilité de remplacer le fournisseur.
    - API utilisées en lecture seule.
    - Maximum trois compétitions (Ligue 1, Premier League, UEFA Champions League).
    - Aucune redistribution de données brutes.
    - Aucune publication commerciale avant validation écrite des droits.
    - Aucune conservation longue durée des données avant validation juridique.
    - Aucune clé d'API ni donnée sensible journalisée.
    - Suivi des quotas autorisé sans journalisation des secrets.
    - Aucune dépendance irréversible au schéma de données du fournisseur.
    - Aucun abonnement ni verrouillage contractuel sans nouvelle décision du Fondateur.
    - La Pull Request de Phase 1 doit être maintenue en mode brouillon (draft) tant que l'évaluation comparative finale n'est pas arbitrée.
- **Conséquences :**
  - Démarrage effectif de la Phase 2 sous réserve du respect strict de la couche d'abstraction de données et des garde-fous ci-dessus.
  - Préparation des courriels d'évaluation et demandes commerciales auprès de Sportmonks.

> **Statut :** Mis à jour
> **Version :** 1.4

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
  - Préparation des courriels d’évaluation et demandes commerciales auprès de Sportmonks.

## DEC-003 — Approbation de l’architecture technique de Phase 2

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision validée
- **Contexte :** À l’issue de la Phase 2.1 (définition de l’architecture), de la Phase 2.2 (ADR initiaux) et de la Phase 2.3 (dossier de validation), l’architecture du prototype Athena a été soumise à l’approbation formelle du Fondateur.
- **Décision :**
  - **Architecture globale approuvée** pour la conception détaillée.
  - **ADR-001 (Monolithe modulaire) :** Accepté.
  - **ADR-002 (Abstraction des fournisseurs) :** Accepté.
  - **ADR-003 (Modèle de domaine normalisé) :** Accepté.
  - Actions autorisées : définition de la structure initiale, préparation des contrats de domaine, conception de l’adaptateur football-data.org, rédaction de nouveaux ADR technologiques.
  - **Écriture de code applicatif non encore autorisée.**
  - Décisions technologiques clés différées (langage, framework, base de données, cache, hébergement, authentification, moteur de probabilités, XAI) : étude dans de nouveaux ADR autorisée.
- **Contraintes maintenus :**
  - Budget maximal : 0 €, aucune dépense immédiate.
  - football-data.org reste provisoire ; Sportmonks reste non implémenté ; aucun fournisseur définitif sélectionné.
  - Maximum trois compétitions, lecture seule, aucune redistribution ni conservation longue durée des données.
  - Pull Request de Phase 1 maintenue en brouillon.
- **Justification :**
  - Choix d’architecture pragmatiques respectant le budget nul et le découpage modulaire, garantissant l’indépendance vis-à-vis du fournisseur de données.
- **Corrections demandées :** Aucune.

## DEC-004 — Approbation des choix technologiques de la Phase 2.4

- **Date :** 2026-07-18
- **Responsable :** Fondateur ABYSS
- **Statut :** Décision validée
- **Contexte :** Suite à la validation de l'architecture globale (DEC-003) et à la présentation des ADR-004 à ADR-007, le Fondateur a arbitré les quatre choix technologiques initiaux du prototype Athena.
- **Décisions :**
  - **ADR-004 — Langage :** TypeScript / Node.js retenu.
  - **ADR-005 — Framework :** Express avec structure modulaire explicite retenu (conditionnel à ADR-004 TypeScript).
  - **ADR-006 — Persistance :** SQLite locale, minimale et désactivable retenu. Option D (aucune persistance) reste utilisable si le cache seul suffit.
  - **ADR-007 — Cache :** Cache mémoire local dans le processus retenu. Migration vers Redis Upstash évaluable via un nouvel ADR si nécessaire.
- **Autorisations accordées :**
  - Préparation de la structure détaillée du projet.
  - Préparation des contrats de domaine.
  - Conception détaillée de l'adaptateur football-data.org.
  - **Écriture de code applicatif non encore autorisée** — conditionnée à la finalisation des contrats de domaine.
- **Contraintes maintenues :**
  - Budget maximal : 0 €, aucune dépense immédiate.
  - football-data.org reste provisoire ; Sportmonks reste non implémenté.
  - Maximum trois compétitions, lecture seule, aucune redistribution ni conservation longue durée des données.
  - SQLite doit pouvoir être désactivée ou supprimée ; aucune donnée brute fournisseur ne doit être persistée.
  - Le cache doit avoir une durée de vie courte et être désactivable ; aucune donnée brute fournisseur ne doit être mémorisée.
  - Aucun service cloud n'est obligatoire pour démarrer.
  - Pull Request de Phase 1 maintenue en brouillon.
- **Justification :**
  - Choix simples, gratuits et réversibles, cohérents avec le monolithe modulaire (ADR-001), l'architecture par ports et adaptateurs (ADR-002) et la contrainte de budget nul.
- **Corrections demandées :** Aucune.

## DEC-005 — Approbation du cadrage fonctionnel de la Phase 2.7

- **Date :** 2026-07-29
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Contexte :**
  - La Phase 2.6 a livré et fusionné le squelette technique approuvé.
  - La Phase 2.7 prépare la première tranche fonctionnelle observable.
  - Cette tranche doit rester locale, fictive, déterministe et en lecture seule.
  - Aucun fournisseur réel, appel réseau ou stockage réel ne doit être activé.
  - Huit décisions fondatrices ont été explicitement approuvées avant toute implémentation.
- **Décision :**
  1. La seule compétition disponible est `FL1`, avec des équipes, matchs, identifiants et métadonnées entièrement fictifs.
  2. Le fournisseur factice retourne exactement trois matchs.
  3. La réponse nominale utilise l’enveloppe `{ "competitionCode": "FL1", "matches": [] }`.
  4. Toute autre compétition retourne HTTP `404` avec `{ "error": "COMPETITION_NOT_AVAILABLE" }`.
  5. Le fournisseur factice est prévu sous `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts`.
  6. Le fournisseur est câblé directement et inconditionnellement dans la composition de l’application, sans variable d’environnement, factory, registre ou sélection dynamique.
  7. Le cas d’usage porte le nom exact `ListScheduledMatchesUseCase` et est prévu sous `src/application/use-cases/list-scheduled-matches.ts`.
  8. Les dates fixes sont `2099-08-14T18:00:00.000Z`, `2099-08-15T20:00:00.000Z` et `2099-08-16T19:30:00.000Z`.
- **Conséquences :**
  - Le cadrage fonctionnel de la Phase 2.7 est figé.
  - Le budget reste limité à `0 €`.
  - La tranche reste en lecture seule et limitée à `FL1`.
  - Aucun appel réseau n’est autorisé.
  - Aucune persistance réelle n’est autorisée.
  - Aucune dépendance npm supplémentaire n’est autorisée.
  - `InMemoryCache` reste inchangé et inactif pour cette tranche.
  - `SqlitePersistence` reste inchangé, logique et inutilisé.
  - football-data.org reste provisoire et non activé.
  - Sportmonks reste non implémenté.
  - Aucun fournisseur réel ou définitif n’est sélectionné.
  - Cette décision documentaire n’autorise pas encore l’implémentation.
  - Une autorisation séparée est requise avant toute création de branche d’implémentation ou écriture de code.
  - Toute déviation par rapport aux huit décisions nécessite une nouvelle décision.
- **Référence :** [Pack de validation Phase 2.7](../03-technical-architecture/phase-2-7-functional-slice-validation-pack.md)


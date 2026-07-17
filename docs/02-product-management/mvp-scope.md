# MVP Scope

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition

---

## 1. Objet

Ce document définit de manière formelle et exhaustive le périmètre officiel du produit minimum viable (MVP) d'Athena: Beyond Odds.

Il traduit les orientations de la [priorisation](prioritization.md) et du [Product Requirements Document](product-requirements-document.md) en spécifications de portée concrètes, traçables et exploitables pour les phases suivantes de design et d'architecture.

Ce document exclut toute décision technique d'architecture ou de framework applicatif, conformément aux contraintes de la Phase 1.

---

## 2. Définition du MVP

Le MVP d'Athena représente la plus petite configuration fonctionnelle stable et sécurisée pouvant être mise à disposition d'utilisateurs pilotes externes afin de valider la proposition de valeur centrale.

Conformément à la règle de priorisation, le MVP d'Athena est délimité à :
- Un périmètre sportif unique : le football ;
- Une couverture géographique et de compétitions initialement restreinte ;
- L'utilisation de flux de données programmés (scheduled/finished) ;
- L'accès à une interface responsive (desktop, tablette et mobile web).

---

## 3. Objectif du MVP

L'objectif principal du MVP d'Athena est de répondre positivement au critère de succès fonctionnel majeur défini dans le PRD [§27](product-requirements-document.md#27-mesure-du-succès) :

> **North Star Metric :** Valider qu'au moins 70 % des utilisateurs pilotes déclarent que le produit les aide réellement à mieux comprendre la dynamique et les probabilités d'un match de football.

Les objectifs secondaires sont :
- Mesurer l'engagement initial et le taux de rétention à 7 jours (J7) ;
- Valider le tunnel d'authentification et de conversion Premium de base ;
- Stabiliser l'intégration des flux de données et la calibration des probabilités.

---

## 4. Hypothèse principale à valider

La viabilité à long terme d'Athena repose sur la validation de l'hypothèse centrale suivante pendant la phase pilote :

> **Hypothèse centrale (H-001) :** Les utilisateurs d'analyses sportives (visiteurs, Free et Premium) valorisent et font confiance à une présentation transparente, explicable et probabiliste de la donnée sportive, par rapport à de simples agrégats de statistiques brutes ou des prédictions opaques.

Cette hypothèse est testée via l'affichage des facteurs explicatifs hiérarchisés et de l'indicateur de fraîcheur des sources.

---

## 5. Personas cibles du MVP

Le MVP s'adresse prioritairement aux personas suivants décrits dans le document des [personas](user-personas.md) :

| Persona | Rôle au MVP | Intérêt principal dans le MVP |
|:---|:---|:---|
| **PER-001 — Thomas "L'Analyste Méthodique"** | Principal | Recherche de transparence, comparaison de probabilités, calibration et accès aux sources. |
| **PER-002 — Alexandre "Le Passionné Occasionnel"** | Principal | Dashboard personnalisé, résumé généré par Explainable AI et alertes de match de base. |
| **PER-003 — Julien "Le Chasseur de Value"** | Principal | Accès au Match Center et aux probabilités normalisées par rapport au marché. |
| **PER-004 — Pierre "Le Trader Professionnel"** | Secondaire | Vérification de la fraîcheur des données et de l'intégrité de l'historique probabiliste. |
| **PER-005 — Sarah "La Directrice des Médias"** | Secondaire | Rapidité d'accès au Match Center et export minimal des résumés. |
| **PER-006 — Marc "Le Développeur API"** | Hors MVP | N'utilise pas l'API publique (exclue du MVP) ; utilise l'interface web classique. |

---

## 6. Parcours critiques

Le MVP prend en charge l'exécution complète et sans erreur des parcours utilisateurs critiques décrits dans [User Journeys](../08-product-blueprint/09-user-journeys.md) :

1. **Première utilisation :** De l'accès visiteur à la création de compte, l'onboarding (langue, fuseau, préférences) et l'accès au premier Dashboard.
   - *Liaison MVP :* `FEAT-001` (Inscription), `FEAT-002` (Connexion), `FEAT-003` (Profil/Préférences), `FEAT-004` (Onboarding), `FEAT-005` (Dashboard).
2. **Consultation récurrente :** Recherche ou sélection d'un match de football, consultation des probabilités de match, lecture du résumé Explainable AI, examen des facteurs et ajout éventuel aux favoris.
   - *Liaison MVP :* `FEAT-006` (Matchs du jour), `FEAT-007` (Recherche), `FEAT-008` (Match Center), `FEAT-009` (Forme/Stats), `FEAT-010` (Probabilités), `FEAT-011` (Résumé IA), `FEAT-012` (Facteurs explicatifs), `FEAT-013` (Sources/Fraîcheur), `FEAT-014` (Favoris), `FEAT-015` (Notifications).
3. **Conversion Premium :** Rencontre d'une limite d'usage Free atteinte, présentation de la valeur ajoutée, parcours d'abonnement avec validation de l'éligibilité et activation des droits d'accès.
   - *Liaison MVP :* `FEAT-016` (Abonnement Premium).
4. **Qualité et incident :** Depuis une donnée clé du Match Center, un utilisateur connecté enregistre un signalement contenant le contexte nécessaire ; ce signalement est ensuite consultable dans l'administration minimale. En cas de données incomplètes, application de la gestion de données manquantes ou redirection vers une page d'erreur résiliente.
   - *Liaison MVP :* `FEAT-017` (Signalement), `FEAT-018` (Administration), `FEAT-019` (Données manquantes), `FEAT-020` (Résilience).

---

## 7. Principes de cadrage

Pour éviter toute dérive de périmètre, le cadrage du MVP applique les principes stricts suivants :

- **Principe de modularité :** Chaque module doit pouvoir être développé indépendamment avec des interfaces fonctionnelles claires.
- **Principe de factualité :** Les fonctions du Match Center affichent des faits et des probabilités calculés, excluant tout avis subjectif ou narration spéculative.
- **Principe d'accès serveur :** La vérification des droits Premium se fait systématiquement côté serveur.
- **Principe de non-casino :** L'interface n'utilise aucun design manipulateur ou incitation aux paris.

---

## 8. Critères d'inclusion

Une fonctionnalité est incluse dans le périmètre du MVP si elle répond à au moins l'un des critères suivants :

- Elle supporte directement l'un des parcours critiques de base (voir §6).
- Elle répond à une obligation légale de sécurité ou de conformité (sécurité des mots de passe, RGPD, journal d'audit).
- Elle est une dépendance fonctionnelle bloquante d'une fonctionnalité MVP (ex. Profil pour l'Onboarding).
- Elle assure la résilience minimale du produit en cas de données sportives manquantes ou d'indisponibilité.

---

## 9. Critères d'exclusion

Une fonctionnalité est exclue du MVP si elle présente l'une des caractéristiques suivantes :

- Elle nécessite l'ingestion de flux de données sportives en temps réel instantané (live center étendu).
- Elle s'applique à un autre sport que le football.
- Elle implique une programmation ou des interfaces automatisées externes (API publique, exports programmés).
- Elle intègre des parcours d'exécution de transactions financières externes aux abonnements (ex. paris, gestion de bankroll).
- Elle nécessite une application mobile native (l'accès mobile web responsive est suffisant).

---

## 10. Périmètre fonctionnel inclus

Le MVP intègre **20 fonctionnalités fonctionnelles actives** (`FEAT-001` à `FEAT-020`) détaillées dans le [catalogue des fonctionnalités](features.md).

Ces fonctionnalités couvrent l'intégralité des 22 exigences fonctionnelles (`FR-001` à `FR-022`) du PRD.

---

## 11. Compte et accès

Le domaine gère le cycle de vie des accès utilisateurs connectés et visiteurs.

- **Inclus :**
  - Inscription avec validation d'adresse email (`FEAT-001`) ;
  - Authentification sécurisée avec mot de passe haché (`FEAT-002`, priorité P1 actuelle / P0 recommandée) ;
  - Attribution automatique des permissions selon le rôle (Visiteur, Free, Premium, Administrateur).
- **Exclu du MVP :**
  - Double authentification (MFA) pour les utilisateurs finaux connectés (voir OQ-005).

---

## 12. Onboarding

L'onboarding accompagne l'utilisateur lors de sa première session après inscription.

- **Inclus :**
  - Parcours d'onboarding en 5 étapes fonctionnelles : configuration de la langue, du fuseau horaire de match, de l'expertise (débutant/expert), des favoris (équipes, compétitions) et types d'alertes autorisées (`FEAT-004`).
  - Persistance des choix sur le profil serveur.

---

## 13. Dashboard et découverte

Le Dashboard constitue la page d'accueil de l'utilisateur connecté.

- **Inclus :**
  - Affichage contextuel des matchs du jour pour les compétitions sélectionnées (`FEAT-006`) ;
  - Accès direct aux équipes et compétitions marquées en favori ;
  - Section "Analyses récentes" listant les derniers Match Centers visités par l'utilisateur connecté (`FEAT-005`).

---

## 14. Recherche et Match Center

La navigation et la consultation des fiches d'analyse constituent le cœur d'Athena.

- **Inclus :**
  - Recherche textuelle globale avec auto-complétion à partir de 3 caractères (`FEAT-007`) ;
  - Fiche d'information Match Center complète pour chaque match sélectionné (`FEAT-008`).

---

## 15. Statistiques et forme

La fiche d'analyse Match Center intègre des indicateurs objectifs de dynamique sportive.

- **Inclus :**
  - Classement actuel et historique des 5 derniers matchs pour chaque équipe (`FEAT-009`) ;
  - Statistiques principales consolidées (buts marqués/encaissés à domicile/extérieur, possession moyenne, tirs, cartons).

---

## 16. Probabilités et confiance

L'affichage des estimations probabilistes est normalisé et explicable.

- **Inclus :**
  - Probabilités 1N2 (Victoire domicile, Nul, Victoire extérieur) issues du consensus de modèles probabilistes (`FEAT-010`) ;
  - Affichage associé d'un score de confiance synthétique calculé à partir de la couverture et stabilité des données ;
  - Historique immuable et versionné des probabilités pour chaque fiche match.

---

## 17. Explainable AI

L'intelligence artificielle explicative contextualise et synthétise les données calculées.

- **Inclus :**
  - Résumé d'analyse textuel expliquant la répartition des probabilités (`FEAT-011`) ;
  - Liste hiérarchisée des facteurs favorables et défavorables majeurs soutenant le calcul (`FEAT-012`).
- **Exclu du MVP :**
  - Recommandation personnalisée d'analyses en fonction des habitudes de l'utilisateur.

---

## 18. Sources et fraîcheur

La transparence vis-à-vis des données d'entrée est obligatoire pour établir la confiance.

- **Inclus :**
  - Affichage de l'indicateur de fraîcheur de la donnée (date et heure de la dernière mise à jour) ;
  - Liste explicite des sources de données d'entrée exploitées pour la fiche match (`FEAT-013`).

---

## 19. Favoris et notifications

L'utilisateur connecté interagit avec les entités sportives de son périmètre.

- **Inclus :**
  - Marquage d'équipes, de compétitions et de matchs spécifiques en favori (`FEAT-014`) ;
  - Notifications d'alertes de match par email de base : rappel avant-match (24h/1h), début de match et fin de match (`FEAT-015`).
- **Exclu du MVP :**
  - Alertes avancées personnalisées sur événements de jeu complexes (ex. alertes de cote ou de but précis).
  - Canaux de notification SMS et push mobile natif.

---

## 20. Free et Premium

L'accès fonctionnel est différencié selon le rôle utilisateur.

- **Inclus :**
  - Application des limitations de quota sur le compte Free (ex. historique probabiliste réduit, volume d'analyses limité par jour) ;
  - Tunnel d'abonnement Premium de base avec validation de paiement et déverrouillage immédiat des droits côté serveur (`FEAT-016`).

---

## 21. Qualité, signalement et administration

L'administration minimale garantit la viabilité opérationnelle d'Athena.

- **Inclus :**
  - Capacité pour un utilisateur connecté de signaler contextuellement une anomalie sur les données du Match Center (`FEAT-017`, P2) ;
  - Interface d'administration pour la gestion des comptes, le suivi des anomalies de données signalées, et l'observabilité opérationnelle (`FEAT-018`).

---

## 22. Résilience produit

Le système gère gracieusement les états limites de données et de connexion.

- **Inclus :**
  - Gestion stricte des données manquantes : affichage explicite d'un indicateur de non-disponibilité (`null` ou `unknown`), sans jamais remplacer par zéro (`FEAT-019`) ;
  - Affichage de pages d'erreur explicatives (404, 503) et gestion de la perte de connexion sans plantage de l'interface (`FEAT-020`).

---

## 23. Fonctionnalités explicitement exclues

Les fonctionnalités et modules suivants sont formellement exclus du MVP et de sa phase de tests pilotes :

- **Multi-sports :** Support d'autres sports que le football (`FEAT-021`).
- **Données en temps réel (Live Center temps réel) :** Suivi live instantané avec timeline et évolution dynamique minute-par-minute en cours de match (`FEAT-024`).
- **API publique & programmabilité :** API d'intégration ou exports de données automatisés pour des usages externes ou professionnels (`FEAT-025`).
- **Recommandations personnalisées :** Moteur proposant des suggestions personnalisées d'analyses (`FEAT-026`).
- **Vidéo & Tactique :** Intégration de flux vidéo, résumés de match vidéo ou analyses tactiques graphiques.
- **Transactions de paris :** Tunnel de placement de paris chez un bookmaker externe ou outils de gestion de bankroll et trading de cotes.

---

## 24. Fonctionnalités reportées

Les fonctionnalités suivantes du catalogue sont reportées sur les versions ultérieures de la roadmap :

- **Pour la V1 (Roadmap Moyen Terme) :**
  - Outil de simulation interactive de match (What-If) permettant de modifier virtuellement une composition d'équipe (`FEAT-022`) ;
  - Comparateur de cotes de marché avec indicateurs de valeur relative (`FEAT-023`) ;
  - Module Live Center temps réel de base.
- **Pour la V2 (Roadmap Long Terme) :**
  - API publique d'export (`FEAT-025`) ;
  - Moteur de recommandation personnalisé d'analyses (`FEAT-026`).

---

## 25. Matrice de périmètre

La matrice suivante consolide l'état de chaque fonctionnalité du catalogue officiel vis-à-vis du MVP. Elle associe chaque fonctionnalité à une exigence fonctionnelle (FR), un récit utilisateur (US), un persona cible principal et une condition minimale d'acceptation.

Elle maintient la traçabilité complète vis-à-vis de l'ensemble des personas associés validés dans le catalogue.

| ID | Nom | Priorité | Statut MVP | FR | US | Persona principal | Personas associés | Justification | Condition |
|:---|:---|:---:|:---:|:---:|:---:|:---|:---|:---|:---|
| `FEAT-001` | Inscription | P1 | Inclus | FR-001 | US-001 | PER-001 | PER-001 | Bloc requis pour le profil et l'onboarding. | Inscription avec validation de l'adresse email. |
| `FEAT-002` | Connexion et auth | P1 | Inclus | FR-013 | US-002 | PER-001 | PER-002 | Sécurité d'accès et distinction Free/Premium. | Connexion sécurisée avec mot de passe haché. |
| `FEAT-003` | Profil et préférences | P1 | Inclus | FR-017 | US-003 | PER-002 | PER-002 | Support des préférences de base (langue, alertes). | Enregistrement persistant des choix. |
| `FEAT-004` | Onboarding | P1 | Inclus | FR-002 | US-004 | PER-001 | PER-001 | Configuration simplifiée lors de la première session. | Parcours d'onboarding en 5 étapes fonctionnelles. |
| `FEAT-005` | Dashboard | P1 | Inclus | FR-003 | US-005 | PER-002 | PER-001, PER-002 | Point d'entrée centralisant les favoris et l'activité. | Affichage unifié des favoris et des analyses récentes. |
| `FEAT-006` | Matchs du jour | P1 | Inclus | FR-004 | US-006 | PER-001 | PER-001 | Découverte rapide des rencontres du jour. | Liste filtrable par compétition configurée. |
| `FEAT-007` | Recherche | P1 | Inclus | FR-009 | US-007 | PER-002 | PER-002 | Navigation principale et accès aux fiches de match. | Autocomplete fonctionnel à partir de 3 caractères. |
| `FEAT-008` | Match Center | P1 | Inclus | FR-005 | US-008 | PER-001 | PER-001 | Conteneur des données de la North Star. | Page de match accessible avec layout responsive. |
| `FEAT-009` | Statistiques et forme | P1 | Inclus | FR-006 | US-009 | PER-001 | PER-001, PER-002 | Contexte sportif factuel d'aide à la décision. | Affichage historique des 5 derniers matchs. |
| `FEAT-010` | Probabilités | P1 | Inclus | FR-007 | US-010 | PER-004 | PER-004, PER-005 | Cœur de valeur analytique d'Athena. | Probabilités 1N2 avec score de confiance. |
| `FEAT-011` | Résumé IA | P1 | Inclus | FR-010 | US-011 | PER-002 | PER-001, PER-003 | Synthèse textuelle d'explicabilité obligatoire. | Résumé rédigé sans hallucination factuelle. |
| `FEAT-012` | Facteurs explicatifs | P1 | Inclus | FR-019 | US-012 | PER-001 | PER-005 | Justifie la calibration des probabilités 1N2. | Facteurs clés favorables et défavorables. |
| `FEAT-013` | Sources et fraîcheur | P1 | Inclus | FR-011 | US-013 | PER-004 | PER-002, PER-004 | Transparence obligatoire des sources. | Horodatage de fraîcheur et liste des sources. |
| `FEAT-014` | Favoris | P1 | Inclus | FR-008 | US-014 | PER-003 | PER-001 | Supporte la personnalisation et les alertes. | Bouton de favori avec persistance. |
| `FEAT-015` | Notifications | P1 | Inclus | FR-012 | US-015 | PER-005 | PER-001 | Alertes minimales pour le rappel de match. | Envoi de notifications autorisées par l'utilisateur. |
| `FEAT-016` | Abonnement Premium | P1 | Inclus | FR-018, FR-021 | US-016 | PER-002 | PER-001 | Validation de la viabilité et de la monétisation. | Paiement sécurisé avec gestion des droits d'accès. |
| `FEAT-017` | Signalement | P2 | Inclus | FR-016 | US-017 | PER-002 | PER-002 | Retours utilisateurs pour le contrôle qualité. | Enregistrement de signalement contextualisé. |
| `FEAT-018` | Administration | P1 | Inclus | FR-022 | US-018 | PER-006 | PER-006 | Permet le suivi d'exploitation de la beta. | Logs d'audit et interface de gestion des anomalies. |
| `FEAT-019` | Données manquantes | P1 | Inclus | FR-014 | US-019 | PER-002 | PER-002 | Garantit l'intégrité de l'affichage en cas de manque. | Affichage explicite de "Non disponible". |
| `FEAT-020` | Résilience | P1 | Inclus | FR-015, FR-020 | US-020 | PER-006 | PER-006 | Stabilité globale de la plateforme pilote. | Redirection sur page 404/503 lors des incidents. |
| `FEAT-021` | Multi-sports | P4 | Exclu | - | - | PER-006 | PER-006 | Limité strictement au football au MVP. | Aucun support autre sport développé. |
| `FEAT-022` | Simulation What-If | P2 | Reporté | - | - | PER-002 | PER-002 | Simulations interactives hors MVP initial. | Reporté en V1. |
| `FEAT-023` | Comparateur de cotes | P2 | Reporté | - | - | PER-003 | PER-003 | Dépend de flux de cotes externes non prioritaires. | Reporté en V1. |
| `FEAT-024` | Live Center | P2 | Reporté | - | - | PER-005 | PER-005 | Flux temps réel instantanés exclus du MVP. | Reporté en V1. |
| `FEAT-025` | API publique d'export | P3 | Reporté | - | - | PER-006 | PER-006 | Usage professionnel planifié en version finale. | Reporté en V2. |
| `FEAT-026` | Recommandations | P3 | Reporté | - | - | PER-002 | PER-002 | Complexité algorithmique non requise pour la beta. | Reporté en V2. |

---

## 26. Dépendances fonctionnelles critiques

Les dépendances fonctionnelles suivantes doivent être résolues pour permettre l'exécution sans interruption du périmètre MVP :

1. **Disponibilité de données sportives complètes et fraîches :** Requis pour afficher les fiches match (`FEAT-008`), les classements (`FEAT-009`) et les sources (`FEAT-013`). (Voir OQ-003, OQ-006).
2. **Capacité à traiter et à gérer le cycle de vie des abonnements :** Requis pour le traitement des paiements et la validation de l'éligibilité et l'activation des droits d'accès (`FEAT-016`). (Voir OQ-002).
3. **Disponibilité de résultats probabilistes fiables :** Requis pour le calcul du consensus 1N2 (`FEAT-010`) et la génération du résumé d'explicabilité (`FEAT-011`).
4. **Capacité à transmettre les communications indispensables au parcours de compte :** Requis pour la validation des adresses email à l'inscription (`FEAT-001`).
5. **Capacité à transmettre les notifications autorisées par l'utilisateur :** Requis pour l'envoi des messages d'alerte de match (`FEAT-015`).

---

## 27. Conditions de lancement

Le lancement de la phase pilote MVP est conditionné par la validation préalable des éléments suivants :

| Catégorie | Condition fonctionnelle | Preuve attendue | Statut ou seuil | Question |
|:---|:---|:---|:---:|:---:|
| Parcours produit | Les quatre parcours critiques sont utilisables de bout en bout sans blocage majeur | Résultat des scénarios de validation des parcours | Tous les scénarios critiques réussis | — |
| Données | Les données nécessaires aux rencontres du périmètre MVP sont suffisamment complètes et fraîches | Rapport de contrôle de disponibilité, complétude et fraîcheur | Seuil à valider | OQ-003, OQ-006 |
| Analyse | Les probabilités, niveaux de confiance, résumés et facteurs explicatifs sont disponibles et compréhensibles | Validation fonctionnelle et UX sur les rencontres pilotes | Seuil à valider | — |
| Résilience | Les données manquantes, indisponibilités et états incohérents produisent un état compréhensible et non bloquant | Tests des scénarios dégradés | Tous les scénarios critiques couverts | — |
| Accès | La création de compte, la connexion, la récupération d’accès et la gestion des droits fonctionnent conformément aux exigences | Tests des parcours d’accès | Aucun blocage critique ouvert | OQ-005 |
| Free et Premium | Les limites Free, l’accès Premium, l’abonnement, l’activation des droits et la résiliation sont utilisables | Tests du cycle de vie de l’abonnement | Quotas et tarifs à valider | OQ-001, OQ-002 |
| Qualité | Un utilisateur peut enregistrer un signalement contextualisé et l’administration minimale peut le consulter | Validation de FEAT-017 et FEAT-018 | Parcours fonctionnel de bout en bout | — |
| Sécurité et confidentialité | Les accès, données personnelles, consentements et fonctions administratives respectent les exigences du PRD | Rapport de validation sécurité et conformité | Aucune non-conformité critique ouverte | OQ-004, OQ-005 |
| Mesure | Les métriques nécessaires à l’évaluation du MVP peuvent être observées | Validation du plan de mesure | Seuil à valider | — |
| Gouvernance | Les questions bloquantes sont résolues ou formellement acceptées comme risques | Registre des questions et décisions à jour | Aucune question bloquante sans décision | OQ-001 à OQ-006 |

Aucune condition n'impose de fournisseur, d'infrastructure cloud, de framework applicatif, de base de données, d'architecture, de protocole ou de mécanisme technique.

---

## 28. Critères de sortie du MVP

Les critères de sortie du MVP sont classés par catégorie fonctionnelle et produit :

### Fonctionnels
- Le Match Center (`FEAT-008`) est stable et affiche l'ensemble des données d'un match (scheduled/finished). (Réf : [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)).
- L'utilisateur peut ajouter et supprimer des favoris avec persistance. (Réf : [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)).

### Qualité
- Les résumés d'analyse IA et les facteurs clés n'affichent aucune incohérence par rapport aux données chiffrées du Match Center. (Réf : [Product Principles §5](../08-product-blueprint/02-product-principles.md)).
- Bouton de signalement d'anomalies de données fonctionnel. (Réf : [User Journeys §8](../08-product-blueprint/09-user-journeys.md)).

### Sécurité et conformité
- Absence de vulnérabilité critique ouverte. (Réf : [User Roles §9](../08-product-blueprint/08-user-roles.md)).
- Consentements utilisateur enregistrés de manière traçable lors de l'onboarding. (Réf : [Product Principles §14](../08-product-blueprint/02-product-principles.md)).

### Données
- Ingestion et traitement stables des données sportives sur le périmètre défini. (Réf : [MVP Scope §5](../08-product-blueprint/30-mvp-scope.md)).
- Gestion des données manquantes active et vérifiée (`FEAT-019`). (Réf : [Business Rules §2](../08-product-blueprint/14-business-rules.md)).

### UX
- **Performance :** L'affichage initial d'un Match Center s'effectue en moins de 2,5 secondes (Largest Contentful Paint < 2,5 s). (Réf : [PRD §24 NFR-001](product-requirements-document.md#nfr-001--performance)).
- Expérience responsive vérifiée sur desktop, tablette et mobile. (Réf : [Product Principles §12](../08-product-blueprint/02-product-principles.md)).

### Opérationnels
- Tableau de bord d'administration opérationnel permettant le traitement des signalements d'anomalies. (Réf : [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)).

### Business
- **Compréhension validée :** Au moins 70 % des utilisateurs pilotes connectés interrogés via les formulaires de signalement ou d'évaluation déclarent que les probabilités et explications fournies ont amélioré leur compréhension de la dynamique du match. (Réf : [PRD §27](product-requirements-document.md#27-mesure-du-succès) · [Success Metrics §7](../08-product-blueprint/04-success-metrics.md)).
- **Monétisation :** Tunnel d'abonnement Premium fonctionnel et éligibilité vérifiée. (Réf : [MVP Scope §5](../08-product-blueprint/30-mvp-scope.md)).
- **Fidélisation :** Mesure d'activation et de rétention J7 opérationnelle. (Réf : [Success Metrics §4](../08-product-blueprint/04-success-metrics.md)).

---

## 29. Risques et mesures de réduction

Les risques opérationnels liés au périmètre du MVP et leurs actions d'atténuation sont les suivants :

| Risque identifié | Impact | Probabilité | Mesure de réduction fonctionnelle |
|:---|:---:|:---:|:---|
| **Données sportives incomplètes** | Élevé | Élevée | Activation automatique de la gestion des données manquantes (`FEAT-019`) : affichage d'un indicateur neutre sans distorsion de l'analyse. |
| **Erreurs de modèles ou de calcul** | Élevé | Moyenne | Affichage clair du score de confiance et bouton de signalement d'anomalie de données (`FEAT-017`) accessible en un clic. |
| **Abandons lors de l'onboarding** | Moyen | Moyenne | Limitation de l'onboarding initial à 5 étapes rapides, avec possibilité de passer l'étape et de la finaliser plus tard depuis le profil. |
| **Spam de notifications** | Moyen | Faible | Application stricte des heures de silence (quiet hours) configurables et déduplication automatique des alertes de début/fin de match. |

---

## 30. Hypothèses

Les hypothèses opérationnelles suivantes ont été retenues pour le cadrage du MVP :

- **Hypothèse H-002 :** L'accès mobile web responsive est suffisant pour valider les habitudes d'usage en mobilité avant de lancer le développement d'une application native.
- **Hypothèse H-003 :** La couverture initiale de compétitions (voir OQ-006) est représentative pour valider les modèles probabilistes auprès des différents personas.
- **Hypothèse H-004 :** Le traitement asynchrone des anomalies signalées par les utilisateurs suffit pour la phase beta, n'exigeant pas un outil de support client en temps réel.

---

## 31. Questions ouvertes

Les questions ouvertes impactant le périmètre du MVP sont répertoriées dans [`docs/06-operations/open-questions.md`](../06-operations/open-questions.md) :

- **OQ-001 :** Quotas exacts du compte Free (impacte `FEAT-016` et la pertinence de l'offre Premium).
- **OQ-002 :** Structure tarifaire Premium (détermine la complexité du module de paiement `FEAT-016`).
- **OQ-003 :** Identification des sources de données d'entrée (détermine la couverture de `FEAT-008` et `FEAT-013`).
- **OQ-004 :** Langue(s) initiale(s) de l'interface (détermine la portée de la traduction dans l'onboarding `FEAT-004`).
- **OQ-005 :** MFA pour les utilisateurs finaux (exclu du MVP, validé comme exigence future).
- **OQ-006 :** Compétitions de football couvertes initialement (définit la portée de l'ingestion `FEAT-006`).

---

## 32. Décisions à valider

Les décisions suivantes sont soumises à l'arbitrage du Fondateur ABYSS avant la fin de la phase de définition :

1. **Validation du quota Free d'analyses de match :** La limite quotidienne de consultation autorisée pour un utilisateur connecté Free (OQ-001).
2. **Périmètre exact des compétitions pilotes :** Choix des 3 à 5 ligues européennes majeures incluses pour le test pilote (OQ-006).
3. **Seuil d'affichage du résumé IA :** Décision de désactiver temporairement la génération du résumé Explainable AI (`FEAT-011`) si le score de confiance calculé pour le match est inférieur à 2.0/5.0.

---

## 33. Gouvernance des changements de périmètre

Toute demande de modification du périmètre fonctionnel défini dans ce document doit suivre le processus de gouvernance suivant :

1. **Soumission :** Rédaction d'une demande précisant la fonctionnalité impactée, l'exigence `FR-*` ou `NFR-*` concernée, et la justification métier.
2. **Analyse d'impact :** Évaluation de l'impact sur le graphe de dépendances fonctionnelles et sur l'effort de conception.
3. **Arbitrage :** Décision finale prise par le Fondateur ABYSS.
4. **Mise à jour :** En cas d'acceptation, mise à jour de ce document (`mvp-scope.md`) et du catalogue des fonctionnalités (`features.md`), accompagnée d'une entrée descriptive dans l'historique des versions.

---

## 34. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Requirements Document](product-requirements-document.md) | Source des exigences fonctionnelles et non fonctionnelles. |
| [User Personas](user-personas.md) | Personas cibles prioritaires (`PER-001` à `PER-004`). |
| [User Stories](user-stories.md) | Récits utilisateurs et critères d'acceptation de base. |
| [Features](features.md) | Catalogue officiel des fonctionnalités (`FEAT-001` à `FEAT-026`). |
| [Prioritization](prioritization.md) | Classement des fonctionnalités et scores SPC. |
| [Blueprint — MVP Scope](../08-product-blueprint/30-mvp-scope.md) | Périmètre initial de référence du Blueprint. |
| [Blueprint — Release Strategy](../08-product-blueprint/31-release-strategy.md) | Définition des environnements et conditions de release. |
| [Blueprint — User Journeys](../08-product-blueprint/09-user-journeys.md) | Définition des parcours utilisateurs clés. |
| [Open Questions](../06-operations/open-questions.md) | Centralisation des questions ouvertes OQ-001 à OQ-006. |

---

## 35. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Rédaction initiale du document de cadrage du MVP — Définition, périmètre fonctionnel, dépendances critiques, conditions de lancement, critères de sortie et gouvernance. |

---

> **Made in Abyss : Spark by the King**

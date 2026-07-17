# Features

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition

---

## 1. Objet

Ce document constitue le catalogue officiel et structuré des fonctionnalités d'Athena: Beyond Odds.

Il traduit les exigences du [Product Requirements Document (PRD)](product-requirements-document.md) et les récits du document [User Stories](user-stories.md) en spécifications de fonctionnalités claires, identifiées et priorisées. Ce catalogue sert de référence pour le découpage des tâches de développement de la phase d'implémentation.

---

## 2. Méthode

Les fonctionnalités de ce catalogue ont été déduites de l'analyse croisée des documents suivants :
- [Product Requirements Document](product-requirements-document.md)
- [User Stories](user-stories.md)
- [Functional Domains](../08-product-blueprint/10-functional-domains.md)
- [Modules](../08-product-blueprint/11-modules.md)
- [Screens](../08-product-blueprint/12-screens.md)
- [MVP Scope](../08-product-blueprint/30-mvp-scope.md)

Leur priorisation respecte la règle de priorité définie dans le Blueprint ([Features §7](../08-product-blueprint/13-features.md)) : les fonctionnalités indispensables au MVP ou critiques pour la sécurité/conformité portent la priorité P1 (ou P0), tandis que les extensions hors MVP sont classées P2, P3, P4 ou documentées comme hors périmètre (P-Hors-MVP).

---

## 3. Conventions

Chaque fonctionnalité est documentée selon la structure suivante :
- **Identifiant stable :** `FEAT-XXX`
- **Nom :** Intitulé fonctionnel clair
- **Priorité & Portée :** P0/P1/P2/P3/P4 et sa phase d'intégration (Foundation, MVP, V1, V2, Future)
- **Description :** Comportement attendu et valeur utilisateur
- **Dépendances :** Autres fonctionnalités requises en prérequis
- **Traçabilité :** Liens directs vers les exigences `FR-*` et les récits `US-*` correspondants

---

## 4. Classification des fonctionnalités

Les fonctionnalités sont classées selon les 15 domaines fonctionnels définis pour le MVP et un domaine transverse de résilience.

```
Catalogue des fonctionnalités
├── FEAT-001 à FEAT-003 : Compte et accès
├── FEAT-004 : Onboarding
├── FEAT-005 : Dashboard
├── FEAT-006 : Découverte des matchs
├── FEAT-007 : Recherche
├── FEAT-008 : Match Center
├── FEAT-009 : Statistiques et forme
├── FEAT-010 : Probabilités
├── FEAT-011 à FEAT-012 : Explainable AI
├── FEAT-013 : Sources et fraîcheur
├── FEAT-014 : Favoris
├── FEAT-015 : Notifications
├── FEAT-016 : Abonnement Premium
├── FEAT-017 : Qualité et signalement
├── FEAT-018 : Administration minimale
├── FEAT-019 à FEAT-020 : Résilience produit
└── FEAT-021 à FEAT-026 : Fonctionnalités reportées (V2 / Future)
```

---

## 5. Catalogue global

| ID Fonctionnalité | Nom de la fonctionnalité | Priorité | Phase | Trame PRD / Stories |
|:---|:---|:---:|:---|:---|
| **FEAT-001** | Inscription et confirmation de compte | P1 | MVP | FR-001 / US-001 |
| **FEAT-002** | Connexion et authentification sécurisées | P1 | MVP | FR-013 / US-002 |
| **FEAT-003** | Profil utilisateur et gestion des paramètres | P1 | MVP | FR-017 / US-003 |
| **FEAT-004** | Onboarding de configuration initiale | P1 | MVP | FR-002 / US-004 |
| **FEAT-005** | Dashboard d'accueil personnalisé | P1 | MVP | FR-003 / US-005 |
| **FEAT-006** | Liste des matchs du jour | P1 | MVP | FR-004 / US-006 |
| **FEAT-007** | Recherche globale autocomplete | P1 | MVP | FR-009 / US-007 |
| **FEAT-008** | Fiche d'information Match Center | P1 | MVP | FR-005 / US-008 |
| **FEAT-009** | Affichage de la forme et des stats de base | P1 | MVP | FR-006 / US-009 |
| **FEAT-010** | Moteur de probabilités et score de confiance | P1 | MVP | FR-007 / US-010 |
| **FEAT-011** | Résumé d'analyse généré par IA | P1 | MVP | FR-010 / US-011 |
| **FEAT-012** | Affichage hiérarchisé des facteurs explicatifs | P1 | MVP | FR-019 / US-012 |
| **FEAT-013** | Indicateur de fraîcheur et traçabilité des sources | P1 | MVP | FR-011 / US-013 |
| **FEAT-014** | Marquage et synchronisation des favoris | P1 | MVP | FR-008 / US-014 |
| **FEAT-015** | Notifications d'événements de match | P1 | MVP | FR-012 / US-015 |
| **FEAT-016** | Tunnel d'abonnement et gestion de droits Premium | P1 | MVP | FR-018, FR-021 / US-016 |
| **FEAT-017** | Signalement d'anomalies de données | P2 | MVP | FR-016 / US-017 |
| **FEAT-018** | Tableau de bord d'administration et d'observabilité | P1 | MVP | FR-022 / US-018 |
| **FEAT-019** | Gestion de l'affichage des données manquantes | P1 | MVP | FR-014 / US-019 |
| **FEAT-020** | Résilience applicative et blocage des états incohérents | P1 | MVP | FR-015, FR-020 / US-020 |
| **FEAT-021** | Support multi-sports | — | Future | Reportée |
| **FEAT-022** | Outil de simulation de match (What-If) | — | V1 | Reportée |
| **FEAT-023** | Comparateur de cotes de marché | — | V1 | Reportée |
| **FEAT-024** | Module Live Center temps réel | — | V1 | Reportée |
| **FEAT-025** | API publique d'export | — | V2 | Reportée |
| **FEAT-026** | Moteur de recommandation personnalisé | — | V2 | Reportée |

---

## 6. Compte et accès

### FEAT-001 — Inscription et confirmation de compte
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Permet à un visiteur de créer un compte utilisateur de niveau d'accès Free. Requiert la saisie d'un e-mail unique et d'un mot de passe fort, suivie d'une validation par envoi de lien d'activation e-mail pour confirmer le compte.
- **Dépendances :** Aucune
- **Traçabilité :** Exigence [FR-001](product-requirements-document.md#fr-001--inscription-et-création-de-compte), Récit [US-001](user-stories.md#us-001--inscription-par-e-mail)

### FEAT-002 — Connexion et authentification sécurisées
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Permet à un utilisateur enregistré de se connecter de manière sécurisée. Comprend des mécanismes de protection (limitation des tentatives d'accès incorrectes avec blocage temporaire et journalisation des événements d'accès côté serveur).
- **Dépendances :** `FEAT-001`
- **Traçabilité :** Exigences [FR-013](product-requirements-document.md#fr-013--connexion-et-authentification) et [NFR-007](product-requirements-document.md#nfr-007--sécurité), Récit [US-002](user-stories.md#us-002--connexion-sécurisée)

### FEAT-003 — Profil utilisateur et gestion des paramètres
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Permet à un utilisateur authentifié de modifier ses informations de profil (e-mail, mot de passe) et ses préférences système (langue d'interface, fuseau horaire local, consentements légaux), ou de déclencher la procédure de suppression de son compte.
- **Dépendances :** `FEAT-002`
- **Traçabilité :** Exigence [FR-017](product-requirements-document.md#fr-017--profil-et-préférences-utilisateur), Récit [US-003](user-stories.md#us-003--profil-et-préférences-utilisateur)

---

## 7. Onboarding

### FEAT-004 — Onboarding de configuration initiale
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Guide l'utilisateur lors de sa première connexion à travers un parcours interactif pour configurer ses préférences de base (langue, heure locale, niveau de familiarité avec les statistiques sportives, et sélection facultative d'équipes et compétitions d'intérêt).
- **Dépendances :** `FEAT-003`
- **Traçabilité :** Exigence [FR-002](product-requirements-document.md#fr-002--onboarding-initial), Récit [US-004](user-stories.md#us-004--séquence-donboarding-initial)

---

## 8. Dashboard

### FEAT-005 — Dashboard d'accueil personnalisé
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Affiche un tableau de bord dynamique et personnalisé lors de la connexion. Présente en priorité les matchs du jour des compétitions sélectionnées, les favoris de l'utilisateur, et les dernières fiches de match consultées.
- **Dépendances :** `FEAT-004`
- **Traçabilité :** Exigence [FR-003](product-requirements-document.md#fr-003--dashboard-personnalisé), Récit [US-005](user-stories.md#us-005--consultation-du-dashboard-personnalisé)

---

## 9. Découverte des matchs

### FEAT-006 — Liste des matchs du jour
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Met à disposition un écran recensant l'intégralité des rencontres programmées pour la journée en cours, classées par compétition et filtrables, affichant les équipes, le score en direct s'il y a lieu, l'horaire local et l'état du match.
- **Dépendances :** `FEAT-005`
- **Traçabilité :** Exigence [FR-004](product-requirements-document.md#fr-004--consultation-les-matchs-du-jour), Récit [US-006](user-stories.md#us-006--liste-des-rencontres-du-jour)

---

## 10. Recherche

### FEAT-007 — Recherche globale autocomplete
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Champ de recherche textuelle permanent permettant de chercher et trouver instantanément des équipes, compétitions ou matchs. Affiche des suggestions de résultats structurées par catégorie dès la saisie de 3 caractères.
- **Dépendances :** Aucune
- **Traçabilité :** Exigences [FR-009](product-requirements-document.md#fr-009--recherche) et [NFR-001](product-requirements-document.md#nfr-001--performance), Récit [US-007](user-stories.md#us-007--recherche-globale-par-saisie-semi-automatique)

---

## 11. Match Center

### FEAT-008 — Fiche d'information Match Center
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Fiche d'atterrissage complète pour une rencontre sportive donnée (Match Center). Elle centralise les données d'identité du match (compositions d'équipe, indisponibilités, heure de début, lieu, état réel de la rencontre et score).
- **Dépendances :** `FEAT-006`
- **Traçabilité :** Exigences [FR-005](product-requirements-document.md#fr-005--match-center) et [NFR-001](product-requirements-document.md#nfr-001--performance), Récit [US-008](user-stories.md#us-008--accès-à-la-fiche-match-center)

---

## 12. Statistiques et forme

### FEAT-009 — Affichage de la forme et des stats de base
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Présente l'historique de forme récente (résultat des 5 dernières rencontres) et les statistiques globales fondamentales ( possession, tirs cadrés, buts) de chaque équipe. Les statistiques avancées (xG, xA) font l'objet d'un masquage d'accès pour les Free Users.
- **Dépendances :** `FEAT-008`
- **Traçabilité :** Exigence [FR-006](product-requirements-document.md#fr-006--forme-et-statistiques), Récit [US-009](user-stories.md#us-009--consultation-de-la-forme-récente-et-des-statistiques-principales)

---

## 13. Probabilités

### FEAT-010 — Moteur de probabilités et score de confiance
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Calcule et affiche la répartition des probabilités d'issue (Victoire/Nul/Défaite) issues des modèles probabilistes validés (somme normalisée à 100 %). Les modèles détaillés, les intervalles d'incertitude et l'accord de consensus sont réservés aux abonnés Premium.
- **Dépendances :** `FEAT-008`
- **Traçabilité :** Exigences [FR-007](product-requirements-document.md#fr-007--probabilités) et [NFR-012](product-requirements-document.md#nfr-012--traçabilité-des-modèles), Récit [US-010](user-stories.md#us-010--consultation-des-probabilités-et-confiance-des-modèles)

---

## 14. Explainable AI

### FEAT-011 — Résumé d'analyse généré par IA
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Synthèse textuelle claire générée par l'IA explicable à partir des données structurées de la rencontre. Ce résumé met en avant la dynamique des forces en présence sans formuler de pronostic certain ou de gain garanti. La version complète et l'accès interactif aux questions de l'assistant sont réservés aux comptes Premium.
- **Dépendances :** `FEAT-010`
- **Traçabilité :** Exigence [FR-010](product-requirements-document.md#fr-010--résumé-athena-explainable-ai), Récit [US-011](user-stories.md#us-011--résumé-explicable-par-lia-explainable-ai)

### FEAT-012 — Affichage hiérarchisé des facteurs explicatifs
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Module affichant de manière hiérarchisée et ordonnée les facteurs statistiques favorables ou défavorables influençant la distribution des probabilités calculée, justifiant chaque facteur par une source ou donnée explicite.
- **Dépendances :** `FEAT-010`
- **Traçabilité :** Exigence [FR-019](product-requirements-document.md#fr-019--facteurs-explicatifs), Récit [US-012](user-stories.md#us-012--facteurs-clés-explicatifs)

---

## 15. Sources et fraîcheur

### FEAT-013 — Indicateur de fraîcheur et traçabilité des sources
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Section dédiée à l'affichage transparent de l'état de fraîcheur (dernière mise à jour) des données affichées sur le Match Center, accompagnée de la liste des sources de données tierces de référence ayant alimenté les calculs.
- **Dépendances :** `FEAT-008`
- **Traçabilité :** Exigences [FR-011](product-requirements-document.md#fr-011--affichage-des-sources-et-fraîcheur) et [NFR-010](product-requirements-document.md#nfr-010--qualité-des-données), Récit [US-013](user-stories.md#us-013--consultation-des-sources-et-de-lindicateur-de-fraîcheur)

---

## 16. Favoris

### FEAT-014 — Marquage et synchronisation des favoris
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Offre à l'utilisateur authentifié la possibilité d'ajouter ou retirer une entité sportive (match, équipe ou compétition) à sa liste de favoris personnelle via un bouton d'action dédié, synchronisant instantanément ses choix avec le serveur.
- **Dépendances :** `FEAT-005`
- **Traçabilité :** Exigence [FR-008](product-requirements-document.md#fr-008--favoris), Récit [US-014](user-stories.md#us-014--gestion-des-favoris)

---

## 17. Notifications

### FEAT-015 — Notifications d'événements de match
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Permet à l'utilisateur de configurer des alertes contextuelles spécifiques à un match (rappel d'avant-match, coup d'envoi, fin de rencontre) et de les recevoir de manière dédupliquée en respectant ses paramètres horaires d'autorisation.
- **Dépendances :** `FEAT-014`
- **Traçabilité :** Exigence [FR-012](product-requirements-document.md#fr-012--notifications-de-base), Récit [US-015](user-stories.md#us-015--configuration-et-réception-des-alertes-de-match)

---

## 18. Abonnement Premium

### FEAT-016 — Tunnel d'abonnement et gestion de droits Premium
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Gère le cycle de vie de l'abonnement Premium. Comprend le tunnel de vente (comparatif des offres sans dark pattern), le contrôle de l'application des restrictions fonctionnelles côté serveur et la gestion administrative de l'arrêt du renouvellement automatique.
- **Dépendances :** `FEAT-003`
- **Traçabilité :** Exigences [FR-018](product-requirements-document.md#fr-018--gestion-de-labonnement-premium) et [FR-021](product-requirements-document.md#fr-021--niveaux-daccès-free-et-premium), Récit [US-016](user-stories.md#us-016--tunnel-dabonnement-et-déverrouillage-premium)

---

## 19. Qualité et signalement

### FEAT-017 — Signalement d'anomalies de données
- **Priorité :** P2
- **Phase :** MVP
- **Décision :** Option A — Inclus au MVP. Justification : `FR-016` porte la priorité P2 dans le PRD ; le parcours `Signaler une erreur` est un User Journey officiel (§8) ; le MVP Scope §2 liste explicitement `qualité` et `incidents` dans l'Administration minimale. Le signalement ne figure pas dans la liste des exclusions du MVP Scope §3.
- **Description :** Met à disposition un bouton contextuel sur les données clés du Match Center permettant aux utilisateurs de signaler une erreur dans les statistiques ou informations. Génère un ticket d'anomalie traçable dans le tableau de bord d'administration.
- **Dépendances :** `FEAT-008`, `FEAT-018`
- **Traçabilité :** Exigence [FR-016](product-requirements-document.md#fr-016--signalement-dune-erreur), Récit [US-017](user-stories.md#us-017--signalement-danomalie-de-données)

---

## 20. Administration minimale

### FEAT-018 — Tableau de bord d'administration et d'observabilité
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Console d'administration sécurisée permettant aux opérateurs internes de suivre les indicateurs de fraîcheur et de complétude des flux ingérés, de gérer les habilitations et de suspendre des utilisateurs, tout en consignant les actions d'administration dans un journal d'audit.
- **Dépendances :** `FEAT-002`
- **Traçabilité :** Exigence [FR-022](product-requirements-document.md#fr-022--administration-minimale), Récit [US-018](user-stories.md#us-018--supervision-et-gestion-de-la-plateforme)

---

## 21. Résilience produit

### FEAT-019 — Gestion de l'affichage des données manquantes
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Règle de présentation garantissant qu'en cas d'absence de données (statistique, absence de joueur, composition d'équipe), l'interface affiche explicitement la mention "Donnée non disponible" (sans la masquer et sans la remplacer par un zéro), et avertit l'utilisateur de l'impact potentiel sur la complétude de l'analyse globale.
- **Dépendances :** `FEAT-008`
- **Traçabilité :** Exigence [FR-014](product-requirements-document.md#fr-014--gestion-des-données-manquantes), Récit [US-019](user-stories.md#us-019--gestion-de-laffichage-des-données-manquantes)

### FEAT-020 — Résilience applicative et blocage des états incohérents
- **Priorité :** P1
- **Phase :** MVP
- **Description :** Filtre de validation bloquant les transitions d'états de match interdites côté serveur (ex. : de match terminé vers match en cours) et redirigeant l'utilisateur vers des écrans d'erreur standardisés non techniques (404, 503) lors des incidents serveurs ou réseau.
- **Dépendances :** `FEAT-008`
- **Traçabilité :** Exigences [FR-015](product-requirements-document.md#fr-015--gestion-des-états-du-match) et [FR-020](product-requirements-document.md#fr-020--gestion-des-états-derreur-produit), Récit [US-020](user-stories.md#us-020--résilience-aux-erreurs-produit-et-transitions-interdites)

---

## 22. Fonctionnalités hors périmètre MVP (Roadmap)

Les fonctionnalités suivantes sont listées à titre d'information pour la cohérence de la roadmap mais n'appartiennent pas au périmètre du MVP actuel. Leur identifiant est stable et leur statut est `Reportée`.

| ID Fonctionnalité | Nom | Portée | Statut | Raison de l'exclusion du MVP |
|:---|:---|:---:|:---:|:---|
| **FEAT-021** | Support multi-sports | Future | Reportée | Restriction stricte du MVP au football uniquement |
| **FEAT-022** | Outil de simulation de match (What-If) | V1 | Reportée | Simulations interactives de forme/compo exclues du MVP |
| **FEAT-023** | Comparateur de cotes de marché | V1 | Reportée | Intégration avancée des bookmakers hors périmètre initial |
| **FEAT-024** | Module Live Center temps réel | V1 | Reportée | Flux de mise à jour instantanée hors périmètre (scheduled/finished prioritaire) |
| **FEAT-025** | API publique d'export | V2 | Reportée | Interface programmable réservée aux versions professionnelles futures |
| **FEAT-026** | Moteur de recommandation personnalisé | V2 | Reportée | Algorithmes de recommandation d'analyses complexes exclus |

Référence : [MVP Scope](../08-product-blueprint/30-mvp-scope.md)

---

## 23. Matrice de traçabilité

La matrice suivante établit la traçabilité complète : **Exigence PRD → User Story → ID Fonctionnalité**.

| Exigence PRD | Récit Utilisateur (User Story) | ID Fonctionnalité | Priorité | Statut MVP |
|:---|:---|:---|:---:|:---|
| **FR-001** | `US-001` | **FEAT-001** | P1 | Inclus |
| **FR-002** | `US-004` | **FEAT-004** | P1 | Inclus |
| **FR-003** | `US-005` | **FEAT-005** | P1 | Inclus |
| **FR-004** | `US-006` | **FEAT-006** | P1 | Inclus |
| **FR-005** | `US-008` | **FEAT-008** | P1 | Inclus |
| **FR-006** | `US-009` | **FEAT-009** | P1 | Inclus |
| **FR-007** | `US-010` | **FEAT-010** | P1 | Inclus |
| **FR-008** | `US-014` | **FEAT-014** | P1 | Inclus |
| **FR-009** | `US-007` | **FEAT-007** | P1 | Inclus |
| **FR-010** | `US-011` | **FEAT-011** | P1 | Inclus |
| **FR-011** | `US-013` | **FEAT-013** | P1 | Inclus |
| **FR-012** | `US-015` | **FEAT-015** | P1 | Inclus |
| **FR-013** | `US-002` | **FEAT-002** | P1 | Inclus |
| **FR-014** | `US-019` | **FEAT-019** | P1 | Inclus |
| **FR-015** | `US-020` | **FEAT-020** | P1 | Inclus |
| **FR-016** | `US-017` | **FEAT-017** | P2 | Inclus (MVP) |
| **FR-017** | `US-003` | **FEAT-003** | P1 | Inclus |
| **FR-018** | `US-016` | **FEAT-016** | P1 | Inclus |
| **FR-019** | `US-012` | **FEAT-012** | P1 | Inclus |
| **FR-020** | `US-020` | **FEAT-020** | P1 | Inclus |
| **FR-021** | `US-016` | **FEAT-016** | P1 | Inclus |
| **FR-022** | `US-018` | **FEAT-018** | P1 | Inclus |

---

## 24. Dépendances fonctionnelles

Les relations de dépendances directes entre les modules fonctionnels d'ingestion et les fonctionnalités présentées s'établissent ainsi :

```
             [FEAT-002 (Connexion)]
                       │
                       ▼
             [FEAT-003 (Profil)]
                       │
                       ▼
            [FEAT-004 (Onboarding)]
                       │
                       ▼
            [FEAT-005 (Dashboard)] ◄────── [FEAT-014 (Favoris)]
                       │                               │
                       ▼                               ▼
          [FEAT-006 (Matchs du jour)] ◄─── [FEAT-015 (Notifications)]
                       │
                       ▼
            [FEAT-008 (Match Center)]
             ├── FEAT-009 (Stats)
             ├── FEAT-010 (Probabilités) ◄── [FEAT-012 (Facteurs)]
             │         │
             │         ▼
             │   [FEAT-011 (Résumé IA)]
             │
             ├── FEAT-013 (Sources & Fraîcheur)
             ├── FEAT-019 (Données manquantes)
             └── FEAT-020 (Résilience)
```

---

## 25. Risques et limites

- **Risque d'indisponibilité des API de données sportives :** `FEAT-008` (Match Center) et ses sous-composants dépendent directement de fournisseurs tiers. La résilience (`FEAT-019` et `FEAT-020`) doit garantir que le système ne plante pas lors d'une défaillance externe.
- **Limites de calcul des modèles :** `FEAT-010` (Probabilités) requiert un historique suffisant pour initialiser les scores Poisson/Elo au MVP. Le périmètre initial est limité à un ensemble de compétitions restreint pour réduire ce risque.

---

## 26. Hypothèses

- **Hypothèse à valider :** La détection et le masquage des statistiques avancées pour les comptes Free Users (`FEAT-009`) n'entravent pas les performances d'affichage de la fiche Match Center.
- **Hypothèse à valider :** Le signalement d'erreur (`FEAT-017`) n'est pas utilisé pour saturer les serveurs d'administration. Une limitation de quota de signalements par utilisateur doit être envisagée si le besoin se présente.

---

## 27. Questions ouvertes

Les questions ouvertes impactant le catalogue des fonctionnalités sont centralisées dans :
[`docs/06-operations/open-questions.md`](../06-operations/open-questions.md)

- **OQ-001 (Quotas Free) :** Fixe la limite technique d'affichage et de décompte dans `FEAT-016`.
- **OQ-002 (Tarifs Premium) :** Définit les modalités de paiement à intégrer dans `FEAT-016`.
- **OQ-003 (Fournisseurs de données) :** Conditionne la structure d'ingestion et de fraîcheur affichée dans `FEAT-013`.

---

## 28. Critères de qualité

Le catalogue des fonctionnalités est considéré comme valide et exploitable lorsque :
- Chaque fonctionnalité possède un identifiant unique stable et une priorité définie.
- La traçabilité avec le PRD et les Stories est bidirectionnelle et sans omission.
- Les dépendances fonctionnelles clés sont documentées et ne contiennent pas de boucle.
- La distinction entre le périmètre du MVP et les phases futures est exempte d'ambiguïté.

---

## 29. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Requirements Document](product-requirements-document.md) | Liste des exigences fonctionnelles (FR) et non fonctionnelles (NFR) |
| [User Stories](user-stories.md) | Description des récits utilisateurs et des critères Given-When-Then |
| [MVP Scope](../08-product-blueprint/30-mvp-scope.md) | Périmètre strict du MVP |
| [Modules](../08-product-blueprint/11-modules.md) | Modélisation des composants du système |
| [Screens](../08-product-blueprint/12-screens.md) | Découpage des écrans de l'application |

---

## 30. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Spécification du catalogue de fonctionnalités du MVP football |

---

> **Made in Abyss : Spark by the King**

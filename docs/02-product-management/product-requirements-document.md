# Product Requirements Document

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition  
> **Propriétaire :** Fondateur ABYSS

---

## 1. Résumé exécutif

Athena: Beyond Odds est une plateforme d'intelligence sportive explicable conçue pour transformer des données dispersées et complexes en analyses structurées, probabilistes et compréhensibles.

Le produit commence par le football et s'adresse à plusieurs profils d'utilisateurs, du passionné de sport à l'analyste professionnel.

Ce document définit les exigences qui doivent guider les phases de conception UX/UI, d'architecture technique et de développement.

Il synthétise les décisions du [Product Blueprint](../08-product-blueprint/00-readme.md) et crée des liens vers les documents responsables de chaque décision.

---

## 2. Contexte

### 2.1 Entreprise

ABYSS est l'entreprise mère du produit. Sa devise est : `Made in Abyss : Spark by the King`.

### 2.2 Produit

Athena: Beyond Odds est le premier produit d'ABYSS. Il occupe une position entre :

- les applications de scores ;
- les plateformes de statistiques ;
- les outils d'analyse professionnelle ;
- les moteurs probabilistes ;
- les assistants d'intelligence artificielle.

Référence : [Product Overview](../08-product-blueprint/01-product-overview.md)

### 2.3 Phase actuelle

Ce PRD correspond à la **Phase 1 — Product Definition**.

Il prépare la transition vers la Phase 2 (Architecture technique) et la Phase 3 (Design UX/UI).

---

## 3. Problème utilisateur

Les utilisateurs ont accès à une quantité croissante de données sportives, mais ces données sont :

- réparties entre plusieurs services sans intégration cohérente ;
- présentées dans des formats différents, difficiles à comparer ;
- rarement contextualisées ni accompagnées d'explications ;
- parfois incomplètes, contradictoires ou transformées en affirmations excessivement certaines.

**Le manque principal n'est pas l'information. Le manque est une compréhension fiable, centralisée et explicable.**

Référence : [Product Overview §3](../08-product-blueprint/01-product-overview.md)

---

## 4. Opportunité produit

Aucune solution existante ne combine aujourd'hui les dimensions suivantes au sein d'une expérience unique et explicable :

1. centralisation des données sportives ;
2. contextualisation permanente ;
3. modélisation probabiliste multi-modèles ;
4. simulation de scénarios ;
5. explicabilité assistée par IA ;
6. personnalisation de l'expérience.

Cette lacune constitue l'opportunité principale d'Athena.

---

## 5. Vision et mission

### Mission produit

> Transformer les données sportives en compréhension fiable, contextualisée et explicable.

### Vision

Athena doit devenir la référence mondiale de l'intelligence sportive explicable.

### North Star

> Le nombre d'analyses comprises et jugées utiles par des utilisateurs récurrents.

Référence : [Product Vision](../08-product-blueprint/03-product-vision.md) · [Success Metrics §2](../08-product-blueprint/04-success-metrics.md)

---

## 6. Objectifs du produit

| Objectif | Description |
|:---|:---|
| Compréhension | 70 % des répondants déclarent mieux comprendre le match après utilisation |
| Confiance | Taux d'erreurs signalées faible et stable |
| Rétention | Retour à J7 mesurable dès le MVP |
| Activation | 5 étapes d'activation définies et mesurées |
| Qualité des données | Fraîcheur et couverture contrôlées en continu |

Référence : [Success Metrics](../08-product-blueprint/04-success-metrics.md)

---

## 7. Objectifs du MVP

Le MVP doit valider trois hypothèses fondamentales :

1. les utilisateurs comprennent mieux un match avec Athena ;
2. les utilisateurs font confiance aux explications ;
3. les données et modèles peuvent être maintenus de manière fiable.

L'objectif n'est pas la richesse fonctionnelle. L'objectif est la preuve d'utilité.

Référence : [Product Vision §2](../08-product-blueprint/03-product-vision.md) · [MVP Scope](../08-product-blueprint/30-mvp-scope.md)

---

## 8. Éléments hors périmètre

Les éléments suivants sont explicitement exclus du MVP :

| Élément exclu | Raison |
|:---|:---|
| Multi-sports | Complexité initiale, périmètre limité au football |
| Live avancé (score temps réel) | Hors MVP, prévu en V1 |
| Vidéo | Hors périmètre actuel |
| API publique | Prévu en V2 |
| Exports professionnels | Prévu en V2 |
| Agents autonomes | Vision future |
| SMS notifications | Hors MVP |
| Paris exécutés, bankroll, trading | Exclus définitivement de la mission |
| Application mobile native | Mobile web responsive inclus ; natif en V2 |
| Recommandations personnalisées avancées | Prévu en V2 |

Référence : [MVP Scope §3](../08-product-blueprint/30-mvp-scope.md)

---

## 9. Utilisateurs cibles

### 9.1 Rôles système

| Rôle | Accès |
|:---|:---|
| Visiteur | Pages publiques et aperçu limité |
| Free User | Fonctions essentielles, quotas limités |
| Premium User | Analyses complètes, simulations, alertes avancées |
| Professional Analyst | Exports, filtres avancés, API selon contrat |
| Support Agent | Dossiers support, métadonnées limitées |
| Data Operator | Qualité des données, ingestion |
| Administrator | Gestion utilisateurs, modèles, configuration |
| Super Administrator | Accès exceptionnel avec 2FA et journalisation |

Référence : [User Roles](../08-product-blueprint/08-user-roles.md)

### 9.2 Profils utilisateurs principaux

| Profil | Besoins principaux |
|:---|:---|
| Amateur de sport | Résumés clairs, explications accessibles, suivi des favoris |
| Utilisateur analytique | Données détaillées, filtres, probabilités, traçabilité des sources |
| Analyste sportif | Précision, profondeur, reproductibilité, rapports |
| Créateur de contenu / journaliste | Résumés, tendances, faits clés, visualisations partageables |
| Utilisateur intéressé par les marchés | Probabilités calibrées, comparaison avec cotes implicites |

Référence : [Product Overview §5](../08-product-blueprint/01-product-overview.md)

---

## 10. Proposition de valeur

Athena centralise, contextualise, modélise, simule, explique et personnalise les données sportives.

**Athena est un outil d'aide à la compréhension et à la décision. Athena n'est pas un outil de certitude.**

Athena ne fait jamais de promesse de gain ou de résultat garanti.

Référence : [Product Overview §4](../08-product-blueprint/01-product-overview.md) · [Product Principles §4](../08-product-blueprint/02-product-principles.md)

---

## 11. Principes produit

| N° | Principe | Résumé |
|:---|:---|:---|
| P-01 | Compréhension avant quantité | Priorité aux signaux utiles, pas au volume |
| P-02 | Explicabilité obligatoire | Toute conclusion doit pouvoir être expliquée |
| P-03 | Probabilité, jamais certitude | Interdiction des formulations garantissant un résultat |
| P-04 | Données avant narration | L'IA commente des calculs validés, ne les remplace pas |
| P-05 | Qualité avant vitesse | Une fonctionnalité fiable vaut cinq fonctionnalités instables |
| P-06 | Simplicité progressive | Accessible aux débutants, approfondi pour les experts |
| P-07 | Contexte permanent | Une donnée n'a de valeur qu'avec son contexte |
| P-08 | Confiance par la transparence | Afficher sources, dates, limites et divergences |
| P-09 | L'humain reste responsable | Athena augmente le jugement, ne le remplace pas |
| P-10 | Pas de dark patterns | Aucun mécanisme de pression ou de manipulation |
| P-11 | Mobile utile | L'expérience mobile est conçue, pas compressée |
| P-12 | Accessibilité par défaut | WCAG appliqué dès la conception |
| P-13 | Confidentialité minimale | Collecte limitée aux données nécessaires |
| P-14 | Mesure avant opinion | Les décisions s'appuient sur des données |
| P-15 | Modularité | Chaque domaine peut évoluer indépendamment |
| P-16 | Internationalisation dès l'origine | Aucun texte codé en dur, aucun fuseau implicite |

Référence : [Product Principles](../08-product-blueprint/02-product-principles.md)

---

## 12. Expérience principale

L'expérience centrale d'Athena s'organise autour d'un match de football.

```text
Découverte publique
        ↓
Création de compte
        ↓
Onboarding (langue, fuseau, équipes, alertes)
        ↓
Dashboard personnalisé
        ↓
Recherche ou découverte d'un match
        ↓
Match Center
        ↓
Données et contexte
        ↓
Statistiques et comparaison
        ↓
Probabilités et simulations
        ↓
Explication Athena
        ↓
Favori, alerte ou rapport
        ↓
Suivi du résultat
        ↓
Évaluation et historique
```

Référence : [Product Overview §13](../08-product-blueprint/01-product-overview.md) · [User Journeys](../08-product-blueprint/09-user-journeys.md)

---

## 13. Périmètre fonctionnel du MVP

### 13.1 Inclus dans le MVP

| Domaine | Fonctions incluses |
|:---|:---|
| Compte | Inscription, connexion, récupération, profil, préférences de base |
| Catalogue | Compétitions sélectionnées, équipes, matchs, saisons |
| Dashboard | Matchs du jour, favoris, analyses récentes |
| Match Center | État, équipes, score, heure, forme, statistiques principales, absences, probabilités, facteurs, résumé Athena, sources, fraîcheur |
| Recherche | Équipes, matchs, compétitions |
| Favoris | Équipe, match, compétition |
| Notifications | Rappel avant match, début, fin |
| Administration minimale | Utilisateurs, fournisseurs, qualité, incidents |

### 13.2 Modèles probabilistes MVP

- Baseline ;
- Poisson ;
- Elo ;
- consensus simple ;
- calibration ;
- simulation limitée.

### 13.3 Critères de sortie du MVP

- données fiables sur le périmètre ;
- Match Center stable ;
- probabilités versionnées ;
- explications fondées sur des données réelles ;
- métriques actives ;
- sécurité validée ;
- tests de couverture ;
- utilisateurs pilotes validés ;
- compréhension déclarée mesurée.

Référence : [MVP Scope](../08-product-blueprint/30-mvp-scope.md)

---

## 14. Exigences fonctionnelles

### FR-001 — Inscription et création de compte

- **Priorité :** P1
- **Personas :** Visiteur → Free User
- **Description :** L'utilisateur peut créer un compte avec une adresse e-mail et un mot de passe. Des méthodes OAuth peuvent être proposées.
- **Préconditions :** L'utilisateur n'est pas connecté.
- **Comportement attendu :**
  1. L'utilisateur accède à la page d'inscription.
  2. Il saisit son adresse e-mail et son mot de passe.
  3. Il accepte les conditions d'utilisation et la politique de confidentialité.
  4. Il confirme son adresse e-mail via un lien de validation.
  5. Son compte est créé avec le rôle Free User.
- **Résultat attendu :** Le compte est actif. L'utilisateur est redirigé vers l'onboarding.
- **Règles associées :**
  - Le mot de passe doit respecter une exigence minimale de complexité définie.
  - L'adresse e-mail doit être unique dans le système.
  - Aucun paiement n'est requis à l'inscription.
  - Le consentement est explicite et traçable.
- **Dépendances :** FR-002 (onboarding), FR-021 (niveaux d'accès)
- **Critères d'acceptation préliminaires :**
  - [ ] L'inscription avec e-mail et mot de passe fonctionnel est opérationnelle.
  - [ ] Un e-mail de validation est envoyé dans les 60 secondes.
  - [ ] Un compte non confirmé ne peut pas accéder aux fonctions protégées.
  - [ ] Les erreurs de formulaire sont affichées de manière claire et accessible.
- **Références :**
  - [User Roles](../08-product-blueprint/08-user-roles.md)
  - [User Journeys §1](../08-product-blueprint/09-user-journeys.md)
  - [Functional Domains §2](../08-product-blueprint/10-functional-domains.md)

---

### FR-002 — Onboarding initial

- **Priorité :** P1
- **Personas :** Free User (premier accès)
- **Description :** À l'issue de l'inscription, l'utilisateur est guidé à travers une séquence d'initialisation de ses préférences.
- **Préconditions :** Le compte est créé et confirmé.
- **Comportement attendu :**
  1. L'utilisateur sélectionne sa langue.
  2. Il choisit son fuseau horaire.
  3. Il indique son niveau d'expertise sportive.
  4. Il sélectionne les compétitions et équipes qui l'intéressent.
  5. Il configure ses préférences de notifications.
  6. Il donne ses consentements explicites.
  7. Il accède à son Dashboard personnalisé.
- **Résultat attendu :** Le Dashboard est peuplé avec les équipes et compétitions sélectionnées.
- **Règles associées :**
  - L'onboarding doit pouvoir être ignoré ou repris ultérieurement.
  - Les consentements ne peuvent pas être cochés par défaut.
  - Voir OQ-004 pour la liste des langues disponibles.
- **Dépendances :** FR-001 (inscription), FR-003 (Dashboard)
- **Critères d'acceptation préliminaires :**
  - [ ] La séquence d'onboarding comporte au minimum 5 étapes.
  - [ ] L'onboarding peut être sauté, les préférences restent modifiables.
  - [ ] Le Dashboard affiche bien les équipes sélectionnées à l'issue de l'onboarding.
- **Références :**
  - [User Journeys §2](../08-product-blueprint/09-user-journeys.md)

---

### FR-003 — Dashboard personnalisé

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** Le Dashboard est la page d'accueil principale après connexion. Il présente les matchs du jour, les favoris et les analyses récentes.
- **Préconditions :** L'utilisateur est connecté.
- **Comportement attendu :**
  1. Le Dashboard affiche les matchs du jour filtrés sur les compétitions suivies.
  2. Il affiche les équipes et compétitions favorites de l'utilisateur.
  3. Il affiche les analyses récemment consultées.
  4. Les matchs en cours affichent leur état en temps quasi-réel.
- **Résultat attendu :** L'utilisateur accède rapidement aux informations pertinentes pour lui.
- **Règles associées :**
  - Un utilisateur sans favoris voit une sélection par défaut de compétitions majeures.
  - La liste des matchs du jour est fraîche (délai d'ingestion contrôlé).
- **Dépendances :** FR-002 (onboarding), FR-008 (favoris), FR-004 (matchs du jour)
- **Critères d'acceptation préliminaires :**
  - [ ] Le Dashboard affiche les matchs du jour de toutes les compétitions suivies.
  - [ ] Les favoris sont visibles et navigables depuis le Dashboard.
  - [ ] L'état des matchs en cours est mis à jour sans rechargement complet.
- **Références :**
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)
  - [Functional Domains §3](../08-product-blueprint/10-functional-domains.md)

---

### FR-004 — Consultation des matchs du jour

- **Priorité :** P1
- **Personas :** Visiteur (limité), Free User, Premium User
- **Description :** L'utilisateur peut consulter la liste des matchs du jour pour les compétitions disponibles.
- **Préconditions :** L'utilisateur est sur le Dashboard ou la page des matchs.
- **Comportement attendu :**
  1. La liste affiche tous les matchs du jour par compétition.
  2. Chaque entrée affiche les équipes, l'heure de coup d'envoi, l'état du match et le score s'il est disponible.
  3. L'utilisateur peut filtrer par compétition.
  4. Un clic sur un match ouvre le Match Center.
- **Résultat attendu :** L'utilisateur identifie rapidement les matchs qui l'intéressent.
- **Règles associées :**
  - Les heures sont affichées selon le fuseau horaire de l'utilisateur.
  - L'état `scheduled`, `live`, `finished` est visible.
  - Les données manquantes sont indiquées explicitement (non remplacées par zéro).
- **Dépendances :** FR-005 (Match Center), NFR-001 (performance)
- **Critères d'acceptation préliminaires :**
  - [ ] La liste des matchs du jour est disponible pour les compétitions configurées.
  - [ ] Le filtre par compétition fonctionne.
  - [ ] Les heures s'affichent dans le fuseau horaire de l'utilisateur.
- **Références :**
  - [Business Rules §1](../08-product-blueprint/14-business-rules.md)
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)

---

### FR-005 — Match Center

- **Priorité :** P1
- **Personas :** Free User (limité), Premium User
- **Description :** Le Match Center est la fiche complète d'un match. Il regroupe toutes les données disponibles sur une rencontre.
- **Préconditions :** L'utilisateur a sélectionné un match.
- **Comportement attendu :**
  1. La page affiche l'état du match (scheduled, live, finished).
  2. Elle affiche les deux équipes, le score, l'heure et le lieu.
  3. Elle affiche la forme récente des deux équipes.
  4. Elle affiche les statistiques principales disponibles.
  5. Elle affiche les absences connues (blessures, suspensions).
  6. Elle affiche les probabilités issues des modèles.
  7. Elle affiche les facteurs clés favorables et défavorables.
  8. Elle présente un résumé Athena (généré par IA explicable).
  9. Elle indique la fraîcheur et la provenance des données.
  10. Elle affiche les sources utilisées.
- **Résultat attendu :** L'utilisateur dispose d'une compréhension globale du match sur une seule page.
- **Règles associées :**
  - Chaque probabilité affiche sa version de modèle et son horodatage.
  - Les données manquantes sont indiquées (`null` ou `unknown`), jamais remplacées par zéro.
  - Le résumé Athena ne peut pas contenir d'informations inventées.
  - Le match a les états : `scheduled`, `delayed`, `postponed`, `cancelled`, `live`, `halftime`, `extra-time`, `penalties`, `suspended`, `abandoned`, `finished`.
- **Dépendances :** FR-006 (données), FR-007 (probabilités), FR-010 (résumé Athena), FR-011 (sources), NFR-001 (performance)
- **Critères d'acceptation préliminaires :**
  - [ ] Le Match Center s'affiche en moins de 2,5 secondes (NFR-001).
  - [ ] Tous les états de match sont correctement représentés.
  - [ ] Les probabilités affichent leur version et horodatage.
  - [ ] Les données manquantes affichent un indicateur explicite.
  - [ ] Le résumé Athena est fondé sur les données disponibles, pas inventé.
- **Références :**
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)
  - [Business Rules §1, §2, §3](../08-product-blueprint/14-business-rules.md)
  - [Product Principles §2, §3](../08-product-blueprint/02-product-principles.md)

---

### FR-006 — Forme et statistiques

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** L'utilisateur peut consulter la forme récente et les statistiques clés de chaque équipe dans le contexte d'un match.
- **Préconditions :** L'utilisateur consulte le Match Center.
- **Comportement attendu :**
  1. La forme des cinq derniers matchs est affichée pour chaque équipe.
  2. Les statistiques principales (buts, tirs, possession, xG) sont affichées.
  3. Les statistiques sont contextualisées (domicile/extérieur, période, adversaire).
  4. L'utilisateur Premium peut accéder aux statistiques détaillées.
- **Résultat attendu :** L'utilisateur comprend la dynamique récente des deux équipes.
- **Règles associées :**
  - Une statistique non disponible est indiquée, jamais remplacée par zéro.
  - La source et la date de calcul des statistiques sont accessibles.
- **Dépendances :** FR-005 (Match Center)
- **Critères d'acceptation préliminaires :**
  - [ ] La forme des 5 derniers matchs s'affiche pour chaque équipe.
  - [ ] Les statistiques principales sont visibles pour Free User.
  - [ ] Les statistiques avancées (xG, xA) sont réservées au Premium.
- **Références :**
  - [Product Overview §9](../08-product-blueprint/01-product-overview.md)
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)

---

### FR-007 — Probabilités

- **Priorité :** P1
- **Personas :** Free User (résumé), Premium User (complet)
- **Description :** Le Match Center affiche les probabilités produites par les modèles d'Athena.
- **Préconditions :** Les modèles ont produit des probabilités pour ce match.
- **Comportement attendu :**
  1. Les probabilités victoire/nul/défaite sont affichées.
  2. Un score de confiance global est présenté.
  3. L'utilisateur peut voir les intervalles d'incertitude (Premium).
  4. L'accord entre modèles est présenté (Premium).
  5. La version du modèle et l'horodatage sont visibles.
- **Résultat attendu :** L'utilisateur comprend les probabilités et leur niveau de fiabilité.
- **Règles associées :**
  - La somme des probabilités est normalisée à 100 %.
  - La version du modèle est conservée et horodatée.
  - Aucune modification rétroactive silencieuse n'est tolérée.
  - Le score de confiance intègre : couverture, fraîcheur, stabilité, accord, calibration, qualité du contexte.
  - Les formulations garantissant un résultat sont interdites.
- **Dépendances :** FR-005 (Match Center), FR-010 (résumé Athena)
- **Critères d'acceptation préliminaires :**
  - [ ] Les trois probabilités principales s'affichent et totalisent 100 %.
  - [ ] La version du modèle et l'horodatage sont visibles.
  - [ ] Aucune formulation du type « victoire assurée » n'est présente.
  - [ ] Le score de confiance est affiché avec sa signification accessible.
- **Références :**
  - [Business Rules §3, §4](../08-product-blueprint/14-business-rules.md)
  - [Product Principles §3, §8](../08-product-blueprint/02-product-principles.md)
  - [MVP Scope §4](../08-product-blueprint/30-mvp-scope.md)

---

### FR-008 — Favoris

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** L'utilisateur peut enregistrer des équipes, matchs et compétitions comme favoris pour personnaliser son expérience.
- **Préconditions :** L'utilisateur est connecté.
- **Comportement attendu :**
  1. L'utilisateur peut ajouter ou retirer un favori depuis n'importe quelle fiche équipe, match ou compétition.
  2. Les favoris sont visibles sur le Dashboard.
  3. La suppression d'un favori ne supprime pas l'historique d'activité.
- **Résultat attendu :** L'utilisateur retrouve rapidement les entités qui l'intéressent.
- **Règles associées :**
  - Un utilisateur peut enregistrer : équipe, joueur, compétition, match.
  - La suppression d'un favori ne supprime pas l'historique.
- **Dépendances :** FR-003 (Dashboard)
- **Critères d'acceptation préliminaires :**
  - [ ] L'ajout et la suppression d'un favori fonctionnent depuis chaque type de fiche.
  - [ ] Les favoris apparaissent sur le Dashboard.
  - [ ] L'historique de consultation est préservé après suppression d'un favori.
- **Références :**
  - [Business Rules §5](../08-product-blueprint/14-business-rules.md)
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)

---

### FR-009 — Recherche

- **Priorité :** P1
- **Personas :** Visiteur (limité), Free User, Premium User
- **Description :** L'utilisateur peut rechercher des équipes, des matchs et des compétitions via un champ de recherche global.
- **Préconditions :** Aucune.
- **Comportement attendu :**
  1. La barre de recherche est accessible depuis toutes les pages.
  2. L'autocomplete suggère des résultats à partir de trois caractères.
  3. Les résultats sont classés par pertinence.
  4. L'utilisateur peut filtrer par type (équipe, match, compétition).
- **Résultat attendu :** L'utilisateur trouve rapidement l'entité recherchée.
- **Règles associées :**
  - La recherche ne doit pas retourner de résultats hors du périmètre de données disponibles.
- **Dépendances :** FR-005 (Match Center)
- **Critères d'acceptation préliminaires :**
  - [ ] La recherche retourne des résultats pertinents pour les équipes, matchs et compétitions.
  - [ ] L'autocomplete fonctionne à partir de 3 caractères.
  - [ ] La recherche est accessible depuis n'importe quelle page.
- **Références :**
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)
  - [Functional Domains §10](../08-product-blueprint/10-functional-domains.md)

---

### FR-010 — Résumé Athena (Explainable AI)

- **Priorité :** P1
- **Personas :** Free User (version courte), Premium User (complet)
- **Description :** Athena génère un résumé textuel explicable des facteurs qui influencent un match, fondé uniquement sur les données disponibles.
- **Préconditions :** Les données et probabilités du match sont disponibles.
- **Comportement attendu :**
  1. Un résumé texte synthétise les facteurs favorables et défavorables pour chaque équipe.
  2. Les limites et incertitudes sont mentionnées explicitement.
  3. La version du modèle IA et l'horodatage de génération sont accessibles.
  4. L'utilisateur peut interagir avec des questions contextuelles (Premium).
- **Résultat attendu :** L'utilisateur comprend les raisons des probabilités présentées.
- **Règles associées :**
  - L'IA ne peut pas inventer de statistiques, blessures, compositions ou sources.
  - L'IA ne peut pas masquer une donnée manquante.
  - L'IA ne peut pas transformer une hypothèse en certitude.
  - Les données d'entrée sont identifiables.
- **Dépendances :** FR-007 (probabilités), FR-011 (sources)
- **Critères d'acceptation préliminaires :**
  - [ ] Le résumé est fondé uniquement sur les données disponibles.
  - [ ] Les données manquantes sont signalées, pas ignorées.
  - [ ] Aucune affirmation garantissant un résultat n'est générée.
  - [ ] Les sources citées sont réelles et vérifiables.
- **Références :**
  - [Product Overview §10](../08-product-blueprint/01-product-overview.md)
  - [Product Principles §4](../08-product-blueprint/02-product-principles.md)
  - [Functional Domains §8](../08-product-blueprint/10-functional-domains.md)

---

### FR-011 — Affichage des sources et fraîcheur

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** Le Match Center et le résumé Athena affichent la provenance des données et leur fraîcheur.
- **Préconditions :** L'utilisateur consulte le Match Center.
- **Comportement attendu :**
  1. La date de dernière mise à jour des données clés est visible.
  2. Les sources de données sont identifiées.
  3. L'état de disponibilité des données est indiqué (complet, partiel, absent).
- **Résultat attendu :** L'utilisateur peut évaluer la fiabilité des informations présentées.
- **Règles associées :**
  - Masquer l'incertitude réduit la confiance à long terme.
  - La source doit être identifiable, pas seulement mentionnée.
- **Dépendances :** FR-005 (Match Center), FR-010 (résumé Athena)
- **Critères d'acceptation préliminaires :**
  - [ ] La fraîcheur des données est visible sur le Match Center.
  - [ ] Les sources sont identifiées pour les probabilités et les statistiques.
  - [ ] Une donnée partiellement disponible affiche un indicateur d'avertissement.
- **Références :**
  - [Product Principles §8](../08-product-blueprint/02-product-principles.md)
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)

---

### FR-012 — Notifications de base

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** L'utilisateur peut activer des notifications pour les matchs qu'il suit (rappel avant match, début, fin).
- **Préconditions :** L'utilisateur est connecté et a donné son consentement.
- **Comportement attendu :**
  1. L'utilisateur peut activer les notifications depuis le Match Center ou la page d'un favori.
  2. Il choisit le ou les déclencheurs (rappel avant, début, fin).
  3. Il peut désactiver les notifications à tout moment.
  4. Les notifications ne sont pas envoyées pendant les quiet hours définies.
- **Résultat attendu :** L'utilisateur est informé des événements qui l'intéressent, sans spam.
- **Règles associées :**
  - Le consentement est requis et traçable.
  - La déduplication est active (pas de double notification pour le même événement).
  - Un journal de livraison est maintenu.
  - La désactivation est simple et sans friction.
- **Dépendances :** FR-008 (favoris)
- **Critères d'acceptation préliminaires :**
  - [ ] La notification de rappel avant match est envoyée au bon moment.
  - [ ] La désactivation est accessible en un clic.
  - [ ] Aucune notification n'est envoyée sans consentement préalable.
  - [ ] Les quiet hours sont respectées.
- **Références :**
  - [Business Rules §6](../08-product-blueprint/14-business-rules.md)
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)

---

### FR-013 — Connexion et authentification

- **Priorité :** P1
- **Personas :** Free User, Premium User, Administrator
- **Description :** L'utilisateur peut se connecter à son compte de manière sécurisée.
- **Préconditions :** Le compte existe et est confirmé.
- **Comportement attendu :**
  1. L'utilisateur saisit son e-mail et mot de passe.
  2. Le système vérifie les credentials.
  3. En cas d'échec répété, le compte est temporairement verrouillé.
  4. L'utilisateur peut demander une réinitialisation du mot de passe.
  5. Une session sécurisée est créée.
- **Résultat attendu :** L'utilisateur est authentifié et accède à ses fonctions.
- **Règles associées :**
  - Voir OQ-005 pour MFA utilisateurs finaux.
  - Le 2FA est obligatoire pour le Super Administrateur.
  - Les sessions ont une durée de vie définie.
  - Les tentatives d'accès sont loguées.
- **Dépendances :** FR-001 (inscription), FR-021 (niveaux d'accès)
- **Critères d'acceptation préliminaires :**
  - [ ] La connexion avec e-mail/mot de passe fonctionne.
  - [ ] Après N échecs consécutifs, le compte est temporairement verrouillé.
  - [ ] La réinitialisation de mot de passe est fonctionnelle.
  - [ ] La session expire après inactivité.
- **Références :**
  - [User Roles §8, §9](../08-product-blueprint/08-user-roles.md)
  - [Functional Domains §2](../08-product-blueprint/10-functional-domains.md)

---

### FR-014 — Gestion des données manquantes

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** Le produit gère explicitement les situations où des données ne sont pas disponibles pour un match.
- **Préconditions :** Des données sont manquantes ou partiellement disponibles.
- **Comportement attendu :**
  1. Les données manquantes s'affichent avec un indicateur visuel distinct (ex. : « Données non disponibles »).
  2. Le score de confiance est abaissé en cas de données partielles.
  3. Le résumé Athena mentionne explicitement les lacunes.
  4. Aucune valeur zéro ne se substitue à une donnée manquante sans règle explicite.
- **Résultat attendu :** L'utilisateur est informé des limites de l'analyse sans être induit en erreur.
- **Règles associées :**
  - Une donnée manquante reste `null` ou `unknown`, jamais remplacée par zéro sans règle.
- **Dépendances :** FR-005 (Match Center), FR-007 (probabilités)
- **Critères d'acceptation préliminaires :**
  - [ ] Les données manquantes s'affichent avec un indicateur distinct du zéro.
  - [ ] Le score de confiance reflète la qualité des données disponibles.
  - [ ] Le résumé Athena ne présente pas comme certaines des données manquantes.
- **Références :**
  - [Business Rules §2](../08-product-blueprint/14-business-rules.md)
  - [Product Principles §8](../08-product-blueprint/02-product-principles.md)

---

### FR-015 — Gestion des états du match

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** Le produit reflète correctement l'état réel d'un match et respecte les transitions d'états autorisées.
- **Préconditions :** Une source de données fournit l'état du match.
- **Comportement attendu :**
  1. Le Match Center affiche l'état en cours du match.
  2. Les transitions d'état respectent les règles métier.
  3. Les états exceptionnels (postponed, abandoned, suspended) sont gérés et affichés.
- **Résultat attendu :** L'utilisateur voit un état de match cohérent et à jour.
- **Règles associées :**
  - États autorisés : `scheduled`, `delayed`, `postponed`, `cancelled`, `live`, `halftime`, `extra-time`, `penalties`, `suspended`, `abandoned`, `finished`.
  - Transitions interdites : `finished` → `live` ; `cancelled` → `finished` sans correction auditée ; `scheduled` → `halftime`.
- **Dépendances :** FR-005 (Match Center)
- **Critères d'acceptation préliminaires :**
  - [ ] Tous les états autorisés sont représentés visuellement.
  - [ ] Une transition interdite est refusée par le système.
  - [ ] Les états `postponed` et `cancelled` affichent un message clair à l'utilisateur.
- **Références :**
  - [Business Rules §1](../08-product-blueprint/14-business-rules.md)

---

### FR-016 — Signalement d'une erreur

- **Priorité :** P2
- **Personas :** Free User, Premium User
- **Description :** L'utilisateur peut signaler une erreur ou une anomalie dans les données affichées.
- **Préconditions :** L'utilisateur consulte un contenu qui lui semble incorrect.
- **Comportement attendu :**
  1. Un bouton « Signaler » est accessible depuis les données clés.
  2. L'utilisateur choisit une catégorie d'erreur.
  3. Il peut ajouter un commentaire optionnel.
  4. Il reçoit une confirmation et un identifiant de ticket.
  5. Il peut consulter le statut de son signalement.
- **Résultat attendu :** Le signalement est enregistré et traçable.
- **Règles associées :**
  - Les signalements déclenchent un ticket dans le système d'administration.
  - Les corrections importantes conservent l'ancienne valeur, la nouvelle, la raison, la source, l'auteur et la date.
- **Dépendances :** FR-022 — Administration minimale
- **Critères d'acceptation préliminaires :**
  - [ ] Le formulaire de signalement est accessible depuis le Match Center.
  - [ ] Le signalement crée un ticket traçable.
  - [ ] L'utilisateur reçoit une confirmation.
- **Références :**
  - [Business Rules §9](../08-product-blueprint/14-business-rules.md)
  - [User Journeys §8](../08-product-blueprint/09-user-journeys.md)

---

### FR-017 — Profil et préférences utilisateur

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** L'utilisateur peut consulter et modifier son profil et ses préférences.
- **Préconditions :** L'utilisateur est connecté.
- **Comportement attendu :**
  1. L'utilisateur accède à son profil depuis n'importe quelle page.
  2. Il peut modifier son e-mail, son mot de passe, son fuseau horaire et ses préférences de langue.
  3. Il peut gérer ses notifications et consentements.
  4. Il peut supprimer son compte (avec confirmation et délai de grâce).
- **Résultat attendu :** Le profil reflète les préférences actuelles de l'utilisateur.
- **Règles associées :**
  - La suppression d'un compte ne supprime pas immédiatement toutes les données personnelles si une conservation légale est applicable.
  - La modification de l'e-mail déclenche une re-validation.
- **Dépendances :** FR-001 (inscription)
- **Critères d'acceptation préliminaires :**
  - [ ] La modification du mot de passe est fonctionnelle.
  - [ ] La suppression de compte déclenche une confirmation explicite.
  - [ ] Les consentements sont modifiables à tout moment.
- **Références :**
  - [User Roles §3, §4](../08-product-blueprint/08-user-roles.md)
  - [Product Principles §13](../08-product-blueprint/02-product-principles.md)

---

### FR-018 — Gestion de l'abonnement Premium

- **Priorité :** P1
- **Personas :** Free User → Premium User
- **Description :** L'utilisateur peut souscrire à l'offre Premium pour accéder aux fonctions avancées.
- **Préconditions :** L'utilisateur est connecté avec un compte Free.
- **Comportement attendu :**
  1. L'utilisateur est redirigé vers l'offre Premium lorsqu'il tente d'accéder à une fonction verrouillée.
  2. La page de comparaison des offres explique clairement la valeur ajoutée.
  3. Le paiement est sécurisé.
  4. L'accès Premium est déverrouillé immédiatement après confirmation.
  5. L'utilisateur peut gérer et résilier son abonnement sans friction.
- **Résultat attendu :** L'utilisateur accède aux fonctions Premium dès le paiement confirmé.
- **Règles associées :**
  - Les droits sont gérés côté serveur.
  - Une période de grâce est appliquée en cas d'échec de renouvellement.
  - L'accès est maintenu jusqu'à échéance après résiliation.
  - Les quotas sont affichés clairement.
  - Aucun blocage artificiel (dark pattern) ne peut être utilisé pour pousser à l'abonnement.
  - Voir OQ-002 pour la structure tarifaire.
- **Dépendances :** FR-021 (niveaux d'accès)
- **Critères d'acceptation préliminaires :**
  - [ ] L'accès Premium est activé immédiatement après paiement.
  - [ ] La résiliation est accessible sans friction excessive.
  - [ ] L'accès persiste jusqu'à la fin de la période payée après résiliation.
- **Références :**
  - [Business Rules §7](../08-product-blueprint/14-business-rules.md)
  - [User Journeys §5, §9](../08-product-blueprint/09-user-journeys.md)
  - [Product Principles §10](../08-product-blueprint/02-product-principles.md)

---

### FR-019 — Facteurs explicatifs

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** Le Match Center affiche les facteurs qui influencent l'analyse du match, de manière hiérarchisée.
- **Préconditions :** L'utilisateur consulte le Match Center.
- **Comportement attendu :**
  1. Les facteurs favorables et défavorables pour chaque équipe sont listés.
  2. Chaque facteur cite la donnée qui le soutient.
  3. Les facteurs sont classés par importance.
  4. L'utilisateur peut explorer le détail d'un facteur.
- **Résultat attendu :** L'utilisateur comprend pourquoi les probabilités sont ce qu'elles sont.
- **Règles associées :**
  - Un facteur ne peut être affiché que s'il est soutenu par une donnée identifiable.
  - L'IA ne peut pas inventer un facteur.
- **Dépendances :** FR-007 (probabilités), FR-010 (résumé Athena)
- **Critères d'acceptation préliminaires :**
  - [ ] Les facteurs favorables et défavorables sont listés pour chaque équipe.
  - [ ] Chaque facteur cite sa source de données.
  - [ ] Les facteurs sont classés par importance.
- **Références :**
  - [Product Overview §4.5](../08-product-blueprint/01-product-overview.md)
  - [Product Principles §2](../08-product-blueprint/02-product-principles.md)

---

### FR-020 — Gestion des états d'erreur produit

- **Priorité :** P1
- **Personas :** Tous
- **Description :** Le produit gère et affiche de manière claire les erreurs techniques et fonctionnelles.
- **Préconditions :** Une erreur technique ou fonctionnelle se produit.
- **Comportement attendu :**
  1. Les erreurs réseau affichent un message compréhensible et proposent une action.
  2. Les pages indisponibles (404, 503) affichent un message adapté.
  3. Les erreurs de formulaire sont localisées au champ concerné.
  4. Les erreurs critiques sont journalisées et déclenchent une alerte interne.
- **Résultat attendu :** L'utilisateur comprend ce qui s'est passé et sait quoi faire.
- **Règles associées :**
  - Les messages d'erreur ne doivent pas exposer de détails techniques internes.
- **Dépendances :** NFR-006 (observabilité)
- **Critères d'acceptation préliminaires :**
  - [ ] Les erreurs 404 et 503 affichent des pages dédiées.
  - [ ] Les erreurs réseau affichent un message compréhensible.
  - [ ] Les erreurs critiques sont journalisées.
- **Références :**
  - [Blueprint §27 — Error Handling](../08-product-blueprint/27-error-handling.md)

---

### FR-021 — Niveaux d'accès Free et Premium

- **Priorité :** P1
- **Personas :** Free User, Premium User
- **Description :** Le produit applique des restrictions différenciées selon le niveau d'abonnement de l'utilisateur.
- **Préconditions :** L'utilisateur est authentifié.
- **Comportement attendu :**
  1. Les fonctions verrouillées pour le Free User affichent un aperçu et une invitation à passer Premium.
  2. Les quotas du Free User sont indiqués et décrémentés visuellement.
  3. Le passage Premium déverrouille toutes les fonctions concernées immédiatement.
- **Résultat attendu :** La différence de valeur entre Free et Premium est perçue sans frustration artificielle.
- **Règles associées :**
  - Les droits sont toujours vérifiés côté serveur.
  - Voir OQ-001 pour les quotas Free exacts.
  - Aucun dark pattern (fausse urgence, pression émotionnelle) n'est toléré.
- **Dépendances :** FR-018 (abonnement)
- **Critères d'acceptation préliminaires :**
  - [ ] Les restrictions Free s'appliquent côté serveur, pas seulement en interface.
  - [ ] Les invitations à passer Premium expliquent la valeur ajoutée.
  - [ ] Aucune fausse urgence ni pression artificielle n'est affichée.
- **Références :**
  - [User Roles §3, §4](../08-product-blueprint/08-user-roles.md)
  - [Product Principles §10](../08-product-blueprint/02-product-principles.md)

---

### FR-022 — Administration minimale

- **Priorité :** P1
- **Personas :** Administrator, Data Operator, Support Agent
- **Description :** Une interface d'administration minimale permet de gérer les utilisateurs, les fournisseurs, la qualité des données et les incidents.
- **Préconditions :** L'utilisateur possède un rôle d'administration.
- **Comportement attendu :**
  1. L'administrateur peut consulter et gérer les comptes utilisateurs.
  2. Il peut gérer les fournisseurs de données et leur statut.
  3. Il peut consulter les métriques de qualité des données.
  4. Il peut documenter et suivre les incidents.
  5. Il peut activer ou désactiver des feature flags.
- **Résultat attendu :** L'équipe peut opérer le produit sans intervention technique directe pour les opérations courantes.
- **Règles associées :**
  - Toute action sensible est tracée dans un journal d'audit.
  - Les permissions d'administration sont séparées des permissions utilisateur.
- **Dépendances :** FR-013 (authentification)
- **Critères d'acceptation préliminaires :**
  - [ ] La gestion des utilisateurs est fonctionnelle (suspension, modification).
  - [ ] Les métriques de qualité sont consultables par les opérateurs.
  - [ ] Toute action sensible est journalisée.
- **Références :**
  - [MVP Scope §2](../08-product-blueprint/30-mvp-scope.md)
  - [User Roles §7, §8](../08-product-blueprint/08-user-roles.md)

---

## 15. Exigences liées aux données

- Les données sportives (matchs, équipes, compétitions, joueurs) proviennent de fournisseurs externes. Voir OQ-003.
- Toute donnée dispose d'un identifiant stable, d'une date d'ingestion et d'une source identifiable.
- Les dates et heures sont stockées en UTC et affichées selon le fuseau de l'utilisateur. Référence : [Business Rules §8](../08-product-blueprint/14-business-rules.md)
- Les données manquantes sont `null` ou `unknown`, jamais remplacées par zéro sans règle explicite.
- Les corrections importantes conservent l'historique complet (ancienne valeur, nouvelle, raison, source, auteur, date). Référence : [Business Rules §9](../08-product-blueprint/14-business-rules.md)
- La fraîcheur des données est mesurée et affichée.
- Le périmètre sportif initial est le football. Le multi-sports est exclu du MVP.

---

## 16. Exigences liées aux probabilités et modèles

- Les probabilités sont produites par des modèles statistiques et probabilistes indépendants, pas par l'IA générative directement.
- Modèles MVP : Baseline, Poisson, Elo, consensus simple, calibration, simulation limitée. Référence : [MVP Scope §4](../08-product-blueprint/30-mvp-scope.md)
- Chaque calcul de probabilité est versionnée, horodatée et associée à ses données d'entrée identifiables.
- La somme des probabilités est normalisée.
- L'historique des probabilités est immuable (aucune modification rétroactive silencieuse).
- Les performances des modèles sont mesurées : Brier Score, Log Loss, calibration, expected calibration error. Référence : [Success Metrics §10](../08-product-blueprint/04-success-metrics.md)
- Les performances sont segmentées par compétition, saison, marché et version du modèle.

---

## 17. Exigences liées à l'intelligence artificielle

- L'IA conversationnelle (Explainable AI) synthétise, contextualise et explique des résultats calculés. Elle ne les produit pas.
- L'IA ne peut pas : inventer des statistiques, inventer des blessures, fabriquer une probabilité, masquer une donnée manquante, transformer une hypothèse en certitude.
- Les réponses de l'IA doivent citer leurs sources.
- La qualité de l'IA est mesurée : factualité, taux d'hallucination, taux de citation correcte, refus appropriés. Référence : [Success Metrics §11](../08-product-blueprint/04-success-metrics.md)
- La version du modèle IA utilisé est accessible.
- La latence du résumé Athena est mesurée et contrôlée.

---

## 18. Exigences de personnalisation

- L'utilisateur peut personnaliser : équipes favorites, compétitions, alertes, niveau de détail, langue, fuseau horaire.
- Les préférences sont persistées côté serveur (pas uniquement en local).
- Les préférences peuvent être modifiées à tout moment depuis le profil.
- Un utilisateur sans préférences configurées voit une sélection par défaut pertinente.

---

## 19. Exigences de recherche

- La recherche couvre : équipes, matchs, compétitions.
- L'autocomplete fonctionne à partir de 3 caractères.
- Les résultats sont classés par pertinence (correspondance exacte prioritaire).
- La recherche ne retourne pas de résultats hors du périmètre de données disponibles.
- La performance de la recherche est mesurée : p95 < 500 ms. Référence : [Non Functional Requirements §2](../08-product-blueprint/22-non-functional-requirements.md)

---

## 20. Exigences de notifications

- Les notifications MVP couvrent : rappel avant match, début de match, fin de match.
- Le consentement est requis, explicite et traçable avant tout envoi.
- La fréquence est contrôlée pour éviter le spam.
- Des quiet hours configurables sont respectées.
- La déduplication est active.
- Un journal de livraison est maintenu.
- La désactivation est accessible en une action.
- Référence : [Business Rules §6](../08-product-blueprint/14-business-rules.md)

---

## 21. Exigences de comptes et d'accès

- Les rôles du MVP sont : Visiteur, Free User, Premium User, Administrator.
- Tous les droits sont vérifiés côté serveur.
- Le principe du moindre privilège s'applique à tous les rôles.
- Les permissions sont versionnées.
- Les actions sensibles sont auditées.
- La révocation d'accès est immédiate.
- Voir OQ-005 pour le MFA utilisateurs finaux.
- Référence : [User Roles](../08-product-blueprint/08-user-roles.md)

---

## 22. Exigences commerciales initiales

- L'offre Free est accessible sans paiement.
- L'offre Premium déverrouille les analyses complètes, simulations et alertes avancées.
- Les droits sont gérés côté serveur.
- Une période de grâce s'applique en cas d'échec de renouvellement.
- L'accès persiste jusqu'à l'échéance après résiliation.
- Aucun dark pattern n'est toléré dans le tunnel de conversion.
- Voir OQ-002 pour la structure tarifaire exacte.
- Référence : [Business Rules §7](../08-product-blueprint/14-business-rules.md)

---

## 23. Exigences d'administration

- Interface d'administration minimale pour le MVP : gestion des utilisateurs, fournisseurs, qualité des données, incidents.
- Toute action sensible est journalisée avec : acteur, action, horodatage, résultat.
- Les feature flags permettent d'activer ou désactiver des fonctions sans déploiement.
- Les rôles d'administration sont strictement séparés des rôles utilisateur.
- Référence : [User Roles §7, §8, §9](../08-product-blueprint/08-user-roles.md)

---

## 24. Exigences non fonctionnelles

### NFR-001 — Performance

- **Priorité :** P1
- **Description :** Le produit doit répondre rapidement aux interactions principales.
- **Cibles MVP :**
  - API courante p95 < 500 ms
  - Recherche p95 < 500 ms
  - Match Center utilisable en < 2,5 s
  - Interaction principale < 200 ms lorsque locale
- **Référence :** [Non Functional Requirements §2](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-002 — Disponibilité

- **Priorité :** P1
- **Description :** Le produit doit être disponible de manière continue.
- **Cibles MVP :** 99,5 % mensuel hors maintenance annoncée.
- **Cibles V1 :** 99,9 %.
- **Référence :** [Non Functional Requirements §1](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-003 — Fiabilité

- **Priorité :** P1
- **Description :** Les opérations critiques doivent être idempotentes, retryables et cohérentes.
- **Cibles :** Idempotence des ingestions, retries avec backoff, sauvegardes et restauration testée, transactions atomiques.
- **Référence :** [Non Functional Requirements §4](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-004 — Scalabilité

- **Priorité :** P2
- **Description :** L'architecture doit supporter une croissance horizontale et les pics d'audience lors de grands matchs.
- **Cibles :** Croissance horizontale, files de travaux, cache, partitionnement, lecture intensive.
- **Référence :** [Non Functional Requirements §3](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-005 — Maintenabilité

- **Priorité :** P1
- Le système devra appliquer des contrôles statiques adaptés aux technologies retenues.
- Le système devra utiliser des interfaces et contrats explicites.
- Les modules devront avoir des responsabilités limitées et documentées.
- Les règles métier devront être séparées des couches de présentation et d'infrastructure.
- Les composants critiques devront disposer de tests automatisés.
- Les conventions techniques seront définies pendant la phase d'architecture.
- Aucun langage, framework ou outil précis n'est imposé par le PRD.
- **Référence :** [Non Functional Requirements §5](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-006 — Observabilité

- **Priorité :** P1
- **Description :** Le produit doit permettre de diagnostiquer les problèmes rapidement.
- **Cibles :** Logs structurés, métriques, alertes, traces distribuées, tableau de bord opérationnel.
- **Référence :** [Non Functional Requirements §5](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-007 — Sécurité

- **Priorité :** P0
- **Description :** Le produit protège les données des utilisateurs et prévient les accès non autorisés.
- **Cibles :** Authentification sécurisée, autorisation côté serveur, chiffrement en transit (TLS) et au repos, protection contre les injections et XSS, 2FA Super Admin.
- **Référence :** [User Roles §9](../08-product-blueprint/08-user-roles.md)

---

### NFR-008 — Confidentialité

- **Priorité :** P0
- **Description :** Le produit collecte uniquement les données nécessaires et respecte les obligations légales.
- **Cibles :** Base légale définie pour chaque traitement, durée de conservation définie, suppression possible, consentement explicite et modifiable, conformité réglementaire applicable.
- **Référence :** [Product Principles §13](../08-product-blueprint/02-product-principles.md) · [Non Functional Requirements §7](../08-product-blueprint/22-non-functional-requirements.md)

---

### NFR-009 — Responsive et mobile

- **Priorité :** P1
- **Description :** Le produit est utilisable sur desktop, tablette et mobile web.
- **Cibles :** Expérience mobile conçue (pas compressée), navigation tactile, vitesse de consultation optimisée, favoris et alertes accessibles.
- **Référence :** [Product Principles §11](../08-product-blueprint/02-product-principles.md)

---

### NFR-010 — Qualité des données

- **Priorité :** P1
- **Description :** Les données utilisées sont fraîches, complètes et fiables.
- **Métriques suivies :** Fraîcheur médiane, taux de couverture, taux de champs manquants, taux de doublons, taux d'anomalies, taux d'échec fournisseur.
- **Référence :** [Success Metrics §9](../08-product-blueprint/04-success-metrics.md)

---

### NFR-011 — Internationalisation

- **Priorité :** P2
- **Description :** Le produit est conçu pour supporter plusieurs langues sans réécriture.
- **Cibles :** Aucun texte codé en dur, formats de dates internationalisés, fuseaux horaires configurables, devises configurables.
- **Voir :** OQ-004 (langues initiales)
- **Référence :** [Product Principles §16](../08-product-blueprint/02-product-principles.md)

---

### NFR-012 — Traçabilité des modèles

- **Priorité :** P1
- **Description :** Chaque version de modèle probabiliste est versionnée et ses résultats sont traçables.
- **Cibles :** Version du modèle associée à chaque résultat, horodatage, données d'entrée identifiables, historique immuable, performances mesurées.
- **Référence :** [Business Rules §3](../08-product-blueprint/14-business-rules.md) · [Success Metrics §10](../08-product-blueprint/04-success-metrics.md)

---

## 25. Accessibilité

- Les fonctions essentielles sont utilisables au clavier.
- Les fonctions essentielles sont compatibles avec les lecteurs d'écran.
- L'information n'est pas transmise uniquement par la couleur.
- Le contraste est suffisant (WCAG 2.1 AA minimum).
- Les tailles de texte sont adaptables.
- Les animations ne sont pas obligatoires (prefers-reduced-motion respecté).

Référence : [Product Principles §12](../08-product-blueprint/02-product-principles.md) · [Blueprint §23 — Accessibility](../08-product-blueprint/23-accessibility.md)

---

## 26. Sécurité et confidentialité

- Aucun secret n'est stocké en clair dans le dépôt ou les logs.
- Les mots de passe sont hachés avec un algorithme résistant aux attaques par force brute. Le choix de l'algorithme sera défini pendant la phase d'architecture.
- Les communications sont chiffrées en transit (TLS 1.2 minimum).
- Les données sensibles au repos sont chiffrées.
- Les sessions ont une durée de vie définie et révocable.
- Les actions sensibles déclenchent un audit.
- Le 2FA est obligatoire pour le Super Administrateur.
- Le principe du moindre privilège s'applique à tous les rôles.

Référence : [Blueprint §21 — Security Model](../08-product-blueprint/21-security-model.md) · [NFR-007](../02-product-management/product-requirements-document.md#nfr-007--sécurité) · [NFR-008](../02-product-management/product-requirements-document.md#nfr-008--confidentialité)

---

## 27. Mesure du succès

### North Star

> Le nombre d'analyses comprises et jugées utiles par des utilisateurs récurrents.

### Objectif de compréhension MVP

- Au moins 70 % des répondants déclarent mieux comprendre le match après utilisation.

### Indicateurs d'activation

Un utilisateur est activé lorsqu'il réalise dans les sept jours :

1. création de compte ;
2. sélection d'au moins une équipe ou compétition ;
3. consultation d'un Match Center ;
4. consultation d'une explication ;
5. retour lors d'une autre session.

### Indicateurs principaux suivis dès le MVP

| Catégorie | Métriques |
|:---|:---|
| Acquisition | Visiteurs uniques, taux de création de compte |
| Activation | Taux d'activation, abandon par étape |
| Engagement | DAU/WAU/MAU, matchs consultés, explications ouvertes |
| Compréhension | Note « analyse comprise », taux d'ouverture des détails |
| Qualité des données | Fraîcheur médiane, taux de couverture, anomalies |
| Modèles | Brier Score, Log Loss, calibration |
| Technique | Disponibilité, taux d'erreur, p95 API |

Référence : [Success Metrics](../08-product-blueprint/04-success-metrics.md)

---

## 28. Risques

| Risque | Probabilité | Impact | Réponse |
|:---|:---|:---|:---|
| Données insuffisantes ou de mauvaise qualité | Élevée | Élevé | Validation, provenance, indicateurs de fraîcheur, fournisseurs multiples, gestion explicite des données manquantes |
| Résultats probabilistes mal compris | Moyenne | Élevé | Explications, intervalles d'incertitude, langage prudent, distinction probabilité/certitude |
| Dépendance excessive à l'IA générative | Moyenne | Élevé | Calculs déterministes séparés, validation des réponses, limitations explicites |
| Produit trop complexe | Moyenne | Moyen | Divulgation progressive, niveaux de détail, hiérarchie visuelle, parcours guidés |
| Confusion avec un service de paris | Faible | Élevé | Positionnement clair, absence de promesses, avertissements adaptés, conception non casino |
| Fournisseur de données indisponible | Moyenne | Élevé | Fournisseurs multiples (à confirmer, voir OQ-003), gestion des données manquantes |

Référence : [Product Overview §18](../08-product-blueprint/01-product-overview.md)

---

## 29. Hypothèses à valider

Les hypothèses suivantes doivent être testées auprès d'utilisateurs réels avant de les considérer comme vérifiées :

1. les utilisateurs souhaitent une analyse centralisée ;
2. l'explicabilité augmente la confiance ;
3. une présentation progressive permet de servir les débutants et les experts ;
4. le football constitue un périmètre initial suffisamment riche ;
5. les utilisateurs valorisent la comparaison entre modèles et marché ;
6. la personnalisation améliore la rétention ;
7. les alertes contextuelles apportent une valeur durable ;
8. les utilisateurs accepteront un modèle Premium pour les analyses avancées.

Référence : [Product Overview §19](../08-product-blueprint/01-product-overview.md)

---

## 30. Dépendances

| Dépendance | Nature | Statut |
|:---|:---|:---|
| Fournisseur(s) de données sportives | Externe, critique | À identifier — voir OQ-003 |
| Fournisseur de paiement (Stripe ou équivalent) | Externe, critique | À identifier — voir OQ-002 |
| Service d'envoi d'e-mails transactionnels | Externe | À identifier |
| Service de notifications push | Externe | À identifier |
| Infrastructure cloud | Externe | À identifier — hors Phase 1 |
| Modèles probabilistes MVP | Interne | À développer — Phase 2+ |
| Design System | Interne | À créer — Phase 3 |
| Architecture technique | Interne | À définir — Phase 2 |

---

## 31. Contraintes

| Contrainte | Source |
|:---|:---|
| Football uniquement au MVP | [MVP Scope §3](../08-product-blueprint/30-mvp-scope.md) |
| Aucune promesse de gain ou résultat garanti | [Product Principles §3](../08-product-blueprint/02-product-principles.md) |
| Aucun code applicatif en Phase 1 | Contrainte de gouvernance |
| Aucune stack technique définitive avant Phase 2 | Contrainte de gouvernance |
| Documentation en français, noms techniques en anglais | [Règles Antigravity](../../.agents/rules/01-documentation-rules.md) |
| Aucun secret dans le dépôt | [Règles Antigravity](../../.agents/rules/01-documentation-rules.md) |

---

## 32. Questions ouvertes

Les questions ouvertes détectées lors de la rédaction de ce document sont centralisées dans :

[`docs/06-operations/open-questions.md`](../06-operations/open-questions.md)

| Identifiant | Question |
|:---|:---|
| OQ-001 | Quotas exacts du compte Free |
| OQ-002 | Structure tarifaire Premium |
| OQ-003 | Fournisseurs de données sportives |
| OQ-004 | Langue(s) initiale(s) du produit |
| OQ-005 | MFA obligatoire pour les utilisateurs finaux |
| OQ-006 | Périmètre des compétitions couvertes au MVP |

---

## 33. Critères de préparation à la conception (Design Ready)

Le PRD est prêt pour la phase de conception UX/UI lorsque :

- [ ] Les questions ouvertes OQ-001 à OQ-006 ont des réponses provisoires validées.
- [ ] Les User Personas sont rédigés et validés.
- [ ] Les User Stories sont formalisées.
- [ ] Le catalogue des fonctionnalités est priorisé.
- [ ] Les parcours critiques sont documentés dans [User Journeys](../08-product-blueprint/09-user-journeys.md).
- [ ] Les exigences d'accessibilité sont confirmées (WCAG 2.1 AA minimum).
- [ ] Les exigences de responsive sont confirmées (desktop, tablette, mobile web).
- [ ] Le statut du PRD passe de `Brouillon` à `À valider`.

---

## 34. Critères de préparation au développement (Dev Ready)

Le produit est prêt pour le développement lorsque :

- [ ] Le PRD est en statut `Validé`.
- [ ] Les maquettes UX/UI sont validées.
- [ ] L'architecture technique est définie et validée.
- [ ] Les fournisseurs de données sont identifiés (OQ-003).
- [ ] La structure tarifaire est définie (OQ-002).
- [ ] Les modèles probabilistes MVP sont spécifiés.
- [ ] Les critères d'acceptation des exigences P0 et P1 sont finalisés.
- [ ] L'environnement de développement est configuré.
- [ ] Les standards de développement sont définis.

Référence : [Blueprint — Roadmap §1 Phase Foundation](../08-product-blueprint/32-product-roadmap.md)

---

## 35. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Overview](../08-product-blueprint/01-product-overview.md) | Source principale de l'identité et de la proposition de valeur |
| [Product Principles](../08-product-blueprint/02-product-principles.md) | Principes non négociables |
| [Product Vision](../08-product-blueprint/03-product-vision.md) | Horizons 12 mois / 3 / 5 / 10 ans |
| [Success Metrics](../08-product-blueprint/04-success-metrics.md) | Indicateurs de mesure |
| [Domain Map](../08-product-blueprint/05-domain-map.md) | Cartographie des domaines |
| [User Roles](../08-product-blueprint/08-user-roles.md) | Rôles et permissions |
| [User Journeys](../08-product-blueprint/09-user-journeys.md) | Parcours utilisateurs |
| [Functional Domains](../08-product-blueprint/10-functional-domains.md) | Responsabilités des domaines |
| [Features](../08-product-blueprint/13-features.md) | Catalogue des fonctionnalités |
| [Business Rules](../08-product-blueprint/14-business-rules.md) | Règles métier |
| [Non Functional Requirements](../08-product-blueprint/22-non-functional-requirements.md) | Contraintes non fonctionnelles |
| [MVP Scope](../08-product-blueprint/30-mvp-scope.md) | Périmètre exact du MVP |
| [Product Roadmap](../08-product-blueprint/32-product-roadmap.md) | Phases de développement |
| [Open Questions](../06-operations/open-questions.md) | Décisions en attente |

---

## 36. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Première rédaction complète — Phase 1 Product Definition |

---

> **Made in Abyss : Spark by the King**

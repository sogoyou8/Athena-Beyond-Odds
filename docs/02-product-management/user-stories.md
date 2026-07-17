# User Stories

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition

---

## 1. Objet

Ce document définit les récits utilisateurs (User Stories) d'Athena: Beyond Odds.

Chaque histoire décrit une valeur fonctionnelle du point de vue d'un persona cible (défini dans [User Personas](user-personas.md)), appuyée par des critères d'acceptation exploitables pour les phases de conception UI/UX, de test et de développement.

---

## 2. Méthode

Les histoires utilisateurs de ce document ont été formulées à partir des documents validés suivants :
- [Product Requirements Document (PRD)](product-requirements-document.md)
- [User Personas](user-personas.md)
- [MVP Scope](../08-product-blueprint/30-mvp-scope.md)
- [Business Rules](../08-product-blueprint/14-business-rules.md)

Leur écriture suit la méthode INVEST (Indépendante, Négociable, de Valeur, Estimable, Suffisamment petite, Testable).

---

## 3. Conventions

### 3.1 Format standard d'une story
Chaque story est identifiée de manière stable et structurée ainsi :
- **ID :** `US-XXX`
- **Titre :** Intitulé descriptif
- **Récit :** En tant que `[Persona / Rôle]`, je veux `[Action]` afin de `[Bénéfice]`.
- **Exigences PRD associées :** `FR-XXX` ou `NFR-XXX`
- **Critères d'acceptation :** Énoncés sous le format *Given-When-Then* ou sous forme de checklist vérifiable.

### 3.2 Personas et rôles système référencés
- `PER-001` — Amateur de football
- `PER-002` — Utilisateur analytique
- `PER-003` — Créateur de contenu ou journaliste
- `PER-004` — Analyste sportif professionnel
- `PER-005` — Utilisateur intéressé par les probabilités et marchés sportifs
- `PER-006` — Administrateur ou opérateur interne

---

## 4. Epics

Les récits sont regroupés au sein des 16 Epics fonctionnels officiels suivants :

| ID Epic | Nom de l'Epic | Description |
|:---|:---|:---|
| **EP-001** | Compte et accès | Inscription, connexion, sécurité, profil et rôles |
| **EP-002** | Onboarding | Configuration initiale des préférences |
| **EP-003** | Dashboard | Accès centralisé personnalisé |
| **EP-004** | Découverte des matchs | Consultation de la liste des rencontres du jour |
| **EP-005** | Recherche | Recherche globale par saisie semi-automatique |
| **EP-006** | Match Center | Fiche match complète, contexte général de la rencontre |
| **EP-007** | Statistiques et forme | Historique récent et statistiques essentielles |
| **EP-008** | Probabilités | Probabilités estimées, confiance des modèles et consensus |
| **EP-009** | Explainable AI | Résumé explicable et synthèse des facteurs clés par l'IA |
| **EP-010** | Sources et fraîcheur | Traçabilité des sources et indicateurs d'actualisation |
| **EP-011** | Favoris | Gestion des équipes, matchs ou compétitions favoris |
| **EP-012** | Notifications | Configuration et réception des alertes de match |
| **EP-013** | Abonnement Premium | Gestion de l'accès payant et tunnel d'abonnement |
| **EP-014** | Qualité et signalement | Gestion et remontée des anomalies de données |
| **EP-015** | Administration minimale | Outils de supervision internes (comptes, qualité, flux) |
| **EP-016** | Résilience produit | Gestion des erreurs et des états de données exceptionnels |

---

## 5. Stories — Compte et accès

### US-001 — Inscription par e-mail
- **Epic :** EP-001
- **Récit :** En tant que `PER-001`, je veux créer un compte avec mon adresse e-mail afin d'accéder aux fonctionnalités personnalisées d'Athena.
- **Exigence PRD :** [FR-001](product-requirements-document.md#fr-001--inscription-et-création-de-compte)
- **Critères d'acceptation :**
  - **Given** Je suis un visiteur non connecté sur la page d'inscription.
  - **When** Je saisis un e-mail unique et un mot de passe valide, puis je valide.
  - **Then** Mon compte est créé avec le statut "Non vérifié", et un lien de validation m'est envoyé par e-mail.
  - **Given** J'ai reçu l'e-mail de validation.
  - **When** Je clique sur le lien de confirmation.
  - **Then** Mon compte passe au statut "Vérifié" et je peux me connecter comme Free User.

### US-002 — Connexion sécurisée
- **Epic :** EP-001
- **Récit :** En tant que Free ou Premium User, je veux me connecter avec mes identifiants afin d'accéder à mon espace personnel de manière sécurisée.
- **Exigence PRD :** [FR-013](product-requirements-document.md#fr-013--connexion-et-authentification), [NFR-007](product-requirements-document.md#nfr-007--sécurité)
- **Critères d'acceptation :**
  - **Given** Je suis sur la page de connexion.
  - **When** Je saisis mes identifiants corrects.
  - **Then** Je suis redirigé vers mon Dashboard.
  - **Given** Je saisis des identifiants incorrects.
  - **Then** Un message d'erreur clair s'affiche et je reste sur la page.
  - **Given** Je saisis un mot de passe incorrect 5 fois consécutives.
  - **Then** Mon compte est temporairement bloqué et je reçois un e-mail de sécurité.

### US-003 — Profil et préférences utilisateur
- **Epic :** EP-001
- **Récit :** En tant que Free ou Premium User, je veux modifier mes informations et préférences de profil afin de garder mes paramètres de compte à jour.
- **Exigence PRD :** [FR-017](product-requirements-document.md#fr-017--profil-et-préférences-utilisateur)
- **Critères d'acceptation :**
  - **Given** Je suis connecté et sur la page de mon profil.
  - **When** Je modifie ma langue d'interface ou mon fuseau horaire puis j'enregistre.
  - **Then** Mes préférences sont persistées côté serveur et appliquées immédiatement à l'interface.
  - **When** Je clique sur "Supprimer mon compte" et confirme ma décision.
  - **Then** Mon compte est désactivé et programmé pour suppression définitive.

---

## 6. Stories — Onboarding

### US-004 — Séquence d'onboarding initial
- **Epic :** EP-002
- **Récit :** En tant que nouveau `PER-001` connecté, je veux configurer mes préférences lors de ma première connexion afin que mon interface soit adaptée à mes intérêts.
- **Exigence PRD :** [FR-002](product-requirements-document.md#fr-002--onboarding-initial)
- **Critères d'acceptation :**
  - **Given** Je me connecte pour la toute première fois.
  - **When** La séquence d'onboarding démarre.
  - **Then** Je peux configurer : ma langue, mon fuseau horaire, mon niveau d'expertise, et sélectionner mes premières compétitions ou équipes favorites.
  - **When** Je finalise les étapes.
  - **Then** Mes préférences sont enregistrées sur le serveur et je suis redirigé vers mon Dashboard personnalisé.
  - **Then** Un bouton m'autorise à passer ou reporter cette configuration à plus tard.

---

## 7. Stories — Dashboard

### US-005 — Consultation du Dashboard personnalisé
- **Epic :** EP-003
- **Récit :** En tant que `PER-001`, je veux consulter mon Dashboard afin de voir rapidement l'activité des compétitions et équipes que je suis.
- **Exigence PRD :** [FR-003](product-requirements-document.md#fr-003--dashboard-personnalisé)
- **Critères d'acceptation :**
  - **Given** Je suis connecté et j'ai configuré des favoris.
  - **When** J'accède à la page d'accueil (Dashboard).
  - **Then** Je vois en priorité : les matchs du jour de mes compétitions favorites, l'état actualisé de mes équipes suivies, et mes analyses récentes.
  - **Given** Je n'ai configuré aucun favori.
  - **When** J'accède au Dashboard.
  - **Then** Le système m'affiche une sélection par défaut des compétitions et rencontres majeures du jour.

---

## 8. Stories — Matchs du jour

### US-006 — Liste des rencontres du jour
- **Epic :** EP-004
- **Récit :** En tant que `PER-001`, je veux consulter les matchs programmés aujourd'hui afin de choisir les rencontres que je souhaite analyser.
- **Exigence PRD :** [FR-004](product-requirements-document.md#fr-004--consultation-les-matchs-du-jour)
- **Critères d'acceptation :**
  - **Given** Je suis sur le Dashboard ou la page des matchs.
  - **When** Je consulte la liste des matchs du jour.
  - **Then** Les rencontres sont regroupées par compétition, affichant l'heure locale de l'utilisateur, les deux équipes, l'état (scheduled, live, finished) et le score actuel.
  - **When** J'applique un filtre par compétition.
  - **Then** Seules les rencontres de cette compétition sont affichées.

---

## 9. Stories — Recherche

### US-007 — Recherche globale par saisie semi-automatique
- **Epic :** EP-005
- **Récit :** En tant que `PER-002`, je veux rechercher une équipe, une compétition ou un match via un champ unique afin d'accéder directement à sa fiche détaillée.
- **Exigence PRD :** [FR-009](product-requirements-document.md#fr-009--recherche), [NFR-001](product-requirements-document.md#nfr-001--performance)
- **Critères d'acceptation :**
  - **Given** La barre de recherche globale est visible.
  - **When** Je saisis au moins 3 caractères.
  - **Then** L'autocomplete me propose des suggestions pertinentes classées par catégories (Équipes, Matchs, Compétitions) en moins de 500 ms (p95).
  - **When** Je clique sur un résultat proposé.
  - **Then** Je suis redirigé directement vers la fiche correspondante (Match Center, équipe ou compétition).

---

## 10. Stories — Match Center

### US-008 — Accès à la fiche Match Center
- **Epic :** EP-006
- **Récit :** En tant que `PER-001`, je veux ouvrir la fiche d'un match afin de comprendre son contexte général.
- **Exigence PRD :** [FR-005](product-requirements-document.md#fr-005--match-center), [NFR-001](product-requirements-document.md#nfr-001--performance)
- **Critères d'acceptation :**
  - **When** Je clique sur un match dans la liste ou dans la recherche.
  - **Then** La fiche Match Center s'affiche en moins de 2,5 secondes.
  - **Then** Elle affiche l'état réel de la rencontre (par exemple : scheduled, live, finished), le score, l'horaire, le lieu de la rencontre, ainsi que les absences clés identifiées (blessures et suspensions).

---

## 11. Stories — Statistiques et forme

### US-009 — Consultation de la forme récente et des statistiques principales
- **Epic :** EP-007
- **Récit :** En tant que `PER-001`, je veux consulter les statistiques essentielles et la forme récente des deux équipes afin d'évaluer leur dynamique actuelle.
- **Exigence PRD :** [FR-006](product-requirements-document.md#fr-006--forme-et-statistiques)
- **Critères d'acceptation :**
  - **Given** Je consulte le Match Center.
  - **When** Je regarde la section statistiques.
  - **Then** Je vois l'historique des résultats sur les 5 derniers matchs de chaque équipe (forme récente).
  - **Then** Les statistiques clés (buts, possession, tirs cadrés) sont présentées de manière claire et contextualisée (domicile/extérieur).
  - **Given** Je suis un Free User.
  - **Then** Les statistiques avancées (comme xG ou xA) sont masquées par un visuel d'aperçu invitant à l'abonnement.

---

## 12. Stories — Probabilités

### US-010 — Consultation des probabilités et confiance des modèles
- **Epic :** EP-008
- **Récit :** En tant que `PER-005` ou `PER-004`, je veux consulter les probabilités estimées du match afin de comprendre le pronostic statistique des modèles.
- **Exigence PRD :** [FR-007](product-requirements-document.md#fr-007--probabilités), [NFR-012](product-requirements-document.md#nfr-012--traçabilité-des-modèles)
- **Critères d'acceptation :**
  - **Given** Je consulte la section Probabilités du Match Center.
  - **Then** Je vois la répartition en pourcentage pour les issues Victoire Domicile / Match Nul / Victoire Extérieur, dont la somme est obligatoirement égale à 100 %.
  - **Then** Le score de confiance global du consensus s'affiche avec la version des modèles et l'horodatage des calculs.
  - **Given** Je suis Premium User (ou Analyste professionnel `PER-004` avec un rôle Premium).
  - **Then** Je peux déplier la vue pour voir l'accord entre les modèles individuels (consensus) et les intervalles d'incertitude.
  - **Then** Aucune formulation promotionnelle ou promettant un résultat certain n'est affichée (conformément aux règles éthiques).

---

## 13. Stories — Explainable AI

### US-011 — Résumé explicable par l'IA (Explainable AI)
- **Epic :** EP-009
- **Récit :** En tant que `PER-003`, je veux lire une synthèse textuelle générée par Athena afin de comprendre les facteurs explicatifs d'un match.
- **Exigence PRD :** [FR-010](product-requirements-document.md#fr-010--résumé-athena-explainable-ai)
- **Critères d'acceptation :**
  - **Given** Je consulte le Match Center.
  - **When** Je lis le Résumé Athena.
  - **Then** Je dispose d'une explication textuelle listant les facteurs clés favorables et défavorables, s'appuyant uniquement sur les données structurées et validées (pas d'hallucination).
  - **Then** Les limites connues ou incertitudes du match sont explicitement rappelées.
  - **Given** Je suis Free User.
  - **Then** J'accède à une version courte du résumé.
  - **Given** Je suis Premium User.
  - **Then** J'accède au résumé complet et je peux poser des questions contextuelles à l'assistant.

### US-012 — Facteurs clés explicatifs
- **Epic :** EP-009
- **Récit :** En tant que `PER-005`, je veux consulter les facteurs explicatifs hiérarchisés afin de comprendre les raisons de la distribution des probabilités.
- **Exigence PRD :** [FR-019](product-requirements-document.md#fr-019--facteurs-explicatifs)
- **Critères d'acceptation :**
  - **Given** Je suis sur la section Probabilités du Match Center.
  - **When** Je lis la liste des facteurs clés.
  - **Then** Je vois une classification claire des arguments favorables et défavorables pour chaque équipe.
  - **Then** Chaque facteur fait référence à une donnée ou statistique identifiée (ex. : baisse d'efficacité offensive sur les 3 derniers matchs).

---

## 14. Stories — Sources et fraîcheur

### US-013 — Consultation des sources et de l'indicateur de fraîcheur
- **Epic :** EP-010
- **Récit :** En tant que `PER-002` ou `PER-004`, je veux connaître les sources de données utilisées et leur fraîcheur afin d'évaluer la pertinence de l'analyse du match.
- **Exigence PRD :** [FR-011](product-requirements-document.md#fr-011--affichage-des-sources-et-fraîcheur), [NFR-010](product-requirements-document.md#nfr-010--qualité-des-données)
- **Critères d'acceptation :**
  - **Given** Je suis sur la fiche Match Center.
  - **When** Je consulte l'indicateur de fraîcheur.
  - **Then** Le système affiche la date et l'heure de la dernière mise à jour des données (ex. : "Mis à jour il y a 5 min").
  - **Then** Les sources de données tierces utilisées pour générer les probabilités et statistiques sont listées de manière visible.

---

## 15. Stories — Favoris

### US-014 — Gestion des favoris
- **Epic :** EP-011
- **Récit :** En tant que `PER-001`, je veux marquer une équipe, une compétition ou un match comme favori afin de les retrouver en priorité sur mon Dashboard.
- **Exigence PRD :** [FR-008](product-requirements-document.md#fr-008--favoris)
- **Critères d'acceptation :**
  - **Given** Je suis sur le Match Center ou la fiche d'une équipe ou d'une compétition.
  - **When** Je clique sur l'icône "Favori".
  - **Then** L'entité est ajoutée à mes favoris et s'affiche sur mon Dashboard.
  - **When** Je clique à nouveau pour retirer le favori.
  - **Then** L'entité est retirée de mon Dashboard.
  - **Then** Mon historique d'activité reste préservé sur le serveur après retrait.

---

## 16. Stories — Notifications

### US-015 — Configuration et réception des alertes de match
- **Epic :** EP-012
- **Récit :** En tant que `PER-001`, je veux activer des notifications pour les événements de match (rappel, début, fin) afin d'être informé sans devoir rester connecté.
- **Exigence PRD :** [FR-012](product-requirements-document.md#fr-012--notifications-de-base)
- **Critères d'acceptation :**
  - **Given** J'accède aux préférences de notifications d'un match.
  - **When** J'active le rappel de match (par exemple, 30 min avant le coup d'envoi), l'alerte de début ou l'alerte de fin.
  - **Then** Je dois confirmer explicitement mon consentement (Opt-in) si c'est la première fois.
  - **When** L'événement survient et que je ne suis pas dans mes heures de tranquillité (quiet hours).
  - **Then** Je reçois une notification unique (dédupliquée) sur mon canal configuré.
  - **When** Je le souhaite, je peux désactiver toutes les alertes en une seule action simple depuis mon profil.

---

## 17. Stories — Abonnement Premium

### US-016 — Tunnel d'abonnement et déverrouillage Premium
- **Epic :** EP-013
- **Récit :** En tant que Free User, je veux m'abonner à l'offre Premium afin d'accéder immédiatement aux statistiques avancées et aux simulations de match.
- **Exigence PRD :** [FR-018](product-requirements-document.md#fr-018--gestion-de-labonnement-premium), [FR-021](product-requirements-document.md#fr-021--niveaux-daccès-free-et-premium)
- **Critères d'acceptation :**
  - **Given** Je tente d'accéder à une fonctionnalité verrouillée (par exemple, les probabilités détaillées consensus).
  - **When** Je clique sur l'invitation à m'abonner.
  - **Then** Je suis redirigé vers une page claire de tarification, sans compteur d'urgence artificiel ni pression commerciale (pas de dark pattern).
  - **When** Je finalise mon paiement sécurisé.
  - **Then** Mon rôle passe à Premium User et toutes les fonctionnalités Premium sont déverrouillées instantanément sans rechargement forcé de l'application.
  - **When** Je résilie mon abonnement, je conserve mes accès Premium jusqu'à la date d'échéance de la période payée.

---

## 18. Stories — Qualité et signalement

### US-017 — Signalement d'anomalie de données
- **Epic :** EP-014
- **Récit :** En tant que `PER-002`, je veux signaler une incohérence ou une erreur sur une donnée du Match Center afin de contribuer à l'amélioration de la qualité de la plateforme.
- **Exigence PRD :** [FR-016](product-requirements-document.md#fr-016--signalement-dune-erreur)
- **Critères d'acceptation :**
  - **Given** Je consulte une donnée dans le Match Center.
  - **When** Je clique sur le bouton "Signaler une erreur" à côté de celle-ci.
  - **Then** Un formulaire s'ouvre, me demandant de sélectionner la catégorie de l'anomalie et de saisir un commentaire optionnel.
  - **When** Je valide.
  - **Then** Un ticket d'anomalie est généré sur le serveur d'administration et je reçois un e-mail de confirmation avec un numéro de suivi.

---

## 19. Stories — Administration minimale

### US-018 — Supervision et gestion de la plateforme
- **Epic :** EP-015
- **Récit :** En tant que `PER-006`, je veux disposer d'un portail d'administration pour gérer les comptes et surveiller les flux afin d'assurer le support utilisateur et la maintenance opérationnelle.
- **Exigence PRD :** [FR-022](product-requirements-document.md#fr-022--administration-minimale)
- **Critères d'acceptation :**
  - **Given** Je suis connecté avec un rôle `Administrator` ou supérieur.
  - **When** J'accède à l'espace d'administration.
  - **Then** Je peux rechercher des utilisateurs, modifier leur rôle (Free, Premium) ou suspendre un compte.
  - **Then** Toute action de modification sensible est enregistrée dans les journaux d'audit du système.
  - **Then** Je peux consulter la fraîcheur et la qualité des flux de données ingérés sur un tableau de bord dédié.

---

## 20. Stories — Résilience produit

### US-019 — Gestion de l'affichage des données manquantes
- **Epic :** EP-016
- **Récit :** En tant que `PER-002`, je veux que le système indique clairement les données indisponibles plutôt que d'afficher des valeurs par défaut incorrectes afin d'éviter les erreurs d'analyse.
- **Exigence PRD :** [FR-014](product-requirements-document.md#fr-014--gestion-des-données-manquantes)
- **Critères d'acceptation :**
  - **Given** Une statistique ou une absence de joueur n'a pas pu être récupérée ou est indisponible pour une rencontre.
  - **When** Le Match Center est chargé.
  - **Then** Le champ correspondant affiche la mention textuelle ou visuelle "Donnée non disponible" à la place du chiffre.
  - **Then** l'interface indique que l'absence de cette donnée peut réduire la fiabilité ou la complétude de l'analyse.

### US-020 — Résilience aux erreurs produit et transitions interdites
- **Epic :** EP-016
- **Récit :** En tant que `PER-006`, je veux que le système bloque les transitions d'états de match incohérentes et gère proprement les erreurs système afin de garantir l'intégrité de la plateforme.
- **Exigence PRD :** [FR-015](product-requirements-document.md#fr-015--gestion-des-états-du-match), [FR-020](product-requirements-document.md#fr-020--gestion-des-états-derreur-produit)
- **Critères d'acceptation :**
  - **Given** Une mise à jour automatique ou manuelle tente de ramener un match de l'état `finished` à l'état `live`.
  - **Then** Le système bloque l'opération et rejette la transition côté serveur.
  - **Given** Une panne de réseau ou une erreur système 503 survient.
  - **Then** L'interface affiche une page d'erreur claire et compréhensible, sans exposer de détails techniques internes, et enregistre l'incident.

---

## 21. Matrice de traçabilité

Cette matrice fait le lien entre les histoires utilisateurs (User Stories) et les exigences fonctionnelles et non fonctionnelles du PRD.

| ID Story | Titre de la Story | Epic | Exigence PRD | Rôles / Personas |
|:---|:---|:---|:---|:---|
| **US-001** | Inscription par e-mail | EP-001 | FR-001 | `PER-001` |
| **US-002** | Connexion sécurisée | EP-001 | FR-013, NFR-007 | `PER-001`, `PER-002` |
| **US-003** | Profil et préférences utilisateur | EP-001 | FR-017 | `PER-001`, `PER-002` |
| **US-004** | Séquence d'onboarding initial | EP-002 | FR-002 | `PER-001` |
| **US-005** | Consultation du Dashboard personnalisé | EP-003 | FR-003 | `PER-001`, `PER-002` |
| **US-006** | Liste des rencontres du jour | EP-004 | FR-004 | `PER-001` |
| **US-007** | Recherche globale par saisie semi-automatique | EP-005 | FR-009, NFR-001 | `PER-002` |
| **US-008** | Accès à la fiche Match Center | EP-006 | FR-005, NFR-001 | `PER-001` |
| **US-009** | Consultation de la forme récente et des stats | EP-007 | FR-006 | `PER-001`, `PER-002` |
| **US-010** | Consultation des probabilités et confiance | EP-008 | FR-007, NFR-012 | `PER-005`, `PER-004` |
| **US-011** | Résumé explicable par l'IA (Explainable AI) | EP-009 | FR-010 | `PER-003`, `PER-001` |
| **US-012** | Facteurs clés explicatifs | EP-009 | FR-019 | `PER-005` |
| **US-013** | Consultation des sources et de la fraîcheur | EP-010 | FR-011, NFR-010 | `PER-002`, `PER-004` |
| **US-014** | Gestion des favoris | EP-011 | FR-008 | `PER-001` |
| **US-015** | Configuration et réception des alertes | EP-012 | FR-012 | `PER-001` |
| **US-016** | Tunnel d'abonnement et déverrouillage Premium | EP-013 | FR-018, FR-021 | `PER-001` |
| **US-017** | Signalement d'anomalie de données | EP-014 | FR-016 | `PER-002` |
| **US-018** | Supervision et gestion de la plateforme | EP-015 | FR-022 | `PER-006` |
| **US-019** | Gestion de l'affichage des données manquantes | EP-016 | FR-014 | `PER-002` |
| **US-020** | Résilience aux erreurs produit | EP-016 | FR-015, FR-020 | `PER-006` |

---

## 22. Critères de qualité

Une User Story est considérée comme valide et prête pour la phase de design (Design Ready) si elle respecte les critères suivants :

- **Indépendance :** L'histoire peut être planifiée et implémentée sans dépendance technique bloquante vis-à-vis d'une autre story non spécifiée.
- **De valeur :** L'histoire apporte un bénéfice direct identifiable à l'un des personas officiels.
- **Testable :** Les critères d'acceptation décrivent précisément les états attendus avec des exemples vérifiables (Given-When-Then).
- **Faisabilité :** Elle ne requiert aucun développement technique sortant du cadre du MVP défini dans le [MVP Scope](../08-product-blueprint/30-mvp-scope.md).

---

## 23. Hypothèses et limites

### 23.1 Hypothèses à valider
- **Hypothèse à valider :** La syntaxe de description standard *Given-When-Then* est compréhensible par l'ensemble des designers UX/UI et des développeurs impliqués dans le projet.
- **Hypothèse à valider :** Le découpage en 20 Stories couvre de manière exhaustive le périmètre fonctionnel du MVP d'Athena.
- **Hypothèse à valider :** Les personas s'identifient de manière naturelle aux récits proposés dans chaque story correspondante.

### 23.2 Limites
- Les critères de performance précis (comme le temps d'affichage exact en millisecondes) dépendent des contraintes matérielles finales et sont spécifiés dans le PRD (NFR-001).
- Ce document ne traite pas du design visuel ni du détail ergonomique des composants de l'interface utilisateur.

---

## 24. Questions ouvertes

Les questions ouvertes impactant les critères d'acceptation de ces récits sont centralisées dans :
[`docs/06-operations/open-questions.md`](../06-operations/open-questions.md)

Les principales questions associées aux Stories sont :
- **OQ-001 (Quotas Free) :** Impacte le critère de blocage et de décompte visuel de la story **US-016**.
- **OQ-002 (Tarifs Premium) :** Impacte le contenu informatif affiché lors du parcours de la story **US-016**.
- **OQ-003 (Fournisseurs de données) :** Impacte la disponibilité et le format des données répertoriées dans les critères d'acceptation des stories **US-009**, **US-013** et **US-019**.

---

## 25. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Requirements Document](product-requirements-document.md) | Définition des exigences fonctionnelles (FR) |
| [User Personas](user-personas.md) | Profils et identifiants des utilisateurs (`PER-001` à `PER-006`) |
| [MVP Scope](../08-product-blueprint/30-mvp-scope.md) | Périmètre strict des inclusions pour le MVP |
| [Business Rules](../08-product-blueprint/14-business-rules.md) | Règles de transition de match, quotas et exclusions |
| [Open Questions](../06-operations/open-questions.md) | Liste des incertitudes en cours |

---

## 26. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Rédaction initiale — 20 Stories conformes aux 16 Epics, Phase 1 Product Definition |

---

> **Made in Abyss : Spark by the King**

# Phase 3.1 — Critères d'acceptation de la première implémentation frontend Athena

* **Date :** 2026-08-07
* **Responsable :** Fondateur ABYSS
* **Statut :** Critères proposés pour validation
* **Référence :** `88184110dbff27d695728900c0c2635bd8c7d956`

---

## 1. Critères d'acceptation fonctionnels et techniques

Les critères d'acceptation suivants doivent être **strictement satisfaits** lors de l'implémentation de la première tranche d'interface utilisateur :

| ID | Domaine | Intitulé & Description du Critère | Statut attendu |
|---|---|---|---|
| **AC-001** | Chargement | À l'ouverture, l'interface présente une structure stable avec un état de chargement (`LoadingState` squelettes) sans saut de mise en page. | Obligatoire |
| **AC-002** | Données | Sur réponse HTTP 200 non vide de `GET /competitions/FL1/matches`, l'interface affiche la liste des cartes de matchs avec équipes, date/heure UTC, statut `SCHEDULED` et journée. | Obligatoire |
| **AC-003** | État vide | Sur réponse HTTP 200 avec `matches: []`, l'interface affiche le composant `EmptyState` avec le message exact *"Aucun match programmé sur la période disponible."* sans style d'erreur. | Obligatoire |
| **AC-004** | 404 | Sur réponse HTTP 404 (`COMPETITION_NOT_AVAILABLE`), l'interface affiche l'erreur `competitionUnavailable` informant que seule la Ligue 1 FL1 est disponible. | Obligatoire |
| **AC-005** | 429 | Sur réponse HTTP 429 (`PROVIDER_RATE_LIMIT`), l'interface affiche l'avertissement `rateLimited` sans aucun déclenchement de réessai automatique. | Obligatoire |
| **AC-006** | 503 | Sur réponse HTTP 503 (`PROVIDER_UNAVAILABLE`), l'interface affiche l'erreur `providerUnavailable` et propose une action manuelle "Réessayer". | Obligatoire |
| **AC-007** | Réseau | En cas d'échec de connexion réseau navigateur (`TypeError: Failed to fetch`), l'interface affiche l'état `networkUnavailable` distingué d'un HTTP 503 serveur. | Obligatoire |
| **AC-008** | Santé | Si `GET /health` indique un service dégradé, l'interface affiche l'avertissement discret `healthUnavailable` dans l'en-tête sans bloquer l'affichage principal. | Obligatoire |
| **AC-009** | Compétition | Seule la compétition `FL1` (Ligue 1) est représentée comme active dans l'en-tête. Aucune autre compétition réelle n'est sélectionnable. | Obligatoire |
| **AC-010** | Same-Origin | Toutes les requêtes HTTP sont envoyées vers l'origine unique du serveur Express (`/health`, `/competitions/FL1/matches`). Aucune requête directe vers un tiers. | Obligatoire |
| **AC-011** | Confidentialité | Aucun secret (`FOOTBALL_DATA_API_KEY`), aucun token et aucun header d'authentification fournisseur n'apparaît dans le code client ou les requêtes réseau client. | Obligatoire |
| **AC-012** | Thème initial | L'apparence initiale (clair ou sombre) s'adapte automatiquement à la préférence du navigateur/système via `prefers-color-scheme`. | Obligatoire |
| **AC-013** | Bascule thème | Un bouton d'action dans l'en-tête permet d'alterner manuellement entre mode clair et sombre pour la session courante sans compte ni serveur. | Obligatoire |
| **AC-014** | Responsive 360px | L'interface est pleinement lisible et utilisable sur un écran compact de 360 px sans défilement horizontal fonctionnel. | Obligatoire |
| **AC-015** | Responsive 768px | L'interface s'adapte de manière fluide au format tablette 768 px. | Obligatoire |
| **AC-016** | Responsive 1280px | L'interface s'élargit en grille multi-colonnes sur écran desktop 1280 px. | Obligatoire |
| **AC-017** | Clavier | Toutes les actions interactives (bouton bascule thème, bouton réessayer) sont accessibles au clavier (`Tab`, `Space`, `Enter`). | Obligatoire |
| **AC-018** | Focus | Un indicateur de focus visuel conforme aux normes d'accessibilité est présent sur tout élément actif. | Obligatoire |
| **AC-019** | Screen Reader | Les changements d'état (chargement → matchs / erreurs) sont annoncés vocalement via un conteneur `aria-live="polite"`. | Obligatoire |
| **AC-020** | Accessibilité couleur | Aucune information essentielle n'est transmise exclusivement par la couleur. | Obligatoire |
| **AC-021** | Mouvement | Les transitions visuelles respectent la préférence utilisateur `prefers-reduced-motion: reduce`. | Obligatoire |
| **AC-022** | Cible tactile | Tout élément d'action interactive présente une surface cible d'au moins 44 × 44 px. | Obligatoire |
| **AC-023** | Zoom | L'interface demeure parfaitement lisible et utilisable lors d'un zoom de navigateur à 200 %. | Obligatoire |
| **AC-024** | Hors périmètre | Aucun détail de match, compte, auth, Premium, paiement, MFA, prédiction, cote, pari, classement, historique, favori ou notification n'est présent. | Obligatoire |
| **AC-025** | Zero Framework | Aucune dépendance de framework JS (React, Vue, Svelte, Angular) ou de bibliothèque UI (Tailwind, Bootstrap) n'est ajoutée au projet. | Obligatoire |
| **AC-026** | Zero Router | Aucun routeur client ni gestionnaire d'état global n'est introduit. | Obligatoire |
| **AC-027** | Tests | La nouvelle tranche d'interface et de service d'assets est couverte par des tests automatisés déterministes. | Obligatoire |
| **AC-028** | Non-régression | La totalité des 146 tests backend existants sur les 14 fichiers de test continue de réussir sans exception. | Obligatoire |

---

## 2. Matrice d'acceptation États API vs Rendu

| Entrée API / Signal | État Client | Rendu Visuel Attendu | Action Proposée | Annonce Accessible (`aria-live`) | Test Requis |
|---|---|---|---|---|---|
| En cours | `loading` | Squelettes `LoadingState` | Aucune | "Chargement des matchs en cours" | Test d'affichage initial |
| HTTP 200 + `matches[]` | `matches` | Grille/liste `MatchCard` | Aucune | "N matchs disponibles" | Test d'intégration rendu |
| HTTP 200 + `[]` | `empty` | `EmptyState` informatif | Aucune | "Aucun match disponible" | Test cas vide |
| HTTP 404 `COMPETITION_NOT_AVAILABLE` | `competitionUnavailable` | Message compétition | Aucune | "Erreur : compétition non disponible" | Test cas 404 |
| HTTP 429 `PROVIDER_RATE_LIMIT` | `rateLimited` | Bannière d'avertissement | Aucune (pas de retry auto) | "Avertissement : limite atteinte" | Test cas 429 |
| HTTP 503 `PROVIDER_UNAVAILABLE` | `providerUnavailable` | Message d'erreur 503 | Bouton manuel "Réessayer" | "Erreur : service indisponible" | Test cas 503 + réessai |
| `Failed to fetch` | `networkUnavailable` | Message réseau local | Bouton manuel "Réessayer" | "Erreur : connexion réseau" | Test déconnexion |
| `/health` non-200 | `healthUnavailable` | Bannière en-tête dégradée | Aucune | "Information : service dégradé" | Test santé dégradée |

---

## 3. Décisions graphiques finales encore ouvertes

Les éléments graphiques suivants restent **explicitement non décidés** et n'empêchent pas la validation du présent cadrage structurel :

- Palette de couleurs hexadécimales exactes.
- Famille typographique (`font-family`) et fontes exactes.
- Tailles de police en rem/px et poids typographiques exacts.
- Valeurs CSS graphiques exactes pour les rayons de bordure (`border-radius`) et les ombres (`box-shadow`).
- Source vectorielle des icônes fonctionnelles.
- Logotype de marque officiel.

> **Règle d'implémentation :** L'intégration CSS utilisera des variables tokens génériques (ex: `--color-surface-base`, `--font-body`, `--radius-medium`) dont les valeurs pourront être ajustées sans modifier la structure HTML/JS.

---

```text
CRITÈRES D'ACCEPTATION FRONTEND PHASE 3.1 DÉFINIS — VALIDATION DU CADRAGE REQUISE AVANT IMPLÉMENTATION
```

---

> Made in Abyss : Spark by the King

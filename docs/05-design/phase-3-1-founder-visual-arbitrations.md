# Phase 3.1 — Arbitrages visuels du Fondateur ABYSS

* **Date :** 2026-08-07
* **Responsable :** Fondateur ABYSS
* **Statut :** Approuvé par le Fondateur
* **Référence :** `5723698f82dcd9298a1f9e12ba00ddd208de7610`

---

## 1. Contexte et objet

À la suite de la clôture documentaire de la Phase 3.1 (fusion du cadrage et des spécifications UX/UI via les PRs #14 et #15), le Fondateur ABYSS a rendu les arbitrages visuels officiels gouvernant la conception de la plateforme Athena: Beyond Odds.

Le présent document consigne ces décisions. Il établit les principes visuels directeurs pour la future interface utilisateur sans imposer d'implémentation frontend prématurée.

---

## 2. Décisions visuelles approuvées

### 2.1 Direction visuelle générale

* **Choix approuvé :** `OPTION 2 — TABLEAU DE BORD MODERNE`
* **Principes directeurs :**
  - Interface moderne, structurée et sobre.
  - Orientation analytique et professionnelle affirmée.
  - Cartes de match lisibles avec hiérarchie typographique nette.
  - Surélévation subtile des surfaces (`surface.elevated`) avec séparations visuelles contrôlées.
  - Priorité absolue à la lisibilité et à l'accessibilité mobile (Mobile-First).
  - **Exclusions strictes :** Aucune esthétique "casino", aucun habillage de site de pari, aucun sensationnalisme visuel, aucune décoration gratuite, aucune surcharge d'information.

### 2.2 Mode d'apparence (Thème)

* **Choix approuvé :** `OPTION C — SUIVRE LA PRÉFÉRENCE DU SYSTÈME AVEC BASCULE MANUELLE`
* **Principes directeurs :**
  - Prise en charge conceptuelle du mode clair (`light`) et du mode sombre (`dark`).
  - La valeur initiale s'adapte automatiquement à la préférence du système de l'utilisateur (`prefers-color-scheme`).
  - Une bascule manuelle de thème pourra être proposée dans l'interface future.
  - Aucun compte utilisateur ni synchronisation cloud n'est requis pour cette fonctionnalité.
  - *Note :* Les valeurs hexadécimales exactes des palettes claires et sombres ne sont pas encore choisies.

### 2.3 Densité de mise en page

* **Choix approuvé :** `OPTION B — ÉQUILIBRÉE`
* **Principes directeurs :**
  - Espacement intermédiaire permettant une lecture confortable sur tout écran.
  - Absence de densité extrême (style terminal brut) comme d'espacements décoratifs excessifs.
  - Priorité de mise en page ajustée aux références compactes de 360 px (mobile) tout en maintenant une présentation fluide et structurée sur grand écran (1280 px).

### 2.4 Forme générale des composants

* **Choix approuvé :** `OPTION B — LÉGÈREMENT ARRONDIE`
* **Principe token :** `radius.medium`
* **Principes directeurs :**
  - Coins de cartes et de boutons légèrement adoucis pour un aspect applicatif moderne.
  - Ce choix ne fixe aucune valeur CSS absolue en pixels à ce stade (les valeurs en pixels seront définies lors de l'intégration du Design System).

### 2.5 Iconographie

* **Choix approuvé :** `OPTION B — FONCTIONNELLE STANDARD`
* **Principes directeurs :**
  - Emploi d'icônes discrètes et informatives.
  - Utilisation uniquement lorsque l'icône améliore la compréhension (ex. : statut d'erreur, indicateur de santé, date).
  - Aucune icône ne doit transmettre une information essentielle de manière exclusive sans accompagnement textuel ou label accessible.
  - Aucune bibliothèque d'icônes spécifique n'est sélectionnée à ce stade.

### 2.6 Ton rédactionnel des messages

* **Choix approuvé :** `OPTION B — CLAIR, HUMAIN ET TRANSPARENT`
* **Principes directeurs :**
  - Vocabulaire simple, factuel et orienté vers la compréhension.
  - Aucun jargon technique brut (ex. : les codes d'erreur HTTP 404, 429, 503 sont traduits en messages compréhensibles).
  - Pas de ton alarmiste ni de rhétorique commerciale.
  - Erreurs et avertissements orientés vers l'action ou l'explication transparente de l'état des données.

---

## 3. Preservation d'OQ-004

L'adoption d'un ton rédactionnel clair et l'utilisation de textes de travail en français dans les spécifications **ne résolvent pas OQ-004** (*Langue(s) initiale(s) du produit*).

Le statut officiel d'OQ-004 reste **Ouverte**. La stratégie linguistique finale du MVP (monolingue FR, multilingue i18n, etc.) fera l'objet d'un arbitrage ultérieur par le Fondateur.

---

## 4. Éléments graphiques explicitement non décidés

Les arbitrages visuels ci-dessus fixent les principes généraux sans trancher les spécifications graphiques détaillées suivantes, qui restent totalement ouvertes :

```text
Palette de couleurs exacte et valeurs hexadécimales
Famille typographique principale (font-family)
Poids typographiques exacts (font-weight)
Échelle de tailles typographiques finales en px/rem
Valeurs CSS exactes des rayons de bordure (border-radius)
Valeurs CSS exactes des ombres d'élévation (box-shadow)
Bibliothèque d'icônes ou source vectorielle retenue
Logo officiel et identité visuelle de marque détaillée
```

---

## 5. Matrice de synthèse des arbitrages visuels

| Axe d'arbitrage | Option choisie | Description synthétique |
|---|---|---|
| **Direction générale** | **Option 2** | Tableau de Bord Moderne (professionnel, structuré, épuré) |
| **Thème d'apparence** | **Option C** | Détection automatique système + bascule manuelle |
| **Densité visuelle** | **Option B** | Équilibrée (optimisée 360 px mobile & 1280 px desktop) |
| **Forme des composants**| **Option B** | Légèrement arrondie (`radius.medium`) |
| **Iconographie** | **Option B** | Fonctionnelle standard (icônes discrètes et explicites) |
| **Ton rédactionnel** | **Option B** | Clair, humain, factuel et transparent |

---

```text
ARBITRAGES VISUELS PHASE 3.1 APPROUVÉS — DIRECTION GÉNÉRALE FIXÉE, IDENTITÉ DE MARQUE DÉTAILLÉE ENCORE À SPÉCIFIER
```

---

> Made in Abyss : Spark by the King

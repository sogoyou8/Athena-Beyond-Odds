# Cadrage officiel — Phase 3.2 : Match Center analytique initial

**Projet :** Athena Beyond Odds  
**Phase :** 3.2  
**Date :** 2026-08-08  
**Responsable :** Fondateur ABYSS  
**Statut :** Approuvé — cadrage documentaire uniquement, implémentation non autorisée  
**Branche de base :** `architecture/phase-2-technical-design`  
**Commit de référence :** `4305e0e01517dc8e68f892fd2e128322b1607564`  

---

## 1. Contexte après clôture de la Phase 3.1

La Phase 3.1 a permis de valider et de livrer la première tranche frontend d'Athena (serveur Same-Origin Express, HTML5/CSS natif/TypeScript sans framework UI, 9 états UI, réalignement du contrat `ScoreDTO` et gestion défensive des scores `fullTime`). La Phase 3.1 est officiellement clôturée par `DEC-016` (fusion PR #22).

La Phase 3.2 constitue la première étape documentaire de la roadmap historique **Phase 3 — Features**.

---

## 2. Rappel de la vision historique Athena

Athena a pour objectif produit historique d'être une plateforme d'intelligence sportive capable d'analyser objectivement un événement sportif, et non un simple affichage passif de matchs ni un outil promotionnel de paris.

---

## 3. Objectif de la Phase 3.2 : Match Center analytique initial

La Phase 3.2 fait passer Athena de :
```text
[ Liste de matchs read-only (Phase 3.1) ]
                  ↓
[ Match Center analytique initial (Phase 3.2) ]
                  ↓
[ Moteur décisionnel & probabilités explicatives (Phase 4 et +) ]
```

L'objectif principal est de structurer les premières informations analytiques exploitables à partir des données d'événements sportifs et d'établir la base fonctionnelle des futures fonctionnalités d'analyse et d'explication d'Athena.

---

## 4. Définition du Match Center analytique initial

Le **Match Center analytique initial** transforme la carte de match d'un simple conteneur d'affichage d'horaires et d'équipes en un module d'information analytique structuré. Il regroupe les premiers indicateurs contextuels et sportifs permettant à un utilisateur d'évaluer la dynamique et le contexte d'une rencontre.

---

## 5. Distinction stricte Phase 3 / Phase 4 (Decision Engine)

La Phase 3.2 **NE DOIT PAS** implémenter le Decision Engine complet ni de moteur de recommandation de paris.

Sont **strictement exclus** de la Phase 3.2 et réservés aux phases ultérieures (Phase 4+) :
- Recommandation ou ordre de parier
- Score de confiance décisionnel global / Moteur de recommandation
- Calcul opérationnel de la mise de Kelly
- Moteur de recherche de Value Betting / Arbitrage bookmaker complet
- Moteur prédictif probabiliste complet et modèles de Machine Learning (ML)
- Moteur d'apprentissage automatique automatique / entraînement dynamique

La Phase 3.2 se limite à préparer, structurer et présenter les données contextuelles et analytiques brutes qui alimenteront ultérieurement ces moteurs décisionnels.

---

## 6. Inventaire des features historiques candidates et règle de sélection

La documentation historique (PRD, Blueprint) identifie un ensemble de features analytiques potentielles :
1. **Ranking** (Classement et dynamique de position)
2. **Form** (Forme récente des équipes / série de résultats)
3. **Head To Head (H2H)** (Historique direct des confrontations)
4. **Fatigue** (Jours de repos et enchaînement des matchs)
5. **Travel** (Distance et impact des déplacements)
6. **Momentum** (Indicateur de dynamique de jeu)
7. **Market Movement** (Variation des tendances de marché)
8. **Closing Line Value (CLV)** (Valeur de la cote de fermeture)
9. **Bookmaker Trust** (Indice de fiabilité des cotes bookmakers)
10. **Value & Expected Value (EV)** (Calcul d'espérance mathématique)
11. **Kelly & Risk & Variance** (Gestion financière et de risque)
12. **Corrélation** (Analyse d'impacts croisés)

### Règle de sélection de la première tranche analytique :
Toutes ces features ne seront **pas** implémentées simultanément. Le cadrage de la Phase 3.2 exige :
1. L'inventaire des données déjà disponibles dans le modèle normalisé actuel (`Match`, `Score`, `Team`, `Status`).
2. L'identification des données manquantes dans les contrats d'API existants.
3. L'évaluation des features réalisables avec l'architecture actuelle (ex: Forme récente, H2H, Classement si données fournies).
4. La séparation nette entre les features d'information contextuelle (Phase 3.2) et les features financières/probabilistes avancées (Phase 4).
5. La définition de la **plus petite tranche analytique cohérente** (ex: indicateurs de forme et confrontation H2H de base) avant tout développement.

---

## 7. Données actuellement disponibles et données potentiellement manquantes

- **Données actuellement disponibles (Domaine & Client DTO) :** `matchday`, `utcDate`, `status`, `homeTeam` (`name`, `shortName`, `tla`), `awayTeam` (`name`, `shortName`, `tla`), `score` (`fullTime`, `halfTime`).
- **Données potentiellement manquantes pour l'analyse complète :** Historique étendu des matchs précédents (pour calculer la forme), historiques des confrontations directes (H2H), classements actualisés (`standings`), données de cotes historiques/marché.

---

## 8. Nécessité d'un audit de faisabilité technique préalable

Avant toute autorisation d'implémentation de la première tranche analytique, un **audit de faisabilité technique** devra être conduit pour :
- Vérifier si les providers de données sportives actuels (`in-memory` et `football-data.org`) fournissent les endpoints requis sans surcoût ni rupture de quota.
- Évaluer l'impact sur le modèle de domaine normalisé Athena (`src/domain`).

---

## 9. Contraintes d'architecture existante

Toute évolution dans le cadre de la Phase 3.2 devra respecter les principes établis :
- Respect de l'architecture hexagonale et du modèle de domaine normalisé.
- Conservation du principe Same-Origin d'Express (`/health`, `/competitions/...`).
- Zéro framework JS lourd côté client, zéro routeur client complexe.
- Absence d'exposition de secrets ou clés API côté navigateur.

---

## 10. Identité visuelle différée et direction artistique non contraignante

L'identité graphique définitive reste **volontairement différée** et ne bloque pas le cadrage de la Phase 3.2.

**Direction artistique indicative (non contraignante) :**
- Efficacité et lisibilité d'un produit d'information sportive moderne.
- Subtile inspiration des standards d'ergonomie sportive moderne (ex: lisibilité de type Winamax/Flashscore), sans jamais copier ni reproduire l'esthétique des sites de jeux d'argent.
- Ancrage dans l'univers conceptuel propre à Athena (sanctuaire, précision, cosmos, clarté).
- Rendu sobre, moderne, premium et axé en priorité sur la lisibilité des données.

**Restent explicitement ouverts (non figés par DEC-017) :**
- Palette de couleurs hexadécimales exactes.
- Famille typographique (`font-family`), poids et tailles exacts.
- Logo officiel et charte graphique détaillée.
- Valeurs CSS exactes en pixels (`border-radius`, `box-shadow`).
- Source vectorielle des icônes fonctionnelles.

---

## 11. Statut de la Phase 2.9 Niveau 2

La validation **Phase 2.9 Niveau 2** (test réel avec clé API football-data.org) reste **NON BLOQUANTE** pour le cadrage et l'avancement documentaire de la Phase 3.2.
Elle est différée et ne sera exécutée qu'après le 15 août 2026 si une tranche d'implémentation nécessite de valider le comportement avec des données réseau réelles.

---

## 12. Statut des anomalies héritées (A-001, A-002, A-003)

- **A-001 (healthUnavailable dans main-content) :** MINEURE — OUVERTE — NON BLOQUANTE — Conservée dans le backlog technique. Non incluse dans le périmètre fonctionnel de la Phase 3.2.
- **A-002 (Trailing whitespace historique) :** MINEURE — OUVERTE — NON BLOQUANTE — Conservée dans le backlog technique. Non incluse dans le périmètre fonctionnel de la Phase 3.2.
- **A-003 (Rendu score undefined) :** CORRIGÉE ET FERMÉE (PR #21).

---

## 13. Statut des Questions Ouvertes (OQ-001 à OQ-006)

Les questions ouvertes conservent strictement leurs statuts documentaires officiels :
- **OQ-001 (Quotas compte Free) :** Ouverte (non bloquante pour la tranche analytique initiale).
- **OQ-002 (Structure tarifaire Premium) :** Ouverte (non bloquante pour la tranche analytique initiale).
- **OQ-003 (Fournisseurs de données sportives) :** Partiellement résolue (DEC-001/DEC-002).
- **OQ-004 (Langue(s) initiale(s)) :** Ouverte (français utilisé par défaut).
- **OQ-005 (MFA obligatoire) :** Ouverte (non bloquante pour la tranche analytique initiale).
- **OQ-006 (Périmètre compétitions MVP) :** Décision conditionnelle (DEC-001/DEC-002, FL1 actif).

Aucune OQ n'est résolue implicitement par le présent document.

---

## 14. Hors périmètre de la Phase 3.2

Sont strictement exclus de la Phase 3.2 :
- Tout code frontend ou backend (exécutable, scripts ou styles).
- Tout système de compte, authentification, inscription ou MFA.
- Tout système de paiement, d'abonnement ou de monétisation.
- Moteur de recommandation de paris, calcul de mise (Kelly), Value Betting, cote fermée.
- Machine Learning, modèles de prédiction automatique ou moteurs d'apprentissage.

---

## 15. Conditions nécessaires avant le premier code de la Phase 3.2

Aucune écriture de code pour la Phase 3.2 ne sera autorisée sans :
1. La rédaction d'une spécification fonctionnelle et d'un audit de faisabilité technique pour la première tranche analytique du Match Center.
2. Une décision officielle dédiée (**ex: DEC-018**) autorisant explicitement l'implémentation et le périmètre des fichiers modifiables.

---

## 16. Prochaines étapes documentaires

1. Validation et fusion du présent document de cadrage via la Pull Request de la branche `architecture/phase-3-2-match-center-framing`.
2. Rédaction de la spécification détaillée de la première tranche du Match Center analytique (analyse des données et maquettes fonctionnelles).

---

## 17. Verdict documentaire

```text
CADRAGE FONDATEUR PHASE 3.2 DÉFINI — MATCH CENTER ANALYTIQUE INITIAL ET ORIENTATIONS D'INTELLIGENCE SPORTIVE STOPPÉS À LA DOCUMENTATION, IMPLÉMENTATION INTERDITE
```

---

> Made in Abyss : Spark by the King

# Phase 3.7 — Opponent Context / Contexte d'adversité : Clôture formelle (DEC-037)

---

## 1. CONTEXTE ET OBJECTIF DU DOCUMENT

Ce document formalise la **clôture technique, fonctionnelle et documentaire** de la **Phase 3.7** d'ATHENA : **Opponent Context (Contexte d'adversité / Adversaires récents)**.

Cette brique constitue la **sixième brique analytique descriptive** du Match Center, s'insérant dans la chaîne analytique immédiatement après la brique *Dynamique récente (Momentum)*.

---

## 2. HISTORIQUE ET TRAÇABILITÉ DES DÉCISIONS

| Étape | Identifiant / SHA | Date | Statut |
| :--- | :--- | :--- | :--- |
| **Cadrage Produit** | `DEC-035` (PR #46, `211b05b`) | 2026-08-20 | ✅ Approuvé & Fusionné |
| **Gate A Architecte** | Audit 100% lecture seule | 2026-08-20 | ✅ Conforme (0 appel provider supplémentaire) |
| **Conception Technique** | `DEC-036` (PR #47, `748b54e`) | 2026-08-20 | ✅ Approuvé & Fusionné |
| **Audit Rétrospectif PR #47** | Base `748b54e` | 2026-08-20 | ✅ Conforme (2 fichiers doc exacts) |
| **Implémentation** | PR #48 (`a079a2a`) | 2026-08-21 | ✅ Implémenté (3 commits propres) |
| **Fusion Implémentation** | Merge commit `965686f` | 2026-08-21 | ✅ Fusionné sur base |
| **Validation Golden Local** | InMemory FL1 / 2099 | 2026-08-21 | ✅ Conforme aux valeurs API |
| **Validation Chromium Humaine** | Localhost:4575 (Chrome) | 2026-08-21 | ✅ Conforme (Desktop, Mobile, Résilience) |
| **Clôture Phase 3.7** | `DEC-037` (ce document) | 2026-08-21 | ✅ Approuvée |

---

## 3. PÉRIMÈTRE PRODUIT LIVRÉ

### 3.1 Définition métier
- **Nom analytique :** Opponent Context
- **Nom documentaire :** Contexte d'adversité
- **Nom UI :** Adversaires récents
- **Sous-titre UI :** Niveau saisonnier des adversaires affrontés
- **Question métier résolue :** *« Quel était le niveau saisonnier des adversaires rencontrés dans les matchs récents de cette équipe ? »*
- **Nature :** Purement descriptive, déterministe, explicable, non prédictive.
- **Interdictions strictes respectées :** Aucun score de difficulté, aucun rating, aucune classification fort/faible, aucun ajustement automatique de Forme ou Momentum, aucune prédiction de résultat, aucune cote, aucune Value/EV.

### 3.2 Règles contractuelles du domaine
1. **Équipe cible & Saison :** Maximum 5 rencontres récentes de l'équipe cible, au sein de la même compétition et de la même saison.
2. **Statut & Complétude :** Rencontres `FINISHED` avec score `fullTime` complet (`home !== null && away !== null`).
3. **Cutoff temporel strict :** `utcDate < targetMatch.utcDate`. Tri déterministe sur copie : `utcDate DESC` puis `Match.id DESC`.
4. **Profils adversaires :**
   - Évalués à la date du match cible (`utcDate < targetMatch.utcDate`).
   - La rencontre récente est incluse dans le profil de l'adversaire (garantit mathématiquement $\ge 1$ match overall et $\ge 1$ match contextuel).
   - **Profil Overall :** Points par match (`pointsPerMatch`) et Différence de buts par match (`goalDifferencePerMatch`) sur l'ensemble de la saison.
   - **Profil Contextuel :** Points par match et Différence de buts par match selon le rôle de l'adversaire lors de la rencontre récente (`HOME` -> Domicile, `AWAY` -> Extérieur).
5. **Entries & Doublons :** Exactement une entrée par rencontre récente ($\le 5$ entries). Si un adversaire a été affronté deux fois, deux entries distinctes sont conservées.
6. **Agrégats & Pondération :** Agrégats calculés selon la sémantique `MATCH_ENTRY_WEIGHTING` (pondération par rencontre récente, chaque match récent a le même poids dans la moyenne).
7. **Disponibilité & Seuil :**
   - Seuil de disponibilité `AVAILABLE` : $\ge 3$ adversaires **DISTINCTS** évaluables (`evaluatedOpponentSampleSize = Set(opponentTeamId).size >= 3`).
   - Si $< 3$ adversaires distincts : état `INSUFFICIENT_DATA` (tailles d'échantillons numériques renseignées, 4 agrégats à `null`).
   - Si historique inaccessible : état `UNAVAILABLE`.
8. **Précision :** Aucun arrondi dans la couche Domaine. Affichage UI formaté à 2 décimales avec préservation stricte des vrais zéros (`0.00` sans signe `+` ou `-`).

---

## 4. ARCHITECTURE TECHNIQUE LIVRÉE

### 4.1 Composants et Flux
- **`OpponentContextCalculator` :** Service de domaine pur, synchrone, déterministe, sans I/O, sans `Date.now()`, sans mutation d'entrées.
- **Portée des données :** Réutilise directement l'indexation `historyByTeam` (`Map<string, Match[]>`) construite une seule fois dans `ListAnalyticalMatchesUseCase` à partir du flux d'historique partagé de la compétition (`COMPETITION_WIDE`).
- **Endpoints :** Enrichissement transparent du endpoint existant `/competitions/:competitionCode/matches/analysis` (`opponentContext.home` et `opponentContext.away`). Aucun nouvel endpoint créé. Route `/matches` inchangée.

### 4.2 Budgets Réseau & Complexité
- **Appels Application Provider :** 2 appels maximum par requête d'analyse (1 scheduled matches + 1 competition history partagé).
- **Appels Opponent Context supplémentaires :** Exactement **0 appel Application**, **0 requête HTTP**.
- **Plafond HTTP :** $\le 5$ requêtes HTTP (budget d'infrastructure respecté).
- **Absence de N+1 :** $O(1)$ appels réseau.
- **Complexité CPU :** $O(H + 10 \cdot S \cdot K)$ où $H$ est le scan d'indexation, $S \le 5$ matchs récents, $K$ matchs de l'adversaire (borné par les saisons retenues).

---

## 5. TRAÇABILITÉ DE LA GOUVERNANCE

La PR #48 d'implémentation a été fusionnée par le fondateur sur `965686ff21d376a147f27bb62858b33b9b31d65b` avant l'exécution du rapport d'audit pré-fusion formel.

Cette déviation a été immédiatement tracée et auditée :
- `PRE_MERGE_IMPLEMENTATION_AUDIT_OMITTED = YES`
- `RETROSPECTIVE_IMPLEMENTATION_AUDIT = PASS`
- `GOVERNANCE_DEVIATION = NON_BLOCKING`

L'audit rétrospectif approfondi post-fusion a confirmé l'intégrité absolue du dépôt :
- 2 parents de merge réels : `748b54e` (base DEC-036) et `a079a2a` (head implémentation).
- Exactement 8 fichiers modifiés/créés.
- 0 fichier provider/infrastructure modifié.
- 0 fichier package.json / package-lock.json modifié.
- 0 fichier documentaire altéré par la PR #48.
- 0 fixture altérée.

---

## 6. VALIDATION TECHNIQUE, GOLDEN & CHROMIUM

### 6.1 Suite de Tests Automatisés
- **Fichiers de tests :** 28/28 passants.
- **Tests totaux :** 357 passants (357/357).
- **Tests ajoutés Phase 3.7 :** +21 tests (15 unitaires `opponent-context-calculator.test.ts`, 4 intégration `analysis.test.ts`, 2 frontend `render.test.ts`).
- **Tests échoués / désactivés :** 0 / 0.
- **Typechecks & Build :** Server typecheck (0), Client typecheck (0), Build (0).
- **Real calls réseau :** 0.

### 6.2 Validation Golden InMemory Local
Vérification des valeurs exactes sur `http://localhost:4575/competitions/FL1/matches/analysis` :
- **Match 1 (Alpha FC vs Beta United) :**
  - Alpha FC (Home) : `AVAILABLE`, 5 matchs, 4 adversaires distincts. Moyennes : Pts/m = 1.46, Diff/m = +0.29, Contexte terrain = 1.33, Diff/m = +0.22. Doublon Beta United présent (2 entries).
  - Beta United (Away) : `AVAILABLE`, 5 matchs, 4 adversaires distincts. Moyennes : Pts/m = 1.26, Diff/m = -0.16, Contexte terrain = 1.29, Diff/m = -0.21. Doublon Gamma City présent.
- **Match 2 (Gamma City vs Delta Athletic) :**
  - Gamma City (Home) : `AVAILABLE`, 5 matchs, 3 adversaires distincts. Doublons Beta United et Delta Athletic présents.
  - Delta Athletic (Away) : `AVAILABLE`, 5 matchs, 3 adversaires distincts. Vrai zéro validé : `averageContextualOpponentGoalDifferencePerMatch = 0` affiché `0.00` sans signe `+` ni `-`.
- **Match 3 (Epsilon SC vs Zeta Rovers) :**
  - Epsilon SC (Home) : `AVAILABLE`, 4 matchs (< 5), 3 adversaires distincts. Label : `4 matchs récents (3 adversaires distincts)`.
  - Zeta Rovers (Away) : `INSUFFICIENT_DATA`, 0 match, 0 adversaire distinct. Affichage : `Données insuffisantes` (aucun faux zéro, aucun agrégat erroné).

### 6.3 Validation Chromium Humaine
- **Desktop Dark & Light :** Ordre des briques respecté (Adversaires récents après Dynamique récente), contrastes et typographie conformes.
- **Mobile 390×635 :** Rendu lisible, aucun débordement horizontal critique (`HORIZONTAL_OVERFLOW_CRITICAL = NO`).
- **Console DevTools :** 0 erreur fatale JS, 0 exception non gérée, 0 avertissement critique.
- **Network Normal (30s) :** Requêtes locales uniquement (`/health` et `/analysis` uniques), `POLLING = NO`, `EXTERNAL_PROVIDER_VISIBLE = 0`.
- **Network Bloqué (30s) :** Blocage `/analysis` affichant le message d'erreur réseau et le bouton `Réessayer`, `AUTOMATIC_RETRY = NO`, `MANUAL_RETRY_AVAILABLE = YES`.
- **Restauration :** Restauration immédiate et complète des 6 briques après déblocage (`RESTORATION_AFTER_BLOCK = PASS`).

### 6.4 Non-Régression des 5 Briques Antérieures
La présence et l'intégrité visuelle/métier des 5 briques précédentes sont formellement confirmées :
1. Form 5 (`FORM5_NON_REGRESSION = PASS`)
2. Season Strength (`SEASON_STRENGTH_NON_REGRESSION = PASS`)
3. H2H contextualisé (`H2H_NON_REGRESSION = PASS`)
4. Repos & Congestion (`SCHEDULE_LOAD_NON_REGRESSION = PASS`)
5. Momentum / Dynamique récente (`MOMENTUM_NON_REGRESSION = PASS`)

### 6.5 Réserve UX Mineure
- **Code :** `MOBILE_DETAIL_DENSITY = MINOR_NON_BLOCKING`
- **Description :** Sur mobile (390 px), l'enchaînement inline de certains détails d'entry (`Nom + Venue + Global + Métriques`) présente une densité visuelle élevée.
- **Décision :** N'altère ni l'exactitude des données ni la navigabilité. Ne justifie aucune réouverture de code en Phase 3.7. Sera traitée dans une passe de polissage UX globale ultérieure.

---

## 7. CONCLUSION

La **Phase 3.7 « Opponent Context »** est techniquement complète, fonctionnellement validée et formellement clôturée.

Le Match Center dispose désormais de **6 briques analytiques descriptives** robustes, transparentes et sans aucun appel réseau superflu.
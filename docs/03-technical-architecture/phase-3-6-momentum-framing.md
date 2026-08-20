# Phase 3.6 — Cadrage produit « Momentum descriptif / Dynamique récente » (DEC-032)

Date : 2026-08-20
Responsable : Fondateur ABYSS
Statut : APPROUVÉE
Prédécesseurs : DEC-029 (Cadrage Phase 3.5), DEC-030 (Conception technique Phase 3.5), DEC-031 (Clôture Phase 3.5 — SHA `b3783945727bc7ce05febffdd48442267f7c5316`)

---

## 1. Contexte & Définition Produit

La Phase 3.6 introduit dans Athena Beyond Odds la cinquième brique analytique du Match Center : le **Momentum descriptif** (intitulé en interface **« Dynamique récente »**).

### 1.1 Principe directeur & Différenciation fondamentale avec Form 5 (OQ-055 / OQ-057)
- **Form 5** répond à : *« Quels ont été les résultats bruts récents ? »* (séquence chronologique de W/D/L).
- **Momentum** répond à : *« La performance de la période la plus récente diffère-t-elle de la période immédiatement précédente ? »* (variation de rythme entre deux échantillons consécutifs).

Momentum n'est donc en aucun cas une duplication de Form 5 : il compare formellement deux périodes adjacentes distinctes.

### 1.2 Nature strictement descriptive & Interdictions (OQ-056 / OQ-064 / OQ-065 / OQ-081)
La brique est **factuelle, déterministe, explicable et non prédictive**.
- **Scores composites strictement interdits** : aucun `momentumScore`, `confidenceScore`, `advantageScore` (OQ-065).
- **Classifications qualitatives discrètes interdites** : aucun label ou seuil arbitraire `UP`, `DOWN`, `STABLE`, `POSITIVE`, `NEGATIVE`, `hotTeam`, `coldTeam` (OQ-064).
- **Allégations prédictives interdites** : aucune probabilité de victoire, aucune notion de Value, d'EV, de Kelly ni de recommandation de pari (OQ-081).
- Momentum v1 constitue uniquement une métrique descriptive contextuelle et une future feature candidate pour le Decision Engine ultérieur.

---

## 2. Modèle Mathématique & Fenêtres Adaptatives (OQ-058 / OQ-059)

### 2.1 Fenêtres adaptatives de taille égale
Pour éviter d'attendre 10 matchs avant d'activer la brique tout en garantissant une stricte équité d'échantillonnage, Momentum v1 repose sur un système de **deux fenêtres adjacentes de taille égale** :

$$\text{windowSize} = \min\left(5, \left\lfloor \frac{\text{eligibleMatches}}{2} \right\rfloor\right) \quad \text{avec} \quad \text{windowSize} \ge 3$$

| Matchs éligibles disponibles | Fenêtre Récente (`RECENT`) | Fenêtre Précédente (`PREVIOUS`) | Configuration UI | Statut |
|---|---|---|---|---|
| $< 6$ | — | — | — | `INSUFFICIENT_DATA` |
| $6$ ou $7$ | 3 matchs | 3 matchs | **3 vs 3** | `AVAILABLE` |
| $8$ ou $9$ | 4 matchs | 4 matchs | **4 vs 4** | `AVAILABLE` |
| $\ge 10$ | 5 matchs | 5 matchs | **5 vs 5** | `AVAILABLE` |

### 2.2 Ordre chronologique & Non-chevauchement
Après tri déterministe (`utcDate DESC`, tie-break `Match.id DESC`) :
- **`RECENT_WINDOW`** : les $N$ matchs éligibles les plus proches de `targetMatch.utcDate` (positions 1 à $N$).
- **`PREVIOUS_WINDOW`** : les $N$ matchs immédiatement précédents (positions $N+1$ à $2N$).
- **Aucun chevauchement** : aucun match n'appartient simultanément aux deux fenêtres.

---

## 3. Éligibilité des Matchs & Frontière de Saison (OQ-066 / OQ-067 / OQ-068 / OQ-069)

1. **Même compétition** : `match.competitionId === targetMatch.competitionId`.
2. **Même équipe** : `homeTeam.id === teamId || awayTeam.id === teamId`.
3. **Statut terminé** : `match.status === 'FINISHED'`.
4. **Score complet requis** : `score.fullTime.home !== null && score.fullTime.away !== null` (OQ-066, car le calcul des points et de la différence de buts exige les scores réels).
5. **Coupure temporelle stricte** : `match.utcDate < targetMatch.utcDate`.
6. **Saison cible uniquement (`TARGET_SEASON_ONLY`)** : `match.seasonId === targetMatch.seasonId` (OQ-067).
   - **Aucun carryover N-1** : la dynamique sportive ne traverse pas l'intersaison (changement d'effectif, dynamique remise à zéro).
   - Moins de 6 matchs dans la saison courante $\implies$ `INSUFFICIENT_DATA` (OQ-068).
7. **Pas de segmentation Domicile/Extérieur (`OVERALL_ONLY`)** : tous les matchs de l'équipe sont pris en compte, indépendamment du terrain (OQ-069).

---

## 4. Métriques & DTO Conceptuel (OQ-060 / OQ-061 / OQ-062 / OQ-063 / OQ-080)

### 4.1 Métriques par fenêtre
Pour chaque fenêtre (`recent` et `previous`) :
- `sampleSize` : nombre de matchs ($3$, $4$ ou $5$).
- `pointsPerMatch` : $\frac{\text{points}}{\text{sampleSize}}$ (avec Win = 3, Draw = 1, Loss = 0).
- `goalsForPerMatch` : $\frac{\text{goalsFor}}{\text{sampleSize}}$.
- `goalsAgainstPerMatch` : $\frac{\text{goalsAgainst}}{\text{sampleSize}}$.
- `goalDifferencePerMatch` : $\frac{\text{goalsFor} - \text{goalsAgainst}}{\text{sampleSize}}$.

### 4.2 Deltas descriptifs
- `pointsPerMatchDelta` : $\text{recent.pointsPerMatch} - \text{previous.pointsPerMatch}$ (OQ-060).
- `goalDifferencePerMatchDelta` : $\text{recent.goalDifferencePerMatch} - \text{previous.goalDifferencePerMatch}$ (OQ-061).

### 4.3 DTO Conceptuel
```typescript
interface MomentumWindow {
  sampleSize: number;
  pointsPerMatch: number;
  goalsForPerMatch: number;
  goalsAgainstPerMatch: number;
  goalDifferencePerMatch: number;
}

interface MomentumProfile {
  availability: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
  windowSize: number | null;
  recent: MomentumWindow | null;
  previous: MomentumWindow | null;
  pointsPerMatchDelta: number | null;
  goalDifferencePerMatchDelta: number | null;
}
```

### 4.4 Règle des zéros & Disponibilités (OQ-077 / OQ-080)
- En statut `AVAILABLE` : un delta ou un ratio à `0.00` est une **vraie donnée factuelle** valide.
- En statut `INSUFFICIENT_DATA` : tous les champs numériques sont strictement `null` (UI : « Données insuffisantes », aucun faux zéro).
- En statut `UNAVAILABLE` : dégradation locale propre (UI : « Indisponible »), le Match Center et les 4 autres briques restent opérationnels.

---

## 5. Périmètre Exclu en v1 (OQ-070 / OQ-071)

- **Séries / Streaks hors périmètre v1** : aucune série d'invincibilité, de défaites, de clean sheets dans Momentum v1 (OQ-070).
- **Ajustement par la force de l'adversaire exclu** : aucun coefficient de difficulté du calendrier (Strength of Schedule) en v1, reporté après la mise en place d'un Power Rating (OQ-071).

---

## 6. Architecture Cible & Budgets Réseau (OQ-073 / OQ-074 / OQ-075 / OQ-076)

### 6.1 Intention d'utilisation du corpus partagé
- Momentum a pour intention d'exploiter le flux historique mutualisé 3 saisons existant (`provider.getMatches(competitionCode, undefined, undefined, { seasonCount: 3 })`).
- Aucune nouvelle méthode provider, aucun nouveau paramètre dans `HistoryFilter`, aucun nouvel endpoint HTTP.

### 6.2 Budgets cibles maintenus
- `APPLICATION_PROVIDER_INVOCATIONS_MAX = 2`
- `HISTORY_INVOCATIONS = 1`
- `MOMENTUM_EXTRA_HTTP = 0`
- `HTTP_HARD_MAX = 5`
- `N_PLUS_ONE = NO` (Complexité réseau $O(1)$)

> [!IMPORTANT]
> **Statut de faisabilité** : La réutilisation du corpus et le respect des budgets ci-dessus constituent pour l'instant une **contrainte cible**. La preuve formelle de faisabilité sera établie lors du **Gate A technique** après fusion de ce document de cadrage.

### 6.3 Propriétés du `MomentumCalculator` cible
- Service pur, synchrone, déterministe.
- 0 I/O, 0 appel réseau, 0 dépendance temporelle (`Date.now()` proscrit).
- Tri déterministe : `utcDate DESC`, tie-break `Match.id DESC`.

---

## 7. Rendu Frontend Cible (OQ-078 / OQ-079)

- **Titre du bloc** : « Dynamique récente » (intégré dans les cartes de match pour Domicile et Extérieur).
- **Indicateur de fenêtre** : affichage explicite du format actif (ex: `5 vs 5`, `4 vs 4` ou `3 vs 3`).
- **Affichage des métriques** :
  - Points/match : Avant vs Récent et Écart ($\Delta$).
  - Diff. buts/match : Avant vs Récent et Écart ($\Delta$).
  - Optionnel/secondaire : BP/m et BC/m.
- **Sémantique visuelle neutre** : pas de colorisation binaire automatique (vert/rouge) basée sur le simple signe du delta (OQ-079).
- Maintien strict des 9 états globaux frontend existants.

---

## 8. Non-Régressions & Indépendance (OQ-072)

L'introduction de Momentum ne modifie conceptuellement aucune des 4 briques existantes :
1. **Form 5** : inchangée ($N=5$ résultats).
2. **Season Strength** : inchangée (performance globale et contextuelle sur toute la saison).
3. **Head-to-Head** : inchangé (confrontations directes sur 3 saisons).
4. **Repos & Congestion** : inchangé (charge calendaire sur 7/14/28 jours).
5. Route `/matches` inchangée ; seule `/analysis` sera enrichie.

---

## 9. Arbitrages Fondateur Validés (OQ-055 à OQ-081)

| Question Ouverte | Décision Validée |
|---|---|
| **OQ-055** | Nom : « Momentum descriptif » (analytique) / « Dynamique récente » (UI) |
| **OQ-056** | Nature : strictement descriptive, factuelle, déterministe, non prédictive |
| **OQ-057** | Différenciation : comparaison de 2 périodes consécutives (non duplication de Form 5) |
| **OQ-058** | Fenêtres : adaptatives de taille égale (3v3 dès 6 matchs, 4v4 dès 8, 5v5 dès 10) |
| **OQ-059** | Ordre : fenêtres adjacentes, tri `utcDate DESC`, aucun chevauchement |
| **OQ-060** | Métrique maîtresse : `pointsPerMatchDelta = recent.PPM - previous.PPM` |
| **OQ-061** | Métrique secondaire : `goalDifferencePerMatchDelta = recent.GD/m - previous.GD/m` |
| **OQ-062** | Taux buts : exposition de `goalsForPerMatch` et `goalsAgainstPerMatch` par fenêtre |
| **OQ-063** | DTO : `MomentumProfile` à deux sous-structures `MomentumWindow` |
| **OQ-064** | Classification : aucune direction qualitative discrète (`UP`/`DOWN`) en v1 |
| **OQ-065** | Score : aucun score composite (`momentumScore` interdit) |
| **OQ-066** | Éligibilité : `FINISHED`, même compétition, score `fullTime` complet requis |
| **OQ-067** | Saison : `TARGET_SEASON_ONLY`, aucun carryover N-1 |
| **OQ-068** | Seuil minimal : $< 6$ matchs éligibles $\implies$ `INSUFFICIENT_DATA` |
| **OQ-069** | Terrain : `OVERALL_ONLY` en v1 (pas de segmentation domicile/extérieur) |
| **OQ-070** | Streaks : séries hors périmètre Momentum v1 |
| **OQ-071** | Adversaire : aucun ajustement par la force adverse en v1 |
| **OQ-072** | Indépendance : séparation stricte avec Season Strength |
| **OQ-073** | Source : intention de réutilisation intégrale du corpus historique mutualisé |
| **OQ-074** | Budget réseau : $\le 2$ invocations application, hard max $\le 5$ requêtes, 0 extra HTTP |
| **OQ-075** | Service : `MomentumCalculator` pur, déterministe, sans I/O |
| **OQ-076** | Tri : déterministe `utcDate DESC` puis `Match.id DESC` |
| **OQ-077** | Indisponibilité : dégradation locale propre `UNAVAILABLE` sans casser le Match Center |
| **OQ-078** | Frontend : bloc compact « Dynamique récente » avec deltas et taille de fenêtre |
| **OQ-079** | Couleurs : présentation visuelle neutre, pas de code couleur arbitraire |
| **OQ-080** | Zéros : `0.00` autorisé si `AVAILABLE` ; `null` sans faux zéro si `INSUFFICIENT_DATA` |
| **OQ-081** | Décisionnel : aucune probabilité, Value, EV, Kelly ni sélection de pari |

---

## 10. Prochaine Étape

Après fusion de DEC-032 et audit post-fusion :
1. **Gate A — Faisabilité technique Phase 3.6** : audit en lecture seule pour prouver que le corpus mutualisé existant supporte l'extraction de $\ge 10$ matchs par équipe dans la saison courante avec scores complets sans appel provider additionnel.
2. **DEC-033 — Conception technique de Momentum** : spécification technique formelle, algorithmes, indexation et plan de tests.

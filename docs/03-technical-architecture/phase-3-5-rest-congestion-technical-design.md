# Phase 3.5 — Conception technique de Repos & Congestion

## 1. Décision

- **Décision :** DEC-030 — Phase 3.5 — Conception technique de Repos & Congestion
- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Documents de référence :**
  - `docs/03-technical-architecture/phase-3-5-rest-congestion-framing.md` (DEC-029)
  - Gate A — Faisabilité technique Phase 3.5 (`VERDICT: PHASE 3.5 — GATE A CONFORME AVEC CONTRAINTES — DEC-030 AUTORISABLE SANS NOUVEL APPEL PROVIDER`)
- **Conclusion :** Verrouillage de la conception technique détaillée pour la brique « Repos & Congestion ». Aucun code, aucune modification de port/provider, aucun test modifié et aucun real-call ne sont réalisés dans cette étape.

---

## 2. Synthèse architecturale et conformité aux budgets

La conception technique de Repos & Congestion v1 s'inscrit dans la stricte continuité des briques Form 5 (DEC-019), Season Strength (DEC-024) et H2H contextualisé (DEC-027) :

1. **Port provider inchangé :** `SportsDataProvider` et `HistoryFilter` restent **strictement inchangés**. Aucune nouvelle méthode ni aucun nouveau paramètre ne sont créés.
2. **Corpus historique mutualisé :** L'appel unique `provider.getMatches(competitionCode, undefined, undefined, { seasonCount: 3 })` dans `ListAnalyticalMatchesUseCase` alimente conjointement `FormCalculator`, `SeasonStrengthCalculator`, `HeadToHeadCalculator` et le nouveau `ScheduleLoadCalculator`.
3. **Double budget respecté :**
   - Invocations logiques Application : $\le 2$ (1 pour les SCHEDULED + 1 pour l'historique mutualisé).
   - Requêtes HTTP amont : $\le 5$ (Normal = 4, Fallback catalogue = 5).
   - Extra HTTP pour Repos & Congestion : **0**.
4. **Complexité réseau :** **O(1)** indépendante du nombre de cartes Match Center. Aucun N+1.
5. **Composant de domaine pur :** `ScheduleLoadCalculator` est un service de domaine déterministe, sans I/O, sans `Date.now()`, sans mutation d'entrées et provider-neutral.
6. **Optimisation locale (Application-level) :** Indexation locale en mémoire par équipe (`Map<string, Match[]>`) scoped à la requête dans le use case, sans persistance ni état partagé.

---

## 3. Arbitrages sémantiques et temporels verrouillés (MINOR-001 à MINOR-003)

### MINOR-001 — Sémantique de « Jour » (`ELAPSED_COMPLETE_24H_PERIODS_UTC`)

Toutes les durées exprimées en jours dans Repos & Congestion v1 reposent exclusivement sur des **périodes complètes de 24 heures écoulées en temps UTC** :

$$\text{days} = \left\lfloor \frac{\text{laterUtcDate.getTime()} - \text{earlierUtcDate.getTime()}}{86\,400\,000} \right\rfloor$$

- Aucun `Date.now()`.
- Aucune dépendance à la timezone locale ni au calendrier civil local.
- Les fenêtres de congestion temporelle reposent sur des constantes millisecondes strictes :
  - Fenêtre 7 jours : $7 \times 86\,400\,000\text{ ms} = 604\,800\,000\text{ ms}$
  - Fenêtre 14 jours : $14 \times 86\,400\,000\text{ ms} = 1\,209\,600\,000\text{ ms}$
  - Fenêtre 28 jours : $28 \times 86\,400\,000\text{ ms} = 2\,419\,200\,000\text{ ms}$
- Intervalle pour fenêtre $N$ jours : $[\text{targetDate} - N \times 24\text{h}, \text{targetDate}[$ (borne basse incluse, `targetDate` exclue).

### MINOR-002 — Sémantique de `minimumRestDaysInLast14Days` (`INTERVALS_WHOSE_LATER_MATCH_IS_WITHIN_LAST_14_DAYS`)

Un intervalle de repos entre deux matchs consécutifs $(M_{i}, M_{i+1})$ est pris en compte si et seulement si le **match le plus récent de la paire ($M_{i+1}$)** se situe dans la fenêtre des 14 jours :

$$M_{i+1}.\text{utcDate} \in [\text{targetDate} - 14 \times 86\,400\,000, \text{targetDate}[$$

- Le prédécesseur immédiat $M_{i}$ peut donc se situer avant la fenêtre $J-14$ (ex: $M_{i}$ le 5 août, $M_{i+1}$ le 12 août pour un match cible le 20 août $\to$ intervalle éligible).
- Le prédécesseur $M_{i}$ doit respecter les règles générales d'éligibilité (saison cible, ou saison $N-1$ dans la limite carryover $\le 28$ jours).
- Si aucun intervalle éligible n'existe : `minimumRestDaysInLast14Days = null` (pas de fausse valeur sentinelle).

### MINOR-003 — Nullabilité de `shortRest` (`NULL_WHEN_DAYS_SINCE_LAST_MATCH_UNAVAILABLE`)

`shortRest` est strictement conditionné par la disponibilité de `daysSinceLastMatch` :
- Si `daysSinceLastMatch !== null` : `shortRest = (daysSinceLastMatch <= 3)` (donc `0, 1, 2, 3` $\to$ `true`, `4, 5, ...` $\to$ `false`).
- Si `daysSinceLastMatch === null` : `shortRest = null` (interdiction stricte de retourner `false` par défaut en l'absence de donnée).

---

## 4. Politique de frontière de saison et résolution provider-neutral de N-1

### Règle `SEASON_BOUNDARY_WITH_28_DAY_CARRYOVER`

1. **Saison cible ($N$) :** Matchs dont `seasonId === targetMatch.seasonId` $\to$ éligibles sans limite de 28 jours pour `daysSinceLastMatch` (ex: trêve longue de 35 jours au sein de la même saison $\to 35$ jours).
2. **Saison précédente ($N-1$) :** Matchs dont `seasonId === PREVIOUS_SEASON_ID` $\to$ éligibles **uniquement si** :
   $$\text{targetMatch.utcDate.getTime()} - \text{match.utcDate.getTime()} \le 28 \times 86\,400\,000\text{ ms}$$
3. **Saison $N-2$ et antérieures :** Strictement exclues de Repos & Congestion v1.
4. **Aucun fallback réseau :** Aucun appel vers $N-1$ n'est déclenché spécifiquement.

### Résolution provider-neutral de `PREVIOUS_SEASON_ID`

Pour garantir l'indépendance vis-à-vis des identifiants spécifiques des providers (ex: `season-2025` ou `season-fl1-2099`), le parsing de chaînes est formellement interdit.

La résolution locale dans `ScheduleLoadCalculator` s'effectue comme suit :
1. `TARGET_SEASON_ID = targetMatch.seasonId`.
2. Parmi tous les matchs du corpus dont `competitionId === targetMatch.competitionId` et `seasonId !== TARGET_SEASON_ID` et `utcDate < targetMatch.utcDate` :
   - On regroupe les matchs par `seasonId`.
   - On identifie pour chaque `seasonId` son match le plus récent (`max(utcDate)`).
   - La saison dont le match le plus récent est chronologiquement le plus proche de `targetMatch.utcDate` est déclarée **`PREVIOUS_SEASON_ID`**.
3. Tout match appartenant à un autre `seasonId` historique est considéré comme $N-2+$ et ignoré.

---

## 5. Spécification des Value Objects et DTOs

### Contrat `ScheduleLoadProfile`

```typescript
export interface ScheduleLoadProfile {
  readonly availability: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
  readonly daysSinceLastMatch: number | null;
  readonly matchesLast7Days: number | null;
  readonly matchesLast14Days: number | null;
  readonly matchesLast28Days: number | null;
  readonly minimumRestDaysInLast14Days: number | null;
  readonly shortRest: boolean | null;
}
```

### Enrichissement du DTO analytique

```typescript
export interface AnalyticalMatchEntry {
  readonly match: Match;
  readonly form: {
    readonly home: TeamForm;
    readonly away: TeamForm;
  };
  readonly seasonStrength: {
    readonly home: SeasonStrengthProfile;
    readonly away: SeasonStrengthProfile;
  };
  readonly headToHead: HeadToHeadProfile;
  readonly scheduleLoad: {
    readonly home: ScheduleLoadProfile;
    readonly away: ScheduleLoadProfile;
  };
}
```

### Table de disponibilité et états

| État | Condition | `daysSinceLastMatch` | `matchesLast{7,14,28}Days` | `minimumRestDaysInLast14Days` | `shortRest` |
|---|---|:---:|:---:|:---:|:---:|
| `AVAILABLE` | Au moins 1 match éligible pour `daysSinceLastMatch` | `number` ($\ge 0$) | `number` ($\ge 0$) | `number` ou `null` | `boolean` |
| `INSUFFICIENT_DATA` | Aucun match éligible respectant les règles | `null` | `null` | `null` | `null` |
| `UNAVAILABLE` | Échec de récupération du corpus historique | `null` | `null` | `null` | `null` |

*Note sur les zéros réels :* En état `AVAILABLE`, `matchesLast7Days = 0` est une information factuelle valide (*aucun match joué dans les 7 jours*).

---

## 6. Spécification du service de domaine `ScheduleLoadCalculator`

### Signature et contrat

```typescript
export class ScheduleLoadCalculator {
  calculate(
    teamId: string,
    targetMatch: Match,
    historicalMatches: Match[]
  ): ScheduleLoadProfile;
}
```

### Algorithme de calcul déterministe

1. **Filtrage préliminaire de l'équipe :**
   - `m.competitionId === targetMatch.competitionId`
   - `(m.homeTeam.id === teamId || m.awayTeam.id === teamId)`
   - `m.status === 'FINISHED'` (score fullTime `null` accepté)
   - `m.utcDate < targetMatch.utcDate` (exclusion stricte du match cible et du futur)
2. **Identification de `PREVIOUS_SEASON_ID`** selon la règle provider-neutral (§4).
3. **Filtrage saisonnier / carryover :**
   - Si `m.seasonId === targetMatch.seasonId` $\to$ éligible.
   - Si `m.seasonId === PREVIOUS_SEASON_ID` et `(targetMatch.utcDate - m.utcDate) <= 28 * 86_400_000` $\to$ éligible.
   - Sinon $\to$ exclu.
4. **Tri déterministe :**
   - Ordre principal : `utcDate DESC`.
   - Tie-break obligatoire : `Match.id DESC`.
5. **Calcul de `daysSinceLastMatch` :**
   - Si liste éligible vide $\to$ `INSUFFICIENT_DATA` (tous champs `null`).
   - Sinon premier match $M_0 \to \text{daysSinceLastMatch} = \lfloor (\text{target} - M_0.\text{utcDate}) / 86\,400\,000 \rfloor$.
6. **Calcul des fenêtres (7 / 14 / 28 jours) :**
   - `matchesLast7Days` = nombre de matchs avec $\text{utcDate} \ge \text{target} - 7 \times 86\,400\,000$.
   - `matchesLast14Days` = nombre de matchs avec $\text{utcDate} \ge \text{target} - 14 \times 86\,400\,000$.
   - `matchesLast28Days` = nombre de matchs avec $\text{utcDate} \ge \text{target} - 28 \times 86\,400\,000$.
7. **Calcul de `minimumRestDaysInLast14Days` :**
   - Trier les matchs éligibles par `utcDate ASC` (ordre chronologique).
   - Examiner les paires consécutives $(M_i, M_{i+1})$.
   - Si $M_{i+1}.\text{utcDate} \ge \text{target} - 14 \times 86\,400\,000$, calculer $\text{diff} = \lfloor (M_{i+1}.\text{utcDate} - M_i.\text{utcDate}) / 86\,400\,000 \rfloor$.
   - Conserver le minimum des $\text{diff}$. Si aucune paire éligible $\to null$.
8. **Calcul de `shortRest` :** `daysSinceLastMatch <= 3`.

---

## 7. Spécification de l'intégration dans `ListAnalyticalMatchesUseCase`

### Optimisation locale : Indexation en mémoire

Pour maintenir un coût CPU optimal en $O(N)$ sur le use case sans rescanner l'intégralité du corpus pour chaque équipe :
```typescript
const historyByTeam = new Map<string, Match[]>();
for (const m of historicalMatches) {
  if (m.status === 'FINISHED' && m.competitionId === targetCompId) {
    if (!historyByTeam.has(m.homeTeam.id)) historyByTeam.set(m.homeTeam.id, []);
    if (!historyByTeam.has(m.awayTeam.id)) historyByTeam.set(m.awayTeam.id, []);
    historyByTeam.get(m.homeTeam.id)!.push(m);
    historyByTeam.get(m.awayTeam.id)!.push(m);
  }
}
```
*Note :* Cette structure est strictement locale au use case (request-scoped).

### Dégradation gracieuse

En cas d'échec de l'appel historique unique (`historicalMatches === null`) :
- `home` et `away` reçoivent un `ScheduleLoadProfile` avec `availability: 'UNAVAILABLE'` et toutes les métriques à `null`.
- Le Match Center retourne HTTP 200 avec les matchs programmés.

---

## 8. Spécification Frontend & Interface Utilisateur

### Bloc visuel « Repos & congestion »

Pour chaque carte de match programmé, un bloc compact et factuel est ajouté sous la brique H2H.

### Contenu et terminologie (OQ-049 / OQ-050)

- **Mention obligatoire de contextualisation :** `Charge dans cette compétition`.
- **Lignes de métriques par équipe (Home / Away) :**
  - *Dernier match :* `X j` (ou `Données insuffisantes` / `Indisponible`).
  - *Matchs (7 / 14 / 28 j) :* `X / Y / Z`.
  - *Repos min. (14 j) :* `X j` (ou `—` si non applicable).
  - *Badge repos court :* `Repos court` (affiché uniquement si `shortRest === true`).
- **Interdictions formelles dans l'UI :**
  - Aucun mot : *fatigué*, *épuisé*, *frais*, *forme physique*, *blessure*, *score*, *avantage*.
  - Aucun graphique, aucune jauge colorée (rouge/verte).
  - Pas de nouveau statut global frontend (les 9 états existants sont strictement préservés).

---

## 9. Matrice de non-régression et couverture de tests requise

### Tests unitaires Domaine (`ScheduleLoadCalculator`)
1. Pureté et déterminisme ($O(1)$ allocations d'état persistant, zéro I/O, zéro Date.now()).
2. Cas Golden A : dernier match même saison à J-5 $\to 5$ jours, `shortRest = false`.
3. Cas Golden B : dernier match même saison après trêve à J-35 $\to 35$ jours, `shortRest = false`.
4. Cas Golden C : premier match saison N, dernier match N-1 à J-16 $\to 16$ jours, `shortRest = false`.
5. Cas Golden D : premier match saison N, dernier match N-1 à J-82 $\to$ exclu par carryover, `INSUFFICIENT_DATA`.
6. Cas Golden E : saison N-2 exclue systématiquement.
7. Coupure stricte `utcDate < targetMatch.utcDate` (match le jour même à heure égale/postérieure exclu).
8. Matchs `FINISHED` uniquement (`SCHEDULED`, `LIVE`, `POSTPONED`, `CANCELLED` exclus).
9. Match `FINISHED` avec `score.fullTime.home/away = null` accepté et comptabilisé.
10. Matchs d'une autre compétition exclus.
11. Matchs d'autres équipes exclus.
12. Fenêtres exactes : J-7, J-14, J-28 avec bornes basses incluses et `targetDate` exclue.
13. `shortRest` : `0, 1, 2, 3` $\to$ `true` ; `4, 5` $\to$ `false` ; `INSUFFICIENT_DATA` $\to$ `null`.
14. `matchesLast7Days = 0` factuel en état `AVAILABLE`.
15. `minimumRestDaysInLast14Days` avec deux matchs dans J-14.
16. `minimumRestDaysInLast14Days` avec match récent dans J-14 et prédécesseur hors J-14.
17. `minimumRestDaysInLast14Days = null` sans intervalle éligible.
18. Déterminisme du tri et tie-break `Match.id DESC`.
19. Résolution provider-neutral de `PREVIOUS_SEASON_ID` sans parsing de chaînes.

### Tests d'intégration Application (`ListAnalyticalMatchesUseCase`)
20. Invocations provider : exactement 2 invocations logiques.
21. Invocation historique : exactement 1 appel mutualisé (`{ seasonCount: 3 }`).
22. Dégradation gracieuse M-002 : échec de l'historique $\to$ `scheduleLoad = UNAVAILABLE`.
23. Non-régression totale Form 5, Season Strength et H2H.
24. Non-régression de la route `/matches`.
25. Enrichissement propre de `/analysis`.

### Tests Frontend (`render.ts`, `main.ts`)
26. Rendu du bloc Repos & congestion pour Home et Away.
27. Affichage des zéros réels en état `AVAILABLE`.
28. Rendu propre de `INSUFFICIENT_DATA` sans faux zéros.
29. Rendu de `UNAVAILABLE` local sans masquer les autres briques.
30. Présence de la mention « Charge dans cette compétition ».
31. Absence totale de vocabulaire physiologique.
32. Préservation des 9 états globaux frontend.

---

## 10. Traçabilité et validation Fondateur

- **Approbation :** Document de conception technique validé pour la Phase 3.5.
- **Prochaine étape :** Audit pré-fusion documentaire de DEC-030 $\to$ Fusion par `Create a merge commit` $\to$ Audit post-fusion $\to$ Autorisation formelle de l'implémentation par le Fondateur.

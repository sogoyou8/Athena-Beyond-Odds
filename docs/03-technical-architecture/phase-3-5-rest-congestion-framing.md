# Phase 3.5 — Cadrage de Repos & Congestion

## 1. Décision

- **Décision :** DEC-029 — Phase 3.5 — Cadrage de Repos & Congestion
- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Conclusion :** Ouverture officielle de la Phase 3.5 en cadrage produit uniquement. L'implémentation logicielle, les modifications de code, les modifications du provider et les requêtes réseau provider ne sont pas autorisées à ce stade. DEC-030 (conception technique) doit faire l'objet d'un gate séparé après fusion du présent document.

---

## 2. Objectif produit de la Phase 3.5

La Phase 3.5 vise à introduire la quatrième brique analytique du Match Center d'Athena : **Repos & Congestion**.

La brique doit répondre à la question analytique :
> **« À quel rythme de compétition chaque équipe a-t-elle joué récemment, avant ce match ? »**

### Positionnement dans la chaîne analytique d'Athena

| Phase | Brique | Question analytique |
|---|---|---|
| 3.2 | Form 5 | Quels sont les résultats récents de chaque équipe ? |
| 3.3 | Season Strength | Quelle est la performance structurelle de fond sur la saison ? |
| 3.4 | H2H contextualisé | Que montrent les confrontations directes passées entre ces deux équipes ? |
| **3.5** | **Repos & Congestion** | **À quel rythme de compétition chaque équipe a-t-elle joué récemment ?** |

### Ce que Repos & Congestion N'est PAS

La brique ne prétend pas mesurer :
- la fatigue physiologique des joueurs ;
- l'état physique ou médical des effectifs ;
- un avantage ou un désavantage entre les équipes ;
- une probabilité de victoire, de blessure ou de contre-performance.

Ces inférences sont hors périmètre d'Athena Beyond Odds v1 par décision fondatrice (OQ-030).

---

## 3. Nomenclature et terminologie (OQ-029 / OQ-050)

### Nom officiel retenu

**Repos & Congestion** (`REST_AND_CONGESTION`)

Le terme « Fatigue » est formellement rejeté car Athena mesure des faits calendaires observables — jours de repos, densité de matchs, intervalles entre rencontres — et non l'état physiologique direct d'un joueur ou d'un effectif.

### Terminologie autorisée dans l'UI

| Autorisé | Interdit |
|---|---|
| Repos | Fatigué |
| Repos court | Épuisé |
| Matchs récents | Frais |
| Charge calendrier | En forme physiquement |
| Congestion | Risque de blessure |
| `≤ 3 jours de repos` | `fatigueScore` |
| Données insuffisantes | `fitnessScore` |
| | `exhaustionProbability` |
| | `injuryRisk` |
| | `performanceDrop` |

---

## 4. Nature factuelle et interdictions formelles (OQ-030 / OQ-042 / OQ-043)

La brique est strictement :
- **Descriptive** : elle expose des métriques calendaires brutes ;
- **Déterministe** : calcul pur à partir de matchs réels vérifiables ;
- **Explicable** : chaque métrique est directement décomposable ;
- **Non prédictive** : aucun score synthétique ne peut être déduit.

### Scores synthétiques interdits en v1

Les identifiants suivants sont interdits dans l'implémentation, les DTO, les types TypeScript et l'interface :

```
scheduleLoadScore   fatigueScore   congestionScore
restScore           readinessScore confidenceScore
advantageScore      probability    prediction
```

### Comparaison automatique entre équipes interdite (OQ-043)

La brique affiche les deux profils côte à côte. Elle ne produit pas automatiquement de verdict du type *« Équipe A est avantagée »* ou *« Équipe B est plus fatiguée »*. L'interprétation appartient à l'analyste.

---

## 5. Métriques exposées (OQ-031 / OQ-032 / OQ-033 / OQ-034 / OQ-041)

### Métriques par équipe

| Métrique | Définition |
|---|---|
| `daysSinceLastMatch` | Nombre exact de jours entre le dernier match éligible terminé et `targetMatch.utcDate`. Calculé uniquement relativement au match cible — jamais via `Date.now()`. |
| `matchesLast7Days` | Nombre de matchs éligibles terminés dans les 7 jours précédant strictement `targetMatch.utcDate`. |
| `matchesLast14Days` | Idem, fenêtre 14 jours. |
| `matchesLast28Days` | Idem, fenêtre 28 jours. |
| `minimumRestDaysInLast14Days` | Nombre minimum de jours de repos entre deux matchs consécutifs dans la fenêtre des 14 derniers jours. Absent si moins de 2 matchs dans la fenêtre. |
| `shortRest` | `true` si `daysSinceLastMatch <= 3`. Absent si `daysSinceLastMatch` n'est pas calculable. |

### Seuil Repos court (OQ-033)

`shortRest = true` si et seulement si `daysSinceLastMatch <= 3`.

L'interface affiche uniquement le fait : **Repos court** ou **≤ 3 jours de repos**. Elle n'écrit jamais *« équipe fatiguée »*.

### Zéros valides (OQ-053)

Les compteurs de fenêtres (`matchesLast7Days`, `matchesLast14Days`, `matchesLast28Days`) peuvent légitimement être `0`. Contrairement aux faux zéros H2H (Phase 3.4), `0` ici signifie réellement *« aucun match joué dans cette fenêtre »* : c'est une information factuelle valide, pas un état d'erreur.

---

## 6. DTO conceptuel (OQ-041)

Le nom retenu pour le profil de charge est **`ScheduleLoadProfile`**.

```typescript
// Noms conceptuels — les noms TypeScript exacts seront verrouillés dans DEC-030.
interface ScheduleLoadProfile {
  availability: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
  daysSinceLastMatch?: number;
  matchesLast7Days?: number;
  matchesLast14Days?: number;
  matchesLast28Days?: number;
  minimumRestDaysInLast14Days?: number;
  shortRest?: boolean;
}

interface ScheduleLoad {
  home: ScheduleLoadProfile;
  away: ScheduleLoadProfile;
}
```

Le DTO est exposé par équipe (`home` / `away`), sans segmentation `HOME` / `AWAY` / `SAME_VENUE` (OQ-048) : la charge appartient à l'équipe, pas au lieu du match précédent.

---

## 7. Règles d'éligibilité des matchs (OQ-036 / OQ-037 / OQ-054)

### Critères d'inclusion

Un match historique est éligible pour le calcul si :
1. Son statut est `FINISHED` ;
2. Il implique l'équipe concernée (domicile ou extérieur) ;
3. Il appartient à la **même compétition** que le match cible ;
4. Sa date `utcDate` est **strictement antérieure** à `targetMatch.utcDate` (pas d'égalité, pas de futur) ;
5. Il satisfait la **politique de frontière de saison** décrite ci-dessous.

Un score de match complet n'est **pas requis** (OQ-036). Il suffit que le match soit terminé pour comptabiliser une apparition calendaire.

### Politique de frontière de saison (OQ-054 — `SEASON_BOUNDARY_WITH_28_DAY_CARRYOVER`)

La politique retenue est plus précise que « saison courante uniquement » :

| Source | Éligibilité |
|---|---|
| Saison cible (N) | Toujours éligible selon les règles habituelles, même si l'intervalle depuis le dernier match dépasse 28 jours. |
| Saison N-1 | Éligible **uniquement** si `utcDate >= targetMatch.utcDate - 28 jours`. |
| Saison N-2 | **Jamais utilisée** pour Repos & Congestion v1. |

**Pas de fallback provider** : aucun appel réseau supplémentaire vers N-1 n'est déclenché pour trouver un précédent match. Le corpus historique mutualisé (Phase 3.4) peut déjà contenir N, N-1 et N-2 ; `ScheduleLoadCalculator` applique ses règles d'éligibilité localement.

**Règle pour `daysSinceLastMatch`** :
- Dernier match de la saison cible → toujours utilisable pour calculer `daysSinceLastMatch`, même si l'intervalle dépasse 28 jours (ex. : trêve internationale longue) ;
- Dernier match de N-1 → utilisable uniquement s'il se situe à ≤ 28 jours du match cible ;
- Si aucun match précédent ne respecte ces règles → `INSUFFICIENT_DATA`.

**Exemple :**
- Premier match de saison le 10 août, dernier match N-1 le 25 juillet → `daysSinceLastMatch = 16` ✅ pertinent.
- Premier match de saison le 10 août, dernier match N-1 le 20 mai → `daysSinceLastMatch` = `INSUFFICIENT_DATA` ✅ (82 jours d'intersaison ne mesurent pas une charge récente).

---

## 8. Disponibilité et états d'erreur (OQ-038 / OQ-039 / OQ-040)

### Modèle de disponibilité (OQ-040)

Les trois statuts existants sont réutilisés sans création d'un nouveau statut global frontend :

| Statut | Déclencheur |
|---|---|
| `AVAILABLE` | Au moins un match éligible permet de calculer `daysSinceLastMatch`. |
| `INSUFFICIENT_DATA` | Aucun match éligible avant le match cible dans le périmètre retenu (ex. : premier match de saison sans carryover N-1 valide). |
| `UNAVAILABLE` | Le corpus historique n'est pas disponible (erreur provider). |

### Isolation de la dégradation (OQ-039)

En cas de `UNAVAILABLE` pour Repos & Congestion, le Match Center reste affiché. Les briques Form 5, Season Strength et H2H ne sont pas masquées si leurs propres données sont disponibles.

---

## 9. Périmètre compétitif (OQ-035 — `SAME_COMPETITION_ONLY_V1`)

La brique mesure la **charge dans la compétition étudiée uniquement**.

L'interface doit l'indiquer explicitement : *« Charge dans cette compétition »* ou équivalent. Elle ne doit jamais présenter cette métrique comme une mesure de :
- la charge totale de l'équipe ;
- la fatigue globale ;
- le calendrier complet (coupe, Europe, etc.).

Une évolution vers une charge multi-compétitions nécessiterait une nouvelle capacité provider significative. Elle est explicitement hors périmètre v1 et fera l'objet d'un arbitrage Fondateur séparé.

---

## 10. Contraintes architecturales et budgets (OQ-044 / OQ-045 / OQ-046)

### Corpus historique mutualisé (OQ-044)

La Phase 3.5 réutilise le corpus historique partagé établi en Phase 3.4 (`HistoryFilter`, invocations mutualisées). Aucune nouvelle capacité provider n'est créée pour Repos & Congestion v1.

La conception technique (DEC-030) devra **vérifier** que le corpus disponible couvre réellement les fenêtres 7 / 14 / 28 jours et la politique de carryover N-1, avant de confirmer l'absence de nouvel appel.

### Budget provider (OQ-045)

```
APPLICATION_PROVIDER_INVOCATIONS_MAX = 2
```

Aucun nouvel appel logique Application vers le provider n'est autorisé pour Repos & Congestion. La brique doit consommer le corpus déjà mutualisé.

### Interdiction N+1 (OQ-046)

Strictement interdit :
- Appel par équipe ;
- Appel par carte Match Center ;
- Appel par métrique ;
- Appel par fenêtre (7, 14, 28 jours).

Toutes les métriques sont calculées localement à partir du corpus partagé. La complexité réseau reste **O(1)** indépendamment du nombre de cartes.

---

## 11. Périmètre exclu de v1

| Élément | Statut |
|---|---|
| `daysUntilNextMatch` | Hors périmètre v1 — calendrier à venir |
| `futureCongestion` | Hors périmètre v1 |
| `next7DaysFixtures` | Hors périmètre v1 |
| Score synthétique (`scheduleLoadScore`, etc.) | Interdit v1 |
| Segmentation domicile/extérieur/même lieu | Hors périmètre (OQ-048) |
| Multi-compétitions | Hors périmètre v1 (OQ-035) |
| Saison N-2 | Hors périmètre (OQ-054) |
| Jauge rouge/verte | Hors périmètre UI v1 |
| Graphique de charge | Hors périmètre UI v1 |

---

## 12. Frontend (OQ-049)

Un bloc local conceptuel **Repos & Congestion** est ajouté pour chaque carte Match Center.

### Contenu par équipe

- Jours depuis le dernier match ;
- Nombre de matchs sur 7 jours ;
- Nombre de matchs sur 14 jours ;
- Nombre de matchs sur 28 jours ;
- Repos minimum récent (si calculable) ;
- Mention **Repos court** si `shortRest = true`.

### Contraintes UI v1

- Pas de graphique ;
- Pas de jauge rouge/verte ;
- Pas de score synthétique ;
- Pas de comparaison automatique entre équipes ;
- Pas de nouvel état global frontend.

---

## 13. Séparation des briques (OQ-051 / OQ-052)

| Brique | Question | Lien avec Repos & Congestion |
|---|---|---|
| Form 5 | Quels résultats récents ? | Indépendant — aucun résultat sportif dans le calcul de charge |
| Season Strength | Performance structurelle de fond ? | Indépendant |
| H2H | Que s'est-il passé entre ces équipes ? | Indépendant — H2H non utilisé pour calculer la charge |
| **Repos & Congestion** | À quel rythme ont-ils joué ? | — |

---

## 14. Arbitrages Fondateur verrouillés (OQ-029 à OQ-054)

| Arbitrage | Code | Décision |
|---|---|---|
| OQ-029 | `REST_AND_CONGESTION` | Nom officiel : Repos & Congestion (et non Fatigue) |
| OQ-030 | `DESCRIPTIVE_ONLY` | Nature : descriptive / déterministe / explicable / non prédictive |
| OQ-031 | `DAYS_SINCE_LAST_MATCH` | Unité principale : jours depuis le dernier match éligible |
| OQ-032 | `WINDOWS_7_14_28` | Fenêtres de densité récente : 7, 14, 28 jours |
| OQ-033 | `SHORT_REST_THRESHOLD_3_DAYS` | `shortRest = true` si `daysSinceLastMatch <= 3` |
| OQ-034 | `RAW_METRICS_NO_COMPOSITE_SCORE` | Métriques brutes, pas de score de congestion |
| OQ-035 | `SAME_COMPETITION_ONLY_V1` | Même compétition uniquement, mentionné explicitement dans l'UI |
| OQ-036 | `FINISHED_SCORE_NOT_REQUIRED` | Statut `FINISHED` suffit, score de match non requis |
| OQ-037 | `STRICT_TARGET_CUTOFF` | `utcDate < targetMatch.utcDate`, jamais `Date.now()` |
| OQ-038 | `INSUFFICIENT_DATA` | Aucun match éligible → `INSUFFICIENT_DATA`, pas de valeur artificielle |
| OQ-039 | `LOCAL_UNAVAILABLE` | Erreur provider → `UNAVAILABLE`, briques indépendantes préservées |
| OQ-040 | `REUSE_EXISTING_AVAILABILITY_MODEL` | Statuts `AVAILABLE` / `INSUFFICIENT_DATA` / `UNAVAILABLE` réutilisés |
| OQ-041 | `SCHEDULE_LOAD_PROFILE` | DTO : `ScheduleLoadProfile` avec les 6 métriques listées |
| OQ-042 | `NO_SYNTHETIC_SCORE` | Scores composites interdits en v1 |
| OQ-043 | `NO_AUTOMATIC_ADVANTAGE` | Deux profils côte à côte, l'utilisateur interprète |
| OQ-044 | `REUSE_SHARED_HISTORY_CORPUS` | Corpus mutualisé Phase 3.4 réutilisé (à vérifier en DEC-030) |
| OQ-045 | `NO_ADDITIONAL_APPLICATION_PROVIDER_CALL` | Budget maintenu : ≤ 2 invocations Application |
| OQ-046 | `O1_NETWORK_COMPLEXITY` | N+1 strictement interdit |
| OQ-047 | `PAST_LOAD_ONLY_V1` | Calendrier futur hors périmètre v1 |
| OQ-048 | `NO_VENUE_SEGMENTATION` | Pas de segment domicile/extérieur/même lieu |
| OQ-049 | `COMPACT_FACTUAL_UI` | UI factuelle compacte, pas de graphique ni jauge |
| OQ-050 | `NO_PHYSIOLOGICAL_CLAIMS` | Terminologie calendaire uniquement, pas de claims physiologiques |
| OQ-051 | `FORM_AND_LOAD_SEPARATE` | Form 5 et Repos & Congestion entièrement séparés |
| OQ-052 | `H2H_AND_LOAD_SEPARATE` | H2H et Repos & Congestion entièrement séparés |
| OQ-053 | `ZERO_COUNTS_ARE_VALID_WHEN_HISTORY_EXISTS` | `0` dans les fenêtres est une donnée factuelle valide (≠ faux zéro H2H) |
| OQ-054 | `SEASON_BOUNDARY_WITH_28_DAY_CARRYOVER` | Saison cible + N-1 dans les 28 jours ; N-2 exclu ; pas de fallback provider |

---

## 15. Prochaine étape autorisée

- **DEC-030** : Conception technique de Repos & Congestion (gate séparé, après fusion du présent document).
- DEC-030 devra prouver que le corpus historique mutualisé Phase 3.4 couvre réellement les fenêtres 7 / 14 / 28 jours et la politique de carryover N-1 (`SEASON_BOUNDARY_WITH_28_DAY_CARRYOVER`) sans requérir de nouvel appel provider.

**Interdit jusqu'à ouverture de DEC-030 :**
- Toute modification du code source ;
- Toute modification du provider ou de l'adaptateur ;
- Tout appel réseau réel.

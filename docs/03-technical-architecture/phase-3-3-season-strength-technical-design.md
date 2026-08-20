# Phase 3.3 — Conception technique du profil de force saisonnier

## 1. Décision

- **Décision :** DEC-024 — Phase 3.3 — Conception technique du profil de force saisonnier
- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Portée :** Conception technique détaillée, contrats d'interfaces, règles de calcul déterministes et résolution formelle des questions ouvertes (OQ-007 à OQ-015) de la Phase 3.3. **L'implémentation logicielle n'est pas autorisée avant la fusion et l'audit post-fusion de cette décision.**

---

## 2. Résolution formelle des Questions Ouvertes (OQ-007 à OQ-015)

Conformément aux arbitrages approuvés par le Fondateur, les questions ouvertes définies dans DEC-023 sont résolues comme suit pour le premier incrément :

| Question Ouverte | Statut | Résolution officielle arrêtée |
| :--- | :--- | :--- |
| **OQ-007 (Classement / seasonRank)** | **RESOLVED** | **Aucun `seasonRank` dans la v1.** Les disparités de règles selon les ligues et l'absence de nécessité immédiate pour situer la force brute motivent son exclusion du premier incrément. |
| **OQ-008 (Type de Ranking)** | **RESOLVED** | **Différé.** Le choix entre classement officiel de la ligue et ranking interne Athena est différé avec le module de classement. |
| **OQ-009 (Règles de départage)** | **RESOLVED** | **Différé.** Aucune règle de départage universelle (*tie-break*) n'est inventée en v1. |
| **OQ-010 (Seuil de représentativité)** | **RESOLVED** | **Aucun seuil arbitraire de masquage.** 0 match terminé = `INSUFFICIENT_DATA` ; $\ge 1$ match terminé = calculable (`AVAILABLE`). La taille d'échantillon réelle (`sampleSize`) est explicitement exposée. |
| **OQ-011 (Arrondis & Précision)** | **RESOLVED** | **Calcul interne exact sans arrondi.** Les ratios (`pointsPerMatch`, `goalsForPerMatch`, `goalsAgainstPerMatch`) sont formatés à **2 décimales** exclusivement dans la couche de présentation (UI / DTO de rendu). |
| **OQ-012 (Périmètre d'affichage des splits)** | **RESOLVED** | **Profil global (`overall`) + split contextualisé (`contextual`) uniquement.** Pour l'équipe recevante : split Domicile (`HOME`). Pour l'équipe visiteuse : split Extérieur (`AWAY`). |
| **OQ-013 (Sélection des métriques)** | **RESOLVED** | **Noyau métrique strict de 11 champs.** Aucune métrique dérivée ou superflue (*clean sheets*, BTTS, $xG$, etc.) n'est introduite en v1. |
| **OQ-014 (Architecture Provider)** | **RESOLVED** | **Réutilisation obligatoire du dataset historique mutualisé.** Maximum structurel de **2 appels provider** par exécution de `/analysis`. Zéro troisième appel, zéro appel par carte/équipe ($O(1)$ strict). |
| **OQ-015 (Structure du DTO)** | **RESOLVED** | **DTO explicite structuré en deux segments (`overall` et `contextual`).** Disponibilité indépendante par segment (`AVAILABLE`, `INSUFFICIENT_DATA`, `UNAVAILABLE`) avec `metrics: null` lorsque non disponible. |

---

## 3. Contrat fonctionnel et délimitation du périmètre

Le profil de force saisonnier (**Season Strength**) est une métrique purement factuelle, déterministe et vérifiable :
- **Horizon :** Saison courante (`seasonId` identique) et matchs terminés (`FINISHED`).
- **Complémentarité Form 5 :** Form 5 capture le momentum récent (court terme, 5 matchs max), tandis que Season Strength capture le niveau structurel moyen sur l'ensemble de la saison.
- **Interdictions strictes :** Aucun score synthétique composite (ex. *Power Rating*, note 0-100), aucun modèle probabiliste ou de Machine Learning, aucune cote (*odds*), aucun Decision Engine, aucune recommandation de mise.

---

## 4. Source de données et filtrage temporel strict

Pour un match cible donné (`targetMatch`), l'ensemble des matchs éligibles pour une équipe analysée doit respecter **strictement** les critères d'intégrité suivants :
1. Même code de compétition (`match.competitionCode === targetMatch.competitionCode`) ;
2. Même identifiant de saison (`match.seasonId === targetMatch.seasonId`) ;
3. Présence de l'équipe analysée (`match.homeTeam.id === teamId || match.awayTeam.id === teamId`) ;
4. Statut terminé (`match.status === 'FINISHED'`) ;
5. Score complet et non null (`score.fullTime.home !== null && score.fullTime.away !== null`) ;
6. **Antériorité temporelle stricte :** `match.utcDate < targetMatch.utcDate`.

### Règles d'exclusion formelles
- **Le match cible est strictement exclu** (condition `<` et non `<=`).
- Aucun match futur ou postérieur à `targetMatch.utcDate` n'est inclus.
- Aucune traversée inter-saison ni historique pluriannuel.
- Aucun match d'une autre compétition.

---

## 5. Composant de calcul pur : `SeasonStrengthCalculator`

Le calcul du profil saisonnier est confié à un service de domaine pur, sans effet de bord :

### Responsabilités
- Fonction pure déterministe recevant l'équipe cible, la date cible, la saison cible et le tableau mutualisé des matchs historiques de la saison.
- Calcul indépendant du segment global (`overall`) et du segment contextualisé (`contextual`).
- Détermination du statut de disponibilité (`AVAILABLE` vs `INSUFFICIENT_DATA`).

### Interdictions architecturales
Le calculateur ne doit **jamais** :
- Réaliser d'appel réseau ou invoquer `SportsDataProvider` ;
- Accéder aux variables d'environnement (`process.env`) ou à la base de données ;
- Utiliser directement le cache en mémoire ou Express ;
- Générer des logs ou produire des prédictions.

---

## 6. Perspective d'équipe et règles de calcul

Toutes les métriques d'un match historique sont évaluées du point de vue de l'équipe cible :

### 6.1 Buts marqués et encaissés
- Si l'équipe jouait à domicile (`match.homeTeam.id === teamId`) :
  - $\text{goalsFor} = \text{score.fullTime.home}$
  - $\text{goalsAgainst} = \text{score.fullTime.away}$
- Si l'équipe jouait à l'extérieur (`match.awayTeam.id === teamId`) :
  - $\text{goalsFor} = \text{score.fullTime.away}$
  - $\text{goalsAgainst} = \text{score.fullTime.home}$

### 6.2 Résultat et barème de points
- **Victoire (WIN) :** $\text{goalsFor} > \text{goalsAgainst} \implies 3\text{ points}$
- **Nul (DRAW) :** $\text{goalsFor} == \text{goalsAgainst} \implies 1\text{ point}$
- **Défaite (LOSS) :** $\text{goalsFor} < \text{goalsAgainst} \implies 0\text{ point}$

---

## 7. Définition exacte des 11 métriques du segment

Chaque segment de force valide (`AVAILABLE`) contient exactement 11 métriques numériques :

$$\text{played} = \text{wins} + \text{draws} + \text{losses}$$
$$\text{points} = (\text{wins} \times 3) + (\text{draws} \times 1)$$
$$\text{pointsPerMatch} = \frac{\text{points}}{\text{played}}$$
$$\text{goalsFor} = \sum \text{goalsFor}$$
$$\text{goalsAgainst} = \sum \text{goalsAgainst}$$
$$\text{goalDifference} = \text{goalsFor} - \text{goalsAgainst}$$
$$\text{goalsForPerMatch} = \frac{\text{goalsFor}}{\text{played}}$$
$$\text{goalsAgainstPerMatch} = \frac{\text{goalsAgainst}}{\text{played}}$$

Le calculateur pur conserve les nombres réels exacts en virgule flottante sans appliquer d'arrondi prématuré.

---

## 8. Découpage en deux segments : Overall et Contextual

### 8.1 Segment Overall (`overall`)
- Porte sur l'intégralité des matchs éligibles de l'équipe sur la saison courante avant `targetDate` (domicile et extérieur confondus).
- Si 0 match éligible : `availability = 'INSUFFICIENT_DATA'`, `sampleSize = 0`, `metrics = null`.
- Si $\ge 1$ match éligible : `availability = 'AVAILABLE'`, `sampleSize = played`, `metrics = { ... }`.

### 8.2 Segment Contextualisé (`contextual`)
- Filtre spécifiquement les matchs éligibles selon le rôle de l'équipe dans le match cible :
  - Équipe recevante : `venue = 'HOME'` (matchs où l'équipe jouait à domicile).
  - Équipe visiteuse : `venue = 'AWAY'` (matchs où l'équipe jouait à l'extérieur).
- **Indépendance des disponibilités :** Un club peut avoir `overall` à `AVAILABLE` ($\text{ex: } 6\text{ matchs}$) mais son `contextual` (déplacement) à `INSUFFICIENT_DATA` ($\text{ex: } 0\text{ match à l'extérieur joué}$). Les deux segments sont calculés de manière autonome.

---

## 9. Schéma TypeScript du DTO `SeasonStrengthProfile`

```typescript
export type SeasonStrengthAvailability = 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';

export interface SeasonStrengthMetrics {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  pointsPerMatch: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  goalsForPerMatch: number;
  goalsAgainstPerMatch: number;
}

export type SeasonStrengthSegment =
  | {
      availability: 'AVAILABLE';
      sampleSize: number; // >= 1, égal à metrics.played
      metrics: SeasonStrengthMetrics;
    }
  | {
      availability: 'INSUFFICIENT_DATA';
      sampleSize: 0;
      metrics: null;
    }
  | {
      availability: 'UNAVAILABLE';
      sampleSize: null;
      metrics: null;
    };

export interface ContextualSeasonStrength {
  venue: 'HOME' | 'AWAY';
  segment: SeasonStrengthSegment;
}

export interface SeasonStrengthProfile {
  overall: SeasonStrengthSegment;
  contextual: ContextualSeasonStrength;
}
```

---

## 10. Gestion de l'état `UNAVAILABLE` et Dégradation gracieuse

- Le calculateur pur produit `AVAILABLE` ou `INSUFFICIENT_DATA` à partir des données reçues.
- L'état `UNAVAILABLE` est une responsabilité de la couche Application / Orchestration : en cas d'échec de récupération de l'historique saisonnier par le provider, l'orchestrateur assigne `UNAVAILABLE` avec `sampleSize: null` et `metrics: null`.
- **Maintien de M-002 :** En cas d'indisponibilité du flux historique, l'endpoint `/analysis` répond `HTTP 200`, les matchs programmés sont conservés, Form 5 est marquée `UNAVAILABLE` et Season Strength est marqué `UNAVAILABLE`. Le Match Center reste affiché et utilisable.

---

## 11. Intégration dans l'orchestrateur `ListAnalyticalMatchesUseCase`

Le use case centralise la double analyse pour chaque rencontre programmée :

```text
1. getMatches(competitionCode, now, now+7j)  ──>  Matchs programmés de la semaine (Appel 1)
2. getMatches(competitionCode)               ──>  Historique saison courante mutualisé (Appel 2)
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼                                                                   ▼
       FormCalculator.calculate(...)                                   SeasonStrengthCalculator.calculate(...)
                      │                                                                   │
                      ▼                                                                   ▼
              Form 5 (Home / Away)                                        Season Strength (Home / Away)
                      │                                                                   │
                      └─────────────────────────────────┬─────────────────────────────────┘
                                                        ▼
                                       MatchAnalyticalDTO enrichi exposé
```

### Contrainte Anti N+1 bloquante
Le nombre total d'appels émis vers `SportsDataProvider` par exécution de `/analysis` est strictement plafonné à **2 appels** ($O(1)$ provider).

---

## 12. Contrat de l'endpoint HTTP `/analysis`

L'endpoint enrichit le DTO de chaque match sans modifier la route historique `/matches` :

```json
{
  "matches": [
    {
      "id": 101,
      "utcDate": "2026-08-22T19:00:00Z",
      "status": "TIMED",
      "homeTeam": { "id": 1, "name": "Paris Saint-Germain" },
      "awayTeam": { "id": 2, "name": "Olympique de Marseille" },
      "form": {
        "home": { "availability": "AVAILABLE", "results": ["WIN", "WIN", "DRAW", "WIN", "LOSS"] },
        "away": { "availability": "AVAILABLE", "results": ["WIN", "DRAW", "LOSS", "WIN", "WIN"] }
      },
      "seasonStrength": {
        "home": {
          "overall": {
            "availability": "AVAILABLE",
            "sampleSize": 8,
            "metrics": {
              "played": 8,
              "wins": 6,
              "draws": 1,
              "losses": 1,
              "points": 19,
              "pointsPerMatch": 2.375,
              "goalsFor": 18,
              "goalsAgainst": 6,
              "goalDifference": 12,
              "goalsForPerMatch": 2.25,
              "goalsAgainstPerMatch": 0.75
            }
          },
          "contextual": {
            "venue": "HOME",
            "segment": {
              "availability": "AVAILABLE",
              "sampleSize": 4,
              "metrics": {
                "played": 4,
                "wins": 4,
                "draws": 0,
                "losses": 0,
                "points": 12,
                "pointsPerMatch": 3.0,
                "goalsFor": 11,
                "goalsAgainst": 2,
                "goalDifference": 9,
                "goalsForPerMatch": 2.75,
                "goalsAgainstPerMatch": 0.5
              }
            }
          }
        },
        "away": {
          "overall": { "availability": "AVAILABLE", "sampleSize": 8, "metrics": { "...": "..." } },
          "contextual": {
            "venue": "AWAY",
            "segment": { "availability": "AVAILABLE", "sampleSize": 4, "metrics": { "...": "..." } }
          }
        }
      }
    }
  ]
}
```

---

## 13. Exigences pour la couche de présentation (Frontend)

- **Bloc UI "Saison" :** Intégré sobrement dans la carte de match, distinct du bloc "Forme récente".
- **Formatage des ratios :** `pointsPerMatch`, `goalsForPerMatch`, `goalsAgainstPerMatch` formatés avec **exactement 2 décimales** (ex. `2.38 pts/m`, `2.25 b/m`, `0.75 enc/m`).
- **Gestion des états dégradés :** Libellés clairs en cas de `INSUFFICIENT_DATA` ou `UNAVAILABLE` sans affichage de valeurs trompeuses (`NaN`, `null`, `undefined`, `0.00` artificiel).
- **Accessibilité :** Balises sémantiques et attributs ARIA pour chaque métrique.

---

## 14. Plan d'assurance qualité et matrice de tests requise

L'implémentation devra obligatoirement satisfaire la couverture suivante :

### 14.1 Tests unitaires (`SeasonStrengthCalculator`)
- 0 match éligible $\implies$ `INSUFFICIENT_DATA` (`sampleSize: 0`, `metrics: null`) ;
- 1 match éligible $\implies$ `AVAILABLE` (`sampleSize: 1`) ;
- Barème des victoires (3 pts), nuls (1 pt), défaites (0 pt) ;
- Inversion correcte des perspectives domicile vs extérieur ;
- Exactitude des calculs sans arrondi interne ;
- Respect strict de la borne `utcDate < targetDate` et exclusion formelle du match cible ;
- Exclusion des matchs hors saison ou d'autres compétitions ;
- Filtrage exact du split domicile (`HOME`) et du split extérieur (`AWAY`) ;
- Indépendance prouvée entre statut `overall` et statut `contextual`.

### 14.2 Tests d'intégration (`analysis-route`)
- Présence simultanée de `form` et `seasonStrength` dans la réponse `/analysis` ;
- Preuve de l'exécution d'au plus 2 appels provider ;
- Validation de la dégradation gracieuse en cas de panne historique (`HTTP 200` + `UNAVAILABLE`).

### 14.3 Tests frontend
- Rendu conforme du bloc Saison (overall + split contextualisé) ;
- Formatage à 2 décimales vérifié ;
- Robustesse face aux états `INSUFFICIENT_DATA` et `UNAVAILABLE` ;
- Zéro régression sur les 9 états globaux client.

---

## 15. Séquence de transition vers l'implémentation

1. **Revue et approbation formelle de DEC-024.**
2. **Ouverture et audit pré-fusion de la Pull Request documentaire.**
3. **Fusion de DEC-024 sur `architecture/phase-2-technical-design` via `Create a merge commit`.**
4. **Audit post-fusion strict.**
5. **Délivrance de l'autorisation de développement de la Phase 3.3 technique.**

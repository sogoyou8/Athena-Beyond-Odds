# Cadrage technique détaillé — Phase 3.2 : Form 5

- Projet : Athena Beyond Odds
- Phase : 3.2
- Tranche : Form 5
- Date : 2026-08-19
- Responsable : Fondateur ABYSS
- Statut : Approuvé — implémentation autorisée uniquement après fusion et audit post-fusion de DEC-019
- Branche de base : `architecture/phase-2-technical-design`
- Commit de référence : `c2a18dcb211432df8844917cd12329ebfbc8c810`

---

## 1. Contexte et Décisions de référence

À la suite de la clôture de la Phase 3.1 et de la validation du cadrage produit général via `DEC-017`, la première tranche analytique du Match Center (**Form 5 — Forme récente minimale des équipes**) a été approuvée fonctionnellement par la décision `DEC-018` (PR #24).

La présente spécification technique formalise les **7 arbitrages définitifs du Fondateur ABYSS** et définit l'architecture technique exacte permettant la future implémentation de Form 5 dans le respect strict des principes d'architecture d'Athena.

---

## 2. Enregistrement des 7 Arbitrages Fondateur

1. **HTTP (Anti N+1) :** Contrat analytique agrégé unique via `GET /competitions/:competitionCode/matches/analysis`. Aucun endpoint Form 5 par carte ou par équipe.
2. **Historique (Saison courante jusqu'à la date cible) :** Récupération des matchs terminés (`status === 'FINISHED'`) de la même compétition et de la saison courante, strictement antérieurs à la date du match analysé (`historicalMatch.utcDate < targetMatch.utcDate`). Aucune fenêtre glissante arbitraire (30/60/90 jours). Protection garantie contre le look-ahead bias.
3. **Portée Inter-saison (Non) :** Strictement limitée à la saison courante. En début de saison (1 à 4 matchs joués), seuls les résultats réels de la saison en cours sont affichés. Aucun complément artificiel avec la saison précédente.
4. **Responsabilité du Provider :** Le provider (`SportsDataProvider`) est responsable de la récupération et normalisation des matchs sur une compétition/période donnée. **Il ne doit plus appliquer de filtrage métier inconditionnel `status === 'SCHEDULED'`.**
5. **Non-régression SCHEDULED dans l'Application :** Le use-case `ListScheduledMatchesUseCase` conserve son filtrage strict `match.status === 'SCHEDULED'` pour garantir que `GET /competitions/:code/matches` reste 100% inchangé.
6. **Représentation DTO / UI :** Code DTO interne neutre (`WIN` | `DRAW` | `LOSS`). Traduction UI FR (`V` | `N` | `D`) gérée au niveau de la vue frontend (`render.ts`). Question ouverte `OQ-004` préservée intacte.
7. **Dégradation gracieuse & Phase 2.9 Niveau 2 :** En cas d'erreur sur l'historique, les matchs programmés restent affichés et l'état `UNAVAILABLE` est transporté localement sans nouvel écran d'erreur global. La validation Phase 2.9 Niveau 2 s'exécutera après l'implémentation locale et les tests déterministes.

---

## 3. Architecture Technique Cible

```text
[Frontend: render.ts] ---> (1 requête HTTP) ---> [Route: matches-route.ts]
                                                        |
                                       [Use Case: ListAnalyticalMatchesUseCase]
                                                        |
                                          [Service: FormCalculator]
                                                        |
                                       [Port: SportsDataProvider]
                                         /                    \
                     [InMemorySportsDataProvider]   [FootballDataOrgAdapter]
```

---

## 4. Spécification détaillée des Couches

### 4.1. Couche Domaine (Services & Value Objects)

- **`FormResult` :** Type énuméré neutre `'WIN' | 'DRAW' | 'LOSS'`.
- **`TeamForm` :** Structure représentant la forme calculée d'une équipe :
  ```typescript
  export type FormResult = 'WIN' | 'DRAW' | 'LOSS';

  export interface TeamForm {
    readonly teamId: string;
    readonly sequence: FormResult[];
  }
  ```
- **`FormCalculator` (`src/domain/services/form-calculator.ts`) :**
  - Service purement métrique sans aucune dépendance externe.
  - Entrées : `teamId: string`, `targetDate: Date`, `historicalMatches: Match[]`.
  - Logique :
    1. Filtrer les matchs où `homeTeam.id === teamId || awayTeam.id === teamId`.
    2. Filtrer les matchs où `status === 'FINISHED'`.
    3. Filtrer les matchs où `score.fullTime.home !== null && score.fullTime.away !== null`.
    4. Filtrer les matchs où `utcDate < targetDate` (protection anti look-ahead).
    5. Trier par `utcDate` décroissant (tie-break : `id` décroissant).
    6. Conserver au maximum les 5 premiers matchs.
    7. Déterminer pour chaque match `WIN` (buts équipe > adversaire), `DRAW` (égalité) ou `LOSS` (buts équipe < adversaire).

### 4.2. Couche Application (Use Cases & Ports)

- **`SportsDataProvider` :** Signature inchangée : `getMatches(competitionCode: string, fromDate?: Date, toDate?: Date): Promise<Match[]>`.
- **`ListScheduledMatchesUseCase` :** Responsabilité inchangée. Reçoit tous les matchs du provider et conserve son filtre `match.status === 'SCHEDULED'`.
- **`ListAnalyticalMatchesUseCase` (`src/application/use-cases/list-analytical-matches.ts`) :**
  - Nouveau Use Case pour le Match Center analytique.
  - Détermine les matchs programmés à afficher.
  - Récupère les matchs de la compétition sur la saison courante via le provider.
  - Utilise `FormCalculator` pour calculer la forme domicile et extérieure de chaque match.
  - Retourne la liste agrégée des matchs enrichis de leurs statuts et séquences Form 5.

### 4.3. Couche Infrastructure (Providers & Cache)

- **`FootballDataOrgAdapter` :** Suppression du filtrage inconditionnel `if (mappedStatus !== 'SCHEDULED') continue`. L'adaptateur normalise tous les matchs retournés par l'API amont sur la plage demandée.
- **`InMemorySportsDataProvider` :** Ajout de fixtures statiques déterministes de matchs au statut `FINISHED` avec des scores `fullTime` complets pour permettre le développement et les tests 100% hors ligne.
- **`InMemoryCache` :** Réutilisation transparente de la clé de cache de compétition/période pour éviter tout surcoût de quota provider.

### 4.4. Couche Interfaces (HTTP Routes & DTOs)

- **Route HTTP :** `GET /competitions/:competitionCode/matches/analysis`
- **Structure DTO de réponse :**
  ```typescript
  export interface AnalyticalMatchDTO {
    match: Match;
    form: {
      home: {
        teamId: string;
        status: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
        results: FormResult[];
      };
      away: {
        teamId: string;
        status: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNAVAILABLE';
        results: FormResult[];
      };
    };
  }

  export interface AnalyticalMatchesResultDTO {
    competitionCode: string;
    matches: AnalyticalMatchDTO[];
  }
  ```

### 4.5. Couche Frontend (API Client & View)

- **`api-client.ts` :** Nouvelle méthode `getAnalyticalMatches(competitionCode: string)`.
- **`render.ts` :** Mappage neutre -> UI FR (`WIN` -> `V`, `DRAW` -> `N`, `LOSS` -> `D`).
- **Comportement UI :** Badges discrets et lisibles. Si `status === 'INSUFFICIENT_DATA'`, affichage du message neutre `Données de forme indisponibles`. En cas d'erreur analytique (`UNAVAILABLE`), les cartes du match s'affichent normalement sans planter l'interface.

---

## 5. Stratégie de Test et Non-Régression

1. **Non-régression Use Case Liste Programmée :** Tests unitaires pour `ListScheduledMatchesUseCase` garantissant que seuls les matchs `SCHEDULED` sont retournés même si le provider fournit des matchs `FINISHED`.
2. **Tests Métier Service Domaine (`FormCalculator`) :**
   - Exactement 5 matchs joués -> 5 badges.
   - Plus de 5 matchs joués -> 5 derniers retenus.
   - 1 à 4 matchs joués -> 1 à 4 badges.
   - 0 match joués -> séquence vide.
   - Victoire/Nul/Défaite à domicile et à l'extérieur.
   - Protection date cible (match futur ignoré).
   - Score nul ou incomplet ignoré.
   - Tri déterministe `utcDate DESC`, `id DESC`.
3. **Tests Integration HTTP (`GET /matches/analysis`) :**
   - 200 OK avec structure agrégée.
   - 404 si compétition inconnue.
   - 503 si provider indisponible.
4. **Tests Frontend DOM (`Vitest`) :**
   - Rendu correct des lettres `V`, `N`, `D`.
   - Accessibilité (labels ARIA).
   - Gestion dégradée de `INSUFFICIENT_DATA` et `UNAVAILABLE`.

---

## 6. Liste prévisionnelle des Fichiers

### À créer lors de l'implémentation
- `src/domain/services/form-calculator.ts`
- `src/application/use-cases/list-analytical-matches.ts`
- `tests/unit/form-calculator.test.ts`
- `tests/unit/list-analytical-matches.test.ts`

### À modifier lors de l'implémentation
- `src/infrastructure/providers/football-data-org/football-data-org-adapter.ts`
- `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts`
- `src/interfaces/http/matches-route.ts`
- `src/frontend/ts/api-client.ts`
- `src/frontend/ts/render.ts`
- `tests/unit/list-scheduled-matches.test.ts` (ajout des tests de non-régression)
- `tests/integration/matches.test.ts` (ajout de la suite de tests pour `/matches/analysis`)

---

## 7. Hors périmètre DEC-019

Sont explicitement exclus de la tranche Form 5 :

- Toute persistance longue durée (SQLite non requis)
- Machine Learning et apprentissage automatique
- Decision Engine (réservé Phase 4+)
- Cotes bookmakers, EV, Kelly, recommandations de pari
- Head To Head, Ranking, Fatigue, Travel, Momentum avancé
- Authentification, accès Premium
- Nouvelle compétition, nouveau provider (Sportmonks, etc.)
- Inter-saison et multi-compétition
- Nouvelles dépendances npm

---

## 8. Statut des Anomalies, OQ et Phase 2.9

- **Anomalies A-001 et A-002 :** Backlog technique, statut `MINEURE — OUVERTE — NON BLOQUANTE`.
- **Anomalie A-003 :** `CORRIGÉE ET FERMÉE`.
- **Questions Ouvertes OQ-001 à OQ-006 :** Statuts inchangés.
- **Phase 2.9 Niveau 2 :** Non bloquante pour l'implémentation et les tests locaux.

---

## 8. Condition d'activation de l'Autorisation d'Implémentation

La présente décision `DEC-019` autorise l'ouverture de la future branche d'implémentation :
`implementation/phase-3-2-form-5`

**Cette autorisation ne prendra effet qu'après la fusion officielle de la présente PR et la confirmation du verdict d'audit post-fusion.** Aucun code ne doit être écrit avant cette validation.

---

## 9. Verdict documentaire

```text
DEC-019 FORM 5 EN PULL REQUEST — AUDIT FINAL DU FONDATEUR REQUIS AVANT AUTORISATION EFFECTIVE D'IMPLÉMENTATION
```

---

> Made in Abyss : Spark by the King

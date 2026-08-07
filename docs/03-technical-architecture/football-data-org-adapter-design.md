# Conception détaillée — Adaptateur football-data.org

* **Statut :** Approuvé (DEC-004)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`
* **Référence de décision :** DEC-002 (football-data.org comme fournisseur de prototype gratuit)

---

## 1. Rôle de l'adaptateur

L'adaptateur `FootballDataOrgAdapter` implémente le port `SportsDataProvider`. Son rôle est :
1. D'effectuer des requêtes HTTP GET vers l'API football-data.org en injectant l'en-tête `X-Auth-Token`.
2. De gérer les limites de requêtes (quota du plan gratuit : 10 requêtes par minute).
3. De transformer les objets JSON bruts reçus en entités normalisées du domaine d'Athena (`Match`, `Team`, `Season`, `Competition`).

---

## 2. Spécification du mapping de données

Voici la logique de conversion qui sera implémentée dans `mapper.ts` du fournisseur :

### A. Mapping d'un match (football-data.org → Match)

| Champ source (football-data.org) | Champ destination (Match) | Type / Transformation |
|:---|:---|:---|
| `id` | `providerMetadata.externalId` | Converti en `string` |
| `competition.id` | `competitionId` | Normalisé (ex: "FR-L1") |
| `season.id` | `seasonId` | Converti en `string` |
| `matchday` | `matchday` | `number` |
| `utcDate` | `utcDate` | `Date` |
| `status` | `status` | Mappé selon la table de statut ci-dessous |
| `homeTeam` | `homeTeam` | Mappé vers l'entité `Team` |
| `awayTeam` | `awayTeam` | Mappé vers l'entité `Team` |
| `score` | `score` | Mappé vers la structure de `Score` normalisée |

### B. Table de conversion des statuts (`status`)

| Valeur API Source | Statut Normalisé Athena (`MatchStatus`) |
|:---|:---|
| `SCHEDULED` | `SCHEDULED` |
| `TIMED` | `SCHEDULED` |
| `LIVE` | `LIVE` |
| `IN_PLAY` | `LIVE` |
| `PAUSED` | `LIVE` |
| `FINISHED` | `FINISHED` |
| `POSTPONED` | `POSTPONED` |
| `CANCELLED` | `CANCELLED` |
| `SUSPENDED` | `LIVE` (considéré en direct/suspendu à court terme) |

### C. Mapping du score (`score`)

Le format source distingue `halfTime` et `fullTime`. L'adaptateur réalise un mapping direct :

```typescript
// Exemple conceptuel de mapping de score dans mapper.ts
function mapScore(sourceScore: any): Score {
  return {
    halfTime: {
      home: sourceScore.halfTime?.home ?? null,
      away: sourceScore.halfTime?.away ?? null
    },
    fullTime: {
      home: sourceScore.fullTime?.home ?? null,
      away: sourceScore.fullTime?.away ?? null
    }
  };
}
```

---

## 3. Gestion des limites de taux (Rate Limiting)

Pour faire face aux contraintes du plan gratuit (10 requêtes par minute max) :
* **Détection active** : L'adaptateur lit les en-têtes HTTP de réponse renvoyés par football-data.org :
  * `X-RequestCounter-Reset` : Temps restant avant réinitialisation du compteur.
  * `X-Requests-Available-Minute` : Nombre d'appels restants dans la minute courante.
* **Comportement en cas de 429** : Si l'API retourne un statut HTTP 429, l'adaptateur lève immédiatement une `ProviderRateLimitError` contenant le délai d'attente recommandé.
* **Garde-fou client** : Un délai d'attente (throttle) minimal de 6 secondes entre deux appels HTTP directs sera appliqué par l'adaptateur pour lisser la consommation des requêtes en l'absence de cache.

---

> **Made in Abyss : Spark by the King**

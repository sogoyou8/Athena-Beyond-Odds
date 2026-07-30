# Dossier de validation — Phase 2.10 : activation contrôlée du cache mémoire

- **Projet :** Athena Beyond Odds
- **Phase :** 2.10 — Activation contrôlée du cache mémoire
- **Date :** 2026-07-30
- **Commit de référence :** `76e1fd611145b6812bc6e747820397cda6e85553`
- **Branche de base :** `architecture/phase-2-technical-design`
- **Statut :** Approuvé — implémentation encore non autorisée
- **Responsable :** Fondateur ABYSS

---

## 1. État Technique au Commit de Référence

### Architecture actuelle

Le dépôt est organisé en architecture **ports-and-adapters** stricte.

| Couche | Fichier |
|---|---|
| Interfaces HTTP | `src/interfaces/http/matches-route.ts` |
| Application (Use Case) | `src/application/use-cases/list-scheduled-matches.ts` |
| Port | `src/application/ports/sports-data-provider.ts` |
| Infrastructure (cache) | `src/infrastructure/cache/memory/in-memory-cache.ts` |
| Infrastructure (provider réel) | `src/infrastructure/providers/football-data-org/football-data-org-adapter.ts` |
| Infrastructure (provider fictif) | `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts` |
| Composition | `src/app.ts` |

---

## 2. État Actuel de `InMemoryCache`

`InMemoryCache` implémente le port `SportsDataProvider` en décorateur **passthrough complet** :

- Il ne stocke aucune valeur.
- Il ne lit aucune valeur.
- Il ne possède ni TTL ni politique d'expiration.
- Il délègue systématiquement toutes les méthodes au fournisseur sous-jacent (`next`).

Extrait représentatif :

```typescript
getMatches(code, from?, to?): Promise<Match[]> {
  return this.next.getMatches(code, from, to); // délégation pure, aucun cache
}
```

Le commentaire d'en-tête du fichier précise explicitement :
> `FRONTIÈRE PHASE 2.6 — Aucune politique de cache, aucun TTL, aucun stockage. L'implémentation réelle du cache avec TTL sera ajoutée en Phase 3.`

---

## 3. Absence de `InMemoryCache` dans la Composition

La fonction `resolveSportsDataProvider()` dans `src/app.ts` retourne directement `FootballDataOrgAdapter` pour `SPORTS_DATA_PROVIDER=football-data-org`, sans l'envelopper dans `InMemoryCache` :

```typescript
if (providerType === 'football-data-org') {
  return new FootballDataOrgAdapter({ apiKey }); // InMemoryCache non instancié
}
```

`InMemoryCache` n'est donc jamais instancié dans le chemin de production actuel.

---

## 4. Parcours Actuel d'une Requête FL1

```
Client HTTP
    │
    ▼
GET /competitions/FL1/matches          ← matches-route.ts
    │
    ▼
ListScheduledMatchesUseCase.execute()  ← list-scheduled-matches.ts
    │ provider.getMatches('FL1')       ← sans dates explicites
    ▼
FootballDataOrgAdapter.getMatches()    ← calcule dateFrom/dateTo en interne
    │ Fenêtre [now, now+7j UTC]
    │ X-Auth-Token transmis en en-tête
    ▼
https://api.football-data.org/v4/competitions/FL1/matches
    │
    ▼
Mapping + filtre SCHEDULED
    │
    ▼
{ competitionCode: "FL1", matches: [...] }  ← HTTP 200
```

**Conséquence :** chaque requête entrante sur `GET /competitions/FL1/matches` déclenche un appel HTTP authentifié vers football-data.org, sans aucune mise en cache intermédiaire.

---

## 5. Justification du Cache — Correction de l'Affirmation sur le Quota

Le cadrage initial contenait des projections mensuelles non sourcées officiellement. Ces projections sont supprimées.

La justification correcte de l'activation du cache repose sur :

- **Réduction des appels identiques répétés** : plusieurs requêtes rapprochées sur `GET /competitions/FL1/matches` déclenchent autant d'appels réseau identiques.
- **Réduction de la latence** : une entrée en cache est servie sans attendre la réponse réseau.
- **Protection contre les rafales** : des pics de requêtes simultanées peuvent dépasser la limite de débit du plan gratuit (exprimée en appels par minute par la documentation officielle de football-data.org).
- **Respect de la politique de fair use** : minimiser les appels inutiles est conforme aux conditions d'utilisation du fournisseur.
- **Réduction du risque de HTTP `429`** : chaque `ProviderRateLimitError` interrompt le service pour l'ensemble des clients actifs.

---

## 6. Décisions Fondatrices — DEC-008

### DEC-008.1 — Activation du Cache

**Décision :** Cache actif uniquement avec `football-data-org`.

| Variable | Résolution |
|---|---|
| `SPORTS_DATA_PROVIDER` absent | `InMemorySportsDataProvider` sans cache |
| `SPORTS_DATA_PROVIDER=in-memory` | `InMemorySportsDataProvider` sans cache |
| `SPORTS_DATA_PROVIDER=football-data-org` | `InMemoryCache` enveloppant `FootballDataOrgAdapter` |

Contraintes :
- Cache actif par défaut avec `football-data-org`.
- Aucune nouvelle variable d'environnement (`CACHE_ENABLED` interdit).
- Aucun cache avec le fournisseur fictif.
- Aucun fallback vers `in-memory`.
- Aucune modification du port `SportsDataProvider`.

### DEC-008.2 — TTL

**Décision :** TTL fixe de **10 minutes** (`600 000 ms`).

Justification :
- Les rencontres programmées sur une fenêtre de 7 jours changent peu fréquemment dans cet intervalle.
- Dix minutes réduisent fortement les appels identiques rapprochés sans sacrifier la fraîcheur dans le contexte local actuel.
- Le TTL est en mémoire et supprimé au redémarrage du processus — il n'y a aucune persistance.

Le TTL doit être :
- injecté ou configurable par constructeur dans les tests ;
- fixé à `600 000 ms` dans la composition de production ;
- contrôlé par une horloge injectable ;
- testé sans délai réel (`setTimeout` interdit dans les tests unitaires du cache).

### DEC-008.3 — Clé du Cache et Fenêtre Temporelle

**Décision :** `{competitionCode}:{dateFrom}:{dateTo}`

Exemple non sensible : `FL1:2026-07-30:2026-08-06`

#### Comportement pour `getMatches(code, fromDate?, toDate?)`

**Deux dates fournies :**
- Utiliser exactement `fromDate` et `toDate` pour construire la clé.
- Transmettre exactement ces dates au fournisseur décoré.

**Aucune date fournie :**
Le cache doit :
1. Utiliser son horloge injectable.
2. Calculer la date UTC courante (`dateFrom`).
3. Calculer `dateTo = dateFrom + 7 jours UTC`.
4. Construire la clé `{code}:{dateFrom}:{dateTo}`.
5. Transmettre ces deux dates explicitement au fournisseur décoré.

Le cache et le fournisseur travaillent sur **exactement la même fenêtre** `[dateFrom, dateTo)` — aucun calcul indépendant pour la même requête.

**Une seule borne fournie :**
Si uniquement `fromDate` est fourni sans `toDate`, ou vice-versa, le cache **délègue sans mise en cache** (bypass). Cette règle évite une clé ambiguë et préserve le comportement du port.

#### Sécurité de la Clé

La clé ne doit jamais contenir : `FOOTBALL_DATA_API_KEY`, `X-Auth-Token`, une valeur d'environnement, un secret, un corps fournisseur ou un identifiant utilisateur.

### DEC-008.4 — Comportement sur les Erreurs et l'Expiration

**Réponse réussie :** mise en cache, y compris `[]` (tableau vide valide).

**Erreurs non mises en cache :**
- `ProviderRateLimitError`
- `ProviderUnavailableError`
- `CompetitionNotAvailableError`
- `NotImplementedError`
- Toute erreur inconnue
- Toute promesse rejetée

Les erreurs sont propagées sans modification.

**Expiration :** une entrée expirée est supprimée ou remplacée seulement après une nouvelle réponse réussie. Il est interdit de servir une ancienne valeur après expiration.

**Stale-on-error : INTERDIT.** Le cache ne doit jamais masquer une erreur du fournisseur avec une ancienne valeur.

**Retry : INTERDIT.** Aucun retry automatique ni backoff.

### DEC-008.5 — Concurrence — Déduplication des Promesses

**Décision :** Option B — in-flight deduplication.

Structure interne : `Map<string, Promise<Match[]>>` (temporaire).

Comportement :
- Premier appel sur une clé froide : appel du fournisseur, promesse stockée dans la Map.
- Deuxième appel simultané sur la même clé : réutilisation de la promesse en cours — aucun second appel réseau.
- Clés différentes : promesses indépendantes.
- Promesse réussie : valeur mise dans le cache TTL ; promesse retirée de la Map `in-flight` dans un bloc `finally`.
- Promesse rejetée : aucune valeur mise en cache ; promesse retirée de la Map `in-flight` dans un bloc `finally`.
- Aucune promesse résolue ou rejetée ne reste durablement dans la Map `in-flight`.

### DEC-008.6 — Stratégie de Tests

La suite de tests de `InMemoryCache` doit couvrir au minimum les 24 cas suivants, sans appel réseau réel et sans `setTimeout` réel :

1. Premier appel sur cache froid — fournisseur appelé 1 fois.
2. Deuxième appel identique avant expiration — cache utilisé, 0 appel fournisseur.
3. Appel après expiration du TTL — fournisseur appelé à nouveau.
4. Résultat vide `[]` mis en cache — second appel retourne `[]` sans appel fournisseur.
5. Fenêtres différentes → clés différentes → appels fournisseur indépendants.
6. Compétitions différentes → clés différentes → appels fournisseur indépendants.
7. Fenêtre absente → cache calcule les dates UTC et les transmet au fournisseur décoré.
8. Dates calculées par le cache transmises correctement au fournisseur.
9. Une seule borne fournie → bypass sans mise en cache.
10. `ProviderRateLimitError` non mise en cache — fournisseur appelé à chaque tentative.
11. `ProviderUnavailableError` non mise en cache.
12. Erreur inconnue non mise en cache.
13. Aucune valeur expirée servie après une erreur fournisseur.
14. Deux appels simultanés de même clé dédupliqués — un seul appel fournisseur.
15. Deux appels simultanés de clés différentes non fusionnés — deux appels fournisseur.
16. Promesse rejetée retirée de la Map `in-flight`.
17. Nouvel appel possible après une promesse rejetée.
18. `getCompetitions()` délégué sans cache.
19. `getMatchDetails()` délégué sans cache.
20. Horloge injectable contrôlant le TTL.
21. Aucun `setTimeout` réel dans la suite.
22. Aucun appel réseau réel dans la suite.
23. Aucune clé sensible dans les entrées du cache.
24. Composition du cache uniquement avec `football-data-org` (test de `resolveSportsDataProvider`).

---

## 7. Fichiers Potentiellement Concernés par l'Implémentation

### Fichiers à modifier

| Fichier | Nature de la modification |
|---|---|
| `src/infrastructure/cache/memory/in-memory-cache.ts` | Implémenter TTL, clé, stockage `Map`, déduplication |
| `src/app.ts` | Envelopper `FootballDataOrgAdapter` dans `InMemoryCache` pour `football-data-org` |
| `tests/unit/in-memory-cache.test.ts` | Remplacer le test trivial par la suite complète (24 cas minimum) |

### Quatrième fichier conditionnel

`tests/integration/provider-selection.test.ts` pourrait être modifié **uniquement** si cela est nécessaire pour démontrer automatiquement que :
```
SPORTS_DATA_PROVIDER=football-data-org → FootballDataOrgAdapter enveloppé par InMemoryCache
```
Cette modification n'est **pas automatiquement autorisée**. Elle doit faire l'objet d'un arbitrage séparé.

### Fichiers protégés (inchangés sauf nouvel arbitrage)

```
src/application/ports/sports-data-provider.ts
src/application/use-cases/list-scheduled-matches.ts
src/domain/
src/interfaces/http/matches-route.ts
src/infrastructure/providers/football-data-org/football-data-org-adapter.ts
src/infrastructure/providers/in-memory/
package.json
package-lock.json
tsconfig.json
```

---

## 8. Condition d'Arrêt Architecturale

Avant toute implémentation, vérifier que `FootballDataOrgAdapter.getMatches()` respecte les paramètres `fromDate` et `toDate` explicitement transmis.

**Observation actuelle :** l'adaptateur ignore actuellement les paramètres `_fromDate` et `_toDate` (préfixés `_`) et recalcule en interne `dateFrom = now` et `dateTo = now+7j`.

Si ce comportement n'est pas corrigé avant l'implémentation du cache, le cache transmettrait des dates que l'adaptateur ignorerait, entraînant une incohérence silencieuse.

Si la correction de l'adaptateur n'est pas autorisée séparément, arrêter avec :

```text
PHASE 2.10 BLOQUÉE — CONTRAT DES FENÊTRES DE DATES À ARBITRER
```

Ne modifier pas l'adaptateur sans nouvelle validation du Fondateur.

---

## 9. Risques Techniques

| Risque | Mitigation |
|---|---|
| Paramètres `fromDate`/`toDate` ignorés par l'adaptateur | Condition d'arrêt architecturale préalable |
| Clé incluant des données sensibles | Clé construite uniquement depuis `competitionCode` + dates UTC au format `YYYY-MM-DD` |
| Valeur expirée servie à tort | TTL vérifié à chaque lecture (`Date.now() >= expiresAt`) |
| Fuite mémoire | Clé `FL1:date:date` unique par fenêtre glissante — entrées auto-limitées |
| Stale-on-error activé accidentellement | Interdit explicitement (DEC-008.4) |
| Thundering herd sur cache froid | Mitigé par in-flight deduplication (DEC-008.5) |
| Secret dans les clés de cache | Clé ne contient aucune valeur sensible |
| Cache partagé entre tests | `createApp()` reçoit un `customProvider` mocké — `InMemoryCache` non instancié dans les tests d'intégration |

---

## 10. Éléments Hors Périmètre

- Test Phase 2.9 Niveau 2 (rejouer à partir du 15 août 2026).
- Activation de compétitions autres que `FL1`.
- `getCompetitions()` et `getMatchDetails()` restent non implémentés.
- Observabilité avancée et loggers npm.
- Retry automatique et backoff exponentiel.
- Cache persistant (SQLite, Redis, fichier).
- Déploiement public.
- Utilisateurs tiers.
- Paris, cotes, prédictions.
- Sportmonks.
- Toute modification du domaine ou du port `SportsDataProvider`.

---

## 11. Plan d'Implémentation Proposé

### Branche d'implémentation (non encore autorisée)
```
implementation/phase-2-10-cache-activation
```

### Base de la branche d'implémentation
```
architecture/phase-2-technical-design
```

### Commit d'implémentation proposé
```
feat(cache): activate in-memory cache for football-data-org provider
```

### Pull Request d'implémentation
- Base : `architecture/phase-2-technical-design`
- Titre : `feat(cache): activate in-memory cache for football-data-org provider`
- Cible de fusion : `architecture/phase-2-technical-design`
- Non fusionnable sans validation du Fondateur ABYSS.

---

## 12. Verdict Documentaire

```text
CADRAGE PHASE 2.10 APPROUVÉ — IMPLÉMENTATION ENCORE NON AUTORISÉE
```

> Made in Abyss : Spark by the King

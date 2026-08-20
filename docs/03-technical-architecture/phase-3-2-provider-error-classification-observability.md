# Phase 3.2 — Provider Error Classification & Observability

> **Statut :** Approuvé par le Fondateur (DEC-021)
> **Date :** 2026-08-20
> **Responsable :** Fondateur ABYSS
> **PR Associée :** PR #26 (`implementation/phase-3-2-form-5`)
> **Document de référence :** `docs/03-technical-architecture/phase-3-2-provider-error-classification-observability.md`

---

## 1. Statut

Cette spécification technique définit les règles de classification et d'observabilité sécurisée des erreurs retournées par le fournisseur de données `football-data.org`, spécifiquement pour le traitement des réponses HTTP 400 (Bad Request).

---

## 2. Contexte

Dans le cadre de la Phase 3.2 (Form 5 / Match Center), l'application Athena Beyond Odds se connecte à l'API distante `football-data.org` via l'adaptateur `FootballDataOrgAdapter`.

La sémantique temporelle et l'architecture O(1) de Form 5 ont été formalisées par DEC-020 :
- Un appel principal daté : `getMatches(competitionCode, scheduledFrom, scheduledTo)`
- Un appel historique mutualisé sans dates : `getMatches(competitionCode)`

---

## 3. Incident réel Phase 2.9

Lors de la première exécution contrôlée de Phase 2.9 Niveau 2 sur l'endpoint `/competitions/FL1/matches/analysis` avec le fournisseur réel `football-data.org` :
1. L'appel principal vers `https://api.football-data.org/v4/competitions/FL1/matches?dateFrom=2026-08-20&dateTo=2026-08-27` a retourné un statut **HTTP 400 (Bad Request)** en ~167 ms.
2. L'adaptateur `FootballDataOrgAdapter` a absorbé cette réponse dans sa clause générique `if (!response.ok)` et a levé un `ProviderUnavailableError` ("L'API football-data.org a retourné un statut d'erreur: HTTP 400").
3. La route `/competitions/FL1/matches/analysis` a traduit `ProviderUnavailableError` en **HTTP 503 (PROVIDER_UNAVAILABLE)**.
4. Le corps de réponse JSON envoyé par `football-data.org` n'a pas été lu ni conservé.

---

## 4. Problème observé

- **Perte de diagnostic :** Le message explicatif fourni par l'API distante (indiquant quel paramètre ou filtre est rejeté) est détruit sans être lu.
- **Confusion sémantique :** Une erreur de requête client/paramètre (`HTTP 400`) est traitée comme une panne d'indisponibilité du service distant (`HTTP 503 / ProviderUnavailableError`).
- **Impossibilité de diagnostic hors-réseau :** Sans le message d'erreur upstream sanitisé, il est impossible de déterminer la cause exacte du rejet 400 sans consommer de nouveaux appels réseau.

---

## 5. Objectifs

1. **Distinguer HTTP 400 :** Introduire une classification d'erreur dédiée pour les requêtes rejetées par le provider (`ProviderRequestRejectedError`).
2. **Extraction sécurisée du diagnostic :** Lire le corps de réponse d'erreur JSON lors d'un HTTP 400 pour en extraire le message d'erreur upstream textuel.
3. **Sanitisation et bornage :** Nettoyer et tronquer le message diagnostic (max 256 caractères) pour éviter toute fuite ou pollution de log.
4. **Confidentialité absolue :** Garantir qu'aucun token (`X-Auth-Token`), en-tête sensible ou corps brut non contrôlé ne soit exposé ou loggué.
5. **Préserver le contrat existant :** Ne pas modifier les 9 états frontend Phase 3.1 ni le contrat HTTP public de l'API Athena dans ce premier correctif.

---

## 6. Non-objectifs

- Pas de refonte globale du système de gestion d'erreurs de toute l'application.
- Pas de nouveau framework de logging ou d'observabilité externe (pas d'OpenTelemetry, pas de Sentry, 0 € de budget, 0 nouvelle dépendance npm).
- Pas de nouvel état global ou composant visuel sur le frontend.
- Pas de stockage persistant des réponses d'erreur brutes.
- Pas de modification de la signature du port `SportsDataProvider`.

---

## 7. Classification minimale

La matrice de traitement des statuts upstream par `FootballDataOrgAdapter` est formalisée comme suit :

| Statut Upstream | Exception Interne Levée | FailureKind Télémétrie | Statut HTTP Local Route |
|---|---|---|---|
| **HTTP 400** | `ProviderRequestRejectedError` | `request_rejected` | `HTTP 503` (ou 500 selon route) |
| **HTTP 401** | `ProviderUnavailableError` | `unauthorized` | `HTTP 503` |
| **HTTP 403** | `ProviderUnavailableError` | `forbidden` | `HTTP 503` |
| **HTTP 429** | `ProviderRateLimitError` | `rate_limited` | `HTTP 429` |
| **HTTP 5xx** | `ProviderUnavailableError` | `upstream_5xx` | `HTTP 503` |
| **Network / Timeout** | `ProviderUnavailableError` | `network` / `timeout` | `HTTP 503` |
| **JSON Invalide** | `ProviderUnavailableError` | `invalid_response` | `HTTP 503` |

---

## 8. HTTP 400 / ProviderRequestRejectedError

Une nouvelle classe d'erreur applicative est créée :

```typescript
export class ProviderRequestRejectedError extends ApplicationError {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
    public readonly providerMessage?: string
  ) {
    super(message);
  }
}
```

Lorsqu'une réponse HTTP 400 est reçue :
- L'adaptateur tente de parser la réponse en JSON.
- Il extrait le message d'erreur sécurisé selon la whitelist.
- Il lève `ProviderRequestRejectedError`.

---

## 9. Extraction diagnostic

Seuls les champs textuels non sensibles de premier niveau sont inspectés pour extraire le message :
- `message`
- `error`
- `errorCode`
- `code`

Si aucun champ de la whitelist n'est présent ou si le parsing échoue, un diagnostic générique (`"Requête rejetée par le fournisseur (HTTP 400)"`) est utilisé.

---

## 10. Sanitisation

Le texte extrait doit respecter les contraintes strictes suivantes :
1. Conversion en chaîne primitive (`String(...)`).
2. Suppression des caractères de contrôle et sauts de ligne superflus.
3. Tronquage strict à **256 caractères maximum**.
4. Aucune interpolation avec les variables d'environnement ou les en-têtes HTTP de la requête.
5. Destruction immédiate du corps de réponse brut (aucun raw payload conservé).

---

## 11. Confidentialité / secrets

- **Interdiction absolue** de journaliser ou d'inclure dans les messages d'erreur la valeur de `FOOTBALL_DATA_API_KEY` ou de l'en-tête `X-Auth-Token`.
- Les événements télémétriques (`TelemetryObserver`) continuent d'appliquer `safeObserve` et ne contiennent aucun secret.

---

## 12. Contrat HTTP public

Dans ce correctif minimal DEC-021 :
- `analysis-route.ts` et `matches-route.ts` capturent `ProviderRequestRejectedError` au même titre que `ProviderUnavailableError` pour retourner `HTTP 503` avec `{ error: 'PROVIDER_UNAVAILABLE' }` afin de ne pas déstabiliser le frontend.
- Le message sanitisé reste disponible dans l'objet d'erreur pour les tests, les logs locaux sécurisés et le diagnostic de développement.

---

## 13. Frontend

- Les 9 états clients définis en Phase 3.1 restent inchangés.
- Aucun message brut ou code interne d'erreur externe n'est affiché à l'utilisateur final.

---

## 14. Retry policy

- Aucun retry automatique n'est autorisé lors d'une erreur HTTP 400.
- Toute requête rejetée avec un statut 400 est déterministe et échoue immédiatement.

---

## 15. Tests requis

Après l'approbation et la fusion de DEC-021, les tests unitaires suivants devront être ajoutés dans `tests/unit/football-data-org-adapter.test.ts` lors de l'implémentation sur PR #26 :
1. Upstream HTTP 400 avec `{ message: '...' }` -> lève `ProviderRequestRejectedError` avec `providerMessage` extrait.
2. Upstream HTTP 400 avec message long (>256 chars) -> message tronqué à 256 caractères.
3. Upstream HTTP 400 avec corps non-JSON ou sans champ whitelist -> lève `ProviderRequestRejectedError` avec diagnostic par défaut.
4. Garantie d'absence de token ou headers dans les propriétés de `ProviderRequestRejectedError`.
5. Non-régression sur HTTP 401, 403, 429, 500, timeout et erreurs réseau.

---

## 16. Compatibilité DEC-020

DEC-021 n'altère aucune décision prise dans DEC-020 :
- Le port `SportsDataProvider` reste inchangé.
- L'appel principal reste daté `[now, now+7j)` et l'historique sans dates.
- La dégradation gracieuse M-002 reste intacte.
- Le déterminisme temporel de `InMemorySportsDataProvider` reste intact.

---

## 17. Conditions de nouvelle validation réelle

Une nouvelle tentative de validation Phase 2.9 Niveau 2 ne sera autorisée par le Fondateur qu'aux conditions suivantes :
1. Fusion conforme de la PR documentaire DEC-021.
2. Audit post-fusion positif de la branche de base.
3. Implémentation du cinquième commit technique sur PR #26 appliquant DEC-021.
4. Audit technique complet et suite de tests déterministes (>= 204 tests) 100% verte.

---

## 18. Critères de conformité

- [x] Document technique complet et structuré.
- [x] Matrice d'erreurs explicite incluant HTTP 400.
- [x] Règles de sanitisation et bornage à 256 caractères définies.
- [x] Confidentialité des secrets (`X-Auth-Token`) garantie.
- [x] Décision enregistrée dans `decision-log.md` (version 2.0).

---

## 19. Interdictions

- Aucune modification du code source de production ou de test dans la PR documentaire.
- Aucun appel réseau réel vers `football-data.org`.
- Aucun nouvel état ou modification visuelle frontend.
- Aucune dépendance externe ajoutée.

---

## 20. Conclusion

DEC-021 comble le manque d'observabilité sur les erreurs de rejet HTTP 400 du fournisseur réel `football-data.org`, permettant d'obtenir un diagnostic précis et sécurisé lors de la prochaine exécution de validation Phase 2.9 Niveau 2.

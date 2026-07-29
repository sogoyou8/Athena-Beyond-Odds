# Dossier de validation — Phase 2.7 : première tranche fonctionnelle

- **Projet :** Athena Beyond Odds
- **Phase :** 2.7
- **Branche de base :** `architecture/phase-2-technical-design`
- **Commit de base :** `b36c3d6`
- **Date :** 2026-07-29
- **Statut :** Approuvé — implémentation encore non autorisée
- **Décision associée :** [DEC-005](../06-operations/decision-log.md#dec-005--approbation-du-cadrage-fonctionnel-de-la-phase-27)

> **Approbation complète — 8/8 décisions fondatrices validées**

---

## 1. Objet

La Phase 2.7 prépare la première tranche fonctionnelle locale et observable d’Athena Beyond Odds.

La seule fonctionnalité métier future approuvée est :

```text
GET /competitions/:competitionCode/matches
```

Cette fonctionnalité permettra de consulter exactement trois matchs programmés entièrement fictifs pour la compétition technique `FL1`.

Ce cadrage impose une exécution :

- locale ;
- déterministe ;
- en lecture seule ;
- sans fournisseur réel ;
- sans appel réseau ;
- sans cache métier actif ;
- sans persistance réelle ;
- sans dépendance npm supplémentaire.

Ce document approuve le cadrage fonctionnel, mais n’autorise pas encore l’écriture du code.

---

## 2. Flux fonctionnel approuvé

Le seul flux fonctionnel autorisé est :

```text
Interface HTTP
→ ListScheduledMatchesUseCase
→ SportsDataProvider
→ InMemorySportsDataProvider
→ modèles de domaine normalisés
→ réponse HTTP
```

Précisions obligatoires :

- `InMemorySportsDataProvider` fournit les trois matchs statiques ;
- l’adaptateur football-data.org existant n’est pas utilisé ;
- aucun appel réseau n’est effectué ;
- `InMemoryCache` reste inchangé et inactif pour cette tranche ;
- `SqlitePersistence` reste inchangé, logique et inutilisé ;
- aucune lecture ou écriture persistée n’est effectuée ;
- aucun fournisseur réel n’est activé ;
- aucun mécanisme dynamique de sélection de fournisseur n’est introduit.

---

## 3. Décisions fondatrices approuvées

| N° | Décision | Valeur approuvée |
|---:|---|---|
| 1 | Compétition autorisée | `FL1` uniquement, avec des équipes, matchs, identifiants et métadonnées entièrement fictifs |
| 2 | Nombre de matchs | Exactement `3 matchs` |
| 3 | Réponse nominale | `{ "competitionCode": "FL1", "matches": [] }` |
| 4 | Compétition indisponible | HTTP `404` avec `{ "error": "COMPETITION_NOT_AVAILABLE" }` |
| 5 | Fournisseur factice | `src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts` |
| 6 | Activation | Câblage direct et inconditionnel dans la composition de l’application |
| 7 | Cas d’usage | `ListScheduledMatchesUseCase` |
| 8 | Dates | Trois timestamps ISO UTC fixes et déterministes en 2099 |

Les huit décisions sont closes.

Aucun arbitrage supplémentaire n’est attendu pour le cadrage de la Phase 2.7.

---

## 4. Compétition et données autorisées

La seule compétition disponible est :

```text
FL1
```

`FL1` est uniquement un code technique contrôlé.

Toutes les données doivent être fictives :

- noms d’équipes ;
- identifiants d’équipes ;
- identifiants de matchs ;
- identifiants de saisons ;
- métadonnées du fournisseur ;
- scores éventuels ;
- autres attributs métier.

Aucun nom réel de club et aucune donnée réelle de Ligue 1 ne sont autorisés.

Le maximum architectural général reste fixé à trois compétitions, mais la Phase 2.7 est strictement limitée à une seule compétition.

---

## 5. Matchs retournés

Le fournisseur factice doit retourner exactement trois matchs.

Les trois matchs doivent avoir le statut :

```text
SCHEDULED
```

Ne sont pas autorisés :

- un quatrième match ;
- un résultat terminé ;
- un match en direct ;
- un historique ;
- une génération dynamique de matchs.

---

## 6. Dates fixes

Les trois matchs doivent utiliser exactement :

```text
2099-08-14T18:00:00.000Z
2099-08-15T20:00:00.000Z
2099-08-16T19:30:00.000Z
```

Ces dates sont :

- au format ISO 8601 ;
- en UTC ;
- fixes ;
- déterministes ;
- indépendantes de l’environnement d’exécution.

Sont interdits :

- l’utilisation de l’heure système ;
- les dates relatives ;
- les générateurs aléatoires ;
- les temporisations ;
- une dépendance d’horloge ;
- une modification selon l’environnement.

Les futurs tests devront comparer les trois valeurs exactes.

---

## 7. Contrat HTTP nominal

Pour :

```text
GET /competitions/FL1/matches
```

la future réponse doit utiliser HTTP `200`.

Le corps doit être enveloppé selon cette structure :

```json
{
  "competitionCode": "FL1",
  "matches": []
}
```

Dans la réponse effective :

- `competitionCode` doit être exactement `FL1` ;
- `matches` doit contenir exactement trois éléments ;
- les trois matchs doivent avoir le statut `SCHEDULED` ;
- aucun tableau JSON nu ne doit être retourné.

---

## 8. Compétition indisponible

Pour toute valeur différente de `FL1`, la future réponse doit utiliser :

```text
HTTP 404
```

Le corps JSON doit être exactement :

```json
{
  "error": "COMPETITION_NOT_AVAILABLE"
}
```

Le code d’erreur ne doit pas être :

- traduit ;
- enrichi ;
- renommé ;
- remplacé par un message libre.

---

## 9. Fournisseur factice

Le fournisseur factice futur doit être créé exactement sous :

```text
src/infrastructure/providers/in-memory/in-memory-sports-data-provider.ts
```

Il constituera une implémentation locale du port :

```text
SportsDataProvider
```

Ses responsabilités seront limitées à :

- conserver en mémoire les trois matchs statiques ;
- retourner les dates déterministes approuvées ;
- respecter les modèles normalisés du domaine ;
- ne réaliser aucun appel externe ;
- ne réaliser aucune lecture persistée ;
- ne réaliser aucune écriture persistée.

Il ne constituera pas :

- un fournisseur de production ;
- un fournisseur réel ;
- un générateur configurable ;
- un simulateur générique ;
- un registre de fournisseurs ;
- un fallback ;
- un composant placé sous `src/testing`.

---

## 10. Activation du fournisseur

Pendant la Phase 2.7, `InMemorySportsDataProvider` devra être câblé directement et inconditionnellement dans la composition de l’application.

Sont interdits :

- une variable d’environnement de sélection ;
- une factory ;
- un registre de fournisseurs ;
- une résolution dynamique ;
- un fallback automatique ;
- plusieurs fournisseurs actifs ;
- l’activation de football-data.org ;
- l’activation de Sportmonks.

---

## 11. Cas d’usage

Le cas d’usage futur doit porter le nom exact :

```text
ListScheduledMatchesUseCase
```

Chemin prévu :

```text
src/application/use-cases/list-scheduled-matches.ts
```

Responsabilités autorisées :

- recevoir le code de compétition ;
- accepter uniquement `FL1` ;
- interroger le port `SportsDataProvider` ;
- retourner uniquement les matchs `SCHEDULED` ;
- préserver les modèles normalisés du domaine.

Sont interdits dans ce cas d’usage :

- la logique HTTP ;
- la logique de pari ;
- les recommandations ;
- les prédictions ;
- la logique de stockage ;
- les appels réseau ;
- la sélection dynamique d’un fournisseur.

---

## 12. Impacts architecturaux

### 12.1 Domaine

Aucune nouvelle entité n’est autorisée.

Aucune modification n’est prévue pour :

- `Competition` ;
- `Season` ;
- `Team` ;
- `Match` ;
- `Score` ;
- `MatchStatus` ;
- `ProviderMetadata`.

### 12.2 SportsDataProvider

Le contrat `SportsDataProvider` reste inchangé.

Si une incompatibilité réelle est découverte pendant l’implémentation future :

1. arrêter l’implémentation ;
2. ne pas modifier silencieusement le port ;
3. demander une nouvelle décision d’architecture.

### 12.3 Interface HTTP

Un seul futur endpoint métier est approuvé :

```text
GET /competitions/:competitionCode/matches
```

L’endpoint existant suivant doit rester inchangé :

```text
GET /health
```

Aucun autre endpoint n’est autorisé.

### 12.4 Cache

`InMemoryCache` reste :

- inchangé ;
- débrayable ;
- non utilisé par cette tranche.

Aucune nouvelle politique de TTL métier n’est autorisée.

### 12.5 SQLite

`SqlitePersistence` reste :

- inchangé ;
- purement logique ;
- débrayable ;
- non utilisé par cette tranche.

Sont interdits :

- un driver SQLite ;
- du SQL ;
- une table ;
- une migration ;
- un fichier `.db` ;
- un fichier `.sqlite` ;
- un fichier `.sqlite3` ;
- une lecture persistée ;
- une écriture persistée.

---

## 13. Tests futurs approuvés

Les futurs fichiers de tests sont :

```text
tests/unit/list-scheduled-matches.test.ts
tests/unit/in-memory-sports-data-provider.test.ts
tests/integration/matches.test.ts
tests/integration/unknown-competition.test.ts
```

Ils devront vérifier :

- `FL1` comme seule compétition disponible ;
- exactement trois matchs ;
- trois matchs au statut `SCHEDULED` ;
- les trois timestamps exacts ;
- l’enveloppe HTTP nominale ;
- HTTP `404` pour toute autre compétition ;
- le code exact `COMPETITION_NOT_AVAILABLE` ;
- l’absence d’appel réseau ;
- l’absence de persistance ;
- le maintien de `GET /health` ;
- le maintien de tous les tests de Phase 2.6.

---

## 14. Critères d’acceptation de l’implémentation future

- [ ] exactement un nouvel endpoint métier ;
- [ ] `GET /health` inchangé ;
- [ ] `FL1` seule compétition disponible ;
- [ ] exactement trois matchs fictifs ;
- [ ] équipes, identifiants et métadonnées entièrement fictifs ;
- [ ] trois matchs au statut `SCHEDULED` ;
- [ ] trois timestamps fixes approuvés ;
- [ ] réponse HTTP enveloppée ;
- [ ] HTTP `404` pour toute autre compétition ;
- [ ] code exact `COMPETITION_NOT_AVAILABLE` ;
- [ ] câblage direct de `InMemorySportsDataProvider` ;
- [ ] aucune sélection dynamique de fournisseur ;
- [ ] aucune dépendance npm supplémentaire ;
- [ ] aucun appel réseau ;
- [ ] aucune persistance réelle ;
- [ ] cache inchangé et inactif ;
- [ ] SQLite inchangé et inutilisé ;
- [ ] `npm run typecheck` réussi ;
- [ ] tous les tests réussis ;
- [ ] `npm run build` réussi.

Cette checklist vérifiera la future implémentation.

Elle ne constitue pas un formulaire d’arbitrage et ne remet pas en cause les huit décisions déjà approuvées.

---

## 15. Hors périmètre

Sont explicitement hors périmètre :

- football-data.org réel ;
- Sportmonks ;
- tout autre fournisseur réel ;
- le choix d’un fournisseur définitif ;
- les appels réseau ;
- l’authentification ;
- les sessions ;
- les écritures utilisateur ;
- les résultats réels ;
- les matchs en direct ;
- l’historique ;
- le détail individuel d’un match ;
- un endpoint de liste des compétitions ;
- plusieurs compétitions actives ;
- le stockage fichier ;
- SQLite réel ;
- SQL ;
- un cache métier actif ;
- les prédictions ;
- les recommandations ;
- la logique de pari ;
- la génération dynamique de données ;
- la configuration dynamique ;
- une factory de fournisseurs ;
- une nouvelle dépendance npm ;
- un abonnement payant ;
- un cloud obligatoire ;
- la conservation longue durée ;
- la redistribution de données brutes.

---

## 16. Contraintes permanentes

Les contraintes permanentes restent applicables :

- budget maximal : `0 €` ;
- fonctionnement en lecture seule ;
- maximum architectural général : trois compétitions ;
- Phase 2.7 limitée à `FL1` ;
- football-data.org reste provisoire, remplaçable et non activé ;
- Sportmonks reste non implémenté ;
- aucun fournisseur définitif n’est sélectionné ;
- aucun service payant n’est autorisé ;
- aucun cloud n’est obligatoire ;
- aucune conservation longue durée avant validation juridique ;
- aucune redistribution de données brutes.

---

## 17. Traçabilité

Documents de référence :

- [Contrat SportsDataProvider](sports-data-provider-contract.md)
- [Contrats du domaine](domain-contracts.md)
- [Structure détaillée du projet](detailed-project-structure.md)
- [Validation de la Phase 2.5](phase-2-5-detailed-design-validation-pack.md)
- [Validation de l’architecture Phase 2](phase-2-architecture-validation-pack.md)
- [DEC-005](../06-operations/decision-log.md#dec-005--approbation-du-cadrage-fonctionnel-de-la-phase-27)

---

## 18. Conclusion

Les huit décisions fondatrices sont approuvées.

Le cadrage fonctionnel de la Phase 2.7 est figé.

Ce document n’autorise aucune modification sous `src/` ou `tests/`.

Une autorisation séparée est requise avant la création d’une branche d’implémentation ou l’écriture de code.

**CADRAGE PHASE 2.7 APPROUVÉ — IMPLÉMENTATION ENCORE NON AUTORISÉE**

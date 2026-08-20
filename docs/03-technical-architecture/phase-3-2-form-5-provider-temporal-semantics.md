# Sémantique temporelle SportsDataProvider — Phase 3.2 : Form 5

> **Date :** 2026-08-19
> **Responsable :** Fondateur ABYSS
> **Statut :** Approuvée par le Fondateur — implémentation conditionnelle après fusion et audit post-fusion de DEC-020
> **Référence base :** `593520398fa2b4e61f1749bb604d949b5022870b`
> **PR technique concernée :** `#26` (`implementation/phase-3-2-form-5`)

---

## 1. Contexte

La Phase 3.2 introduit la première tranche analytique d'Athena : **Form 5** (forme récente des 5 derniers matchs).

L'audit technique de la PR `#26` a révélé une anomalie majeure d'architecture (**M-001**) : en l'absence de bornes temporelles transmises par la couche Application, l'adaptateur `FootballDataOrgAdapter` appliquait une fenêtre glissante par défaut de 7 jours (`[now, now + 7j)`), empêchant la récupération de l'historique des matchs `FINISHED` passés de la saison courante.

Toute tentative de déduire artificiellement une date de début de saison (telle que le 1er juillet UTC) a été rejetée comme une convention arbitraire non garantie par le domaine.

---

## 2. Blocage M-001

Le modèle `Season` contient des années (`startYear: 2099`, `endYear: 2100`) mais aucune date UTC exacte de début/fin de saison.

De son côté, le port `SportsDataProvider` offre la signature :
```typescript
getMatches(
  competitionCode: string,
  fromDate?: Date,
  toDate?: Date
): Promise<Match[]>;
```

Si `fromDate` et `toDate` ne sont pas transmis, la sémantique n'était jusqu'ici pas formellement spécifiée au niveau du contrat.

---

## 3. Cause racine

L'adaptateur `football-data.org` appliquait historiquement un comportement par défaut restreint à la fenêtre glissante de 7 jours.

Cette logique d'infrastructure créait une ambiguïté : l'Application s'attendait à ce que `getMatches(code)` retourne tous les matchs disponibles de la saison, alors que le provider restreignait la réponse au futur immédiat.

---

## 4. Arbitrage Fondateur

Le Fondateur ABYSS a approuvé l'arbitrage architectural suivant :

1. **Port inchangé :** La signature de `SportsDataProvider.getMatches(competitionCode, fromDate?, toDate?)` reste strictement inchangée.
2. **Sémantique sans bornes :** `getMatches(competitionCode)` sans dates signifie contractuellement la récupération de tous les matchs disponibles de la **saison courante** de cette compétition.
3. **Déplacement de responsabilité :** La fenêtre glissante `[now, now + 7j)` pour les matchs programmés n'est plus une politique implicite de l'infrastructure, mais devient un filtre/borne **explicite** transmis par la couche Application.

---

## 5. Sémantique contractuelle de `getMatches`

- `getMatches(competitionCode, fromDate, toDate)` avec dates : Récupère les matchs correspondant à la plage temporelle UTC `[fromDate, toDate]`.
- `getMatches(competitionCode)` sans dates : Récupère les matchs disponibles de la **saison courante** de la compétition selon la capacité native du provider.

---

## 6. Responsabilité du provider

Le provider doit :
- Normaliser tous les matchs retournés quel que soit leur statut (`SCHEDULED`, `FINISHED`, `LIVE`, etc.).
- Conserver la sémantique "saison courante" si aucun paramètre de date n'est fourni.
- **Interdiction stricte :** Aucun provider ne doit remplacer silencieusement un appel sans dates par une fenêtre arbitraire ou implicite (ex: `[now, now+7j)`, 30/60/90 jours, ou date conventionnelle inventée).

---

## 7. Responsabilité de la couche Application

La couche Application prend en charge la définition des bornes temporelles pour les besoins fonctionnels spécifiques :
- Pour les matchs programmés du Match Center : Transmet une fenêtre temporelle explicite.
- Pour l'analyse historique Form 5 : Interroge `getMatches(competitionCode)` sans dates pour obtenir la saison courante.

---

## 8. Préservation de `/matches`

Le comportement de la route `GET /competitions/:competitionCode/matches` reste strictement inchangé pour les utilisateurs.

`ListScheduledMatchesUseCase` transmet explicitement la fenêtre temporelle requise et filtre uniquement les matchs au statut `SCHEDULED`.

---

## 9. Architecture `/analysis`

Pour `GET /competitions/:competitionCode/matches/analysis` :
1. **Appel principal :** `getMatches(competitionCode, now, now + 7j)` pour obtenir les matchs programmés à afficher.
2. **Appel historique séparé :** `getMatches(competitionCode)` sans dates pour obtenir les matchs de la saison courante.

---

## 10. Récupération historique Form 5

L'historique retourné par l'appel 2 est transmis à `FormCalculator`.

---

## 11. FormCalculator

`FormCalculator` applique les filtres métiers purs :
- Même compétition (`competitionId`);
- Même saison (`seasonId`);
- Statut `FINISHED` uniquement ;
- Score `fullTime` complet non-null ;
- `utcDate < targetDate` (strictement antérieur — anti look-ahead) ;
- Tri `utcDate DESC` avec tie-break stable par `id DESC` ;
- Maximum 5 résultats retenus ;
- Représentation interne neutre : `WIN` / `DRAW` / `LOSS`.

---

## 12. Anti N+1

Complexité en requêtes provider : **O(1)**.

Pour afficher N cartes analytiques dans le Match Center, le Use Case effectue au total **exactement 2 requêtes provider** (1 principale + 1 historique mutualisée pour l'ensemble des équipes).

Aucun appel provider par équipe ou par carte.

---

## 13. Dégradation gracieuse / M-002

La règle de dégradation M-002 reste obligatoire :
- Si l'appel principal échoue : Erreur globale HTTP transmise (404/429/503).
- Si l'appel principal réussit mais l'appel historique échoue (ex: exception réseau) : Le Use Case intercepte l'erreur, conserve les matchs principaux, et marque la Form 5 de chaque équipe comme `UNAVAILABLE` (`results: []`). Le serveur retourne HTTP 200 et le Match Center ne tombe pas.

---

## 14. Couverture frontend / M-003

La couverture des tests frontend Form 5 (M-003) reste intégralement acquise :
- Mappage UI : `WIN -> V`, `DRAW -> N`, `LOSS -> D`.
- Libellés accessibles ARIA (`Victoire`, `Nul`, `Défaite`).
- Affichage `INSUFFICIENT_DATA` : *"Données de forme indisponibles"*.
- Affichage `UNAVAILABLE` : *"Forme temporairement indisponible"*.
- Rendu DOM textuel sécurisé (`textContent`, `createElement`).
- Absence totale de `undefined`, `null` utilisateur ou `[object Object]`.

---

## 15. Règles d’échec provider

Si un provider externe n'est pas en mesure d'honorer la demande sans dates (saison courante), il doit échouer explicitement via les exceptions prévues (`ProviderUnavailableError`, etc.). Il ne doit en aucun cas renvoyer silencieusement un sous-ensemble tronqué arbitrairement.

---

## 16. Interdiction des bornes arbitraires

Il est formellement interdit d'introduire des dates artificielles non garanties par le modèle (telles qu'un 1er juillet ou 1er août fictif).

---

## 17. Hors périmètre

Sont strictement proscrits de cette décision et de sa future implémentation :
- SQLite / toute persistance longue durée ;
- Nouveau provider / Sportmonks ;
- Multi-compétition / inter-saison ;
- ML / Machine Learning / Decision Engine ;
- Cotes bookmaker / EV / Kelly / Variance / Risk.

---

## 18. Tests obligatoires du futur correctif

Le futur commit correctif M-001 sur la PR `#26` devra valider :
1. `FootballDataOrgAdapter` sans dates : Ne filtre plus par `[now, now+7j)`.
2. `ListScheduledMatchesUseCase` : Transmet la fenêtre explicite `[now, now+7j)`.
3. `ListAnalyticalMatchesUseCase` : Effectue les 2 appels séparés O(1).
4. Tests de non-régression `/matches` et `/analysis` 100% verts.
5. Verification M-002 (échec historique isolé -> `UNAVAILABLE`).

---

## 19. Phase 2.9 / validation réelle

Aucun appel réseau réel à `football-data.org` n'est autorisé pendant la rédaction ou l'audit de DEC-020.

---

## 20. Autorisation conditionnelle d’implémentation

L'approbation du cadrage DEC-020 autorise sa formalisation documentaire.

Elle **N'AUTORISE PAS ENCORE** la modification du code source sur la PR `#26`.

Le troisième commit correctif M-001 sur `implementation/phase-3-2-form-5` (PR `#26`) sera autorisé **UNIQUEMENT APRÈS** :
1. Fusion conforme de DEC-020 par *Create a merge commit* ;
2. Audit post-fusion positif de DEC-020.

---

## 21. Critères de conformité

- Baseline tests 100% verte (173/173 tests sur `architecture/phase-2-technical-design`).
- Documentation claire, sans ambiguïté.
- Absence de toute modification de code dans la PR documentaire.

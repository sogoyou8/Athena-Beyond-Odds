# Phase 3.3 — Cadrage du profil de force saisonnier des équipes

## 1. Décision

- **Décision :** DEC-023 — Phase 3.3 — Cadrage du profil de force saisonnier des équipes
- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Portée :** Cadrage produit, fonctionnel et contraintes architecturales de la Phase 3.3. **L'implémentation logicielle n'est pas autorisée à ce stade.**

---

## 2. Objectif produit de la Phase 3.3

La Phase 3.3 a pour objectif d'introduire une nouvelle couche **analytique factuelle** au sein du Match Center d'Athena Beyond Odds, permettant de situer la performance et la force saisonnière de chaque équipe avant la rencontre.

Cette couche d'analyse répond à des questions objectives et vérifiables :
- Quelle est la performance globale de l'équipe sur la saison courante ?
- L'équipe produit-elle plus offensivement qu'elle ne concède défensivement ?
- Quel est son rendement moyen (points par match, buts par match) ?
- Existe-t-il une asymétrie de performance entre ses matchs à domicile et ses matchs à l'extérieur ?
- Comment se situe l'équipe par rapport aux autres équipes de la même compétition ?
- Le profil de force saisonnier confirme-t-il, nuance-t-il ou contredit-il le signal de forme récente fourni par Form 5 ?

### Principes et limites infranchissables
- Il ne s'agit **PAS** d'un modèle prédictif ou de probabilités de victoire.
- Il ne s'agit **PAS** d'un score de confiance ou d'un indice de recommandation de pari.
- Il ne s'agit **PAS** d'un système de notation opaque ou pondéré artificiellement.
- Toutes les métriques produites sont strictement descriptives, déterministes et vérifiables à partir des scores réels.

---

## 3. Frontière stricte entre Form 5 et Profil Saisonnier

Une séparation conceptuelle nette est établie pour éviter toute redondance :

| Dimension | Form 5 (Phase 3.2) | Profil de Force Saisonnier (Phase 3.3) |
| :--- | :--- | :--- |
| **Question centrale** | "Comment l'équipe vient-elle de performer récemment ?" | "Comment l'équipe performe-t-elle sur l'ensemble de la saison ?" |
| **Horizon temporel** | Court terme (maximum 5 derniers matchs) | Moyen/long terme (tous les matchs joués de la saison courante) |
| **Nature du signal** | Dynamique récente, momentum | Niveau structurel, régularité de fond |
| **Volatilité** | Forte sensibilité au calendrier récent | Métriques stabilisées et représentatives |

### Interdiction de doublon
Il est formellement interdit de réintroduire dans le profil saisonnier des métriques de court terme (ex. *Last 3*, *Last 5 bis*, momentum pondéré, scores de série), qui feraient doublon avec Form 5.

---

## 4. Source de vérité et intégrité des données

Le calcul du profil saisonnier repose exclusivement sur les règles d'intégrité suivantes :
- **Périmètre de compétition :** Même compétition uniquement.
- **Périmètre temporel :** Saison courante (`seasonId` identique). Aucune traversée inter-saison ni moyenne pluriannuelle.
- **Statut des matchs :** Matchs avec statut `FINISHED` uniquement, strictement antérieurs à la date du match cible (`utcDate < targetDate`).
- **Scores complets :** Score `fullTime` non null obligatoire (`home !== null` et `away !== null`).
- **Aucune donnée inventée :** Aucun score ou résultat n'est extrapolé.

---

## 5. Métriques Core Candidates

Le cœur minimal du profil saisonnier est constitué des métriques factuelles suivantes :

1. **Matchs joués (`played`) :** Nombre total de matchs terminés.
2. **Bilan (`wins`, `draws`, `losses`) :** Décompte des victoires, nuls et défaites du point de vue de l'équipe.
3. **Points cumulés (`points`) :** Barème classique du football ($Victoire = 3$, $Nul = 1$, $Défaite = 0$).
4. **Points par match (`pointsPerMatch`) :** $\frac{\text{points}}{\text{played}}$ (si $\text{played} > 0$).
5. **Buts marqués (`goalsFor`) :** Total des buts inscrits.
6. **Buts encaissés (`goalsAgainst`) :** Total des buts concédés.
7. **Différence de buts (`goalDifference`) :** $\text{goalsFor} - \text{goalsAgainst}$.
8. **Moyenne de buts marqués (`goalsForPerMatch`) :** $\frac{\text{goalsFor}}{\text{played}}$.
9. **Moyenne de buts encaissés (`goalsAgainstPerMatch`) :** $\frac{\text{goalsAgainst}}{\text{played}}$.

---

## 6. Split Domicile / Extérieur (Home / Away)

Le rendement d'une équipe en football présente souvent une forte spécificité selon le lieu de la rencontre. Phase 3.3 cadre la pertinence des splits :
- **Split Domicile (`homeSplit`) :** Calculé uniquement sur les matchs joués à domicile.
- **Split Extérieur (`awaySplit`) :** Calculé uniquement sur les matchs joués à l'extérieur.

Chaque split décline les métriques fondamentales : `played`, `wins`, `draws`, `losses`, `points`, `pointsPerMatch`, `goalsFor`, `goalsAgainst`, `goalDifference`.

Dans le Match Center, le profil pourra ainsi présenter le split contextualisé à la rencontre cible :
- Pour l'équipe recevante : split Domicile.
- Pour l'équipe visiteuse : split Extérieur.

---

## 7. Position relative et Classement (Ranking)

L'évaluation relative d'une équipe au sein de son championnat est une composante essentielle de son profil de force.

DEC-023 pose les exigences pour l'intégration éventuelle d'un `seasonRank` ou d'un percentile :
- Calcul 100% déterministe basé sur les matchs `FINISHED` de la saison courante.
- Aucun appel à un endpoint tiers de classement (*standings*) si l'historique des matchs permet de dériver le classement.
- Règles de départage (*tie-break*) formellement documentées.

La décision d'inclure le classement dès le premier incrément reste ouverte à arbitrage (voir OQ-007 et OQ-008).

---

## 8. Métriques exclues du périmètre Core initial

Les métriques et modèles dérivés suivants ne sont **PAS** retenus dans le cœur initial de Phase 3.3 :
- Statistiques de possession, tirs, tirs cadrés, corners, cartons, fautes ;
- Métriques avancées : *expected goals* ($xG$), *expected points* ($xPTS$), *clean sheets*, *failed to score*, BTTS, Over/Under ;
- Modèles de force dérivés ou notations synthétiques : Elo rating, SPI (Soccer Power Index), Power Rankings propriétaires, indices composites.

Toutes les métriques de Phase 3.3 doivent demeurer immédiatement lisibles, transparentes et directement calculables.

---

## 9. Interdiction des scores synthétiques de force

La Phase 3.3 **ne doit pas** produire de score synthétique global ou de métrique agrégée opaque (ex. `strengthScore = 0.82` ou `teamPower = 74/100`).

Les métriques doivent rester séparées et explicables. Tout modèle combinatoire fera l'objet d'une phase dédiée ultérieure.

---

## 10. Architecture et mutualisation des accès provider (Anti N+1)

Contrainte architecturale majeure de Phase 3.3 :
- **Réutilisation prioritaire du dataset historique :** Les données de la saison courante nécessaires à Form 5 (Phase 3.2) contiennent déjà l'ensemble des matchs terminés requis pour le profil saisonnier.
- **Complexité $O(1)$ préservée :** La route `/analysis` doit continuer d'exécuter au maximum 2 appels provider :
  1. Appel principal avec fenêtre programmée `[now, now+7j)` ;
  2. Appel historique mutualisé de la saison courante sans bornes de dates.
- **Calculateurs locaux multiples :** Le use case combinera `FormCalculator` et un futur `SeasonStrengthCalculator` sur le même flux de données en mémoire.
- **Interdiction absolue :** Aucun appel API supplémentaire par équipe ou par carte de match.

---

## 11. Gestion de la disponibilité et Dégradation gracieuse

Le profil saisonnier adoptera les états analytiques locaux normalisés :
- `AVAILABLE` : Historique suffisant et exploitable pour calculer le profil.
- `INSUFFICIENT_DATA` : Historique réel présent mais volume de matchs insuffisant pour établir un profil représentatif.
- `UNAVAILABLE` : Historique non accessible ou échec provider.

### Règle du zéro match
Si une équipe compte 0 match terminé dans la saison, le système ne doit pas afficher de faux zéros calculés (0.00 PPG, 0% victoires) comme des statistiques réelles. L'état doit être explicitement `INSUFFICIENT_DATA`.

Le Match Center principal reste affiché et utilisable même en cas de profil saisonnier indisponible.

---

## 12. Explicabilité et Intégrité des calculs

Toutes les métriques calculées doivent être directement vérifiables :
$$\text{Points par Match} = \frac{\text{Points cumulés}}{\text{Matchs joués}}$$
$$\text{Différence de Buts} = \text{Buts marqués} - \text{Buts encaissés}$$

Aucun coefficient caché, aucun poids subjectif.

---

## 13. Contraintes non fonctionnelles

Phase 3.3 respecte scrupuleusement les contraintes de gouvernance :
- Monolithe modulaire TypeScript / Express / Vanilla CSS / HTML ;
- Port `SportsDataProvider` et abstraction provider inchangés ;
- Budget $0\text{ €}$ ;
- Cache en mémoire avec TTL ;
- Aucune base de données persistante nouvelle requise en production ;
- Aucune donnée brute redistribuée ;
- Sécurité et observabilité conformes aux standards DEC-021.

---

## 14. Éléments strictement hors périmètre de Phase 3.3

Sont formellement exclus de cette phase :
- Historique des confrontations directes (H2H) ;
- Données contextuelles (blessures, suspensions, météo, fatigue, temps de déplacement) ;
- Cotes de paris sportifs, mouvements de marché, CLV, analyse de valeur (Value / EV) ;
- Gestion de bankroll (critère de Kelly, staking) ;
- Modèles prédictifs, Machine Learning, Decision Engine ;
- Recommandations ou incitations au pari.

---

## 15. Questions Ouvertes (Open Questions)

Les questions suivantes sont formellement ouvertes pour arbitrage par le Fondateur :

- **OQ-007 :** Le classement saisonnier (`seasonRank`) doit-il être intégré dès le premier incrément de Phase 3.3 ou différé ?
- **OQ-008 :** Si un ranking est affiché, doit-il s'agir du classement officiel de la ligue ou d'un ranking analytique interne Athena calculé sur les matchs joués ?
- **OQ-009 :** Quelles sont les règles exactes de départage (*tie-break*) en cas d'égalité de points (différence de buts générale, buts marqués, confrontations directes) ?
- **OQ-010 :** Quel est le seuil minimal de matchs joués ($N$) à partir duquel un profil de force est considéré statistiquement représentatif (vs mention de faible échantillon) ?
- **OQ-011 :** Quelle convention d'arrondi et de précision retenir pour l'affichage UI des ratios (ex. PPG à 1 ou 2 décimales) ?
- **OQ-012 :** Faut-il afficher dans l'interface le profil global et les deux splits (domicile + extérieur), ou uniquement le profil global et le split contextualisé au match ?
- **OQ-013 :** Quelles métriques complémentaires méritent d'être retenues pour le premier incrément sans surcharger la carte de match ?
- **OQ-014 :** La structure actuelle du dataset historique de la saison courante est-elle suffisante pour alimenter l'ensemble des calculs sans extension du port provider ?
- **OQ-015 :** Quel contrat DTO précis et normalisé retenir pour exposer le `SeasonStrengthProfile` sur l'endpoint `/analysis` ?

---

## 16. Critères d'acceptation et de succès de la Phase 3.3

1. Profil de force saisonnier calculé exclusivement à partir des matchs `FINISHED` réels.
2. Aucune donnée inventée, extrapolée ou prédictive.
3. Respect strict de la même compétition et de la saison courante.
4. Profil global et splits domicile/extérieur cohérents.
5. Distinction nette et complémentarité avec Form 5 sans redondance.
6. Maintien de la complexité $O(1)$ en requêtes provider (zéro N+1).
7. Dégradation gracieuse opérationnelle.
8. Tests automatisés déterministes et couverture unitaire/intégration complète.
9. Rendu frontend accessible, sobre et parfaitement intégré au Match Center.

---

## 17. Séquence de décision

```text
DEC-023 (Cadrage Produit & Contraintes)
       │
       ▼
Arbitrages du Fondateur sur OQ-007 à OQ-015
       │
       ▼
DEC-024 (Conception Technique Détaillée Season Strength)
       │
       ▼
Fusion et audit documentaire de DEC-024
       │
       ▼
Autorisation d'implémentation technique (Phase 3.3)
```

**L'implémentation logicielle reste strictement interdite tant que la conception technique n'a pas été formellement approuvée et auditée.**

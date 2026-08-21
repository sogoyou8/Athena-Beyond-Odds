# Phase 3.8 — League Context / Positionnement relatif dans la compétition : Cadrage Produit (DEC-038)

---

## 1. CONTEXTE ET MOTIVATION DU PRODUIT

ATHENA dispose désormais de **6 briques descriptives** intégrées au Match Center :
1. **Form 5** (forme récente sur 5 matchs)
2. **Season Strength** (force saisonnière globale et contextuelle)
3. **H2H contextualisé** (confrontations directes historiques)
4. **Repos & Congestion** (Schedule Load)
5. **Momentum** (dynamique récente comparative)
6. **Opponent Context** (niveau saisonnier des adversaires récents)

### Le constat méthodologique
Actuellement, ATHENA expose des statistiques descriptives brutes (ex: `Points/match = 1.46`, `Diff. buts/match = +0.29`). Cependant, une valeur brute isolée ne permet pas à l'utilisateur de répondre directement à la question :
*« 1.46 Pts/match, est-ce une performance élevée, moyenne ou faible dans cette compétition, à cette date précise ? »*

### L'objectif de la Phase 3.8
La **Phase 3.8 « League Context » (Contexte championnat)** comble cette lacune d'interprétation relative en situant chaque équipe par rapport à l'ensemble des équipes de sa propre ligue, **métrique par métrique**, sans jamais fabriquer de score composite ni de modèle prédictif.

Elle constitue le socle statistique normé indispensable qui permettra, dans une phase ultérieure, de concevoir un *Power Rating ATHENA* rigoureux et transparent.

---

## 2. DÉFINITION ET QUESTION MÉTIER

- **Nom analytique :** `League Context`
- **Nom documentaire :** `Positionnement relatif dans la compétition`
- **Nom UI :** `Contexte championnat` (ou `Repères championnat`)
- **Nature :** Purement descriptive, déterministe, explicable, non prédictive.
- **Question métier résolue :**
  > *« Comment les statistiques de cette équipe se situent-elles par rapport aux autres équipes de la même compétition à la date du match cible ? »*
- **Ce que League Context ne résout PAS :**
  - Ne répond PAS à *« Quelle équipe est la plus forte ? »*.
  - Ne répond PAS à *« Qui va gagner ? »*.
  - Ne calcule aucun Power Rating, Score ATHENA, Team Score ou indice synthétique.
  - Ne produit aucune cote, probabilité, Value, EV ou Kelly.

---

## 3. ARBITRAGES FONDATEUR ET CONTRATS PRODUIT (OQ-126 À OQ-149)

### 3.1 Snapshot temporel et étanchéité (OQ-126, OQ-127)
- **`STRICT_TARGET_DATE_SNAPSHOT = YES` :** Pour tout match cible $T$, toutes les statistiques de toutes les équipes de référence utilisent exclusivement les matchs historiques terminés avec `historicalMatch.utcDate < targetMatch.utcDate`. Aucune donnée $\ge T$ n'est utilisée (zéro look-ahead, zéro data leakage, compatibilité totale avec les futurs backtests chronologiques).
- **`TARGET_SEASON_ONLY = YES` :** Seule la saison courante de la compétition est analysée. Aucun report de points ou de données des saisons antérieures (N-1, N-2) dans la v1.

### 3.2 Population de référence (OQ-128, OQ-135)
- **`REFERENCE_POPULATION = ALL_ELIGIBLE_COMPETITION_TEAMS` :** La population de référence englobe l'ensemble des équipes de la compétition ayant disputé au moins un match éligible (`FINISHED`, score `fullTime` complet, même saison, même compétition, `utcDate < targetMatch.utcDate`).
- La population n'est pas restreinte aux deux équipes du match cible ni aux adversaires récents.
- **`MINIMUM_ELIGIBLE_TEAMS = 4` :** Pour que l'état soit `AVAILABLE`, la population d'équipes éligibles doit compter au moins 4 équipes ($\text{populationSize} \ge 4$). Si $\text{populationSize} < 4$, l'état est `INSUFFICIENT_DATA`.

### 3.3 Métriques évaluées en v1 (OQ-129, OQ-136)
- **`METRICS_V1 = pointsPerMatch, goalDifferencePerMatch` :** Strictement les deux ratios fondamentaux de performance saisonnière.
- **`OVERALL_ONLY = YES` :** En v1, le positionnement relatif porte sur les profils globaux (overall). Les classements spécifiques domicile/extérieur sont réservés pour des extensions ultérieures.

### 3.4 Sorties relatives par métrique (OQ-130, OQ-138)
Pour chaque métrique évaluée, League Context expose conceptuellement :
1. `value` : La valeur brute de l'équipe cible (ex: 1.46).
2. `competitionAverage` : La moyenne de la métrique sur l'ensemble de la population éligible.
3. `rank` : Le rang de l'équipe au sein de la population (rang 1 = meilleure valeur, `DESCENDING_RANK`).
4. `populationSize` : Le nombre total d'équipes éligibles évaluées.
5. `percentile` : Le percentile de positionnement relatif de l'équipe (valeur numérique déterministe).
6. `differenceFromAverage` : L'écart arithmétique simple ($\text{value} - \text{competitionAverage}$).

- **`NO_QUALITATIVE_LABEL = YES` :** Aucun qualificatif subjectif (fort, faible, moyen, top team, bon/mauvais). Les faits sont présentés sous forme purement numérique.

### 3.5 Gestion des ex æquo et calcul des rangs (OQ-131, OQ-132)
- **`RANK_METHOD = DENSE_RANK` :** Classement dense décroissant. En cas d'égalité de valeur, les équipes partagent le même rang sans trou dans la séquence numérique qui suit.
  - *Exemple :* `[2.00, 1.80, 1.80, 1.50]` $\rightarrow$ Rangs `[1, 2, 2, 3]`.

### 3.6 Définition du percentile et gestion des ties (OQ-133)
- **`PERCENTILE_DESIGN_RULE` :** La méthode de calcul du percentile doit être purement déterministe, étanche dans le temps, documentée et explicite dans son traitement des égalités.
- **Note formelle :** La formule mathématique exacte n'est pas figée dans DEC-038. L'expression candidate `strictlyLower / (populationSize - 1) * 100` sera formellement arbitrée lors de la conception technique (DEC-039) après les conclusions du Gate A.

### 3.7 Moyenne de compétition (OQ-134)
- **`EQUAL_TEAM_WEIGHT_AVERAGE = YES` :** La moyenne du championnat est la moyenne arithmétique simple des valeurs des équipes éligibles ($\frac{1}{N} \sum \text{value}_i$). Chaque équipe éligible a un poids identique (non pondérée par le nombre de matchs joués).

### 3.8 Pas de score composite ni de classement officiel (OQ-137, OQ-140)
- **`NO_COMPOSITE_SCORE = YES` :** Interdiction stricte de fusionner PPM et GD/m en un score agrégé unique.
- **`OFFICIAL_STANDINGS_REPLACEMENT = NO` :** League Context ne remplace pas et ne prétend pas être le classement officiel de la ligue. C'est un profil statistique multidimensionnel au cutoff temporel strict.

---

## 4. INTÉGRATION VISUELLE ET FRONTEND (OQ-145, OQ-146)

- **Nom du composant :** `Contexte championnat`
- **Positionnement UI :** Inséré immédiatement **après** `Season Strength` et **avant** `H2H contextualisé`.
  - *Ordre des briques Match Center :*
    1. Form 5
    2. Season Strength
    3. **Contexte championnat (League Context)**
    4. H2H contextualisé
    5. Repos & Congestion
    6. Momentum / Dynamique récente
    7. Opponent Context / Adversaires récents
- **Formatage d'affichage :**
  - Ratios et écarts formatés à 2 décimales (avec `+` pour les écarts positifs et préservation stricte du vrai zéro `0.00`).
  - Percentiles affichés sous forme d'entiers pourcentage (ex: `72 %`).
  - Présentation distincte et lisible pour `Points / match` et `Différence de buts / match`.
- **Gestion des états locaux (OQ-139) :**
  - `AVAILABLE` : Rendu des métriques, rangs, percentiles et moyennes.
  - `INSUFFICIENT_DATA` : Mention `Données insuffisantes` (si $< 4$ équipes éligibles, aucun faux zéro).
  - `UNAVAILABLE` : Mention `Indisponible` en cas de défaillance du flux.
  - **`GLOBAL_FRONTEND_STATES = 9` :** Les 9 états globaux de l'application restent strictement inchangés.

---

## 5. CONTRAINTES TECHNIQUES CIBLES ET AUDIT GATE A (OQ-140 À OQ-144)

### 5.1 Objectifs d'architecture
- **Calculateur dédié :** `LeagueContextCalculator` (pur, synchrone, déterministe, zéro I/O, sans `Date.now()`, sans mutation, sans dépendance provider).
- **Corpus & Flux :** Réutilisation exclusive du flux d'historique partagé `COMPETITION_WIDE`.
- **Budgets réseau cibles :**
  - Application Provider Invocations : maximum 2.
  - History Provider Invocations : 1 (mutualisé).
  - League Context Extra Calls : **0 appel Application**, **0 requête HTTP**.
  - Plafond HTTP : $\le 5$ requêtes.
  - Absence de N+1 : $O(1)$.
- **Frontière d'entrée ouverte (OQ-144) :** Le choix entre injecter `historyByTeam` ou le tableau brut `historicalMatches` reste ouvert et sera tranché lors du Gate A technique.

### 5.2 Questions clés du Gate A de faisabilité
Après la fusion de DEC-038, le Gate A devra vérifier :
1. L'identification complète et locale de toutes les équipes de la compétition dans le corpus `COMPETITION_WIDE`.
2. Le filtrage strict de la population éligible ($\ge 1$ match terminé au cutoff).
3. Le calcul des moyennes, du `DENSE_RANK` et du percentile au cutoff temporel strict.
4. L'impact CPU du calcul de l'ensemble de la ligue pour chaque match cible et l'évaluation d'un modèle de complexité précis.
5. La pertinence d'une mémoïsation locale request-scoped si plusieurs matchs cibles partagent un cutoff identique.

---

## 6. PÉRIMÈTRE EXCLU ET SÉQUENÇAGE

- **`TRAVEL_DEFERRED = YES` (OQ-148) :** L'analyse des déplacements/distances géographiques est différée (nécessitera un chantier de données géospatiales distinct).
- **`POWER_RATING_OUT_OF_SCOPE = YES` (OQ-149) :** Le Power Rating n'est pas abordé en Phase 3.8. League Context en prépare le socle relatif sans biais.
- **`MARKET_OUT_OF_SCOPE = YES` :** Aucune cote de bookmaker, Value, EV, CLV ou modèle de mise.
- **`FOOTBALL_V1_ONLY = YES` (OQ-147) :** Implémentation v1 dédiée au football, avec une formalisation conceptuelle extensible aux sports futurs.

---

## 7. RÉCAPITULATIF DES DÉCISIONS DEC-038 (OQ-126 À OQ-149)

| Arbitrage | Décision retenue | Statut |
| :--- | :--- | :--- |
| **OQ-126** | Snapshot temporel strict (`STRICT_TARGET_DATE_SNAPSHOT`) | ✅ Approuvé |
| **OQ-127** | Saison cible uniquement (`TARGET_SEASON_ONLY`) | ✅ Approuvé |
| **OQ-128** | Population : ensemble des équipes éligibles de la compétition | ✅ Approuvé |
| **OQ-129** | Métriques v1 : PPM et GD/m uniquement | ✅ Approuvé |
| **OQ-130** | Sortie relative complète (valeur, moyenne, rang, population, percentile, écart) | ✅ Approuvé |
| **OQ-131** | Classement décroissant (`DESCENDING_RANK`, rang 1 = max) | ✅ Approuvé |
| **OQ-132** | Gestion des égalités en `DENSE_RANK` (sans saut de rang) | ✅ Approuvé |
| **OQ-133** | Percentile déterministe et documenté (formule exacte arbitrée en DEC-039) | ✅ Approuvé |
| **OQ-134** | Moyenne de compétition à poids égal par équipe (`EQUAL_TEAM_WEIGHT_AVERAGE`) | ✅ Approuvé |
| **OQ-135** | Seuil de représentativité : minimum 4 équipes éligibles (`MINIMUM_ELIGIBLE_TEAMS = 4`) | ✅ Approuvé |
| **OQ-136** | Périmètre v1 restreint au profil global (`OVERALL_ONLY`) | ✅ Approuvé |
| **OQ-137** | Aucun score composite (`NO_COMPOSITE_SCORE`) | ✅ Approuvé |
| **OQ-138** | Aucun label ni qualificatif subjectif (`NO_QUALITATIVE_LABEL`) | ✅ Approuvé |
| **OQ-139** | États de disponibilité locaux (9 états globaux frontend inchangés) | ✅ Approuvé |
| **OQ-140** | Cible de réutilisation du flux d'historique partagé `COMPETITION_WIDE` | ✅ Approuvé |
| **OQ-141** | Préservation stricte du budget réseau (0 appel provider supplémentaire, max 5 HTTP) | ✅ Approuvé |
| **OQ-142** | Calculateur de domaine pur et dédié (`LeagueContextCalculator`) | ✅ Approuvé |
| **OQ-143** | Profils équipes calculés strictement au cutoff du match cible | ✅ Approuvé |
| **OQ-144** | Frontière d'entrée du calculateur ouverte jusqu'au Gate A | ✅ Approuvé |
| **OQ-145** | Positionnement UI après Season Strength et avant H2H | ✅ Approuvé |
| **OQ-146** | Ratios à 2 décimales, percentile en entier UI, vrais zéros préservés | ✅ Approuvé |
| **OQ-147** | Concept générique normé orienté football v1 | ✅ Approuvé |
| **OQ-148** | Brique Travel différée | ✅ Approuvé |
| **OQ-149** | Power Rating positionné séquentiellement après League Context | ✅ Approuvé |

---

## 8. PROCHAINE ÉTAPE

Après revue, validation de la PR documentaire et audit post-fusion de DEC-038 :
$\rightarrow$ **Exécution du Gate A de faisabilité technique Phase 3.8 (100% lecture seule).**
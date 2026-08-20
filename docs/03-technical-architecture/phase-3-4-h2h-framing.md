# Phase 3.4 — Cadrage du H2H contextualisé

## 1. Décision

- **Décision :** DEC-026 — Phase 3.4 — Cadrage du H2H contextualisé
- **Date :** 2026-08-20
- **Responsable :** Fondateur ABYSS
- **Statut :** Approuvée par le Fondateur
- **Conclusion :** Ouverture officielle de la Phase 3.4 en cadrage produit uniquement. L'implémentation logicielle, les modifications de code et les requêtes réseau provider ne sont pas autorisées à ce stade.

---

## 2. Objectif produit de la Phase 3.4

La Phase 3.4 vise à introduire la troisième brique analytique fondamentale du Match Center d'Athena : l'historique des confrontations directes (**Head-to-Head / H2H**).

Le H2H doit répondre à la question analytique :
> **« Que montrent factuellement les confrontations directes passées entre ces deux équipes avant le match cible ? »**

### Positionnement dans la chaîne analytique d'Athena

Le H2H apporte un signal distinct et complémentaire des deux premières briques :
1. **Form 5 (Phase 3.2) :** dynamique récente court terme (momentum des 5 derniers matchs de chaque équipe indépendamment).
2. **Season Strength (Phase 3.3) :** performance structurelle de fond de chaque équipe sur l'ensemble de sa saison courante.
3. **H2H Contextualisé (Phase 3.4) :** historique des confrontations directes spécifiques entre les **deux équipes en présence**.

---

## 3. H2H contextualisé vs H2H naïf

Athena Beyond Odds rejette formellement l'approche naïve du H2H consistant à afficher un simple bilan global (ex. *« Équipe A a gagné 6 des 10 derniers H2H »*) pour en déduire implicitement qu'une équipe est favorite.

Le H2H dans Athena doit être **contextualisé** afin que l'utilisateur comprenne la qualité, la représentativité et les limites de l'échantillon historique :
- **Taille de l'échantillon (`sampleSize` / `meetings`) :** rendre visible le nombre réel de rencontres observées sans surinterpréter 1 ou 2 matchs ;
- **Ancienneté des rencontres :** rendre identifiable l'horizon temporel des matchs (date de la dernière et de la plus ancienne rencontre) ;
- **Périmètre des saisons couvertes :** expliciter si les données proviennent de la saison courante ou d'un historique étendu ;
- **Ordre chronologique :** préserver la séquence temporelle des affrontements ;
- **Orientation Domicile / Extérieur :** distinguer la confrontation globale de la confrontation dans la même configuration de lieu que le match cible ;
- **Périmètre compétitif :** ne jamais agréger silencieusement des compétitions de nature différente ;
- **Transparence sur la disponibilité :** expliciter les états de données insuffisantes sans fabriquer de faux bilans.

Cette contextualisation a pour seul but d'éclairer l'analyste, **jamais de transformer un historique en prédiction automatique**.

---

## 4. Nature factuelle et interdictions formelles

Le premier incrément H2H doit être strictement :
- **Déterministe :** calcul pur à partir de matchs réels vérifiables ;
- **Explicable :** chaque agrégat doit être décomposable en résultats unitaires connus ;
- **Non prédictif :** aucune pondération arbitraire ni extrapolation sur le futur.

### Éléments formellement INTERDITS en Phase 3.4
- Aucun score de domination ou de force H2H synthétique (`h2hStrengthScore`, `dominanceScore`, indice 0-100) ;
- Aucun score de confiance ou d'avantage psychologique (`h2hConfidence`, `psychologicalAdvantage`) ;
- Aucun modèle prédictif ou calcul de probabilité de victoire (`prediction`, `winProbability`) ;
- Aucune cote de paris (*odds*), estimation de valeur (*value*), espérance (EV) ou critère de mise (Kelly) ;
- Aucun modèle d'apprentissage automatique (*Machine Learning*) ;
- Aucun moteur de décision automatisé (*Decision Engine*).

---

## 5. Principe de double perspective

Toute statistique H2H doit être restituée depuis la perspective de chacune des deux équipes du match cible.

Pour une confrontation entre l'Équipe A et l'Équipe B :
- **Perspective Équipe A :** victoires de A, nuls, défaites de A (victoires de B), buts pour A, buts contre A (marqués par B), différence de buts de A.
- **Perspective Équipe B :** victoires de B, nuls, défaites de B, buts pour B, buts contre B, différence de buts de B.

Aucun résultat ou agrégat ne doit être présenté sans que le référentiel d'équipe ne soit rendu parfaitement explicite.

---

## 6. Candidats pour les métriques Core

Les métriques candidates identifiées pour le noyau initial H2H sont factuelles et objectives :
- `meetings` (nombre de confrontations prises en compte / `sampleSize`)
- `wins` (victoires de l'équipe dans la perspective)
- `draws` (matchs nuls)
- `losses` (défaites de l'équipe dans la perspective)
- `goalsFor` (buts marqués par l'équipe)
- `goalsAgainst` (buts encaissés par l'équipe)
- `goalDifference` ($\text{goalsFor} - \text{goalsAgainst}$)

### Métriques secondaires à étudier (non verrouillées en cadrage)
- `goalsForPerMeeting` / `goalsAgainstPerMeeting` (moyennes de buts par match) ;
- `latestMeetingDate` / `oldestMeetingDate` (bornes temporelles de l'échantillon) ;
- `seasonsCovered` (nombre ou liste des saisons représentées) ;
- `sameVenueMeetings` (sous-segment dans la même configuration domicile/extérieur).

---

## 7. Indépendance et absence de duplication

Le H2H constitue une brique analytique isolée. Il ne doit **PAS** dupliquer, mélanger ou ré-agréger :
- La série Form 5 des équipes ;
- Le profil Season Strength ou les points par match saisonniers ;
- Les classements de championnat ou classements Elo ;
- Les métriques avancées d'autres domaines ($xG$, cotes de clôture, mouvements de marché).

---

## 8. Enjeu architectural majeur : Profondeur historique et contrat Provider

Un défi technique central distingue le H2H des briques précédentes :

### Contrat Provider actuel (`DEC-020`)
La signature actuelle `SportsDataProvider.getMatches(competitionCode, fromDate?, toDate?)` sans filtre de dates a été formellement arrêtée dans DEC-020 comme retournant **les matchs de la saison courante**.

### Conséquence sur le H2H
- **Saison courante :** le dataset actuel ne contient généralement que 0 ou 1 confrontation antérieure entre deux équipes données pour une même compétition de championnat (match aller).
- **Multi-saison :** disposer de 5 ou 10 confrontations directes historiques nécessite des données couvrant plusieurs saisons passées, ce que le contrat actuel et l'adaptateur `football-data.org` ne garantissent pas nécessairement sans appel spécifique ou extension de contrat.

**DEC-026 pose ce constat avec lucidité : Athena ne prétend pas disposer d'un historique multi-saison tant que sa faisabilité technique et son coût provider n'ont pas été formellement arbitrés.**

---

## 9. Arbitrage architectural : Saison courante vs Multi-saison

Le choix entre deux options structurelles est soumis à arbitrage :

| Dimension | Option A : Saison courante uniquement | Option B : Multi-saison borné (ex: 3-5 ans) |
|---|---|---|
| **Volume de données** | Faible (0 ou 1 match en championnat) | Plus élevé (jusqu'à 4-10 matchs) |
| **Pertinence temporelle** | Maximale (effectifs et contextes actuels) | Décroissante avec l'ancienneté |
| **Impact sur `SportsDataProvider`** | Nul (réutilisation du flux existant) | Nécessite une nouvelle méthode ou sémantique |
| **Coût d'appels API** | $O(1)$ constant, 0 appel supplémentaire | Risque d'appels additionnels ou N+1 |
| **Complexité d'implémentation** | Très faible | Modérée à élevée |

Cette orientation n'est pas tranchée par DEC-026 et fait l'objet de l'Open Question **OQ-016**.

---

## 10. Limite temporelle et obsolescence des confrontations

Deux équipes se rencontrant à plusieurs années d'intervalle présentent des effectifs, des entraîneurs, des états financiers et des niveaux de performance profondément modifiés.

Le H2H dans Athena ne doit donc :
- Ni supposer une causalité statistique stable à travers les années ;
- Ni introduire de formule de pondération arbitraire non calibrée (ex: coefficients de récence $0.8 / 0.2$).

La réponse en v1 consiste à **rendre visible et explicite la date et l'ancienneté de chaque confrontation**, permettant un jugement éclairé sans biais algorithmique.

---

## 11. Règles de cohérence et filtres de données

Toute confrontation retenue dans le calcul H2H doit satisfaire les critères de rigueur temporelle :
1. **Statut `FINISHED` :** matchs terminés uniquement avec score `fullTime` complet. Rejet des statuts `SCHEDULED`, `POSTPONED` ou `CANCELLED`.
2. **Coupure temporelle stricte (`utcDate < targetDate`) :** le match cible en cours d'analyse et toute rencontre future sont strictement exclus.
3. **Équipes participantes :** le match doit opposer exactement les deux équipes concernées.

---

## 12. Gestion des petits échantillons et indisponibilités

- **Échantillon réduit (ex: 1 seule confrontation) :** la métrique reste calculable mais son caractère restreint est rendu explicite par la taille d'échantillon (`sampleSize`).
- **Zéro confrontation (`sampleSize = 0`) :** statut `INSUFFICIENT_DATA` (ou équivalent). Interdiction absolue de fabriquer des métriques à `0` (0 victoire, 0-0 buts) qui simuleraient un bilan équilibré.
- **Indisponibilité des données provider :** statut `UNAVAILABLE` avec dégradation locale au niveau du composant H2H. Le Match Center, Form 5 et Season Strength restent affichés et opérationnels.
- **États globaux :** aucun nouvel état global de page ne doit être créé pour le H2H.

---

## 13. Exigences d'architecture et de coût Provider

L'intégration du H2H devra préserver les acquis d'architecture d'Athena :
- **Anti-N+1 strict :** interdiction absolue d'exécuter des requêtes provider par carte de match ou par paire d'équipes ($O(N)$ proscrit) ;
- **Budget d'appels maîtrisé :** tout enrichissement de `/analysis` doit minimiser le nombre total de requêtes ;
- **Port provider protégé :** aucune modification de `SportsDataProvider` sans conception technique formelle ;
- **Adaptateur réel :** aucune supposition sur les capacités de `football-data.org` sans audit hors production.

---

## 14. Cadrage de l'interface utilisateur (UI)

L'UI du H2H dans le Match Center doit être sobre, textuelle et synthétique :
- Bloc synthétique « Confrontations directes » ou « Face-à-face » ;
- Affichage clair du volume de rencontres et du bilan respectif ;
- Indication des dates des rencontres clés (dernière confrontation) ;
- Accessibilité complète (contrastes, attributs `aria-label`, rendu textuel sans dépendance exclusive aux couleurs) ;
- Aucun tableau complexe, graphique lourd ou timeline chargée en v1.

---

## 15. Questions Ouvertes officielles — Phase 3.4 (OQ-016 à OQ-028)

Les questions ouvertes suivantes sont officiellement enregistrées au statut **OPEN** et devront être arbitrées par le Fondateur avant la rédaction de la conception technique :

- **OQ-016 (Horizon temporel) :** Le premier incrément H2H doit-il être limité à la saison courante ou intégrer un historique multi-saison ?
- **OQ-017 (Profondeur maximale) :** Quelle limite maximale fixer (ex. 3 derniers matchs, 5 derniers matchs, 10 derniers matchs ou fenêtre en années) ?
- **OQ-018 (Exposition de l'ancienneté) :** Faut-il exposer la date de chaque rencontre ou uniquement les dates de la plus récente et de la plus ancienne ?
- **OQ-019 (Segment Domicile / Extérieur) :** Faut-il fournir uniquement le H2H global ou ajouter le segment contextualisé au lieu du match cible (*same venue*) ?
- **OQ-020 (Périmètre des compétitions) :** Le H2H doit-il être restreint à la même compétition ou agréger plusieurs compétitions domestiques/européennes de façon explicite ?
- **OQ-021 (Matchs de coupe) :** Les matchs de coupes nationales ou européennes doivent-ils être inclus dans l'historique H2H ?
- **OQ-022 (Matchs amicaux) :** Les matchs amicaux doivent-ils être formellement exclus ?
- **OQ-023 (Comportement sur très faible échantillon) :** Comment restituer visuellement et contractuellement un échantillon de 1 seul match ?
- **OQ-024 (Statuts de disponibilité) :** Le contrat de disponibilité doit-il reproduire la structure `AVAILABLE` / `INSUFFICIENT_DATA` / `UNAVAILABLE` de Season Strength ?
- **OQ-025 (Structure du DTO) :** Quelle structure de DTO retenir pour le composant H2H dans `AnalyticalMatchEntry` ?
- **OQ-026 (Capacité du contrat Provider actuel) :** Le contrat `SportsDataProvider` actuel permet-il de couvrir le périmètre H2H retenu ou une extension est-elle requise ?
- **OQ-027 (Budget d'appels Provider) :** Quel budget maximal d'appels provider est alloué à l'endpoint `/analysis` intégrant Form 5, Season Strength et H2H ?
- **OQ-028 (Mutualisation des flux de données) :** Comment mutualiser au maximum les flux de données entre les différentes briques analytiques ?

---

## 16. Périmètre Hors Scope préservé

La Phase 3.4 exclut explicitement :
- Données contextuelles externes (blessures, suspensions, météo, fatigue, temps de déplacement) ;
- Données de marché (*odds*, cotes d'ouverture/fermeture, mouvements de ligne, CLV) ;
- Modélisation probabiliste ou prédictive (Value betting, EV, critères de mise de Kelly) ;
- Modèles de Machine Learning ou Deep Learning ;
- Moteur de décision ou assistant de recommandation de paris ;
- Nouvelle base de données persistante ou infrastructure cloud obligatoire.

---

## 17. Séquence de validation obligatoire

La gouvernance du projet impose le respect strict de la séquence :

```text
DEC-026 (Cadrage produit H2H)
   │
   ▼
Arbitrages du Fondateur sur OQ-016 à OQ-028
   │
   ▼
DEC-027 (Conception technique détaillée H2H)
   │
   ▼
Fusion et audit documentaire de DEC-027
   │
   ▼
Implémentation logicielle autorisée
```

**Aucun code H2H, aucune modification de `src/`, aucun nouveau test et aucun appel réseau ne sont autorisés avant l'achèvement complet de cette chaîne.**

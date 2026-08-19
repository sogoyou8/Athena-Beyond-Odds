# Première tranche analytique — Phase 3.2 : Form 5

- Projet : Athena Beyond Odds
- Phase : 3.2
- Tranche : Form 5
- Date : 2026-08-08
- Responsable : Fondateur ABYSS
- Statut : Approuvé — définition documentaire uniquement, implémentation non autorisée
- Branche de base : `architecture/phase-2-technical-design`
- Commit de référence : `79715c79b98b3c42d493eec5179d1f3798778000`

---

## 1. Contexte

À la suite de la clôture officielle de la Phase 3.1 et de la validation du cadrage documentaire général de la Phase 3.2 via `DEC-017` (PR #23), la présente spécification définit la toute première tranche fonctionnelle analytique du Match Center d'Athena.

---

## 2. Décision du Fondateur

Le Fondateur ABYSS approuve officiellement la sélection de **Form 5 (Forme récente minimale des équipes)** comme première feature analytique de la Phase 3.2.

---

## 3. Objectif

L'objectif de cette tranche est d'enrichir la carte de match d'Athena en apportant une information contextuelle descriptive immédiate sur les performances récentes des deux équipes s'affrontant, sans introduire de complexité algorithmique ni d'estimations financières.

---

## 4. Définition de Form 5

Pour chaque équipe participant à une rencontre affichée, Athena doit pouvoir représenter ses résultats sur ses matchs terminés les plus récents, dans une limite maximale de 5 matchs.

**Représentation conceptuelle des résultats :**
- `V` = Victoire
- `N` = Nul
- `D` = Défaite

Exemple d'affichage d'équipe : `V — V — N — D — V`

---

## 5. Valeur utilisateur

Cette fonctionnalité permet à l'utilisateur de consulter d'un coup d'œil la dynamique sportive récente des équipes avant le coup d'envoi, renforçant la promesse d'Athena comme plateforme d'analyse d'événements sportifs.

---

## 6. Caractère descriptif et non prédictif

La séquence Form 5 :
- Décrit uniquement des faits et des résultats passés.
- Ne constitue **pas** une prédiction de résultat futur.
- Ne constitue **pas** une probabilité de victoire.
- Ne constitue **pas** une recommandation de pari.
- Ne constitue **pas** un score de confiance décisionnel.
- Ne constitue **pas** une indication de valeur (Value/EV).

---

## 7. Règle de calcul conceptuelle

Pour une équipe donnée :
1. Récupérer les matchs terminés (`status === 'FINISHED'`) pertinents de l'équipe.
2. Conserver uniquement les matchs où l'équipe a effectivement participé.
3. Ordonner les matchs du plus récent au plus ancien.
4. Conserver au maximum les 5 matchs les plus récents.
5. Déterminer le résultat pour chaque match du point de vue de l'équipe :
   - Si les buts de l'équipe > buts de l'adversaire → `V` (Victoire)
   - Si les buts de l'équipe = buts de l'adversaire → `N` (Nul)
   - Si les buts de l'équipe < buts de l'adversaire → `D` (Défaite)

La règle s'applique uniformément que l'équipe ait joué à domicile ou à l'extérieur. Aucun coefficient, aucune pondération et aucun calcul probabiliste ne sont appliqués.

---

## 8. Gestion des données incomplètes et absence d'invention

- Si 5 matchs joués sont disponibles → afficher les 5 résultats (`V/N/D`).
- Si 1 à 4 matchs joués sont disponibles → afficher uniquement les matchs réellement disponibles.
- Si 0 match terminé n'est disponible → afficher l'état neutre : `Données de forme indisponibles`.

Aucun résultat ou match fictif ne sera inventé.

---

## 9. Définition de la fenêtre de 5 matchs

La valeur 5 représente le **maximum de cinq derniers matchs terminés disponibles** et **non** une obligation d'en posséder exactement 5.

---

## 10. Données nécessaires et données déjà disponibles dans le Domaine

**Données nécessaires par match d'historique :**
- Identifiant du match (`id`)
- Équipe domicile et Équipe extérieure (`homeTeam`, `awayTeam`)
- Date du match (`utcDate`)
- Statut du match (`status === 'FINISHED'`)
- Score final (`score.fullTime.home`, `score.fullTime.away`)

**Données déjà disponibles dans les entités du Domaine Athena :**
Les structures `Match`, `Team`, `Score` (`fullTime`) et `MatchStatus` (`FINISHED`) existent déjà dans le modèle de domaine (`src/domain`).

**Données strictement non requises pour Form 5 :**
Joueurs, blessures, tirs, xG, possession, classement, géolocalisation, cotes bookmakers, données live, Machine Learning.

---

## 11. Besoins techniques actuellement manquants

Le modèle de domaine supporte conceptuellement les matchs terminés. En revanche, le parcours fonctionnel actuel d'Athena (Use Case `ListScheduledMatchesUseCase` et adaptateurs d'infrastructure actuels) filtre exclusivement les matchs programmés (`SCHEDULED`).

La mise à disposition d'un accès aux matchs passés (`FINISHED`) constitue une précondition technique qui fera l'objet d'un **cadrage technique dédié** avant toute écriture de code.

---

## 12. Analyse des adaptateurs et providers

- **FootballDataOrgAdapter :** L'adaptateur actuel exclut les matchs dont le statut n'est pas `SCHEDULED`. Une future adaptation devra permettre d'exposer les matchs terminés lorsqu'ils sont demandés.
- **InMemorySportsDataProvider :** Une future implémentation nécessitera d'ajouter des fixtures de matchs terminés (`FINISHED`) déterministes pour permettre le développement et les tests unitaires/d'intégration sans accès réseau.

*Note : DEC-018 n'autorise aucune modification de ces adaptateurs.*

---

## 13. Analyse du port SportsDataProvider

Le contrat `SportsDataProvider` défini dans `src/application/ports/sports-data-provider.js` expose déjà la signature :
`getMatches(competitionCode: string, fromDate?: Date, toDate?: Date): Promise<Match[]>`

Cette signature est conceptuellement suffisante pour demander des matchs sur une période historique passée. Aucun nouveau contrat de port n'est nécessaire.

---

## 14. Architecture HTTP et Frontend

- **HTTP :** L'architecture HTTP de Form 5 (enrichissement du Use Case ou endpoint dédié) sera définie lors du cadrage technique détaillé. Aucune modification de route n'est autorisée par la présente décision.
- **Frontend :** L'interface présentera la séquence Form 5 sous forme descriptive neutre. Aucune valeur visuelle de marque (palette hex, typo, ombres, rayons) n'est figée par la présente tranche et reste différée.

---

## 15. Absence totale de cotes et de prédictions

La tranche Form 5 comprend :
- 0 cote bookmaker
- 0 prédiction de résultat
- 0 modèle probabiliste / ML
- 0 calcul d'espérance mathématique (EV) ou de mise de Kelly
- 0 recommandation ou conseil de pari
- 0 composant du Decision Engine (réservé Phase 4+)

---

## 16. Statut de la Phase 2.9 Niveau 2

La validation **Phase 2.9 Niveau 2** (test authentifié réel football-data.org) demeure **NON BLOQUANTE** pour le cadrage et le développement local déterministe de Form 5 avec l'InMemoryProvider.
Elle ne sera requise que plus tard, avant une validation réseau réelle, et **jamais avant le 15 août 2026**.

---

## 17. Statut des Anomalies et Questions Ouvertes

- **Anomalies A-001 et A-002 :** Conservées au backlog technique sous statut `MINEURE — OUVERTE — NON BLOQUANTE`.
- **Anomalie A-003 :** Confirmée `CORRIGÉE ET FERMÉE`.
- **Questions Ouvertes (OQ-001 à OQ-006) :** Conservent strictement leurs statuts antérieurs sans aucune résolution sous-entendue.

---

## 18. Critères d'acceptation conceptuels (AC-F5)

- **AC-F5-001 :** Pour une équipe disposant d'au moins 5 matchs terminés accessibles, Form 5 représente ses 5 matchs les plus récents.
- **AC-F5-002 :** Les matchs de la séquence sont ordonnés du plus récent au plus ancien.
- **AC-F5-003 :** Chaque résultat est calculé exclusivement du point de vue de l'équipe concernée.
- **AC-F5-004 :** Victoire (`V`) : buts inscrits par l'équipe > buts de l'adversaire.
- **AC-F5-005 :** Nul (`N`) : buts inscrits par l'équipe = buts de l'adversaire.
- **AC-F5-006 :** Défaite (`D`) : buts inscrits par l'équipe < buts de l'adversaire.
- **AC-F5-007 :** La règle de calcul produit le même résultat que le match ait été joué à domicile ou à l'extérieur.
- **AC-F5-008 :** Si moins de 5 matchs terminés sont disponibles (1 à 4), seuls les matchs disponibles sont affichés.
- **AC-F5-009 :** Si aucun match terminé n'est disponible (0 match), le système affiche l'état neutre `Données de forme indisponibles` sans inventer de données.
- **AC-F5-010 :** Aucune donnée de cote, de prédiction ou de conseil de pari n'est générée par la fonction Form 5.
- **AC-F5-011 :** Le résultat calculé est 100% déterministe pour un ensemble de matchs source donné.
- **AC-F5-012 :** La fonctionnalité peut être entièrement testée et validée en local avec des fixtures déterministes sans dépendance réseau.

---

## 19. Périmètre strictly exclu

Sont hors du périmètre de la tranche Form 5 :
- Ranking, H2H, Fatigue avancée, Travel, Momentum, Cotes, CLV, EV, Kelly, Risk, Variance, Corrélation.
- Decision Engine, Machine Learning, modèles prédictifs.
- Authentification, comptes, paiement, persistance longue durée.
- Nouveaux providers (Sportmonks, etc.) ou nouvelles compétitions.

---

## 20. Conditions nécessaires avant le premier code

Toute écriture de code pour Form 5 nécessite :
1. La réalisation d'un cadrage technique détaillé spécifiant les modifications d'adaptateurs et les Use Cases requis.
2. Une autorisation documentaire distincte avant l'ouverture de la tranche d'implémentation.

---

## 21. Prochaine étape

Cadrage technique détaillé de la mise à disposition des matchs `FINISHED` et de l'intégration de Form 5.

---

## 22. Verdict documentaire

```text
FORM 5 APPROUVÉE DOCUMENTAIREMENT — DÉFINITION CONCEPTUELLE ET CRITÈRES D'ACCEPTATION FORM 5 FIGÉS À LA DOCUMENTATION, IMPLÉMENTATION INTERDITE
```

---

> Made in Abyss : Spark by the King

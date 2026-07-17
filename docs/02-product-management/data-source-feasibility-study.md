# Étude de faisabilité — Sources de données sportives MVP

> **Statut :** Étude — décision finale requise
> **Version :** 1.1
> **Date :** 2026-07-17
> **Auteur :** Antigravity (pour Fondateur ABYSS)
> **Branche :** docs/phase-1-product-definition
> **Questions liées :** OQ-003 (fournisseurs de données), OQ-006 (compétitions MVP)
> **Décision de référence :** DEC-001 (arbitrage conditionnel du 2026-07-17)

Ce document constitue une étude comparative neutre. Il ne prend aucune décision définitive. Il prépare les informations nécessaires pour que le Fondateur ABYSS puisse :

- valider ou rejeter une source de données candidate ;
- confirmer la liste exacte des compétitions du périmètre MVP pilote ;
- clôturer OQ-003 et OQ-006 sur une base factuelle.

Toutes les décisions de sélection, de souscription et de validation contractuelle restent du ressort exclusif du Fondateur.

---

## 1. Inspection Git préalable

| Élément | Valeur |
|:---|:---|
| Branche | `docs/phase-1-product-definition` |
| HEAD | `d116f8d` |
| Statut de l'arbre de travail | Propre |

---

## 2. Sources officielles consultées

| Source | URL | Date | Niveau de confiance |
|:---|:---|:---|:---|
| football-data.org — Coverage | https://www.football-data.org/coverage | 2026-07-17 | **Élevé** — page officielle lue directement |
| football-data.org — Pricing | https://www.football-data.org/pricing | 2026-07-17 | **Élevé** — page officielle lue directement |
| Sportmonks — Football API | https://www.sportmonks.com/football-api/ | 2026-07-17 | **Élevé** — page officielle lue directement |
| API-Football (RapidAPI) | https://rapidapi.com/api-sports/api/api-football | 2026-07-17 | **Moyen** — page publique RapidAPI, non officielle |
| API-Sports.io | https://api-sports.io/ | 2026-07-17 | **Moyen** — accès indirect via résultats de recherche ; page dashboard 403 |

> **Avertissement :** Le tableau de bord officiel API-Football (dashboard.api-football.com) a renvoyé une erreur 403. Les informations tarifaires et les quotas pour ce fournisseur proviennent de sources secondaires. Elles doivent être vérifiées directement sur la page officielle avant toute décision.

> **Fournisseurs non évalués dans cette étude :** Sportradar, Opta / Stats Perform, Hudl StatsBomb — voir section 4.

---

## 3. Fournisseurs identifiés et analysés

### Fournisseur 1 — football-data.org

**Rôle dans cette étude :** Candidat économique prioritaire pour un prototype de validation

**Motifs factuels :**
- Couverture officielle de la Ligue 1 confirmée sur la page coverage (tier libre).
- Couverture officielle de la Premier League confirmée (tier libre).
- Couverture officielle de la Champions League confirmée (tier libre).
- Offre gratuite pérenne et offres publiques payantes transparentes.
- Attribution visible demandée dans l'application (standard du secteur).

| Critère | Fait vérifié — source : https://www.football-data.org/pricing et /coverage (2026-07-17) |
|:---|:---|
| **Couverture** | 12 compétitions en tier libre : Champions League, Premier League, Bundesliga, Eredivisie, Campeonato Brasileiro Série A, Primera Division, Ligue 1, Championship, Primeira Liga, European Championship, Coupe du Monde, Serie A. La Liga incluse à partir du plan Standard (€49/mois, 30 compétitions). |
| **Données essentielles** | Fixtures, classements, résultats — confirmés en tier libre |
| **Données analytiques** | Forme et tendances avancées disponibles dans le plan ML Pack Light (€29/mois, 10 saisons d'historique) |
| **Données explicatives** | Compositions, buteurs, cartons, remplaçants — disponibles dans le plan Free + Deep Data (€29/mois) |
| **Fraîcheur** | Données différées en tier libre (délai exact non précisé sur la page) ; scores live disponibles à partir de €12/mois |
| **Historique** | 10 saisons confirmées dans le plan ML Pack Light (€29/mois) |
| **Coût** | €0 (Free) — €12/mois (Free w/ Livescores) — €29/mois (ML Pack Light ou Free + Deep Data) — €49/mois Standard (30 comp.) — €99/mois Advanced (50 comp.) — €199/mois Pro (100 comp.) |
| **Quotas** | 10 appels/min (Free) — 20/min (€12) — 20/min (€29) — 60/min (€49) — 100/min (€99) |
| **Stabilité** | Projet individuel maintenu depuis plusieurs années — documentation publique disponible |

**Réserves (informations à confirmer avant tout usage en production) :**
- Droits commerciaux dans une application payante : **Non vérifié** — contact direct requis (daniel@football-data.org) ; la page indique que le plan gratuit est gratuit "forever" sans précision sur l'usage commercial.
- Droits d'affichage public dans Athena : **Non vérifié**
- Droits de stockage des données : **Non vérifié**
- Droits de produire et afficher des probabilités ou explications dérivées : **Non vérifié**
- Profondeur et qualité des données analytiques : **À tester** — disponibles dans les plans payants, non testées

**Ne pas déclarer football-data.org juridiquement validé ni comme fournisseur retenu.**

---

### Fournisseur 2 — API-Football (API-Sports)

| Critère | Information — source : RapidAPI (Moyen) et résultats de recherche (2026-07-17) |
|:---|:---|
| **Couverture** | 1 200+ ligues revendiquées — Ligue 1, Premier League, Champions League, La Liga mentionnées dans les sources secondaires |
| **Données essentielles** | Fixtures, classements, résultats, scores live — décrits comme disponibles sur tous les plans |
| **Données analytiques** | Statistiques joueurs et équipes — présence décrite, détail exact à confirmer |
| **Données explicatives** | Compositions, buteurs, cartons — décrits comme disponibles |
| **Fraîcheur** | Quasi-temps réel sur plans payants — mentionné dans sources secondaires |
| **Historique** | Non précisé dans les sources consultées — à demander au fournisseur |
| **Coût** | **Tarification exacte à vérifier dans le tableau de bord ou sur la page officielle au moment de la souscription.** Les sources secondaires mentionnent un plan PRO à environ 19 $/mois (7 500 req/jour) et un plan ULTRA à environ 39 $/mois (75 000 req/jour), mais ces tarifs n'ont pas pu être vérifiés sur une page officielle directe. |
| **Quotas** | Quotas journaliers par plan — pas de surcharge automatique selon les sources secondaires |
| **Stabilité** | API commerciale active — documentation décrite comme étendue |

**Informations à confirmer (toutes non vérifiées sur source officielle directe) :**
- Droits d'usage commercial dans Athena : **Non vérifié**
- Droits d'affichage public : **Non vérifié**
- Droits de stockage des données : **Non vérifié**
- Droits de produire des données dérivées (probabilités, explications) : **Non vérifié**
- Droits des ligues (leagues display rights) : **Non vérifié** — les termes généraux signalent que le fournisseur ne garantit pas les droits sur les compétitions elles-mêmes
- Prix exacts 2026 : **À vérifier sur la page ou le tableau de bord officiel**

---

### Fournisseur 3 — Sportmonks Football API

**Rôle dans cette étude :** Candidat prioritaire à contacter et à tester

| Critère | Information — source : https://www.sportmonks.com/football-api/ (2026-07-17) |
|:---|:---|
| **Couverture** | 2 200+ ligues revendiquées — Premier League et Ligue 1 explicitement mentionnées sur la page officielle |
| **Données essentielles** | Scores live, fixtures, calendriers, classements — confirmés sur la page officielle |
| **Données analytiques** | Données avancées disponibles selon le plan et les modules complémentaires ; disponibilité exacte du xG à confirmer pour le forfait envisagé. |
| **Données explicatives** | Compositions, remplaçants, buteurs, cotes — mentionnés sur la page officielle |
| **Fraîcheur** | Temps réel mentionné — uptime 99,99 % annoncé sur la page officielle |
| **Historique** | Disponible — profondeur exacte à confirmer selon le plan souscrit |
| **Coût** | À partir de €29/mois selon la page officielle — modules complémentaires par ligue possibles — essai de 14 jours mentionné ; tarif exact pour 2–3 compétitions à demander |
| **Quotas** | Variables selon le plan — détails à obtenir lors de l'essai |
| **Stabilité** | API commerciale — documentation présentée comme professionnelle — support dédié mentionné |

**Informations à confirmer :**
- Droits d'usage commercial dans Athena : **Non vérifié** — les termes exacts sont dans le contrat de souscription ; contact requis (support@sportmonks.com)
- Droits d'affichage public de probabilités et explications dérivées : **Non vérifié**
- Droits de stockage intermédiaire : **Non vérifié** — la revente de données brutes est décrite comme interdite, mais le stockage pour usage interne reste à confirmer formellement
- Coût réel avec les compétitions retenues : **À confirmer lors de l'essai**
- SLA formelle : **Non documentée publiquement**

**Décision provisoire :** `Valider pour investigation — décision contractuelle impossible tant que les droits d'usage ne sont pas confirmés.`

---

## 4. Fournisseurs non évalués dans cette étude

Les fournisseurs ci-dessous n'ont pas été inclus dans la grille comparative car les conditions nécessaires à une évaluation factuelle ne sont pas réunies.

| Fournisseur | Statut | Justification |
|:---|:---|:---|
| **Sportradar** | Non évalué pour le MVP | Tarification publique et conditions autonomes insuffisantes pour réaliser une comparaison factuelle sans échange commercial ou devis. |
| **Opta / Stats Perform** | Non évalué pour le MVP | Tarification publique et conditions autonomes insuffisantes pour réaliser une comparaison factuelle sans échange commercial ou devis. |
| **Hudl StatsBomb** | Non retenu pour cette étude | Centré sur le scouting et la performance club — inadapté au cas d'usage Athena (prédictions et explications pour utilisateurs finaux). Tarification non publique. |

> **Note :** L'absence d'évaluation ne signifie pas que ces fournisseurs sont non viables. Aucun tarif n'est avancé pour ces fournisseurs. Seule une démarche commerciale directe permettrait une évaluation complète.

---

## 5. Scénarios de compétitions candidats

> Les compétitions proposées restent des candidates, pas des décisions officielles. Aucune compétition n'est définitivement choisie.

### Scénario A — Repli (2 compétitions)

| Élément | Contenu |
|:---|:---|
| **Compétitions candidates** | Ligue 1 (France) + Premier League (Angleterre) |
| **Justification utilisateur** | Ligue 1 : championnat domestique le plus pertinent pour les utilisateurs francophones visés. Premier League : championnat à forte notoriété internationale, intérêt élevé pour les testeurs. |
| **Sources compatibles** | football-data.org (tier libre), API-Football, Sportmonks |
| **Données essentielles** | À tester sur les 3 fournisseurs |
| **Données analytiques** | À tester — partielles en tier libre football-data.org ; plus complètes selon les plans Sportmonks et API-Football |
| **Droits commerciaux** | À confirmer pour les 3 fournisseurs — la présence dans l'API confirme la couverture technique, pas les droits requis par Athena |
| **Coût** | De €0 à €49/mois selon fournisseur et plan |
| **Risque données** | Faible — compétitions majeures couvertes par tous les fournisseurs |
| **Risque droits** | Moyen — à confirmer |
| **Condition de validation** | Confirmer les droits commerciaux. Tester la qualité et la profondeur sur les deux compétitions. |

---

### Scénario B — Candidat B (3 compétitions, à confirmer)

| Élément | Contenu |
|:---|:---|
| **Compétitions candidates** | Ligue 1 (France) + Premier League (Angleterre) + UEFA Champions League |
| **Justification utilisateur** | Scénario A + Champions League : compétition européenne la plus suivie, intérêt maximal pour les testeurs, couverture disponible en tier libre sur football-data.org. |
| **Sources compatibles** | football-data.org (CL en tier libre), API-Football, Sportmonks |
| **Données essentielles** | À tester |
| **Données analytiques** | À tester — données analytiques pour la CL à confirmer selon le plan |
| **Droits commerciaux** | Droits d'usage, d'affichage et de création de données dérivées pour cette compétition à confirmer auprès du fournisseur. La présence de la CL dans une API confirme la couverture technique, pas les droits requis par Athena. |
| **Coût** | €29–€49/mois selon fournisseur |
| **Risque données** | Faible à moyen |
| **Risque droits** | Moyen — droits UEFA à vérifier spécifiquement pour une application de prédictions |
| **Condition de validation** | Confirmer les droits d'affichage et de dérivation pour la Champions League auprès du fournisseur retenu. |

---

### Scénario C — Repli alternatif (2 compétitions, sans Champions League)

| Élément | Contenu |
|:---|:---|
| **Compétitions candidates** | Ligue 1 (France) + La Liga (Espagne) |
| **Justification utilisateur** | Alternative si les droits Premier League ou Champions League s'avèrent trop complexes ou coûteux. Deux championnats majeurs en Europe continentale. |
| **Sources compatibles** | football-data.org (La Liga à partir de €49/mois Standard), API-Football, Sportmonks |
| **Données essentielles** | À tester |
| **Droits commerciaux** | À confirmer — La Liga (LaLiga organization) a des politiques de distribution actives |
| **Coût** | €29–€49/mois (La Liga absente du tier libre football-data.org) |
| **Risque données** | Faible |
| **Risque droits** | Moyen |
| **Condition de validation** | Confirmer les droits La Liga pour une application de prédictions commerciale. |

---

## 6. Grille comparative pondérée

> Notation sur 5. `Non vérifié` = pas de score — non transformé en valeur positive.
> Les scores provisoires sont normalisés sur les 75 % de critères actuellement évaluables. Ils ne constituent pas des scores globaux, car le critère juridique (droits d'usage commercial, 25 %) reste non vérifié pour tous les fournisseurs.

| Critère | Pondération totale | football-data.org | API-Football | Sportmonks |
|:---|---:|:---:|:---:|:---:|
| **Droits d'usage commercial** | 25 % | Non vérifié | Non vérifié | Non vérifié |
| **Couverture des compétitions** | 20 % | 4/5 *(L1, PL, CL en libre — La Liga à €49/mois)* | 5/5 *(selon sources secondaires)* | 5/5 *(L1 et PL explicitement confirmées)* |
| **Qualité et complétude** | 20 % | 3,5/5 *(libre : données de base ; payant : données analytiques disponibles — non testées)* | 4/5 *(selon sources secondaires — non testé)* | 5/5 *(données avancées mentionnées — disponibilité exacte selon le plan)* |
| **Coût pour le pilote** | 15 % | 5/5 *(offre gratuite pérenne et plans transparents)* | 4/5 *(prix à vérifier officiellement)* | 3/5 *(€29/mois de base + add-ons potentiels)* |
| **Fraîcheur et continuité** | 10 % | 3/5 *(données différées en tier libre ; live à €12/mois ; projet individuel)* | 4/5 *(quasi-temps réel annoncé — non testé)* | 5/5 *(temps réel et uptime 99,99 % mentionnés)* |
| **Documentation et support** | 10 % | 3/5 *(documentation publique correcte ; support email individuel)* | 4/5 *(documentation décrite comme étendue)* | 5/5 *(documentation professionnelle et essai 14 jours mentionnés)* |

### Calcul des scores normalisés (sur les 75 % de critères évaluables)

Les pondérations sont recalculées sur 75 % total (les 5 critères non juridiques) :

| Critère | Pondération normalisée | football-data.org | API-Football | Sportmonks |
|:---|---:|:---:|:---:|:---:|
| Couverture | 26,67 % | 4 × 0,2667 = 1,07 | 5 × 0,2667 = 1,33 | 5 × 0,2667 = 1,33 |
| Qualité | 26,67 % | 3,5 × 0,2667 = 0,93 | 4 × 0,2667 = 1,07 | 5 × 0,2667 = 1,33 |
| Coût | 20,00 % | 5 × 0,20 = 1,00 | 4 × 0,20 = 0,80 | 3 × 0,20 = 0,60 |
| Fraîcheur | 13,33 % | 3 × 0,1333 = 0,40 | 4 × 0,1333 = 0,53 | 5 × 0,1333 = 0,67 |
| Documentation | 13,33 % | 3 × 0,1333 = 0,40 | 4 × 0,1333 = 0,53 | 5 × 0,1333 = 0,67 |

| Fournisseur | Score technique et économique normalisé (sur critères vérifiés) | Score global |
|:---|---:|---:|
| football-data.org | 3,80 / 5 | Non calculable |
| API-Football | 4,26 / 5 | Non calculable |
| Sportmonks | 4,60 / 5 | Non calculable |

> **Aucun fournisseur n'est désigné gagnant sur la base de ce score normalisé.** Le critère juridique à 25 % manquant peut modifier le classement final de manière déterminante. Un fournisseur ayant un score normalisé élevé mais ne pouvant confirmer les droits d'usage commerciaux serait à écarter.

---

## 7. Recommandation — Deux tests parallèles

### Test prioritaire A — football-data.org

**Objectif :**
- Vérifier rapidement la couverture et la qualité sur les compétitions candidates (Ligue 1, Premier League, Champions League).
- Évaluer les données réellement disponibles dans un plan adapté au MVP (ML Pack Light ou Free + Deep Data à €29/mois).
- Demander une confirmation écrite des droits commerciaux à daniel@football-data.org.

**Avantages :**
- Ligue 1, Premier League et Champions League couvertes dès le tier libre.
- Plans tarifaires publics, transparents et vérifiés.
- Point d'entrée le plus économique pour valider la faisabilité technique.

**Conditions préalables :**
- Aucun compte payant ne doit être créé pendant cette mission.
- Contacter le fournisseur par email avant tout engagement.

---

### Test prioritaire B — Sportmonks

**Objectif :**
- Tester la richesse et l'homogénéité des données sur les compétitions candidates.
- Confirmer le coût réel avec les modules nécessaires pour 2 à 3 compétitions.
- Demander une confirmation écrite des droits commerciaux à support@sportmonks.com.

**Avantages :**
- Essai gratuit de 14 jours mentionné — permet une évaluation technique sans engagement.
- Données avancées mentionnées sur la page officielle.
- Support dédié disponible.

**Conditions préalables :**
- Aucun compte payant ne doit être créé pendant cette mission.
- L'essai gratuit peut être lancé uniquement par le Fondateur, après validation.

---

### API-Football — Alternative à investiguer

Si football-data.org ou Sportmonks ne peuvent confirmer les conditions requises, API-Football reste une alternative à évaluer, à condition de vérifier ses tarifs et conditions sur sa page officielle directe.

---

### Recommandation finale provisoire

> **Comparer football-data.org et Sportmonks sur un même échantillon fonctionnel avant de sélectionner la source candidate finale.**

Les deux tests doivent porter sur les mêmes compétitions candidates (Scénario B de préférence) et les mêmes questions juridiques (section 8).

---

## 8. Questions à adresser aux fournisseurs pressentis

Ces questions doivent être envoyées par email à chaque fournisseur avant tout engagement.

1. L'utilisation des données dans une application commerciale accessible au grand public est-elle autorisée par votre abonnement ?
2. L'affichage des scores, classements et statistiques dans une interface publique est-il autorisé ?
3. Les données peuvent-elles servir à calculer des probabilités, scores de forme ou explications de prédiction dérivées, sans constituer une redistribution directe des données brutes ?
4. Quelle est votre politique sur le stockage temporaire des données dans nos propres bases de données (cache, historique, enrichissement) ?
5. Les données affichées dans Athena constituent-elles une redistribution au sens de vos CGU ? Quelles restrictions s'appliquent ?
6. Y a-t-il des compétitions pour lesquelles vous ne garantissez pas les droits de distribution commerciale (en particulier UEFA Champions League, Ligue 1, Premier League, La Liga) ?
7. Quelles compétitions et saisons sont garanties dans le plan envisagé, et pour combien de saisons d'historique ?
8. Avec quel préavis les tarifs ou les quotas peuvent-ils changer ? Existe-t-il une clause de protection tarifaire pour les abonnés existants ?
9. Disposez-vous d'un SLA formel ? Quelle est la procédure en cas d'interruption de service ?
10. Votre essai (si disponible) permet-il de tester techniquement les endpoints de fixtures, classements, statistiques d'équipe et historique sur Ligue 1 et Premier League ?
11. En cas de cession ou d'arrêt du service, quelle est la procédure de transition pour les clients existants ?

---

## 9. Protocole de validation court

> Aucun compte payant ne doit être créé pendant cette mission. Ce tableau est destiné à guider la phase de test à venir.

| Vérification | football-data.org | Sportmonks | API-Football |
|:---|:---:|:---:|:---:|
| Matchs et calendriers disponibles | À tester | À tester | À tester |
| Scores et statuts cohérents | À tester | À tester | À tester |
| Historique accessible | À tester | À tester | À tester |
| Données analytiques suffisantes | À tester | À tester | À tester |
| Traçabilité des sources | À confirmer | À confirmer | À confirmer |
| Usage commercial | Confirmation écrite requise | Confirmation écrite requise | Confirmation écrite requise |
| Stockage | Confirmation écrite requise | Confirmation écrite requise | Confirmation écrite requise |
| Données dérivées (probabilités, explications) | Confirmation écrite requise | Confirmation écrite requise | Confirmation écrite requise |
| Coût réel du périmètre | À confirmer | À confirmer | À confirmer |

---

## 10. Informations juridiques restant à confirmer

| Information | Fournisseur | Action requise |
|:---|:---|:---|
| Droits d'usage commercial dans Athena | Tous | Contacter par email |
| Droits d'affichage public | Tous | Inclure dans les questions |
| Droits de stockage des données | Tous | Inclure dans les questions |
| Restrictions de redistribution exactes | Tous | Lire les CGU signées |
| Droits Champions League (UEFA) | Tous si Scénario B retenu | Demander explicitement |
| Droits La Liga | Tous si Scénario C retenu | Demander explicitement |
| Autorisation de produire des données dérivées | Tous | Inclure dans les questions |
| Coût réel Sportmonks 2–3 compétitions | Sportmonks | Devis ou essai |
| Prix exacts API-Football 2026 | API-Football | Page ou dashboard officiel uniquement |
| Profondeur historique exacte | API-Football, Sportmonks | Documentation ou support |
| SLA et garanties de continuité | Sportmonks, API-Football | Demander par email |

---

## 11. Fichiers créés ou modifiés

| Fichier | Action |
|:---|:---|
| `docs/02-product-management/data-source-feasibility-study.md` | Créé (nouveau — non committé) |

Aucun fichier officiel de la Phase 1 n'a été modifié (PRD, MVP Scope, Acceptance Criteria, Validation Report, Decision Log, Open Questions, Arbitration Pack, next-actions.md).

---

## 12. Décisions restant au Fondateur

1. Autoriser ou non le lancement du test prioritaire A (football-data.org).
2. Autoriser ou non le lancement du test prioritaire B (Sportmonks, essai 14 jours).
3. Envoyer les questions de la section 8 au(x) fournisseur(s) pressenti(s).
4. Valider ou rejeter les compétitions candidates après retour du fournisseur.
5. Confirmer le scénario A, B ou C.
6. Clôturer officiellement OQ-003 et OQ-006 une fois les confirmations obtenues.

---

## 13. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Antigravity | Version initiale — analyse comparative de 3 fournisseurs, 3 scénarios, grille pondérée, recommandation conditionnelle. |
| 1.1 | 2026-07-17 | Antigravity | Consolidation factuelle — retrait des affirmations non sourcées, clarification des rôles, correction du xG Sportmonks, retrait TheStatsAPI (sources insuffisantes), reclassement des fournisseurs enterprise, correction scénarios et grille, recommandation à deux tests parallèles. |

---

> **Made in Abyss : Spark by the King**

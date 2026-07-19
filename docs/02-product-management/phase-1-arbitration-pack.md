# Dossier d'arbitrage de Phase 1 — OQ-003 et OQ-006

> **Statut :** Décision conditionnelle du Fondateur ABYSS
> **Version :** 1.1
> **Phase :** Phase 1 — Product Definition  

Ce dossier de décision centralise les éléments nécessaires pour résoudre conjointement deux questions ouvertes bloquantes pour le passage à la Phase 2 (Architecture technique) :
- **OQ-003 :** Disponibilité et conditions d'accès aux données sportives.
- **OQ-006 :** Périmètre des compétitions couvertes par le MVP.

Ce document constitue le support de décision conditionnelle acté par le Fondateur.

---

## 1. OQ-003 — Accès et disponibilité des données sportives

### 1.1 Décision attendue
Confirmé par le Fondateur ABYSS :
> *Confirmer qu'une source de données compatible avec le MVP est disponible dans des conditions acceptables de qualité, de continuité, de droit d'usage et de coût.*

### 1.2 Données minimales à confirmer

| Niveau | Données | Utilité produit | Obligatoire pour le MVP ? |
|:---|:---|:---|:---:|
| **Essentiel** | Calendrier, équipes, statut du match, score en temps réel ou post-match | Match Center et navigation de base | **À décider** |
| **Analytique** | Résultats historiques, statistiques d'équipes et de joueurs nécessaires aux calculs de probabilités | Analyse Athena | **À décider** |
| **Explicatif** | Données clés et variables métier utilisées pour les facteurs d'influence et résumés Explainable AI | Compréhension et confiance utilisateur | **À décider** |

### 1.3 Critères de validation d'une source de données
La validation d'un fournisseur ou d'une méthode d'accès aux données sportives s'appuie sur les critères qualitatifs suivants (les seuils numériques précis restent à confirmer selon les caractéristiques de l'option retenue) :
- **Couverture :** Capacité à fournir des données sur l'ensemble des compétitions retenues au MVP.
- **Complétude :** Absence de données manquantes critiques sur les saisons en cours et historiques.
- **Fraîcheur :** Latence de mise à jour des données compatible avec les cas d'usage d'Athena MVP.
- **Stabilité et continuité :** Fiabilité technique de l'API ou de la méthode de transfert.
- **Historique disponible :** Nombre de saisons antérieures disponibles pour la calibration des modèles.
- **Droits d'utilisation :** Conformité juridique pour le stockage, le traitement et l'affichage des données dans Athena.
- **Coût :** Compatibilité avec l'enveloppe budgétaire allouée au MVP.
- **Correction des anomalies :** Possibilité de signaler ou de corriger les erreurs de données sources.
- **Traçabilité :** Capacité à identifier la source originale de chaque donnée stockée ou traitée.

### 1.4 Options de décision pour OQ-003

| Option | Description | Avantages | Risques | Conséquence produit |
|:---|:---|:---|:---|:---|
| **Option A — Validée** | Une source répondant aux critères essentiels et analytiques est sélectionnée et validée. | La Phase 2 (Architecture) peut démarrer immédiatement sur des bases claires. | Risque résiduel de dérive des coûts ou de qualité à documenter. | OQ-003 est levée. |
| **Option B — Conditionnelle** | Une source est partiellement validée ou en cours d'évaluation. | Permet d'avancer sur des tâches d'architecture générale sans bloquer l'équipe. | Risque d'incompatibilité ou de manque de droits juridiques identifié. | Démarrage conditionnel de la Phase 2 avec jalons de contrôle. |
| **Option C — Non validée** | Aucune source n'offre de garantie suffisante en termes de coût, de droits ou de qualité. | Évite tout engagement technique ou financier prématuré. | Bloque la Phase 2 pour les composants dépendant des données. | OQ-003 reste ouverte et bloquante. |

---

## 2. OQ-006 — Périmètre des compétitions du MVP

### 2.1 Décision attendue
Confirmé par le Fondateur ABYSS :
> *Choisir le plus petit périmètre de compétitions permettant de valider la compréhension, la confiance et l'usage récurrent d'Athena.*

### 2.2 Options de périmètre neutres

| Option | Périmètre type | Valeur utilisateur | Complexité technique | Dépendance aux données | Risque produit |
|:---|:---|:---|:---|:---|:---|
| **Option A — Restreint** | Une seule compétition pilote ou un groupe très limité (ex. : une ligue nationale unique). | Validation rapide des parcours et de la North Star Metric sur un périmètre contrôlé. | **Faible** | Faible à moyenne | Risque d'usage et d'intérêt trop limités pour les utilisateurs pilotes. |
| **Option B — Intermédiaire** | Petit ensemble cohérent de compétitions majeures (ex. : 2 à 3 compétitions nationales ou européennes majeures). | Représentativité accrue et meilleur engagement des testeurs. | **Moyenne** | Moyenne | Charge de validation des données et d'ingestion plus élevée. |
| **Option C — Étendu** | Ensemble large de compétitions (ex. : toutes les ligues européennes de premier plan). | Couverture utilisateur maximale et attractivité immédiate. | **Élevée** | Élevée | Risque important de dispersion de l'équipe et de retard du MVP. |

*(Note : Les exemples mentionnés ci-dessus sont uniquement illustratifs et non décidés.)*

### 2.3 Critères de choix du périmètre
Le choix du périmètre des compétitions doit être évalué selon les critères suivants :
- **Intérêt des utilisateurs :** Attractivité auprès du groupe cible pour maximiser l'usage et les retours d'expérience.
- **Disponibilité des données :** Présence de données complètes et historiques pour les ligues choisies chez le fournisseur évalué.
- **Homogénéité :** Uniformité des formats de données d'un championnat à un autre.
- **Contrôle qualité :** Capacité de l'équipe à valider manuellement ou semi-automatiquement la pertinence des résultats.
- **Fréquence des matchs :** Récurrence des rencontres pour maintenir un usage actif d'Athena.
- **Couverture MVP :** Capacité des compétitions à exploiter l'ensemble des fonctionnalités du Match Center.
- **Effort d'intégration :** Charge de travail requise pour ingérer et calibrer chaque nouvelle compétition.
- **Risque de dispersion :** Risque de complexifier inutilement la Phase 2 en gérant trop de cas particuliers.

### 2.4 Fiche de décision OQ-006 (à renseigner)

| Champ | Décision du Fondateur |
|:---|:---|
| **Option retenue** | Intermédiaire resserrée |
| **Compétitions incluses** | 2 à 3 compétitions maximum — liste exacte à confirmer |
| **Justification** | Permet une couverture d'intérêt pour les testeurs tout en limitant la complexité initiale de l'ingestion |
| **Risques acceptés** | Données explicatives potentiellement incomplètes, réduction possible de la liste avant réalisation |
| **Date d'effet** | 2026-07-17 |

---

## 3. Dépendance logique entre OQ-003 et OQ-006

Il existe une dépendance croisée majeure entre ces deux questions :
- Le choix du périmètre des compétitions (**OQ-006**) détermine les volumes, l'historique et les formats des données à acquérir (**OQ-003**).
- La disponibilité réelle et le coût des licences de données (**OQ-003**) restreignent physiquement le périmètre des compétitions applicables (**OQ-006**).

Pour faciliter l'arbitrage, deux méthodes de résolution sont soumises au Fondateur :

### Méthode 1 — Produit d'abord
1. Le Fondateur sélectionne le périmètre de compétitions idéal pour le MVP (OQ-006).
2. L'équipe technique évalue la faisabilité, le coût et la disponibilité des données pour ce périmètre spécifique (OQ-003).
3. Le périmètre initial est réduit ou ajusté en cas d'impasse technique ou financière.

### Méthode 2 — Faisabilité d'abord
1. L'équipe technique identifie les périmètres et ligues couverts de manière robuste par les sources de données accessibles (OQ-003).
2. Le Fondateur sélectionne, au sein de cette enveloppe de faisabilité, la combinaison de compétitions offrant la meilleure valeur utilisateur pour le MVP (OQ-006).

---

## 4. Formulaire d'arbitrage conjoint (à renseigner)

### Décision conjointe OQ-003 / OQ-006

| Élément | Décision |
|:---|:---|
| **OQ-003 validée ?** | Oui, sous conditions |
| **Conditions ou réserves** | Confirmer une source couvrant de manière fiable le périmètre MVP, avec des droits d'usage compatibles, une fraîcheur adaptée aux parcours du MVP et un coût soutenable. |
| **OQ-006 validée ?** | Oui, sous conditions |
| **Option de périmètre retenue** | Intermédiaire resserrée |
| **Liste des compétitions** | 2 à 3 compétitions maximum — liste exacte à confirmer |
| **Risques acceptés** | Couverture initiale limitée, données explicatives potentiellement incomplètes et réduction possible du périmètre avant réalisation |
| **Passage en Phase 2 autorisé ?** | Oui, sous réserve de validation factuelle de la source et des compétitions retenues |
| **Responsable de la décision** | Fondateur ABYSS |
| **Date** | 2026-07-17 |

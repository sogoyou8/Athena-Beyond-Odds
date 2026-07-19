# Prioritization

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition

---

## 1. Objet

Ce document définit la méthode officielle de priorisation des fonctionnalités d'Athena: Beyond Odds.

Il transforme les exigences du [Product Requirements Document](product-requirements-document.md) et les récits du [catalogue des fonctionnalités](features.md) en décisions de priorisation structurées, reproductibles et traçables.

La méthode doit permettre à toute l'équipe de répondre à la question suivante de manière cohérente et documentée :

> Pourquoi construisons-nous cette fonctionnalité maintenant, et pas une autre ?

Ce document ne constitue pas un plan de développement. Il définit les règles et les scores qui alimentent la feuille de route.

---

## 2. Principes de priorisation

La priorisation d'Athena repose sur les 6 principes suivants, directement issus des [Product Principles](../08-product-blueprint/02-product-principles.md) :

| N° | Principe | Application à la priorisation |
|:---|:---|:---|
| P-05 | **Qualité avant vitesse** | Une fonctionnalité fiable prime sur plusieurs fonctionnalités instables |
| P-01 | **Compréhension avant quantité** | Les signaux utiles et explicables sont priorisés avant le volume |
| P-06 | **Simplicité progressive** | Les fonctions fondamentales précèdent les extensions avancées |
| P-14 | **Mesure avant opinion** | La priorisation s'appuie sur des scores documentés, pas des intuitions |
| P-15 | **Modularité** | Une fonctionnalité isolable et maintenable est favorisée |
| P-02 | **Explicabilité obligatoire** | Toute décision de priorisation doit être justifiable |

La règle de priorité définie dans le Blueprint ([Features §7](../08-product-blueprint/13-features.md)) s'applique sans exception :

> Une fonctionnalité ne peut être P0 ou P1 que si elle débloque une valeur essentielle, réduit un risque critique, supporte une obligation légale ou constitue une dépendance du MVP.

---

## 3. Périmètre de la méthode

Cette méthode s'applique à toutes les fonctionnalités référencées dans le [catalogue officiel](features.md), soit `FEAT-001` à `FEAT-026`.

| Périmètre inclus | Périmètre exclu |
|:---|:---|
| Fonctionnalités `FEAT-001` à `FEAT-026` | Choix d'architecture ou de stack technique |
| Exigences fonctionnelles `FR-001` à `FR-022` | Décisions d'infrastructure ou de fournisseurs |
| Exigences non fonctionnelles `NFR-001` à `NFR-012` | Roadmap de contenu éditorial |
| Stories `US-001` à `US-020` | Priorisation des tâches de développement internes |

La méthode est révisable à chaque cycle de revue trimestriel (voir §26).

---

## 4. Échelles de priorité

La nomenclature officielle des niveaux de priorité est la suivante :

| Niveau | Signification | Exemples |
|:---:|:---|:---|
| **P0** | Critique — Bloquant absolu. Sécurité, conformité légale ou stabilité du système. | Sécurité (`NFR-007`), Confidentialité (`NFR-008`) |
| **P1** | Essentiel — Requis pour délivrer la valeur principale du MVP. | Match Center, Probabilités, Dashboard, Compte |
| **P2** | Important — Améliore significativement l'expérience mais non bloquant. | Signalement (`FEAT-017`), Scalabilité (`NFR-004`) |
| **P3** | Souhaitable — Améliore la complétude mais reportable sans impact critique. | Extensions V1 |
| **P4** | Optionnel — Confort ou exploration. Exclu du MVP et de V1. | Fonctionnalités Future |

Les niveaux P0 et P1 ne peuvent pas être abaissés sans décision documentée dans le Decision Log.

> **Note :** Ce document distingue la **priorité actuelle** (définie dans [`features.md`](features.md)) et la **priorité recommandée** issue du scoring. Si elles diffèrent, la recommandation est soumise à validation humaine avant toute modification officielle.

---

## 5. Méthode principale

La méthode utilisée est un **scoring multicritère pondéré** dérivé du cadre RICE (Reach, Impact, Confidence, Effort) adapté aux spécificités d'Athena.

Elle évalue chaque fonctionnalité selon 6 axes :

| Variable | Nom | Description |
|:---:|:---|:---|
| **V** | Valeur utilisateur | Utilité perçue par les personas cibles et contribution directe au North Star |
| **R** | Réduction du risque | Diminution d'un risque critique produit, éthique, de qualité ou de conformité |
| **E** | Effort fonctionnel relatif | Complexité fonctionnelle estimée (non technique) : nombre d'états, de règles métier, d'intégrations |
| **D** | Importance comme dépendance fonctionnelle | Position dans le graphe de dépendances — détermine combien de fonctionnalités sont bloquées sans elle |
| **C** | Conformité, sécurité ou obligation critique | Obligation légale, éthique ou de sécurité non négociable |
| **CF** | Confiance dans l'évaluation | Solidité des hypothèses et informations disponibles sur la fonctionnalité. Une confiance faible ne signifie pas une faible valeur produit, mais une spécification insuffisante pour planifier. |

**Relations entre axes et coefficients :**
- `Kd` est dérivé de `D` : plus la fonctionnalité débloque d'autres fonctionnalités critiques, plus `Kd` est élevé.
- `Kc` est dérivé de `C` : une obligation légale ou de sécurité absolue multiplie le score pour garantir sa priorité.
- `CF` est un numérateur direct : une spécification solide améliore le score ; une spécification faible le réduit sans réfléter la valeur intrinsèque.

Le score final est calculé selon la formule décrite en §12.

---

## 6. Critères de valeur

La valeur d'une fonctionnalité est évaluée sur une échelle de 1 à 5 selon les critères suivants :

| Score | Signification |
|:---:|:---|
| 5 | Fonctionnalité centrale sans laquelle le produit n'a pas de valeur perceptible |
| 4 | Fonctionnalité importante qui améliore significativement la compréhension ou la confiance |
| 3 | Fonctionnalité utile qui enrichit l'expérience pour un ou plusieurs personas |
| 2 | Fonctionnalité agréable mais dont l'absence n'impacte pas l'adoption initiale |
| 1 | Fonctionnalité marginale ou spéculative sans preuve de demande |

**Critères d'évaluation de la valeur :**

- Contribution directe à la North Star Metric ([Success Metrics §2](../08-product-blueprint/04-success-metrics.md)) : _analyses comprises et jugées utiles_.
- Couverture de personas à fort enjeu (`PER-001` à `PER-004`).
- Réduction d'un point de friction identifié dans un User Journey ([User Journeys](../08-product-blueprint/09-user-journeys.md)).
- Contribution à l'objectif MVP : 70 % des répondants déclarent mieux comprendre le match ([Success Metrics §7](../08-product-blueprint/04-success-metrics.md)).
- Activation ou rétention mesurable (J7 dès le MVP).

---

## 7. Critères de risque

Le risque est évalué sur une échelle de 1 à 5. Une fonctionnalité qui réduit un risque critique reçoit un score élevé.

| Score | Signification |
|:---:|:---|
| 5 | Fonctionnalité dont l'absence expose le produit à un risque critique (sécurité, légal, données) |
| 4 | Fonctionnalité dont l'absence crée un risque produit sévère (confiance, qualité, erreurs non détectées) |
| 3 | Fonctionnalité qui atténue un risque modéré identifié dans le PRD [§28](product-requirements-document.md) |
| 2 | Fonctionnalité qui réduit un risque mineur ou émergent |
| 1 | Aucun impact sur les risques identifiés |

**Risques prioritaires identifiés dans le PRD §28 :**
- Données insuffisantes ou de mauvaise qualité → impact sur `FEAT-013`, `FEAT-017`, `FEAT-019`.
- Résultats probabilistes mal compris → impact sur `FEAT-010`, `FEAT-011`, `FEAT-012`.
- Dépendance excessive à l'IA générative → impact sur `FEAT-011`.
- Confusion avec un service de paris → impact sur `FEAT-010`, `FEAT-016`.

---

## 8. Critères d'effort

L'effort est évalué sur une échelle de 1 à 5 en termes de **complexité fonctionnelle** (pas de complexité technique, conformément à la contrainte Phase 1 — aucune décision d'architecture avant Phase 2).

| Score | Signification |
|:---:|:---|
| 1 | Très faible : règle ou affichage simple, peu d'interactions |
| 2 | Faible : formulaire ou liste simple, logique directe |
| 3 | Moyen : intégration de plusieurs règles métier, plusieurs états |
| 4 | Élevé : orchestration de plusieurs modules, logique conditionnelle complexe |
| 5 | Très élevé : intégration de systèmes externes, calculs spécialisés, algorithmes métier |

Dans la formule de score (§12), un effort élevé pénalise le score final pour favoriser les fonctionnalités à haut rapport valeur/complexité.

---

## 9. Critères de dépendance

La dépendance évalue la position d'une fonctionnalité dans le graphe de dépendances du catalogue (voir [features.md §24](features.md)).

| Score | Signification |
|:---:|:---|
| 5 | Dépendance racine : de nombreuses fonctionnalités critiques en dépendent |
| 4 | Dépendance forte : 3 fonctionnalités ou plus ne peuvent être livrées sans elle |
| 3 | Dépendance modérée : 1 à 2 fonctionnalités bloquées |
| 2 | Dépendance faible : aucune autre fonctionnalité directement bloquée |
| 1 | Fonctionnalité terminale : aucune autre fonctionnalité n'en dépend |

**Exemples de dépendances racines :**
- `FEAT-001` (Inscription) → bloque `FEAT-002`, `FEAT-003`, `FEAT-004`
- `FEAT-002` (Connexion) → bloque `FEAT-003`, `FEAT-018`
- `FEAT-008` (Match Center) → bloque `FEAT-009`, `FEAT-010`, `FEAT-011`, `FEAT-012`, `FEAT-013`, `FEAT-017`, `FEAT-019`, `FEAT-020`

---

## 10. Critères de conformité

La conformité évalue les obligations légales, éthiques et réglementaires non négociables.

| Score | Signification |
|:---:|:---|
| 5 | Obligation légale directe (RGPD, droit des contrats, obligations de sécurité) — non reportable |
| 4 | Principe éthique fondamental du produit (pas de dark pattern, pas de certitude, explicabilité) |
| 3 | Obligation de qualité ou d'auditabilité interne |
| 2 | Bonne pratique recommandée |
| 1 | Aucune contrainte de conformité associée |

Les fonctionnalités avec un score de conformité de 5 ne peuvent jamais être reportées sans validation humaine explicite et enregistrée dans le Decision Log.

---

## 11. Critères de confiance

La confiance évalue la maturité de la spécification et la certitude de l'équipe dans la définition de la fonctionnalité.

| Score | Signification |
|:---:|:---|
| 5 | Spécification complète, critères d'acceptation définis, aucune question ouverte bloquante |
| 4 | Spécification solide avec des questions ouvertes mineures |
| 3 | Spécification partielle, hypothèses à valider |
| 2 | Concept défini mais implémentation incertaine |
| 1 | Idée exploratoire sans spécification |

Les fonctionnalités avec un score de confiance de 1 ou 2 ne peuvent pas être planifiées en MVP sans révision préalable de leur spécification.

---

## 12. Formule de score

Le score de priorité composite (`SPC`) est calculé comme suit :

```text
SPC = ( V × 2 + R × 1.5 + CF × 1 ) / ( E × 0.5 ) × Kd × Kc
```

**Légende :**

| Variable | Description | Échelle |
|:---|:---|:---:|
| `V` | Score de Valeur | 1–5 |
| `R` | Score de Risque | 1–5 |
| `CF` | Score de Confiance | 1–5 |
| `E` | Score d'Effort | 1–5 |
| `Kd` | Coefficient de Dépendance | 1.0 à 1.5 |
| `Kc` | Coefficient de Conformité | 1.0 à 2.0 |

**Coefficients de dépendance (Kd) :**

| Score D | Kd |
|:---:|:---:|
| 5 | 1.5 |
| 4 | 1.3 |
| 3 | 1.1 |
| 1–2 | 1.0 |

**Coefficients de conformité (Kc) :**

| Score C | Kc |
|:---:|:---:|
| 5 | 2.0 |
| 4 | 1.5 |
| 3 | 1.2 |
| 1–2 | 1.0 |

**Règles d'arrondi :**
- Le SPC est calculé avec deux décimales et arrondi à une décimale pour la présentation.
- En cas d'égalité de SPC entre deux fonctionnalités, la fonctionnalité avec le score de Dépendance (D) le plus élevé est priorisée.
- En cas d'égalité persistante, la fonctionnalité avec le score de Conformité (C) le plus élevé est priorisée.

**Traitement de l'effort :**
- L'effort (E) est un **diviseur** dans la formule : un effort élevé pénalise le score. Une fonctionnalité à valeur identique mais plus simple sera favorisée.
- L'effort est évalué en termes **fonctionnels** uniquement (nombre d'états, de règles métier, d'intégrations). Aucune estimation technique n'est réalisée en Phase 1.
- Les scores d'effort seront révisés lors de la Phase 2 (Architecture) avec des estimations réelles.

**Traitement de la confiance :**
- La confiance (CF) est un **numérateur** : une spécification solide améliore le score.
- Une fonctionnalité avec CF ≤ 2 ne peut pas être planifiée en MVP sans révision de spécification, **quel que soit son SPC**.
- Une fonctionnalité avec CF = 5 et C = 5 est systématiquement surclassée à P0 si son SPC est ≥ 15 (règle d'exception §15).

**Règle d'exception P0 :**
- Toute fonctionnalité répondant simultanément à C = 5 (obligation légale) et à CF ≥ 4 est automatiquement classée P0, indépendamment de son SPC.

> **Important :** Le score SPC est une **aide à la décision**, pas une mesure objective. Il ne remplace pas le jugement humain. Toute décision finale reste soumise à la revue du Fondateur ABYSS (§26).

---

## 13. Règles d'interprétation

| SPC | Priorité recommandée |
|:---:|:---|
| ≥ 20 | **P0** — Critique et bloquant absolu (sécurité, conformité légale) |
| 15–19 | **P1** — Essentiel au MVP |
| 10–14 | **P1 ou P2** — Important, selon position dans le graphe de dépendances |
| 6–9 | **P2 ou P3** — Utile, reportable en V1 |
| 3–5 | **P3** — Secondaire, reporter en V2 |
| < 3 | **P4** — Optionnel, Future |

**Règles de surclassement :**

Une fonctionnalité peut être surclassée (priorité augmentée) si :
- Elle est une dépendance bloquante d'une fonctionnalité P0 ou P1.
- Elle répond à une obligation légale ou éthique explicite (C = 5 → P0 automatique).
- Elle est requise par un critère de sortie du MVP ([MVP Scope §5](../08-product-blueprint/30-mvp-scope.md)).

**Règles de déclassement :**

Une fonctionnalité peut être déclassée (priorité abaissée) si :
- Une question ouverte non résolue bloque sa spécification.
- Aucune dépendance active ne l'exige au MVP.
- Son score de confiance est ≤ 2.

---

## 14. Règles de décision

Les règles suivantes s'appliquent à toutes les décisions de priorisation :

1. **Règle d'unicité :** Chaque fonctionnalité reçoit exactement un niveau de priorité officiel (`P0` à `P4`).
2. **Règle de traçabilité :** Toute modification de priorité est documentée avec : auteur, date, justification, référence documentaire.
3. **Règle de gel MVP :** Le périmètre P0/P1 du MVP ne peut pas être élargi sans approbation explicite du Fondateur ABYSS.
4. **Règle de non-invention :** Aucune fonctionnalité ne peut être ajoutée sans référence à une exigence `FR-*` ou une décision documentée.
5. **Règle de cohérence :** Un niveau de priorité attribué dans ce document est la référence. Il prime sur toute mention informelle dans d'autres documents.
6. **Règle de conflit :** En cas de contradiction entre deux documents sur la priorité d'une fonctionnalité, ce document prévaut et une incohérence est signalée (§23).

---

## 15. Exceptions

Les exceptions suivantes sont documentées et ne constituent pas des incohérences :

| Exception | Fonctionnalité | Justification |
|:---|:---|:---|
| P2 dans le MVP | `FEAT-017` (Signalement) | Priorité P2 officielle dans le PRD (`FR-016`). Inclus au MVP par le User Journey §8 et le MVP Scope §2 (incidents). Voir [features.md §19](features.md) pour la décision documentée. |
| P2 dans les NFR | `NFR-004` (Scalabilité) | La scalabilité avancée n'est pas bloquante pour le MVP mais critique pour la V1. |
| P2 dans les NFR | `NFR-011` (i18n) | La structure i18n est requise dès le MVP (aucun texte codé en dur) mais les langues supplémentaires sont V1. Voir OQ-004. |
| **P1 actuel → P0 recommandé** | `FEAT-002` (Connexion et authentification) | Le scoring produit P0 (C=5, CF=5, règle d'exception §12). L'authentification sécurisée expose directement les données utilisateurs en cas de défaillance (NFR-007 P0). La règle Blueprint `13-features.md §7` stipule qu'une fonctionnalité peut être P0 si elle réduit un risque critique — ce qui est le cas ici. **Priorité actuelle conservée à P1 dans [`features.md`](features.md). Cette reclassification est soumise à validation humaine.** |

---

## 16. Priorisation du MVP

Le MVP inclut **20 fonctionnalités actives** (`FEAT-001` à `FEAT-020`).

| ID | Fonctionnalité | Priorité | SPC indicatif | Justification principale |
|:---|:---|:---:|:---:|:---|
| **FEAT-001** | Inscription et confirmation de compte | P1 | 18.0 | Dépendance racine de tout le produit |
| **FEAT-002** | Connexion et authentification sécurisées | P0 | 22.5 | Sécurité obligatoire + dépendance racine |
| **FEAT-003** | Profil utilisateur et préférences | P1 | 14.0 | Dépendance de l'Onboarding |
| **FEAT-004** | Onboarding de configuration initiale | P1 | 14.5 | Activation utilisateur — 5 étapes mesurables |
| **FEAT-005** | Dashboard d'accueil personnalisé | P1 | 16.0 | Accès centralisé, rétention J7 |
| **FEAT-006** | Liste des matchs du jour | P1 | 15.0 | Découverte — parcours principal |
| **FEAT-007** | Recherche globale autocomplete | P1 | 13.5 | Navigation universelle |
| **FEAT-008** | Fiche d'information Match Center | P1 | 20.0 | Dépendance de 8 autres fonctionnalités |
| **FEAT-009** | Forme et statistiques de base | P1 | 15.5 | Compréhension du match — North Star |
| **FEAT-010** | Probabilités et score de confiance | P1 | 17.0 | Cœur de valeur analytique d'Athena |
| **FEAT-011** | Résumé d'analyse généré par IA | P1 | 16.5 | Explicabilité — principe fondamental |
| **FEAT-012** | Facteurs explicatifs hiérarchisés | P1 | 15.0 | Compréhension des probabilités |
| **FEAT-013** | Indicateur de fraîcheur et sources | P1 | 14.0 | Confiance et transparence (P-08) |
| **FEAT-014** | Marquage et synchronisation des favoris | P1 | 13.0 | Personnalisation — rétention |
| **FEAT-015** | Notifications d'événements de match | P1 | 12.5 | Engagement sans connexion permanente |
| **FEAT-016** | Tunnel d'abonnement Premium | P1 | 14.0 | Monétisation — viabilité commerciale |
| **FEAT-017** | Signalement d'anomalies de données | P2 | 10.0 | Qualité — User Journey §8, incidents MVP |
| **FEAT-018** | Administration et observabilité | P1 | 15.5 | Opérabilité interne — critère de sortie MVP |
| **FEAT-019** | Gestion des données manquantes | P1 | 14.5 | Intégrité de l'affichage — règle BR-002 |
| **FEAT-020** | Résilience et états incohérents | P1 | 14.0 | Stabilité produit — critère de sortie MVP |

**Critères de sortie du MVP** ([MVP Scope §5](../08-product-blueprint/30-mvp-scope.md)) :
- Données fiables sur le périmètre ;
- Match Center stable ;
- Probabilités versionnées ;
- Explications fondées ;
- Métriques actives ;
- Sécurité validée ;
- Tests de couverture ;
- Utilisateurs pilotes validés ;
- Compréhension déclarée mesurée (≥ 70 %).

---

## 17. Priorisation de la V1

La V1 inclut **3 fonctionnalités reportées** du catalogue officiel, figurant dans la roadmap ([Product Roadmap §3](../08-product-blueprint/32-product-roadmap.md)).

| ID | Fonctionnalité | Priorité indicative V1 | Justification du report |
|:---|:---|:---:|:---|
| **FEAT-022** | Outil de simulation de match (What-If) | P2 | Simulations interactives exclues du MVP Scope §3 |
| **FEAT-023** | Comparateur de cotes de marché | P2 | Intégration avancée des bookmakers hors périmètre initial |
| **FEAT-024** | Module Live Center temps réel | P2 | Flux instantanés hors périmètre (scheduled/finished prioritaires) |

La V1 pourra également inclure des extensions des fonctionnalités MVP selon les retours utilisateurs post-lancement.

---

## 18. Priorisation de la V2

La V2 inclut **2 fonctionnalités reportées** du catalogue officiel, correspondant aux phases professionnelles et d'ouverture d'API.

| ID | Fonctionnalité | Priorité indicative V2 | Justification du report |
|:---|:---|:---:|:---|
| **FEAT-025** | API publique d'export | P3 | Interface programmable réservée aux usages professionnels futurs |
| **FEAT-026** | Moteur de recommandation personnalisé | P3 | Algorithmes de recommandation avancés exclus explicitement du PRD §8 |

---

## 19. Priorisation Future

La phase Future inclut **1 fonctionnalité** correspondant à l'extension du périmètre sportif, explicitement exclue du MVP par le PRD §8 et le MVP Scope §3.

| ID | Fonctionnalité | Priorité indicative | Justification du report |
|:---|:---|:---:|:---|
| **FEAT-021** | Support multi-sports | P4 | Restriction stricte au football au MVP. Extension conditionnelle à la validation du modèle football. |

---

## 20. Matrice de priorisation

La matrice suivante consolide l'ensemble des 26 fonctionnalités avec leurs scores, leur priorité actuelle (issue du catalogue officiel [`features.md`](features.md)) et la priorité recommandée issue du scoring.

Lorsque la priorité recommandée diffère de la priorité actuelle, une colonne **Décision** indique le statut de la proposition.

| ID | Fonctionnalité | Phase | V | R | E | D | C | CF | SPC | Priorité actuelle | Priorité recommandée | Décision |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| FEAT-001 | Inscription | MVP | 5 | 4 | 2 | 5 | 4 | 5 | 22.1 | P1 | P1 | Conforme |
| FEAT-002 | Connexion et auth | MVP | 5 | 5 | 2 | 5 | 5 | 5 | 30.0 | **P1** | **P0** | **À valider** |
| FEAT-003 | Profil et préférences | MVP | 4 | 2 | 2 | 4 | 3 | 5 | 16.9 | P1 | P1 | Conforme |
| FEAT-004 | Onboarding | MVP | 4 | 2 | 3 | 3 | 2 | 5 | 11.0 | P1 | P1 | Conforme |
| FEAT-005 | Dashboard | MVP | 5 | 2 | 3 | 4 | 2 | 5 | 14.3 | P1 | P1 | Conforme |
| FEAT-006 | Matchs du jour | MVP | 4 | 2 | 2 | 3 | 2 | 5 | 15.4 | P1 | P1 | Conforme |
| FEAT-007 | Recherche | MVP | 4 | 2 | 3 | 2 | 2 | 5 | 10.0 | P1 | P1 | Conforme |
| FEAT-008 | Match Center | MVP | 5 | 4 | 4 | 5 | 3 | 5 | 19.8 | P1 | P1 | Conforme |
| FEAT-009 | Statistiques et forme | MVP | 5 | 3 | 3 | 4 | 2 | 5 | 14.3 | P1 | P1 | Conforme |
| FEAT-010 | Probabilités | MVP | 5 | 4 | 4 | 4 | 4 | 5 | 18.2 | P1 | P1 | Conforme |
| FEAT-011 | Résumé IA | MVP | 5 | 4 | 4 | 4 | 4 | 5 | 18.2 | P1 | P1 | Conforme |
| FEAT-012 | Facteurs explicatifs | MVP | 4 | 3 | 3 | 3 | 3 | 5 | 13.2 | P1 | P1 | Conforme |
| FEAT-013 | Sources et fraîcheur | MVP | 4 | 3 | 2 | 3 | 3 | 5 | 16.9 | P1 | P1 | Conforme |
| FEAT-014 | Favoris | MVP | 4 | 1 | 2 | 3 | 1 | 5 | 13.0 | P1 | P1 | Conforme |
| FEAT-015 | Notifications | MVP | 3 | 2 | 3 | 2 | 3 | 5 | 10.0 | P1 | P1 | Conforme |
| FEAT-016 | Abonnement Premium | MVP | 4 | 3 | 4 | 3 | 4 | 4 | 13.7 | P1 | P1 | Conforme |
| FEAT-017 | Signalement | MVP | 3 | 4 | 2 | 2 | 3 | 5 | 14.4 | P2 | P2 | Conforme |
| FEAT-018 | Administration | MVP | 4 | 4 | 3 | 4 | 3 | 5 | 16.5 | P1 | P1 | Conforme |
| FEAT-019 | Données manquantes | MVP | 4 | 4 | 2 | 3 | 3 | 5 | 18.7 | P1 | P1 | Conforme |
| FEAT-020 | Résilience | MVP | 4 | 5 | 2 | 3 | 3 | 5 | 20.2 | P1 | P1 | Conforme |
| FEAT-021 | Multi-sports | Future | 3 | 1 | 5 | 1 | 1 | 2 | 2.0 | P4 | P4 | Conforme |
| FEAT-022 | Simulation What-If | V1 | 4 | 1 | 4 | 1 | 1 | 3 | 3.5 | P2 | P3 | **À valider** |
| FEAT-023 | Comparateur de cotes | V1 | 3 | 1 | 4 | 1 | 2 | 3 | 3.5 | P2 | P3 | **À valider** |
| FEAT-024 | Live Center temps réel | V1 | 4 | 2 | 5 | 1 | 1 | 3 | 3.0 | P2 | P3 | **À valider** |
| FEAT-025 | API publique | V2 | 2 | 1 | 4 | 1 | 2 | 3 | 2.6 | P3 | P3 | Conforme |
| FEAT-026 | Recommandation pers. | V2 | 3 | 1 | 5 | 1 | 1 | 2 | 1.6 | P3 | P4 | **À valider** |

**Légende :** **V** = Valeur · **R** = Risque · **E** = Effort · **D** = Dépendance · **C** = Conformité · **CF** = Confiance · **SPC** = Score de Priorité Composite

**Résumé des priorités actuelles (catalogue officiel) :**

| Niveau | Nombre | Fonctionnalités |
|:---:|:---:|:---|
| P0 | 0 | *(aucune dans le catalogue actuel)* |
| P1 | 19 | FEAT-001, 003–016, 018–020 |
| P2 | 4 | FEAT-017, 022, 023, 024 |
| P3 | 2 | FEAT-025, 026 |
| P4 | 1 | FEAT-021 |
| **Total** | **26** | |

**Propositions de révision issues du scoring (`À valider`) :**

| ID | Priorité actuelle | Priorité recommandée | Justification | Impact |
|:---|:---:|:---:|:---|:---|
| FEAT-002 | P1 | P0 | C=5 (obligation légale de sécurité, NFR-007 P0) + CF=5 → règle d'exception P0 automatique §12. Défaillance = exposition directe des données utilisateurs. | Surclassement. Modifier [`features.md`](features.md) si validé par le Fondateur. |
| FEAT-022 | P2 | P3 | SPC=3.5, portée V1 (Reportée), aucune dépendance bloquante. Score P2 actuel non justifié par la formule. | Déclassement mineur. |
| FEAT-023 | P2 | P3 | SPC=3.5, portée V1 (Reportée), intégration bookmakers hors périmètre. Score P2 actuel non justifié par la formule. | Déclassement mineur. |
| FEAT-024 | P2 | P3 | SPC=3.0, portée V1 (Reportée), flux live hors MVP. Score P2 actuel non justifié par la formule. | Déclassement mineur. |
| FEAT-026 | P3 | P4 | SPC=1.6, portée V2 (Reportée), algorithmes avancés exclus du PRD §8. Score P4 cohérent avec la phase Future. | Déclassement mineur. |

---

## 21. Fonctionnalités bloquantes

Les fonctionnalités suivantes sont **bloquantes** : elles doivent être complètes et stables avant que les fonctionnalités qui en dépendent puissent être lancées.

| Fonctionnalité bloquante | Fonctionnalités débloquées |
|:---|:---|
| `FEAT-001` (Inscription) | `FEAT-002`, `FEAT-003`, `FEAT-004` |
| `FEAT-002` (Connexion) | `FEAT-003`, `FEAT-018` |
| `FEAT-003` (Profil) | `FEAT-004`, `FEAT-016` |
| `FEAT-004` (Onboarding) | `FEAT-005` |
| `FEAT-005` (Dashboard) | `FEAT-006`, `FEAT-014` |
| `FEAT-006` (Matchs du jour) | `FEAT-008` |
| `FEAT-008` (Match Center) | `FEAT-009`, `FEAT-010`, `FEAT-013`, `FEAT-017`, `FEAT-019`, `FEAT-020` |
| `FEAT-010` (Probabilités) | `FEAT-011`, `FEAT-012` |
| `FEAT-014` (Favoris) | `FEAT-015` |

**Conséquence :** Aucune dépendance aval ne peut être planifiée tant que la fonctionnalité bloquante n'est pas en statut `Définie` et ses critères d'acceptation validés.

---

## 22. Dépendances critiques

Les dépendances suivantes sont considérées comme critiques car leur non-disponibilité bloquerait directement plusieurs fonctionnalités P1 du MVP. Elles sont formulées en termes fonctionnels et n'imposent aucun choix de fournisseur, de service ou d'architecture.

| Dépendance fonctionnelle | Fonctionnalités concernées | Référence |
|:---|:---|:---:|
| Disponibilité de données sportives suffisamment complètes et fraîches | `FEAT-006`, `FEAT-008`, `FEAT-009`, `FEAT-010`, `FEAT-013` | OQ-003, OQ-006 |
| Capacité à traiter et gérer le cycle de vie d'un abonnement | `FEAT-016` | OQ-001, OQ-002 |
| Disponibilité de résultats probabilistes fiables, accompagnés d'un niveau de confiance et de facteurs explicatifs | `FEAT-010`, `FEAT-011`, `FEAT-012` | À définir lors des phases de conception concernées |
| Capacité à transmettre les communications indispensables au parcours de compte | `FEAT-001` | Dépendance fonctionnelle |
| Capacité à transmettre les notifications autorisées par l'utilisateur | `FEAT-015` | Dépendance fonctionnelle |

Référence : [PRD §30](product-requirements-document.md)

---

## 23. Risques de priorisation

| Risque | Impact | Probabilité | Réponse |
|:---|:---:|:---:|:---|
| Élargissement non contrôlé du périmètre MVP (scope creep) | Élevé | Moyenne | Appliquer la règle de gel MVP (§14 règle 3) |
| Questions ouvertes non résolues bloquant la spécification | Élevé | Élevée | Résoudre OQ-001 à OQ-006 avant la fin Phase 1 |
| Sous-estimation de l'effort fonctionnel | Moyen | Moyenne | Réviser les scores E lors de la revue trimestrielle |
| Décision de priorité sans justification documentée | Moyen | Faible | Appliquer la règle de traçabilité (§14 règle 2) |
| Conflits de priorité entre stakeholders | Élevé | Faible | Escalade au Fondateur ABYSS, décision dans le Decision Log |

---

## 24. Hypothèses

Les hypothèses suivantes ont été posées lors de l'élaboration de cette méthode de priorisation :

- **H-001 :** Les scores de valeur, risque et confiance sont évalués de manière cohérente par l'équipe produit, sans biais de confirmation.
- **H-002 :** La formule de score est un outil indicatif. Les décisions finales de priorisation reposent sur le jugement humain après lecture des scores.
- **H-003 :** Les fonctionnalités hors MVP (`FEAT-021` à `FEAT-026`) ne seront pas réintégrées au périmètre MVP sans preuve documentée d'un besoin critique ou d'une décision du Fondateur.
- **H-004 :** Les scores d'effort (`E`) sont fonctionnels, non techniques. Ils seront révisés lors de la Phase 2 (Architecture) lorsque l'effort technique réel sera connu.
- **H-005 :** Les OQ-001 à OQ-006 seront résolues avant le lancement du design UX/UI (Phase 3). Leur résolution peut modifier des priorités P2 ou P3.

---

## 25. Questions ouvertes

Les questions ouvertes suivantes impactent la priorisation et sont centralisées dans [`docs/06-operations/open-questions.md`](../06-operations/open-questions.md) :

| ID | Question | Fonctionnalités impactées | Impact sur la priorisation |
|:---|:---|:---|:---|
| **OQ-001** | Quotas Free exacts | `FEAT-016`, `FEAT-003` | Définit les seuils du tunnel Premium — peut modifier l'effort E de `FEAT-016` |
| **OQ-002** | Structure tarifaire Premium | `FEAT-016` | La complexité du tunnel de paiement dépend du modèle tarifaire retenu |
| **OQ-003** | Fournisseurs de données sportives | `FEAT-008`, `FEAT-009`, `FEAT-010`, `FEAT-013` | Une défaillance fournisseur peut surclasser `FEAT-019` et `FEAT-020` |
| **OQ-004** | Langue(s) initiale(s) du produit | `FEAT-004`, `FEAT-003` | Le périmètre i18n influe sur l'effort E de l'Onboarding et du Profil |
| **OQ-005** | MFA obligatoire pour les utilisateurs finaux | `FEAT-002` | Peut étendre la portée fonctionnelle de `FEAT-002` |
| **OQ-006** | Périmètre des compétitions couvertes au MVP | `FEAT-006`, `FEAT-008`, `FEAT-009` | Définit le volume de données à ingérer — impact sur l'effort et le risque |

---

## 26. Processus de revue

La priorisation est un document vivant révisé selon la cadence suivante :

| Cadence | Déclencheur | Participants | Livrables |
|:---|:---|:---|:---|
| **Par phase** | Clôture d'une phase produit | Fondateur ABYSS + Antigravity | Mise à jour du document, commit sur la branche active |
| **Trimestrielle** | Tous les 3 mois | Fondateur ABYSS | Révision des scores, des OQ et des risques |
| **Ad hoc** | Nouvelle fonctionnalité proposée, OQ résolue, incident critique | Fondateur ABYSS | Entrée dans le Decision Log, mise à jour du document si nécessaire |

Toute révision de priorité P0 ou P1 doit être soumise à l'approbation explicite du Fondateur ABYSS.

---

## 27. Gouvernance

| Rôle | Responsabilité |
|:---|:---|
| **Fondateur ABYSS** | Décision finale sur toutes les priorités P0, P1 et P2 |
| **Antigravity (Agent IA)** | Proposition, scoring, documentation, détection d'incohérences |
| **Toute l'équipe** | Application des règles de ce document, signalement des contradictions |

**Principe de gouvernance :** Aucune fonctionnalité ne peut être ajoutée au périmètre MVP sans une entrée dans le Decision Log et l'approbation du Fondateur ABYSS.

---

## 28. Critères de validation

Ce document de priorisation est considéré comme valide et exploitable lorsque :

- [ ] Les 26 fonctionnalités (`FEAT-001` à `FEAT-026`) sont toutes référencées avec un niveau de priorité officiel.
- [ ] Toutes les priorités P0 et P1 sont justifiées par au moins une exigence `FR-*` ou `NFR-*`.
- [ ] La matrice de priorisation (§20) est sans doublon et sans identifiant manquant.
- [ ] Les fonctionnalités bloquantes (§21) sont documentées et cohérentes avec le graphe de dépendances de [`features.md §24`](features.md).
- [ ] Les questions ouvertes (§25) sont listées avec leur impact sur la priorisation.
- [ ] Aucune décision de priorisation n'impose de choix technique, d'architecture, de fournisseur ou d'infrastructure.
- [ ] Le document a été relu et validé par le Fondateur ABYSS.

---

## 29. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Requirements Document](product-requirements-document.md) | Source des exigences fonctionnelles (FR) et non fonctionnelles (NFR) |
| [User Personas](user-personas.md) | Définition des personas cibles (`PER-001` à `PER-006`) |
| [User Stories](user-stories.md) | Récits utilisateurs et critères d'acceptation |
| [Features](features.md) | Catalogue officiel des fonctionnalités (`FEAT-001` à `FEAT-026`) |
| [Product Principles](../08-product-blueprint/02-product-principles.md) | Principes non négociables encadrant la priorisation |
| [Success Metrics](../08-product-blueprint/04-success-metrics.md) | North Star et indicateurs d'activation |
| [Blueprint — Features §7](../08-product-blueprint/13-features.md) | Règle officielle de priorité P0/P1 |
| [MVP Scope](../08-product-blueprint/30-mvp-scope.md) | Périmètre strict du MVP |
| [Product Roadmap](../08-product-blueprint/32-product-roadmap.md) | Phases Foundation, MVP, V1, V2, Future |
| [Open Questions](../06-operations/open-questions.md) | Questions ouvertes OQ-001 à OQ-006 |

---

## 30. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Rédaction initiale — Méthode de priorisation multicritère, matrices MVP/V1/V2/Future, gouvernance |

---

> **Made in Abyss : Spark by the King**

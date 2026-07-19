# User Personas

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition

---

## 1. Objet

Ce document décrit les personas utilisateurs d'Athena: Beyond Odds.

Un persona est une représentation synthétique d'un groupe d'utilisateurs partageant des besoins, des comportements et des objectifs similaires.

Les personas de ce document ont pour but de :

- guider les décisions de conception UX/UI ;
- orienter les priorités fonctionnelles du MVP ;
- aligner l'équipe sur les utilisateurs réels à servir ;
- prévenir les biais de conception centrés sur des cas marginaux ;
- servir de référence lors des phases d'architecture et de développement.

Ce document ne remplace pas la recherche utilisateur.

Il constitue une base de travail à affiner dès que des données de terrain sont disponibles.

---

## 2. Méthode et limites

### 2.1 Source

Les personas ont été construits à partir des documents officiels du projet :

- [Product Overview](../08-product-blueprint/01-product-overview.md) §5
- [User Roles](../08-product-blueprint/08-user-roles.md)
- [User Journeys](../08-product-blueprint/09-user-journeys.md)
- [User Problem](../01-product/user-problem.md)
- [Positioning](../01-product/positioning.md)
- [Product Requirements Document](../02-product-management/product-requirements-document.md) §9

### 2.2 Limites

- Aucune donnée terrain n'a encore été collectée au moment de la rédaction de ce document.
- Les données démographiques (âge, revenus, localisation) sont des estimations hypothétiques, signalées comme telles. Elles doivent être validées lors de la phase de recherche utilisateur.
- Les personas ne sont pas exhaustifs. D'autres profils peuvent exister et seront documentés après la phase de découverte utilisateur.
- Les niveaux d'abonnement (Free, Premium) ne constituent pas des personas distincts. Un même persona peut évoluer entre les niveaux selon son engagement.

### 2.3 Mise à jour

Ce document doit être mis à jour après chaque cycle de recherche utilisateur significatif.

---

## 3. Segmentation des utilisateurs

Athena s'adresse à cinq profils externes et un profil interne.

*(Note : Pour des raisons de traçabilité, les identifiants officiels `PER-001` à `PER-006` sont associés aux codes abrégés historiques du projet `P1` à `P6` dans la section 10).*

```
Utilisateurs externes
├── PER-001 — Amateur de football                  (persona principal)
├── PER-002 — Utilisateur analytique               (persona secondaire)
├── PER-003 — Créateur de contenu ou journaliste   (persona secondaire)
├── PER-004 — Analyste sportif professionnel       (persona secondaire)
└── PER-005 — Utilisateur intéressé par les probabilités et marchés sportifs  (persona secondaire)

Utilisateurs internes
└── PER-006 — Administrateur ou opérateur interne  (persona interne)
```

Le persona principal est celui qui représente le plus grand volume potentiel d'utilisateurs et celui pour lequel le MVP doit être le plus accessible.

Les personas secondaires représentent des segments à valeur élevée dont les besoins orientent les décisions de profondeur fonctionnelle.

---

## 4. Persona principal — Amateur de football (PER-001)

### Identité

| Attribut | Valeur |
|:---|:---|
| **Nom fictif** | Karim |
| **Profil** | Passionné de football, utilisateur non expert en statistiques |
| **Niveau d'expertise sportive** | Intermédiaire — suit régulièrement plusieurs compétitions |
| **Niveau d'expertise données** | Faible — lit les scores, classements et formes sans analyse approfondie |
| **Niveau d'accès typique** | Free, potentiellement Premium |
| **Fréquence d'utilisation anticipée** | Plusieurs fois par semaine, avant et après les matchs des équipes suivies |

> ⚠️ Les données démographiques (âge, pays, revenus) ne sont pas documentées dans les sources officielles. Elles seront précisées après la recherche utilisateur.

### Contexte

Karim suit le football depuis de nombreuses années. Il consulte les scores, les classements et les résumés de matchs sur plusieurs applications différentes. Il a une opinion sur les équipes et les joueurs, mais il manque souvent d'arguments solides pour les étayer ou les remettre en question.

Il passe du temps à chercher l'information avant un grand match, mais il finit souvent avec des données isolées qu'il ne sait pas toujours comment interpréter ensemble.

### Besoins principaux

- Comprendre rapidement pourquoi une équipe est favorite ou non avant un match.
- Accéder à un résumé clair des facteurs importants sans devoir croiser plusieurs sources.
- Suivre les équipes et les compétitions qui l'intéressent en un seul endroit.
- Recevoir des alertes utiles avant les matchs qu'il attend.
- Obtenir des explications accessibles, sans jargon statistique excessif.

### Frustrations actuelles

- Les plateformes de scores n'expliquent pas les données qu'elles affichent.
- Les plateformes de statistiques sont trop complexes pour une utilisation rapide.
- Il doit consulter plusieurs applications pour construire une vision complète d'un match.
- Il ne sait pas toujours à quelle source faire confiance.
- Les prédictions qu'il consulte ne sont jamais accompagnées d'explications.

### Objectifs avec Athena

1. Comprendre les facteurs importants d'un match en quelques minutes.
2. Avoir confiance dans les informations présentées.
3. Retrouver rapidement ses équipes et compétitions favorites.
4. Recevoir les informations utiles au bon moment, sans être submergé.

### Parcours typique

```
Notification avant match
        ↓
Dashboard → Matchs du jour
        ↓
Match Center
        ↓
Résumé Athena (lecture rapide)
        ↓
Facteurs clés
        ↓
Probabilités (vue simplifiée)
        ↓
Ajout aux favoris si intéressant
```

### Fonctionnalités prioritaires pour ce persona

| Fonctionnalité | Priorité |
|:---|:---|
| Dashboard personnalisé | Essentielle |
| Matchs du jour | Essentielle |
| Résumé Athena (vue courte) | Essentielle |
| Favoris | Essentielle |
| Notifications de base | Essentielle |
| Recherche | Importante |
| Probabilités (vue simplifiée) | Importante |
| Forme et statistiques principales | Importante |

### Risques pour ce persona

- Surcharge d'informations si l'interface n'est pas hiérarchisée.
- Méfiance si les explications semblent trop techniques ou trop certaines.
- Abandon si le processus d'inscription est trop long.
- Incompréhension des probabilités si elles ne sont pas expliquées simplement.

---

## 5. Persona secondaire — Utilisateur analytique (PER-002)

### Identité

| Attribut | Valeur |
|:---|:---|
| **Nom fictif** | Léa |
| **Profil** | Utilisatrice régulière de données sportives avancées |
| **Niveau d'expertise sportive** | Élevé — maîtrise les statistiques avancées (xG, possession, pressing) |
| **Niveau d'expertise données** | Élevé — consulte régulièrement plusieurs sources et vérifie ses hypothèses |
| **Niveau d'accès typique** | Premium |
| **Fréquence d'utilisation anticipée** | Quotidienne ou plusieurs fois par semaine |

> ⚠️ Les données démographiques sont hypothétiques et à valider par la recherche utilisateur.

### Contexte

Léa suit le football de manière analytique. Elle lit des rapports statistiques, consulte des bases de données avancées et utilise des outils comme des tableurs pour construire ses propres analyses. Elle est habituée aux métriques comme le xG, la possession, les cartes de chaleur et les statistiques défensives.

Elle cherche un outil qui lui permette de vérifier ses hypothèses, d'accéder rapidement aux données brutes et de les comparer dans un contexte structuré.

### Besoins principaux

- Accéder aux statistiques avancées (xG, xA, pressing, etc.) pour un match ou une équipe.
- Comparer des équipes ou des périodes avec des filtres précis.
- Consulter l'historique des modèles probabilistes et leur calibration.
- Identifier les divergences entre modèles et le marché.
- Accéder aux sources des données pour vérifier leur provenance.
- Trouver les données rapidement, sans friction.

### Frustrations actuelles

- Les plateformes de statistiques présentent les données sans les relier à une analyse globale.
- Les probabilités affichées sur d'autres services n'expliquent jamais leur méthodologie.
- Il est difficile de comparer plusieurs équipes sur des périodes personnalisées.
- Les sources de données ne sont pas toujours identifiées clairement.

### Objectifs avec Athena

1. Vérifier ses hypothèses avec des données contextualisées et traçables.
2. Accéder à plusieurs niveaux de détail selon ses besoins du moment.
3. Comprendre les limites des modèles, pas seulement leurs résultats.
4. Comparer efficacement sans devoir croiser plusieurs outils.

### Parcours typique

```
Recherche directe d'un match ou d'une équipe
        ↓
Match Center
        ↓
Statistiques détaillées (vue avancée)
        ↓
Probabilités + intervalles d'incertitude
        ↓
Facteurs + sources
        ↓
Comparaison avec analyse précédente
```

### Fonctionnalités prioritaires pour ce persona

| Fonctionnalité | Priorité |
|:---|:---|
| Statistiques avancées (xG, xA, pressing) | Essentielle |
| Probabilités complètes avec intervalles | Essentielle |
| Sources et fraîcheur des données | Essentielle |
| Recherche rapide avec filtres | Essentielle |
| Historique des modèles | Importante |
| Comparaisons multi-périodes | Importante (V1) |
| Export des données | Importante (V2) |

### Risques pour ce persona

- Déception si les données avancées sont insuffisantes au MVP.
- Méfiance si les méthodes de calcul ne sont pas transparentes.
- Abandon si la recherche et la navigation sont lentes ou peu précises.

---

## 6. Persona secondaire — Créateur de contenu ou journaliste (PER-003)

### Identité

| Attribut | Valeur |
|:---|:---|
| **Nom fictif** | Amara |
| **Profil** | Créatrice de contenu sportif ou journaliste |
| **Niveau d'expertise sportive** | Élevé — couvre plusieurs équipes et compétitions professionnellement |
| **Niveau d'expertise données** | Moyen à élevé — utilise les chiffres pour appuyer ses contenus |
| **Niveau d'accès typique** | Premium |
| **Fréquence d'utilisation anticipée** | Quotidienne, particulièrement avant et après les grands matchs |

> ⚠️ Les données démographiques sont hypothétiques et à valider par la recherche utilisateur.

### Contexte

Amara produit du contenu autour du football : articles d'analyse, vidéos ou posts sur les réseaux sociaux. Elle doit régulièrement documenter des arguments avec des chiffres fiables et compréhensibles pour son audience.

Elle manque de temps pour recouper plusieurs sources et a besoin d'un outil qui lui fournisse rapidement des éléments factuels, clairs et partageables.

### Besoins principaux

- Obtenir un résumé rapide et fiable des facteurs qui influencent un match.
- Trouver des statistiques marquantes pour illustrer un article ou une vidéo.
- S'appuyer sur des données sourcées et à jour pour éviter les erreurs factuelles.
- Accéder à des tendances récentes facilement citables.
- Pouvoir identifier rapidement les éléments d'intérêt pour son audience.

### Frustrations actuelles

- Le temps de recherche pour croiser plusieurs sources est trop long.
- Les données disponibles sont rarement accompagnées d'une source claire.
- Les analyses existantes sont souvent superficielles ou trop techniques.
- Il est difficile de trouver rapidement un fait marquant sur une équipe ou un joueur.

### Objectifs avec Athena

1. Produire du contenu plus vite avec des données vérifiables.
2. S'appuyer sur un résumé Athena comme base d'analyse à développer.
3. Gagner en crédibilité avec des données sourcées.
4. Trouver des angles d'analyse nouveaux grâce aux facteurs explicatifs.

### Parcours typique

```
Recherche d'un match ou d'une équipe
        ↓
Match Center
        ↓
Résumé Athena (lecture complète)
        ↓
Facteurs clés + sources
        ↓
Statistiques pour citation
        ↓
Rédaction du contenu (hors Athena)
```

### Fonctionnalités prioritaires pour ce persona

| Fonctionnalité | Priorité |
|:---|:---|
| Résumé Athena (version complète) | Essentielle |
| Sources et fraîcheur des données | Essentielle |
| Facteurs explicatifs détaillés | Essentielle |
| Statistiques clés citables | Essentielle |
| Recherche rapide | Essentielle |
| Tendances et forme récente | Importante |
| Export ou partage de données | Importante (V1/V2) |

### Risques pour ce persona

- Perte de confiance si une donnée citée s'avère incorrecte ou mal sourcée.
- Désintérêt si le résumé Athena est trop générique ou trop technique.
- Abandon si la recherche et la navigation ne sont pas fluides.

---

## 7. Persona secondaire — Analyste sportif professionnel (PER-004)

### Identité

| Attribut | Valeur |
|:---|:---|
| **Nom fictif** | Thomas |
| **Profil** | Analyste sportif, consultant ou professionnel des données sportives |
| **Niveau d'expertise sportive** | Expert — produit des analyses professionnelles ou semi-professionnelles |
| **Niveau d'expertise données** | Expert — maîtrise les métriques avancées, les modèles et la méthodologie |
| **Niveau d'accès typique** | Premium ou Professional Analyst |
| **Fréquence d'utilisation anticipée** | Quotidienne, avec des besoins de profondeur et de reproductibilité |

> ⚠️ Les données démographiques sont hypothétiques et à valider par la recherche utilisateur.

### Contexte

Thomas travaille dans un contexte professionnel où la précision et la reproductibilité des analyses sont critiques. Il produit des rapports, compare des périodes longues, suit plusieurs compétitions simultanément et a besoin de comprendre la méthodologie derrière chaque résultat.

Il est habitué à utiliser plusieurs outils spécialisés et cherche une solution qui centralise les données avancées sans sacrifier la rigueur.

### Besoins principaux

- Accéder à des données précises avec leurs métadonnées complètes (source, date, version).
- Comprendre la méthodologie des modèles probabilistes.
- Comparer des équipes et des périodes sur des horizons longs.
- Générer ou exporter des rapports structurés.
- Identifier les divergences entre modèles, simulations et marché.
- Suivre la calibration et les performances historiques des modèles.

### Frustrations actuelles

- Les outils existants ne permettent pas de vérifier la méthode de calcul des probabilités.
- Les données exportables sont rares et souvent incomplètes.
- Il n'existe pas de solution qui centralise données, modèles et explications en une seule interface.
- La reproductibilité des analyses est difficile sans accès aux données d'entrée des modèles.

### Objectifs avec Athena

1. Disposer d'une source de vérité fiable pour ses analyses professionnelles.
2. Accéder aux données d'entrée des modèles pour valider les résultats.
3. Exporter des données propres pour les intégrer à ses propres outils.
4. Comprendre les limites et les hypothèses de chaque modèle.

### Parcours typique

```
Accès direct à une compétition ou une équipe cible
        ↓
Consultation des données avancées et de l'historique
        ↓
Analyse des probabilités avec intervalles et version de modèle
        ↓
Comparaison des modèles et du marché
        ↓
Consultation des sources et métadonnées
        ↓
Export ou génération de rapport (V1/V2)
```

### Fonctionnalités prioritaires pour ce persona

| Fonctionnalité | Priorité |
|:---|:---|
| Méthodologie et versionnement des modèles | Essentielle |
| Données d'entrée identifiables | Essentielle |
| Calibration et performances historiques des modèles | Essentielle |
| Comparaisons multi-périodes | Essentielle (V1) |
| Export de données structurées | Essentielle (V2) |
| Génération de rapports | Importante (V1/V2) |
| API selon contrat | Vision long terme |

### Risques pour ce persona

- Perte de confiance si la méthodologie n'est pas transparente.
- Déception majeure si les exports ne sont pas disponibles au MVP.
- Abandon si la profondeur des données est insuffisante par rapport aux outils spécialisés existants.

---

## 8. Persona secondaire — Utilisateur intéressé par les probabilités et marchés sportifs (PER-005)

### Identité

| Attribut | Valeur |
|:---|:---|
| **Nom fictif** | Sébastien |
| **Profil** | Utilisateur qui compare les probabilités statistiques avec les cotes du marché |
| **Niveau d'expertise sportive** | Moyen à élevé — connaît les équipes et les compétitions principales |
| **Niveau d'expertise données** | Moyen — comprend les probabilités et les cotes implicites, pas nécessairement les modèles statistiques |
| **Niveau d'accès typique** | Premium |
| **Fréquence d'utilisation anticipée** | Régulière, concentrée avant les matchs |

> ⚠️ Les données démographiques sont hypothétiques et à valider par la recherche utilisateur.
>
> ⚠️ **Positionnement éthique :** Athena ne vend pas de pronostics, ne promet aucun gain et n'est pas un service de paris. Ce persona est servi dans le respect strict des principes produit : probabilité, jamais certitude. Référence : [Product Principles §3, §10](../08-product-blueprint/02-product-principles.md)

### Contexte

Sébastien s'intéresse à la relation entre les probabilités statistiques et les cotes proposées sur les marchés sportifs. Il ne cherche pas de certitudes, mais veut comprendre si les cotes d'un match reflètent correctement la réalité statistique.

Il utilise Athena comme outil de compréhension et de comparaison, pas comme un signal de mise automatique.

### Besoins principaux

- Comparer les probabilités calculées par les modèles avec les probabilités implicites du marché.
- Comprendre la marge de l'opérateur et les mouvements de cotes.
- Identifier les cas où les modèles d'Athena divergent significativement du marché.
- Accéder à l'historique des estimations pour évaluer la calibration des modèles.
- Comprendre les scénarios de risque sur un match.

### Frustrations actuelles

- Les cotes disponibles ne sont jamais accompagnées d'une explication statistique.
- Il n'existe pas de plateforme qui relie probabilités statistiques et marché sans tomber dans le pronostic commercial.
- Les modèles probabilistes disponibles en ligne sont rarement transparents sur leur méthode.
- La comparaison entre plusieurs marchés est fastidieuse.

### Objectifs avec Athena

1. Comprendre les écarts entre probabilités statistiques et cotes de marché.
2. Évaluer la fiabilité des modèles sur le long terme.
3. Disposer d'une source d'analyse indépendante des intérêts commerciaux des bookmakers.
4. Explorer des scénarios sans que le produit lui promette un résultat.

### Parcours typique

```
Consultation du Dashboard ou Recherche
        ↓
Match Center
        ↓
Probabilités (vue complète avec intervalles)
        ↓
Comparaison marché (V1)
        ↓
Facteurs explicatifs
        ↓
Historique des estimations (V1)
```

### Fonctionnalités prioritaires pour ce persona

| Fonctionnalité | Priorité |
|:---|:---|
| Probabilités complètes avec intervalles d'incertitude | Essentielle |
| Score de confiance des modèles | Essentielle |
| Accord entre modèles | Essentielle |
| Comparaison avec probabilités implicites du marché | Importante (V1) |
| Mouvements de cotes | Importante (V1) |
| Historique des estimations | Importante (V1) |
| Scénarios de simulation | Importante (V1) |

### Risques pour ce persona

- Mauvaise interprétation des probabilités comme des certitudes → les avertissements et la formulation sont critiques.
- Confusion entre Athena et un service de paris → le positionnement et le design doivent être irréprochables.
- Utilisation irresponsable si les limites et l'incertitude ne sont pas suffisamment visibles.

---

## 9. Persona interne — Administrateur ou opérateur interne (PER-006)

### Identité

| Attribut | Valeur |
|:---|:---|
| **Nom fictif** | Nicolas |
| **Profil** | Fondateur, opérateur ou administrateur interne du produit |
| **Rôle système** | Administrator, Data Operator, Support Agent |
| **Niveau d'expertise technique** | Élevé — gère les configurations, les incidents et les données |
| **Fréquence d'utilisation** | Quotidienne en phase de lancement, puis régulière en régime de croisière |

### Contexte

L'administrateur ou opérateur interne est responsable du bon fonctionnement du produit. Il gère les utilisateurs, surveille la qualité des données, traite les incidents et configure les paramètres opérationnels.

Au stade du MVP, ce rôle est souvent tenu par le fondateur ou par un petit nombre de personnes qui portent plusieurs casquettes.

### Besoins principaux

- Gérer les comptes utilisateurs (suspension, modification, support).
- Surveiller la qualité et la fraîcheur des données ingérées.
- Identifier et traiter rapidement les incidents de données ou de modèles.
- Activer ou désactiver des fonctionnalités sans déploiement (feature flags).
- Consulter les journaux d'audit pour les actions sensibles.
- Valider les sources de données et les intégrations fournisseurs.

### Frustrations actuelles (projection)

- L'absence d'interface d'administration dédiée impose des interventions techniques directes.
- Le manque d'observabilité rend le diagnostic d'incident lent.
- Les corrections de données sans traçabilité créent des risques d'intégrité.

### Objectifs avec Athena

1. Opérer le produit sans intervention dans le code pour les opérations courantes.
2. Détecter les anomalies de données rapidement grâce aux métriques de qualité.
3. Maintenir la confiance des utilisateurs grâce à des corrections traçables.
4. Contrôler les accès et les droits sans dépendre d'un développeur.

### Parcours typique

```
Tableau de bord d'administration
        ↓
Vérification qualité des données
        ↓
Traitement des incidents ou signalements
        ↓
Gestion des utilisateurs
        ↓
Consultation des audits
```

### Fonctionnalités prioritaires pour ce persona

| Fonctionnalité | Priorité |
|:---|:---|
| Interface d'administration minimale (FR-022) | Essentielle |
| Métriques de qualité des données | Essentielle |
| Gestion des utilisateurs | Essentielle |
| Journal d'audit des actions sensibles | Essentielle |
| Feature flags | Importante |
| Gestion des fournisseurs de données | Importante |
| Observabilité (logs, alertes) | Essentielle |

---

## 10. Comparaison des personas

*(Note : Pour assurer la cohérence documentaire avec les anciennes spécifications Notion du projet, les codes abrégés historiques `P1` à `P6` sont associés à leur identifiant officiel correspondant).*

| Dimension | PER-001 (P1) | PER-002 (P2) | PER-003 (P3) | PER-004 (P4) | PER-005 (P5) | PER-006 (P6) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| Expertise sportive | Moyenne | Élevée | Élevée | Experte | Moyenne/Élevée | Variable |
| Expertise données | Faible | Élevée | Moyenne | Experte | Moyenne | Élevée |
| Profondeur attendue | Faible | Élevée | Moyenne | Très élevée | Élevée | — |
| Fréquence d'usage | Hebdo | Quotidien | Quotidien | Quotidien | Régulière | Quotidien |
| Accès MVP | Free/Premium | Premium | Premium | Premium/Pro | Premium | Admin |
| Priorité MVP | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★★ |
| Besoin explicabilité | Élevé | Moyen | Élevé | Faible | Moyen | — |
| Sensibilité au design | Élevée | Faible | Élevée | Faible | Faible | Faible |

---

## 11. Besoins communs

Tous les personas partagent les besoins suivants :

1. **Fiabilité des données** — Les informations présentées doivent être exactes, à jour et sourcées.
2. **Transparence** — La provenance, la fraîcheur et les limites des données doivent être visibles.
3. **Rapidité d'accès** — L'information pertinente doit être accessible rapidement.
4. **Absence de promesse** — Aucun résultat garanti ne doit être présenté.
5. **Gestion des données manquantes** — Les informations absentes doivent être signalées, jamais masquées.
6. **Cohérence** — Une même information ne doit pas varier entre deux écrans.
7. **Accessibilité minimale** — Les fonctions essentielles doivent être utilisables sans barrière.

---

## 12. Besoins divergents

| Besoin | PER-001 | PER-002 | PER-003 | PER-004 | PER-005 | PER-006 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| Résumé simplifié et accessible | ✅ | — | ✅ | — | — | — |
| Statistiques avancées (xG, xA, etc.) | — | ✅ | Partiel | ✅ | Partiel | — |
| Méthodologie des modèles | — | Partiel | — | ✅ | ✅ | — |
| Comparaison avec cotes de marché | — | — | — | Partiel | ✅ | — |
| Export de données | — | Partiel | — | ✅ | — | — |
| Interface d'administration | — | — | — | — | — | ✅ |
| Alertes avancées | Basiques | ✅ | Partiel | — | Partiel | — |
| Historique étendu | — | ✅ | Partiel | ✅ | ✅ | — |
| Journaux d'audit | — | — | — | — | — | ✅ |

---

## 13. Implications produit

Les personas ont les implications suivantes sur les décisions produit :

### Hiérarchisation du MVP

Le persona `PER-001` (Amateur de football) est le plus critique pour valider l'hypothèse centrale d'Athena : est-ce que les utilisateurs non experts comprennent mieux un match grâce à Athena ?

Le persona `PER-006` (Administrateur ou opérateur interne) est indispensable pour opérer le produit à son lancement.

Les personas `PER-002`, `PER-003`, `PER-004` et `PER-005` orientent la profondeur fonctionnelle de la V1 et de la V2.

### Conception progressive

La conception doit permettre d'afficher un résumé accessible à `PER-001` tout en donnant accès à la profondeur attendue par `PER-002`, `PER-004` et `PER-005`. La divulgation progressive est le mécanisme clé.

Référence : [Product Principles §6](../08-product-blueprint/02-product-principles.md)

### Explicabilité

`PER-001` et `PER-003` ont besoin d'explications en langage naturel.

`PER-004` et `PER-005` ont besoin de transparence sur la méthode, pas seulement sur les conclusions.

Ces deux besoins doivent coexister dans le Match Center sans créer de friction.

### Positionnement anti-casino

`PER-005` est le persona le plus sensible aux risques de dérive vers un positionnement de paris. La conception de la section probabilités doit être irréprochable : formulation prudente, intervalles d'incertitude visibles, avertissements présents.

Référence : [Product Principles §3, §10](../08-product-blueprint/02-product-principles.md)

---

## 14. Implications UX

### Pour `PER-001` — Amateur

- Résumé Athena lisible en moins de 60 secondes.
- Probabilités présentées sans jargon et avec une indication claire du niveau de confiance.
- Onboarding guidé pour la sélection des équipes et compétitions.
- Dashboard peuplé dès la première connexion avec une sélection par défaut pertinente.

### Pour `PER-002` — Analytique

- Accès aux statistiques avancées sans friction (pas besoin de naviguer entre plusieurs pages).
- Sources et horodatage visibles au clic, pas sur une page dédiée.
- Mode de comparaison efficace (à concevoir en V1).

### Pour `PER-003` — Créateur

- Résumé Athena exportable ou facilement copiable (formulation claire, pas de verbiage).
- Identification des faits marquants mis en évidence visuellement.
- Navigation rapide entre plusieurs matchs de la même journée.

### Pour `PER-004` — Analyste professionnel

- Accès à la version du modèle et aux données d'entrée depuis le Match Center.
- Interface d'export (V2 prioritaire pour ce persona).
- Tableau de suivi de la calibration accessible (à concevoir en V1).

### Pour `PER-005` — Marchés

- Comparaison probabilités modèles / probabilités implicites du marché affichée clairement (V1).
- Intervalles d'incertitude et accord entre modèles toujours visibles.
- Avertissements présents et non masquables sur la page des probabilités.

### Pour `PER-006` — Administrateur

- Interface d'administration séparée de l'interface utilisateur.
- Tableau de bord opérationnel avec métriques de qualité en temps quasi-réel.
- Actions sensibles confirmées et journalisées.

---

## 15. Implications commerciales

### Freemium

`PER-001` est le persona naturel de l'offre Free. Sa conversion vers le Premium interviendra quand il souhaitera accéder à des analyses plus profondes (probabilités complètes, alertes avancées, historique).

`PER-002`, `PER-003`, `PER-004` et `PER-005` sont des personas naturels du Premium ou du niveau Professional Analyst.

### Valeur perçue du Premium

La différence de valeur entre Free et Premium doit être perçue comme un gain de profondeur et de contrôle, pas comme un mur artificiel. La frustration ne doit pas être le moteur de conversion.

Référence : [Product Principles §10](../08-product-blueprint/02-product-principles.md)

### Questions ouvertes associées

- Les quotas du compte Free (OQ-001) conditionnent directement la valeur perçue par `PER-001`.
- La structure tarifaire (OQ-002) doit être calibrée pour `PER-002`, `PER-003` et `PER-005` qui comparent plusieurs outils.

Référence : [Open Questions](../06-operations/open-questions.md)

---

## 16. Risques de mauvaise interprétation

| Risque | Description | Mitigation |
|:---|:---|:---|
| Concevoir uniquement pour `PER-001` | Le MVP devient trop simple pour `PER-002`, `PER-004`, `PER-005` | Respecter la divulgation progressive dès le MVP |
| Concevoir uniquement pour `PER-004` | L'interface devient inaccessible à `PER-001` | Tester systématiquement la lisibilité avec des utilisateurs non experts |
| Confondre `PER-005` avec un parieur | Le produit dérive vers un outil de mise | Maintenir les avertissements, la formulation prudente et le positionnement clair |
| Négliger `PER-006` | Le lancement du produit est entravé par l'absence d'outils d'administration | Considérer `PER-006` comme une exigence opérationnelle, pas une option |
| Considérer Free/Premium comme des personas | Les restrictions d'accès ne définissent pas un profil utilisateur | Les personas traversent les niveaux d'abonnement |

---

## 17. Hypothèses à valider

Les hypothèses suivantes concernent les personas et devront être testées lors de la phase de recherche utilisateur :

- **Hypothèse à valider :** `PER-001` représente le profil le plus fréquent parmi les premiers utilisateurs potentiels d'Athena.
- **Hypothèse à valider :** `PER-001` comprend et apprécie une formulation probabiliste prudente.
- **Hypothèse à valider :** `PER-002` considère la profondeur des données d'Athena comme un avantage réel par rapport aux outils existants.
- **Hypothèse à valider :** `PER-003` utiliserait Athena comme source complémentaire dans son travail.
- **Hypothèse à valider :** `PER-004` serait disposé à payer pour les fonctionnalités professionnelles ou avancées disponibles au MVP.
- **Hypothèse à valider :** `PER-005` comprend et accepte la distinction entre analyse probabiliste et conseil de mise.
- **Hypothèse à valider :** un même utilisateur peut correspondre à plusieurs personas selon son contexte.
- **Hypothèse à valider :** l'onboarding prévu permet à `PER-001` d'atteindre rapidement une première valeur.

---

## 18. Questions de recherche utilisateur

Les questions suivantes doivent être explorées lors des premières sessions de recherche :

### Pour `PER-001`
- Comment cherchez-vous des informations avant un match important ?
- Qu'est-ce qui vous manque dans les outils que vous utilisez actuellement ?
- Qu'est-ce qu'une « bonne explication » d'un match pour vous ?
- Comment réagissez-vous lorsqu'une probabilité est présentée sans explication ?

### Pour `PER-002`
- Quels outils utilisez-vous actuellement pour vos analyses ? Quelles sont leurs limites ?
- Quelle importance accordez-vous à la traçabilité des données ?
- Que pensez-vous de la calibration des modèles probabilistes disponibles actuellement ?

### Pour `PER-003`
- Comment construisez-vous vos analyses aujourd'hui ? Combien de temps y consacrez-vous ?
- Quelle est la donnée que vous cherchez le plus souvent avant un match ?
- Avez-vous déjà eu des problèmes liés à des données incorrectes dans votre contenu ?

### Pour `PER-004`
- Quelles sont vos exigences minimales en termes de méthodologie et de traçabilité ?
- Exportez-vous des données ? Dans quel format ?
- Qu'est-ce qui vous ferait abandonner un outil au profit d'un autre ?

### Pour `PER-005`
- Comment utilisez-vous les probabilités dans votre pratique actuelle ?
- Comprenez-vous spontanément la différence entre probabilité estimée et cote implicite ?
- Quelle importance accordez-vous aux intervalles d'incertitude ?

---

## 19. Critères de validation

Ce document de personas est considéré comme exploitable pour la phase de conception UX lorsque :

- [ ] Au moins une session de recherche utilisateur a été réalisée avec chaque profil principal (`PER-001`, `PER-002`).
- [ ] Les hypothèses de la section 17 ont été partiellement confirmées ou infirmées.
- [ ] Les données démographiques ont été complétées avec des données réelles.
- [ ] Les questions de recherche de la section 18 ont été soumises à des utilisateurs représentatifs.
- [ ] Les implications UX de la section 14 ont été validées par le responsable produit.
- [ ] Le statut de ce document passe de `Brouillon` à `À valider`.

---

## 20. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Overview §5](../08-product-blueprint/01-product-overview.md) | Définition officielle des publics cibles |
| [User Roles](../08-product-blueprint/08-user-roles.md) | Rôles et permissions système |
| [User Journeys](../08-product-blueprint/09-user-journeys.md) | Parcours utilisateurs officiels |
| [Product Principles](../08-product-blueprint/02-product-principles.md) | Principes qui encadrent les décisions |
| [MVP Scope](../08-product-blueprint/30-mvp-scope.md) | Périmètre fonctionnel du MVP |
| [User Problem](../01-product/user-problem.md) | Formulation du problème utilisateur |
| [Positioning](../01-product/positioning.md) | Positionnement produit |
| [Product Requirements Document](../02-product-management/product-requirements-document.md) | Exigences fonctionnelles et non fonctionnelles |
| [Open Questions](../06-operations/open-questions.md) | Décisions en attente |

---

## 21. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Première rédaction — 6 personas, Phase 1 Product Definition |

---

> **Made in Abyss : Spark by the King**

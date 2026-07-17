# Protocole comparatif — football-data.org vs Sportmonks

> **Statut :** Protocole — exécution et validation requises
> **Version :** 1.0
> **Date :** 2026-07-17
> **Auteur :** Antigravity (pour Fondateur ABYSS)
> **Branche :** docs/phase-1-product-definition
> **Questions liées :** OQ-003 (fournisseurs de données), OQ-006 (compétitions MVP)
> **Décision de référence :** DEC-001 (arbitrage conditionnel du 2026-07-17)
> **Étude de référence :** `data-source-feasibility-study.md` (v1.1)

Ce protocole définit un test reproductible, identique pour les deux fournisseurs candidats. Il ne constitue pas une décision de sélection.

**Engagements pendant ce protocole :**
- Aucun compte payant ne sera créé sans autorisation explicite du Fondateur.
- Aucun abonnement, contrat ou engagement financier ne sera souscrit.
- Aucune donnée personnelle ne sera transmise à un fournisseur.
- OQ-003, OQ-006 et DEC-001 ne seront pas modifiés avant la conclusion du test.

---

## 1. Inspection Git préalable

| Élément | Valeur |
|:---|:---|
| Branche | `docs/phase-1-product-definition` |
| HEAD | `6bd5463` |
| Statut de l'arbre de travail | Propre |

---

## 2. Fournisseurs comparés

| Fournisseur | Rôle dans cette étude | Accès disponible |
|:---|:---|:---|
| **football-data.org** | Candidat économique prioritaire pour un prototype de validation | Tier gratuit accessible sans inscription payante (email requis uniquement) |
| **Sportmonks** | Candidat prioritaire à contacter et à tester | Essai de 14 jours mentionné sur la page officielle — activation requise par le Fondateur |

> **Rappel :** Aucune des deux options n'est définitivement sélectionnée. Ce protocole produira les données permettant de faire ce choix.

---

## 3. Échantillon commun

> **Statut :** Échantillon de test — non sélection définitive du MVP

### Compétitions candidates de l'échantillon

| # | Compétition | Pays | Type | Justification |
|:---:|:---|:---|:---|:---|
| 1 | Ligue 1 | France | Championnat national | Compétition domestique cible principale pour les utilisateurs francophones |
| 2 | Premier League | Angleterre | Championnat national | Championnat à plus forte notoriété internationale parmi les candidats |
| 3 | UEFA Champions League | Europe | Compétition européenne | Compétition la plus suivie en Europe ; couverte en tier gratuit sur football-data.org |

### Sous-échantillon ciblé

> **Proposition à valider humainement avant exécution**

| Compétition | Nombre de rencontres proposé | Répartition |
|:---|:---:|:---|
| Ligue 1 | 6 | Sur au moins 2 dates ou journées distinctes |
| Premier League | 6 | Sur au moins 2 dates ou journées distinctes |
| UEFA Champions League | 6 | Sur au moins 2 dates ou journées distinctes |
| **Total** | **18** | |

**Justification de la taille :** Un échantillon de 18 rencontres, réparties sur au moins deux dates ou journées distinctes par compétition, permet de contrôler la présence des rencontres, les dates et les statuts, les scores, les identifiants des équipes et des matchs, les données analytiques disponibles, les champs manquants et la cohérence sur plusieurs périodes — sans prétendre produire une évaluation statistique exhaustive du fournisseur. Un échantillon plus large pourrait fournir des informations supplémentaires, mais il n'est pas nécessaire pour cette première comparaison exploratoire.

> ⚠️ Toutes les valeurs ci-dessous sont des propositions indicatives. Le Fondateur doit valider ou ajuster le nombre de rencontres et les périodes avant l'exécution du test.

### Variables à fixer avant exécution

| Variable | Valeur proposée | Statut |
|:---|:---|:---|
| Saison de référence | 2023-2024 — retenue uniquement si accessible dans les offres gratuites ou d'essai des deux fournisseurs. À défaut, choisir la saison commune la plus récente effectivement disponible chez les deux fournisseurs. | **À valider** |
| Période Ligue 1 | Par exemple deux journées non consécutives (ex. : J10 et J30) — valeur illustrative uniquement | **À valider** |
| Période Premier League | Par exemple deux journées non consécutives (ex. : GW10 et GW30) — valeur illustrative uniquement | **À valider** |
| Période Champions League | Par exemple deux journées de phase de groupes (ex. : journées 3 et 6) — valeur illustrative uniquement | **À valider** |
| Nombre de rencontres par compétition | 6 | **À valider** |
| Nombre total de rencontres | 18 | **À valider** |

---

## 4. Matrice des données à comparer

| Catégorie | Élément à vérifier | football-data.org | Sportmonks | Méthode de contrôle |
|:---|:---|:---:|:---:|:---|
| **Couverture** | Compétition disponible dans l'API | À tester | À tester | Vérification documentaire et requête test sur l'endpoint de listing des compétitions |
| **Match** | Identifiant stable entre plusieurs appels | À tester | À tester | Répéter la même requête et vérifier la cohérence de l'identifiant retourné |
| **Match** | Date et heure correctes | À tester | À tester | Comparaison avec une source publique de référence (ex. : site officiel de la ligue) |
| **Match** | Statut (programmé, joué, annulé) | À tester | À tester | Contrôle avant et après la rencontre sur les données historiques |
| **Score** | Score final correct | À tester | À tester | Comparaison manuelle avec source publique officielle |
| **Équipes** | Noms d'équipes cohérents | À tester | À tester | Contrôle de cohérence interne entre appels |
| **Équipes** | Identifiants stables | À tester | À tester | Comparer l'identifiant de la même équipe sur différents endpoints |
| **Classement** | Classement disponible et cohérent | À tester | À tester | Vérification fonctionnelle de l'endpoint de classement |
| **Historique** | Résultats passés accessibles sur la période | À tester | À tester | Requête ciblée sur la période de l'échantillon |
| **Statistiques** | Données analytiques disponibles et utiles | À tester | À tester | Inventaire des champs retournés sur un match de l'échantillon |
| **Traçabilité** | Source des données identifiable | À confirmer | À confirmer | Lecture de la documentation du fournisseur |
| **Qualité** | Taux de valeurs manquantes (champs nulls ou vides) | À mesurer | À mesurer | Comptage sur l'échantillon de matchs |
| **Continuité** | Réponses stables sur appels répétés | À mesurer | À mesurer | Répétition de 3 appels identiques sur un sous-échantillon de 5 rencontres communes (voir section 3) |
| **Documentation** | Clarté et facilité d'interprétation | À noter | À noter | Revue documentaire par le testeur |
| **Coût** | Coût identifiable pour le périmètre testé | À confirmer | À confirmer | Offre officielle ou réponse email |
| **Droits** | Usage commercial | Écrit requis | Écrit requis | Réponse écrite du fournisseur (voir section 7) |
| **Droits** | Stockage | Écrit requis | Écrit requis | Réponse écrite du fournisseur |
| **Droits** | Données dérivées (probabilités, explications) | Écrit requis | Écrit requis | Réponse écrite du fournisseur |

---

## 5. Critères de réussite

Pour chaque critère, utiliser l'une des valeurs suivantes :

- `Réussi` — le critère est satisfait sans réserve
- `Partiellement réussi` — le critère est satisfait avec des lacunes mineures
- `Échoué` — le critère n'est pas satisfait
- `Non vérifié` — le critère n'a pas pu être testé dans le cadre de cette évaluation

### Critères qualitatifs

| Critère | Description |
|:---|:---|
| **Présence des matchs attendus** | Tous les matchs de l'échantillon doivent être présents dans la réponse de l'API |
| **Cohérence des scores** | Les scores retournés doivent correspondre aux résultats officiels pour les rencontres terminées |
| **Cohérence des dates et statuts** | Les dates et heures doivent être correctes ; les statuts doivent refléter l'état réel de la rencontre |
| **Stabilité des identifiants** | Le même match ou la même équipe doit toujours retourner le même identifiant sur plusieurs appels |
| **Données analytiques suffisantes pour le MVP** | Au moins les statistiques essentielles aux parcours MVP doivent être disponibles (forme, tendances, classement) |
| **Clarté de la documentation** | La documentation doit permettre à un développeur de comprendre les endpoints sans support externe |
| **Coût identifiable** | Le tarif du plan adapté au périmètre testé doit être communicable sans négociation opaque |
| **Réponse juridique exploitable** | Le fournisseur doit fournir une réponse écrite claire sur les droits commerciaux, le stockage et les dérivés |

### Critères mesurables

| Critère | Méthode de mesure | Seuil de succès proposé | Périmètre | Statut du seuil |
|:---|:---|:---|:---|:---|
| Couverture des matchs | (matchs présents) / (matchs attendus) × 100 | 100 % des 18 rencontres sélectionnées | 18 rencontres de l'échantillon | **Proposition à valider** |
| Taux de champs manquants | (champs vides ou nuls) / (champs attendus) × 100 | Objectif exploratoire < 10 % | 18 rencontres de l'échantillon | **Proposition à valider** |
| Stabilité des identifiants | Cohérence entre 3 appels répétés | Identifiants identiques sur les 3 appels | Sous-échantillon de 5 rencontres communes | **Proposition à valider** |

> ⚠️ Tous les seuils ci-dessus sont des propositions. Ils servent uniquement à comparer les fournisseurs sur le même échantillon. Ils ne remplacent pas les exigences produit ou les critères d'acceptation officiels. Le Fondateur doit les valider ou les ajuster avant l'exécution du test.

---

## 6. Tableau de résultats (modèle à compléter)

| Critère | football-data.org | Sportmonks | Commentaire |
|:---|:---:|:---:|:---|
| Couverture des 3 compétitions candidates | Non testé | Non testé | |
| Calendriers et matchs | Non testé | Non testé | |
| Scores et statuts | Non testé | Non testé | |
| Historique | Non testé | Non testé | |
| Données analytiques | Non testé | Non testé | |
| Complétude (taux de champs manquants) | Non testé | Non testé | |
| Stabilité des identifiants | Non testé | Non testé | |
| Documentation | Non testé | Non testé | |
| Coût réel du périmètre | Non vérifié | Non vérifié | |
| Usage commercial | Non vérifié | Non vérifié | |
| Stockage | Non vérifié | Non vérifié | |
| Données dérivées (probabilités, explications) | Non vérifié | Non vérifié | |

### Synthèse comparative (modèle à compléter)

| Dimension | Avantage | Commentaire |
|:---|:---:|:---|
| Économique (coût) | Non déterminé | |
| Couverture | Non déterminé | |
| Qualité des données | Non déterminé | |
| Données analytiques | Non déterminé | |
| Droits commerciaux | Non déterminé | |
| Documentation | Non déterminé | |
| **Recommandation finale** | Non déterminée | À compléter après test |

---

## 7. Brouillons de courriel

> Ces brouillons sont préparés à des fins de validation. Ils ne doivent pas être envoyés sans autorisation explicite du Fondateur. Aucune donnée personnelle, clé API ou information sensible n'est incluse.

---

### Brouillon A — football-data.org

**Destinataire :** daniel@football-data.org
**Objet :** Demande de clarification — droits d'usage commercial pour une application de prédictions footballistiques

---

Bonjour,

Je développe une application appelée Athena, destinée à proposer des prédictions et des explications de résultats de football à des utilisateurs finaux. L'application a vocation à être commerciale.

Je consulte actuellement votre API comme candidate pour alimenter les données de cette application et souhaiterais obtenir des clarifications sur les points suivants avant d'envisager une souscription :

1. **Usage commercial :** L'utilisation des données issues de votre API dans une application commerciale accessible au grand public est-elle autorisée par vos conditions d'utilisation ? Si oui, à partir de quel plan ?

2. **Affichage public :** L'affichage de scores, classements, statistiques et calendriers dans une interface utilisateur publique est-il autorisé ?

3. **Données dérivées :** Les données peuvent-elles être utilisées pour calculer des probabilités de résultats, des scores de forme ou des explications dérivées, sans que cela constitue une redistribution directe des données brutes ?

4. **Stockage :** Votre politique autorise-t-elle le stockage temporaire des données dans nos propres bases de données (cache applicatif, historique enrichi) ? Y a-t-il une durée maximale de conservation ?

5. **Redistribution :** L'affichage des données dans Athena est-il considéré comme une redistribution au sens de vos CGU ? Le cas échéant, quelles restrictions s'appliquent ?

6. **Compétitions :** Les compétitions suivantes sont-elles garanties dans le plan envisagé, et pour combien de saisons d'historique : Ligue 1, Premier League, UEFA Champions League ?

7. **Attribution :** Une attribution visible (mention de votre service) est-elle requise dans l'application ? Sous quelle forme exactement ?

8. **Coût :** Quel plan recommanderiez-vous pour couvrir ces trois compétitions avec données live, historique et statistiques de forme ? Quel en serait le tarif ?

9. **Stabilité tarifaire :** Avec quel préavis les tarifs ou les quotas peuvent-ils changer pour les abonnés existants ?

Je reste disponible pour toute question complémentaire.

Cordialement,
[Fondateur ABYSS]

---

### Brouillon B — Sportmonks

**Destinataire :** support@sportmonks.com
**Objet :** Évaluation commerciale — droits d'usage et modules pour une application de prédictions footballistiques

---

Bonjour,

Je développe une application appelée Athena, destinée à proposer des prédictions et des explications de résultats de football à des utilisateurs finaux. L'application a vocation à être commerciale.

Je souhaite évaluer votre API Football comme source de données candidate. Pourriez-vous me préciser les points suivants :

1. **Usage commercial :** L'utilisation des données dans une application commerciale accessible au grand public est-elle autorisée dans vos plans standards ? Quelles conditions particulières s'appliquent ?

2. **Affichage public :** L'affichage de scores, classements, statistiques et calendriers dans une interface utilisateur publique est-il autorisé ?

3. **Données dérivées :** Les données peuvent-elles servir à calculer des probabilités de résultats, des scores de forme ou des explications de prédiction dérivées, sans constituer une redistribution directe des données brutes ?

4. **Stockage :** Votre politique autorise-t-elle le stockage temporaire des données dans nos propres bases de données (cache applicatif, historique enrichi) ? Y a-t-il une durée maximale de conservation ou des restrictions de localisation ?

5. **Redistribution :** L'affichage des données dans Athena est-il considéré comme une redistribution au sens de vos CGU ?

6. **Compétitions :** Les compétitions suivantes sont-elles couvertes et dans quelles conditions : Ligue 1, Premier League, UEFA Champions League ? Y a-t-il des restrictions de droits spécifiques à ces compétitions ?

7. **Modules nécessaires :** Quels modules complémentaires sont nécessaires pour accéder aux données avancées (forme, xG ou équivalent, statistiques d'équipe détaillées) pour ces trois compétitions ?

8. **Coût total :** Quel serait le coût mensuel d'un plan couvrant ces trois compétitions avec les modules nécessaires ?

9. **Essai :** Votre essai de 14 jours permet-il de tester l'ensemble des endpoints pertinents (fixtures, classements, statistiques, historique) sur ces compétitions ?

10. **Restrictions après fin d'abonnement :** En cas de résiliation, y a-t-il des restrictions sur les données déjà collectées pendant la période d'abonnement ?

11. **Stabilité :** Avec quel préavis les tarifs, les quotas ou la couverture des compétitions peuvent-ils changer ? Disposez-vous d'un SLA formalisé ?

Je reste disponible pour toute question complémentaire.

Cordialement,
[Fondateur ABYSS]

---

## 8. Ordre recommandé d'exécution

| Étape | Action | Responsable | Prérequis |
|:---:|:---|:---|:---|
| 1 | **Test documentaire** — Vérifier la documentation officielle des endpoints des deux fournisseurs et l'accès sans compte | Fondateur ou délégué | Aucun |
| 2 | **Test gratuit ou essai** — Utiliser le tier gratuit football-data.org (sans souscription payante) et, si autorisé, l'essai Sportmonks | Fondateur | Validation préalable du Fondateur pour l'essai Sportmonks |
| 3 | **Comparaison sur l'échantillon commun** — Exécuter les requêtes définies en section 3 et remplir la matrice de la section 4 | Fondateur ou délégué | Étape 2 complète |
| 4 | **Demande écrite sur les droits** — Envoyer les brouillons de la section 7 et attendre les réponses | Fondateur | Aucun (peut être parallèle) |
| 5 | **Comparaison coût/qualité** — Consolider les résultats techniques et les réponses juridiques | Fondateur ou délégué | Étapes 3 et 4 |
| 6 | **Recommandation finale** — Sur la base des résultats du tableau section 6, identifier le fournisseur candidat | Fondateur | Étape 5 |
| 7 | **Mise à jour documentaire** — Actualiser DEC-001, OQ-003 et OQ-006 avec la décision factuelle | Antigravity (sur ordre) | Étape 6 validée par le Fondateur |

> **Règle :** Aucun fournisseur ne doit être sélectionné avant l'étape 6. Aucune mise à jour de DEC-001 ou des questions ouvertes ne doit intervenir avant que le Fondateur ait validé la conclusion de l'étape 5.

---

## 9. Hypothèses chiffrées proposées

| Hypothèse | Valeur proposée | Justification | Statut |
|:---|:---|:---|:---|
| Saison de référence | 2023-2024 — sous condition d'accessibilité commune aux deux fournisseurs ; à défaut, la saison commune la plus récente disponible | Dernière saison complète au moment probable du test | **À valider** |
| Période Ligue 1 | 6 rencontres sur au moins 2 journées distinctes (valeurs illustratives uniquement : ex. J10 et J30) | Permet la vérification de la cohérence temporelle sans saturer les quotas gratuits | **À valider** |
| Période Premier League | 6 rencontres sur au moins 2 journées distinctes (valeurs illustratives uniquement : ex. GW10 et GW30) | Même logique | **À valider** |
| Période Champions League | 6 rencontres sur au moins 2 journées distinctes (valeurs illustratives uniquement : ex. journées 3 et 6 de phase de groupes) | Permet d'évaluer le format coupe sur un petit échantillon | **À valider** |
| Nombre total de rencontres | 18 (6 par compétition) | Volume suffisant pour une comparaison exploratoire reproductible | **À valider** |
| Sous-échantillon pour appels répétés | 5 rencontres communes aux deux fournisseurs | Minimum suffisant pour détecter une instabilité sans surcharger les quotas | **À valider** |
| Nombre de répétitions pour stabilité | 3 appels identiques par rencontre du sous-échantillon | Minimum pour détecter une instabilité | **À valider** |
| Seuil de champs manquants | < 10 % (objectif exploratoire) | Niveau pragmatique pour une première comparaison — ne constitue pas un critère d'acceptation officiel | **À valider** |

> ⚠️ L'ensemble de ces valeurs sont des propositions indicatives. Elles doivent être validées ou ajustées par le Fondateur avant toute exécution du test.

---

## 10. Fichiers créés ou modifiés

| Fichier | Action |
|:---|:---|
| `docs/02-product-management/data-provider-comparison-protocol.md` | Créé (nouveau — non committé) |

Aucun fichier officiel de la Phase 1 n'a été modifié (data-source-feasibility-study.md, phase-1-arbitration-pack.md, phase-1-validation-report.md, decision-log.md, open-questions.md, next-actions.md, PRD, MVP Scope, Features, Acceptance Criteria).

---

## 11. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Antigravity | Version initiale — protocole comparatif, échantillon proposé, matrice de données, critères de réussite, tableau de résultats, brouillons de courriel, ordre d'exécution. |
| 1.1 | 2026-07-17 | Antigravity | Correction de cohérence — remplacement des deux journées complètes par un sous-échantillon de 6 rencontres × 3 compétitions (18 total), justification corrigée, appels répétés limités à 5 rencontres, saison de référence rendue conditionnelle, seuils recadrés. |

---

> **Made in Abyss : Spark by the King**

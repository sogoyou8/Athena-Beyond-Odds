# 04 - Success Metrics

```markdown
# Success Metrics

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Objet

Ce document définit les indicateurs permettant de mesurer :

- l’utilité réelle du produit ;
- la confiance ;
- la qualité des données ;
- la performance des modèles ;
- la santé commerciale ;
- la fiabilité technique.

Une métrique ne doit jamais être utilisée isolément.

---

## 2. North Star Metric

### Analyses utiles par utilisateur actif

Une analyse utile correspond à une consultation durant laquelle l’utilisateur :

- atteint une vue d’analyse ;
- consulte au moins un facteur explicatif ;
- reste suffisamment longtemps pour lire ;
- réalise une action cohérente ;
- ne signale pas d’erreur critique.

Actions cohérentes possibles :

- ajouter aux favoris ;
- ouvrir une statistique ;
- consulter une explication ;
- comparer ;
- créer une alerte ;
- revenir après le match.

---

## 3. Acquisition

- visiteurs uniques ;
- sources d’acquisition ;
- taux de création de compte ;
- coût d’acquisition ;
- taux d’activation par canal ;
- trafic organique ;
- trafic de recommandation.

---

## 4. Activation

Un utilisateur est activé lorsqu’il réalise dans les sept jours :

1. création de compte ;
2. sélection d’au moins une équipe ou compétition ;
3. consultation d’un Match Center ;
4. consultation d’une explication ;
5. retour lors d’une autre session.

Métriques :

- taux d’activation ;
- délai moyen d’activation ;
- abandon par étape ;
- activation par persona.

---

## 5. Engagement

- DAU ;
- WAU ;
- MAU ;
- ratio DAU/MAU ;
- sessions par utilisateur ;
- durée médiane de session ;
- matchs consultés ;
- explications ouvertes ;
- comparaisons réalisées ;
- alertes créées ;
- favoris actifs.

---

## 6. Rétention

- J1 ;
- J7 ;
- J30 ;
- M3 ;
- cohortes ;
- rétention par fonctionnalité ;
- rétention par compétition ;
- rétention par persona.

---

## 7. Compréhension

Indicateurs directs :

- note « analyse comprise » ;
- note « explication utile » ;
- taux d’ouverture des détails ;
- taux de consultation des limites ;
- mini-questionnaires ;
- entretiens utilisateurs.

Objectif MVP :

- au moins 70 % des répondants déclarent mieux comprendre le match.

---

## 8. Confiance

- note de confiance ;
- taux de consultation des sources ;
- taux d’erreurs signalées ;
- taux de corrections ;
- fréquence de contestation ;
- délai de correction ;
- stabilité des résultats.

---

## 9. Qualité des données

- fraîcheur médiane ;
- taux de couverture ;
- taux de champs manquants ;
- taux de doublons ;
- taux d’anomalies ;
- délai d’ingestion ;
- taux d’échec fournisseur ;
- taux de divergence entre sources.

---

## 10. Performance des modèles

Métriques obligatoires :

- Brier Score ;
- Log Loss ;
- calibration ;
- expected calibration error ;
- précision par classe ;
- intervalle de confiance ;
- stabilité ;
- drift ;
- comparaison au baseline ;
- comparaison aux probabilités implicites ;
- Closing Line Value lorsque applicable.

Les performances doivent être segmentées par :

- compétition ;
- saison ;
- marché ;
- période ;
- disponibilité des données ;
- version du modèle.

---

## 11. Qualité de l’IA

- factualité ;
- taux d’hallucination ;
- taux de citation correcte ;
- refus appropriés ;
- satisfaction ;
- latence ;
- coût par réponse ;
- cohérence avec les données structurées ;
- taux d’escalade vers une réponse prudente.

---

## 12. Performance technique

- disponibilité ;
- taux d’erreur ;
- p50, p95 et p99 ;
- Largest Contentful Paint ;
- Interaction to Next Paint ;
- temps d’affichage Match Center ;
- délai live ;
- délai des notifications ;
- jobs en échec ;
- saturation des files ;
- consommation cache.

---

## 13. Sécurité

- incidents ;
- tentatives bloquées ;
- comptes compromis ;
- vulnérabilités ouvertes ;
- temps de correction ;
- taux d’activation 2FA admin ;
- couverture des audits ;
- accès sensibles non justifiés.

---

## 14. Commercial

- conversion Free vers Premium ;
- MRR ;
- ARR ;
- ARPU ;
- churn ;
- LTV ;
- CAC ;
- remboursements ;
- échecs de paiement ;
- réactivation ;
- revenu par persona.

---

## 15. Garde-fous

Toute amélioration commerciale doit vérifier :

- absence de hausse des erreurs ;
- absence de baisse de confiance ;
- absence d’augmentation des notifications indésirables ;
- absence de dégradation de la performance ;
- absence de manipulation.

---

## 16. Cadence de revue

- quotidien : incidents et qualité des données ;
- hebdomadaire : produit et modèles ;
- mensuel : rétention et commercial ;
- trimestriel : stratégie ;
- annuel : vision et portefeuille.

---

## 17. Signature

> **Made in Abyss : Spark by the King**

```

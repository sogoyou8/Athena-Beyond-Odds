# 05 - Domain Map

```markdown
# Domain Map

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Objet

Cette cartographie présente les domaines fonctionnels d’Athena.

Un domaine représente une responsabilité métier stable.

---

## 2. Carte générale

```text
Athena
├── Public & Acquisition
├── Identity & Access
├── User Workspace
├── Sports Catalogue
├── Match Intelligence
├── Team Intelligence
├── Player Intelligence
├── Competition Intelligence
├── Live Intelligence
├── Statistical Intelligence
├── Prediction & Simulation
├── Market Intelligence
├── Explainable AI
├── Search & Discovery
├── Recommendation
├── Notifications
├── Reporting & Export
├── Subscription & Billing
├── Administration
└── Platform Operations
```

---

## 3. Public & Acquisition

Responsabilités :

- présentation ;
- acquisition ;
- contenu public ;
- pricing ;
- conformité publique ;
- conversion.

---

## 4. Identity & Access

Responsabilités :

- compte ;
- session ;
- authentification ;
- autorisation ;
- vérification ;
- récupération ;
- sécurité du compte.

---

## 5. User Workspace

Responsabilités :

- dashboard ;
- préférences ;
- favoris ;
- historique ;
- listes ;
- espace personnel.

---

## 6. Sports Catalogue

Responsabilités :

- sports ;
- pays ;
- compétitions ;
- saisons ;
- équipes ;
- joueurs ;
- entraîneurs ;
- arbitres ;
- stades.

---

## 7. Match Intelligence

Responsabilités :

- fiche match ;
- contexte ;
- participants ;
- statistiques ;
- événements ;
- composition ;
- absences ;
- synthèse.

---

## 8. Team Intelligence

Responsabilités :

- profil équipe ;
- effectif ;
- forme ;
- calendrier ;
- statistiques ;
- style ;
- historique.

---

## 9. Player Intelligence

Responsabilités :

- profil ;
- carrière ;
- performances ;
- disponibilité ;
- comparaison ;
- évolution.

---

## 10. Competition Intelligence

Responsabilités :

- classement ;
- calendrier ;
- journées ;
- statistiques ;
- équipes ;
- leaders ;
- historique.

---

## 11. Live Intelligence

Responsabilités :

- score ;
- événements ;
- métriques live ;
- rafraîchissement ;
- alertes ;
- état du match.

---

## 12. Statistical Intelligence

Responsabilités :

- agrégations ;
- tendances ;
- comparaisons ;
- normalisation ;
- métriques avancées ;
- visualisations.

---

## 13. Prediction & Simulation

Responsabilités :

- probabilités ;
- modèles ;
- consensus ;
- simulations ;
- calibration ;
- versionnement ;
- backtesting.

---

## 14. Market Intelligence

Responsabilités :

- cotes ;
- bookmakers ;
- probabilités implicites ;
- marge ;
- mouvements ;
- comparaison avec les modèles.

---

## 15. Explainable AI

Responsabilités :

- résumé ;
- explication ;
- question-réponse ;
- adaptation du niveau ;
- citations ;
- gestion de l’incertitude.

---

## 16. Search & Discovery

Responsabilités :

- recherche ;
- autocomplete ;
- indexation ;
- filtres ;
- classement ;
- découverte.

---

## 17. Recommendation

Responsabilités :

- contenus suggérés ;
- matchs pertinents ;
- tendances ;
- personnalisation ;
- garde-fous.

---

## 18. Notifications

Responsabilités :

- règles ;
- préférences ;
- déclencheurs ;
- canaux ;
- livraison ;
- historique.

---

## 19. Reporting & Export

Responsabilités :

- rapports ;
- exports ;
- partage ;
- archivage ;
- génération différée.

---

## 20. Subscription & Billing

Responsabilités :

- offres ;
- droits ;
- factures ;
- paiement ;
- cycle de vie ;
- limites.

---

## 21. Administration

Responsabilités :

- gestion interne ;
- modération ;
- corrections ;
- modèles ;
- utilisateurs ;
- audits.

---

## 22. Platform Operations

Responsabilités :

- santé ;
- observabilité ;
- incidents ;
- files ;
- fournisseurs ;
- feature flags ;
- configuration.

---

## 23. Dépendances principales

```text
Sports Catalogue
    ↓
Match / Team / Player / Competition
    ↓
Statistics
    ↓
Prediction & Simulation
    ↓
Explainable AI
    ↓
User Workspace
```

---

## 24. Règles

- un domaine possède sa logique ;
- les règles métier ne sont pas dans l’interface ;
- chaque dépendance est explicite ;
- les objets partagés sont versionnés ;
- les événements importants sont traçables.

---

## 25. Signature

> **Made in Abyss : Spark by the King**

```

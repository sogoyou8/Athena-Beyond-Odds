# 08 - User Roles

```markdown
# User Roles

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Rôles

- Visitor ;
- Free User ;
- Premium User ;
- Professional Analyst ;
- Support Agent ;
- Data Operator ;
- Administrator ;
- Super Administrator ;
- Service Account.

---

## 2. Visitor

Peut :

- consulter les pages publiques ;
- voir un aperçu limité ;
- consulter les tarifs ;
- créer un compte.

Ne peut pas :

- enregistrer ;
- personnaliser ;
- créer des alertes ;
- accéder aux analyses avancées.

---

## 3. Free User

Peut :

- accéder au Dashboard ;
- sélectionner des favoris ;
- consulter un nombre limité d’analyses ;
- recevoir des notifications de base ;
- utiliser la recherche ;
- consulter les données essentielles.

Limites :

- quotas ;
- historique réduit ;
- simulations limitées ;
- exports indisponibles ;
- analyses avancées verrouillées.

---

## 4. Premium User

Peut :

- consulter les analyses complètes ;
- utiliser les simulations ;
- créer des alertes avancées ;
- accéder à un historique étendu ;
- utiliser les comparaisons ;
- générer des rapports ;
- bénéficier de quotas supérieurs.

---

## 5. Professional Analyst

Peut en plus :

- exporter ;
- créer des espaces de travail ;
- utiliser des filtres avancés ;
- accéder à des métriques professionnelles ;
- gérer plusieurs rapports ;
- utiliser une API selon contrat.

---

## 6. Support Agent

Peut :

- consulter les dossiers support ;
- voir des métadonnées limitées ;
- déclencher certaines procédures ;
- documenter un incident.

Ne peut pas :

- modifier les modèles ;
- voir les secrets ;
- modifier les paiements directement ;
- agir sans trace d’audit.

---

## 7. Data Operator

Peut :

- examiner les anomalies ;
- corriger des correspondances ;
- relancer une ingestion ;
- valider une source ;
- gérer la qualité.

---

## 8. Administrator

Peut :

- gérer les utilisateurs ;
- gérer les contenus ;
- gérer les feature flags ;
- consulter les audits ;
- gérer les modèles validés ;
- superviser les intégrations.

---

## 9. Super Administrator

Accès exceptionnel.

Exigences :

- 2FA ;
- session courte ;
- justification ;
- journalisation renforcée ;
- revue régulière ;
- principe du moindre privilège.

---

## 10. Service Account

Utilisé pour :

- ingestion ;
- workers ;
- déploiement ;
- intégrations.

Chaque compte possède :

- une finalité ;
- un secret rotatif ;
- des permissions minimales ;
- un propriétaire ;
- une date d’expiration.

---

## 11. Matrice simplifiée

| Capacité | Visitor | Free | Premium | Pro | Admin |
|---|---:|---:|---:|---:|---:|
| Données publiques | Oui | Oui | Oui | Oui | Oui |
| Favoris | Non | Oui | Oui | Oui | Oui |
| Analyse complète | Non | Limitée | Oui | Oui | Oui |
| Simulation | Non | Limitée | Oui | Oui | Oui |
| Export | Non | Non | Limité | Oui | Oui |
| Administration | Non | Non | Non | Non | Oui |

---

## 12. Règles

- refus par défaut ;
- moindre privilège ;
- vérification côté serveur ;
- permissions versionnées ;
- audit des actions sensibles ;
- séparation des rôles ;
- révocation immédiate.

---

## 13. Signature

> **Made in Abyss : Spark by the King**

```

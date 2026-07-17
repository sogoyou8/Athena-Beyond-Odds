# 14 - Business Rules

```markdown
# Business Rules

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Match Status

États autorisés :

- scheduled ;
- delayed ;
- postponed ;
- cancelled ;
- live ;
- halftime ;
- extra-time ;
- penalties ;
- suspended ;
- abandoned ;
- finished.

Transitions interdites :

- finished vers live ;
- cancelled vers finished sans correction auditée ;
- scheduled vers halftime.

---

## 2. Données manquantes

Une donnée manquante reste `null` ou `unknown`.

Elle ne doit jamais être remplacée par zéro sans règle explicite.

---

## 3. Probabilités

- somme normalisée ;
- version du modèle conservée ;
- horodatage ;
- données d’entrée identifiables ;
- aucune modification rétroactive silencieuse ;
- historique immuable.

---

## 4. Confiance

Le score de confiance doit intégrer :

- couverture ;
- fraîcheur ;
- stabilité ;
- accord ;
- calibration ;
- qualité du contexte.

Il ne doit pas être une simple opinion du LLM.

---

## 5. Favoris

Un utilisateur peut enregistrer :

- équipe ;
- joueur ;
- compétition ;
- match.

La suppression d’un favori ne supprime pas l’historique d’activité obligatoire.

---

## 6. Notifications

- consentement ;
- fréquence ;
- quiet hours ;
- déduplication ;
- préférence par canal ;
- désactivation simple ;
- journal de livraison.

---

## 7. Abonnement

- droits côté serveur ;
- grace period ;
- accès jusqu’à échéance ;
- pas de perte immédiate des données personnelles ;
- quotas clairement affichés ;
- changement auditée.

---

## 8. Fuseaux horaires

Stockage en UTC.

Affichage selon la préférence utilisateur.

Les dates de compétition conservent leur contexte local.

---

## 9. Corrections

Toute correction importante conserve :

- ancienne valeur ;
- nouvelle valeur ;
- raison ;
- source ;
- auteur ;
- date.

---

## 10. Signature

> **Made in Abyss : Spark by the King**

```

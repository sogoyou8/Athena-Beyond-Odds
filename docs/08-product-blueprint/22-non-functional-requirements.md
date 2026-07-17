# 22 - Non Functional Requirements

```markdown
# Non Functional Requirements

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Disponibilité

Objectif MVP :

- 99,5 % mensuel hors maintenance annoncée.

Objectif V1 :

- 99,9 %.

---

## 2. Performance

- API courante p95 < 500 ms ;
- recherche p95 < 500 ms ;
- Match Center utile < 2,5 s ;
- interaction principale < 200 ms lorsque locale ;
- live avec retard documenté.

---

## 3. Scalabilité

Supporter :

- croissance horizontale ;
- files ;
- cache ;
- partitionnement ;
- lecture intensive ;
- pics lors de grands matchs.

---

## 4. Fiabilité

- idempotence ;
- retries ;
- sauvegardes ;
- restauration testée ;
- transactions ;
- cohérence documentée.

---

## 5. Maintenabilité

- TypeScript strict ;
- tests ;
- documentation ;
- modularité ;
- observabilité ;
- conventions ;
- dette suivie.

---

## 6. Portabilité

- formats ouverts ;
- export ;
- abstraction fournisseurs ;
- infrastructure reproductible ;
- conteneurs.

---

## 7. Conformité

- confidentialité ;
- consentement ;
- rétention ;
- suppression ;
- audit ;
- réglementation applicable.

---

## 8. Signature

> **Made in Abyss : Spark by the King**

```

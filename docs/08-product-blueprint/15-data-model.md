# 15 - Data Model

```markdown
# Data Model

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Objets cœur

- Sport ;
- Country ;
- Competition ;
- Season ;
- Round ;
- Team ;
- Player ;
- Coach ;
- Referee ;
- Venue ;
- Match.

---

## 2. Match

Attributs fonctionnels :

- id ;
- provider ids ;
- competition ;
- season ;
- round ;
- home team ;
- away team ;
- scheduled at ;
- status ;
- score ;
- venue ;
- referee ;
- data quality ;
- timestamps.

Relations :

- lineups ;
- events ;
- statistics ;
- predictions ;
- simulations ;
- odds ;
- explanations ;
- sources.

---

## 3. Team

- identity ;
- aliases ;
- country ;
- competition memberships ;
- squad ;
- coaches ;
- venue ;
- statistics ;
- matches ;
- injuries.

---

## 4. Player

- identity ;
- aliases ;
- nationality ;
- birth date ;
- position ;
- memberships ;
- appearances ;
- statistics ;
- injuries ;
- suspensions.

---

## 5. Prediction

- target ;
- market ;
- probabilities ;
- fair odds ;
- confidence ;
- model version ;
- dataset version ;
- feature version ;
- generated at ;
- valid until ;
- calibration metadata.

---

## 6. Explanation

- subject ;
- language ;
- facts ;
- positive factors ;
- negative factors ;
- uncertainties ;
- citations ;
- generator version ;
- generated at.

---

## 7. User

- identity ;
- authentication ;
- roles ;
- preferences ;
- favorites ;
- alerts ;
- subscription ;
- activity ;
- consent.

---

## 8. Source

- provider ;
- license ;
- endpoint ;
- fetched at ;
- freshness ;
- reliability ;
- raw reference ;
- transformation version.

---

## 9. Principes

- UUID ;
- historiques immuables ;
- soft delete lorsque pertinent ;
- provenance ;
- contraintes ;
- indexes ;
- partitionnement futur ;
- données sensibles séparées.

---

## 10. Signature

> **Made in Abyss : Spark by the King**

```

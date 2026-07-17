# 26 - Analytics & Telemetry

```markdown
# Analytics & Telemetry

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Catégories

- produit ;
- performance ;
- erreurs ;
- sécurité ;
- modèles ;
- données ;
- business.

---

## 2. Événements produit

Convention :

```text
domain.object.action
```

Exemples :

- `match.center.viewed` ;
- `prediction.details.opened` ;
- `favorite.team.added` ;
- `notification.alert.created`.

---

## 3. Propriétés

- user role ;
- session ;
- entity id pseudonymisé ;
- source ;
- device ;
- locale ;
- experiment ;
- app version.

---

## 4. Confidentialité

- minimisation ;
- consentement ;
- pas de contenu sensible ;
- rétention ;
- anonymisation ;
- accès limité.

---

## 5. Observabilité

- logs structurés ;
- traces ;
- métriques ;
- corrélation ;
- alertes ;
- dashboards.

---

## 6. Modèles

Journaliser :

- version ;
- inputs hash ;
- output ;
- latency ;
- confidence ;
- evaluation ;
- drift.

---

## 7. Signature

> **Made in Abyss : Spark by the King**

```

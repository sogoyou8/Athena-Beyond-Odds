# 19 - Search Architecture

```markdown
# Search Architecture

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Types

- recherche globale ;
- recherche contextuelle ;
- autocomplete ;
- filtres ;
- commandes.

---

## 2. Entités indexées

- match ;
- équipe ;
- joueur ;
- compétition ;
- stade ;
- arbitre ;
- rapport ;
- contenu public.

---

## 3. Normalisation

- accents ;
- casse ;
- alias ;
- translittération ;
- fautes ;
- anciens noms ;
- abréviations.

---

## 4. Ranking

Facteurs :

- exactitude ;
- popularité ;
- récence ;
- contexte ;
- préférences ;
- compétition ;
- activité.

La personnalisation ne doit pas supprimer les résultats objectifs.

---

## 5. Filtres

- sport ;
- pays ;
- compétition ;
- saison ;
- date ;
- statut ;
- équipe ;
- joueur.

---

## 6. Sécurité

Les résultats doivent respecter les permissions avant affichage.

---

## 7. Performance

- autocomplete inférieur à 200 ms p95 ;
- résultats principaux inférieurs à 500 ms p95 ;
- cache des requêtes fréquentes ;
- index mis à jour rapidement.

---

## 8. Signature

> **Made in Abyss : Spark by the King**

```

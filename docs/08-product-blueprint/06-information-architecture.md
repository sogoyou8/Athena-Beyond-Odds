# 06 - Information Architecture

```markdown
# Information Architecture

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Objectif

Organiser les informations afin que l’utilisateur puisse :

- trouver ;
- comprendre ;
- comparer ;
- approfondir ;
- revenir ;
- agir.

---

## 2. Objets principaux

```text
Sport
└── Country
    └── Competition
        └── Season
            ├── Round
            ├── Standing
            ├── Team
            └── Match
                ├── Lineup
                ├── Event
                ├── Statistic
                ├── Prediction
                ├── Simulation
                ├── Market
                └── Explanation
```

---

## 3. Objets transversaux

- User ;
- Favorite ;
- Alert ;
- Report ;
- Subscription ;
- Source ;
- Model Version ;
- Data Quality ;
- Audit Event.

---

## 4. Hiérarchie publique

```text
Accueil
├── Fonctionnalités
├── Tarifs
├── Ressources
├── FAQ
├── Connexion
└── Inscription
```

---

## 5. Hiérarchie applicative

```text
Dashboard
├── Live
├── Matchs
├── Compétitions
├── Équipes
├── Joueurs
├── Prédictions
├── Comparaisons
├── Favoris
├── Alertes
├── Rapports
└── Paramètres
```

---

## 6. Page Match

Ordre recommandé :

1. identité et état ;
2. score ou heure ;
3. résumé Athena ;
4. probabilités ;
5. facteurs clés ;
6. compositions et absences ;
7. forme ;
8. statistiques ;
9. historique ;
10. marché ;
11. méthodologie ;
12. sources.

---

## 7. Page Équipe

1. identité ;
2. prochaine rencontre ;
3. forme ;
4. classement ;
5. effectif ;
6. calendrier ;
7. statistiques ;
8. absences ;
9. tendances ;
10. historique.

---

## 8. Page Joueur

1. identité ;
2. statut ;
3. club ;
4. statistiques actuelles ;
5. évolution ;
6. historique ;
7. blessures ;
8. comparaison.

---

## 9. Page Compétition

1. identité ;
2. saison ;
3. classement ;
4. matchs ;
5. équipes ;
6. joueurs ;
7. tendances ;
8. historique.

---

## 10. Métadonnées obligatoires

Chaque information analytique doit pouvoir afficher :

- source ;
- date de mise à jour ;
- période ;
- contexte ;
- unité ;
- définition ;
- qualité ;
- version.

---

## 11. États de contenu

- disponible ;
- partiel ;
- estimé ;
- indisponible ;
- en cours de mise à jour ;
- contesté ;
- corrigé.

---

## 12. Étiquettes de confiance

- élevée ;
- moyenne ;
- faible ;
- insuffisante.

La confiance ne doit pas être calculée par une formule opaque.

---

## 13. Progressive disclosure

Résumé par défaut.

Détails accessibles par :

- accordéon ;
- onglet ;
- panneau latéral ;
- infobulle ;
- modal méthodologique ;
- export.

---

## 14. Relations contextuelles

Depuis un match, l’utilisateur peut ouvrir :

- compétition ;
- équipe ;
- joueur ;
- arbitre ;
- stade ;
- modèle ;
- source ;
- rapport.

---

## 15. Recherche

Les résultats sont groupés :

1. matchs ;
2. équipes ;
3. joueurs ;
4. compétitions ;
5. contenus ;
6. rapports.

---

## 16. URL

Exemples :

```text
/matches/{matchId}
/teams/{teamId}
/players/{playerId}
/competitions/{competitionId}
/competitions/{competitionId}/seasons/{seasonId}
```

Les URLs doivent être stables et partageables.

---

## 17. Signature

> **Made in Abyss : Spark by the King**

```

# Rapport de découverte des accès fournisseurs

**Statut :** Découverte terminée — comparaison complète bloquée par les droits du plan Sportmonks

**Date :** 2026-07-18
**Auteur :** Antigravity
**Branche :** `docs/phase-1-product-definition`
**Commit de référence :** `e192f79`

---

## Contexte

Ce rapport documente les résultats de la commande `--discover-competitions` exécutée localement sur le harnais de comparaison des fournisseurs de données sportives. L'objectif était d'identifier les identifiants de compétitions et la saison commune la plus récente accessible chez les deux fournisseurs candidats.

Aucune clé d'API, valeur partielle ou corps de réponse brut ne figure dans ce rapport.

---

## Résultats football-data.org

Authentification réussie (HTTP 200). Les trois compétitions cibles ont été identifiées.

| Compétition | ID | Code | Saison retournée |
|:---|---:|:---:|:---:|
| Ligue 1 | 2015 | FL1 | 2025/26 |
| Premier League | 2021 | PL | 2025/26 |
| UEFA Champions League | 2001 | CL | 2024/25 |

> Les saisons retournées ne sont pas uniformes entre les compétitions (2025/26 pour la Ligue 1 et la Premier League, 2024/25 pour la Champions League). Ces données ne démontrent pas encore une saison commune homogène pour le protocole comparatif.

---

## Résultats Sportmonks

Authentification réussie (HTTP 200). Le plan d'essai actuel ne donne pas accès aux trois compétitions cibles.

**Compétitions football accessibles observées :**

| Compétition | ID |
|:---|---:|
| Superliga | 271 |
| Premiership | 501 |
| Premiership Play-Offs | 513 |
| Superliga Play-offs | 1659 |

> Les autres compétitions accessibles sur ce plan concernent notamment le cricket (Big Bash League, Twenty20 International, CSA T20 Challenge) et ne sont pas pertinentes pour le MVP football d'Athena.

---

## Compétitions cibles indisponibles sur le plan Sportmonks actuel

- Ligue 1
- Premier League
- UEFA Champions League

---

## Conséquences

- Les identifiants football-data.org sont identifiés (Ligue 1 : 2015, Premier League : 2021, Champions League : 2001).
- Les identifiants Sportmonks des compétitions cibles n'ont pas pu être démontrés avec l'accès actuel.
- Aucune saison commune n'a été démontrée entre les deux fournisseurs.
- La comparaison des 18 rencontres prévues par le protocole n'est pas exécutable avec les accès actuels.
- `scripts/compare-config.json` doit rester incomplet : les identifiants Sportmonks et la saison commune restent à confirmer.
- Aucun fournisseur n'est définitivement sélectionné.
- Aucune validation juridique ou commerciale n'a été effectuée.
- Aucun abonnement payant n'a été souscrit.
- Aucune recommandation d'achat immédiat n'est formulée dans ce rapport.

---

## Options à soumettre au Fondateur

1. **Demander à Sportmonks un accès d'évaluation temporaire** aux compétitions cibles (Ligue 1, Premier League, Champions League), en exposant le contexte de prototype.
2. **Demander une proposition commerciale écrite** à Sportmonks, sans souscription immédiate, pour évaluer le coût d'un plan incluant les trois compétitions cibles.
3. **Comparer un autre fournisseur de la shortlist** identifié dans l'étude de faisabilité, dont l'accès aux trois compétitions est documenté publiquement.
4. **Poursuivre provisoirement le prototype avec football-data.org uniquement**, sans présenter cela comme une comparaison complète entre fournisseurs, et reporter la comparaison à une phase ultérieure.

---

## Statut final

`Validation humaine requise`

---

> **Made in Abyss : Spark by the King**

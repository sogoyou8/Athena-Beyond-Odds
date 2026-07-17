# 02 - Product Principles

```markdown
# Product Principles

> **Version :** 1.0  
> **Statut :** Brouillon  
> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS

---

## 1. Objet

Ce document définit les principes permanents qui encadrent toutes les décisions produit d’Athena.

Une fonctionnalité peut évoluer.  
Une interface peut être remplacée.  
Une technologie peut changer.

Les principes ci-dessous doivent rester stables tant qu’une décision formelle ne les modifie pas.

---

## 2. Compréhension avant quantité

Athena ne cherche pas à afficher le plus grand nombre de statistiques.

Athena cherche à montrer les informations les plus utiles, au bon moment, avec le bon niveau de contexte.

Conséquences :

- priorité aux signaux réellement utiles ;
- réduction du bruit visuel ;
- hiérarchie claire ;
- approfondissement disponible à la demande ;
- aucune métrique sans définition accessible.

---

## 3. Explicabilité obligatoire

Toute conclusion importante doit pouvoir être expliquée.

Une probabilité, un score de confiance ou une recommandation doit préciser :

- les données utilisées ;
- les facteurs principaux ;
- les facteurs contradictoires ;
- le niveau d’incertitude ;
- la fraîcheur des données ;
- les limites connues ;
- la version du modèle lorsque cela est pertinent.

Une conclusion impossible à expliquer ne doit pas être présentée comme une vérité.

---

## 4. Probabilité, jamais certitude

Athena travaille avec un environnement incertain.

Le produit doit toujours distinguer :

- fait observé ;
- estimation ;
- projection ;
- hypothèse ;
- simulation ;
- opinion générée ;
- conclusion validée.

Les formulations suivantes sont interdites :

- « résultat garanti » ;
- « pari sûr » ;
- « certitude » ;
- « impossible de perdre » ;
- « victoire assurée ».

---

## 5. Données avant narration

L’intelligence artificielle ne doit jamais créer une histoire non soutenue par les données.

Ordre obligatoire :

```text
Données validées
    ↓
Calculs
    ↓
Résultats
    ↓
Explication
    ↓
Présentation
```

Le texte vient après le calcul, jamais à sa place.

---

## 6. Qualité avant vitesse de sortie

Athena préfère :

- une fonctionnalité fiable à cinq fonctionnalités instables ;
- une source vérifiée à trois sources contradictoires ;
- une estimation prudente à une conclusion spectaculaire ;
- un lancement limité à un lancement incontrôlé.

---

## 7. Simplicité progressive

Le produit doit rester accessible aux débutants sans frustrer les experts.

La complexité doit être révélée progressivement.

Niveaux recommandés :

1. résumé essentiel ;
2. facteurs principaux ;
3. statistiques détaillées ;
4. méthodologie ;
5. données brutes ou export.

---

## 8. Contexte permanent

Une donnée sportive n’a de valeur qu’avec son contexte.

Toute métrique importante doit pouvoir être reliée à :

- une période ;
- une compétition ;
- un adversaire ;
- un lieu ;
- un niveau d’opposition ;
- un état d’effectif ;
- une méthode de calcul ;
- une source.

---

## 9. Confiance par la transparence

Athena doit montrer :

- la date de dernière mise à jour ;
- la disponibilité des données ;
- les sources ;
- les divergences ;
- les éléments manquants ;
- les erreurs connues ;
- les corrections importantes.

Masquer l’incertitude réduit la confiance à long terme.

---

## 10. L’humain reste responsable

Athena augmente le jugement humain.

Athena ne remplace pas :

- l’analyse personnelle ;
- la responsabilité financière ;
- le jugement professionnel ;
- la vérification éditoriale ;
- les obligations légales.

---

## 11. Pas de dark patterns

Athena interdit :

- les comptes à rebours artificiels ;
- les fausses pénuries ;
- les notifications manipulatrices ;
- les parcours de désabonnement volontairement complexes ;
- les paramètres activés sans consentement ;
- la pression émotionnelle ;
- les couleurs de casino utilisées pour pousser à l’action.

---

## 12. Mobile utile, pas mobile réduit

L’expérience mobile ne doit pas être une copie compressée de l’expérience desktop.

Elle doit privilégier :

- l’essentiel ;
- la vitesse ;
- la consultation rapide ;
- les alertes ;
- les favoris ;
- la lecture en déplacement.

---

## 13. Accessibilité par défaut

Toute fonctionnalité essentielle doit être utilisable :

- au clavier ;
- avec un lecteur d’écran ;
- sans dépendre uniquement de la couleur ;
- avec un contraste suffisant ;
- avec des tailles de texte adaptables ;
- sans animation obligatoire.

---

## 14. Confidentialité minimale

Athena collecte uniquement les données nécessaires.

Toute donnée personnelle doit avoir :

- une finalité ;
- une durée de conservation ;
- une base légale ;
- une protection ;
- une possibilité de suppression lorsque la loi le permet.

---

## 15. Mesure avant opinion

Les décisions produit doivent être évaluées avec :

- données d’usage ;
- entretiens utilisateurs ;
- tests ;
- métriques ;
- retours qualitatifs ;
- incidents ;
- coûts opérationnels.

---

## 16. Modularité

Chaque domaine fonctionnel doit pouvoir évoluer sans imposer une réécriture globale.

Le produit doit éviter :

- les dépendances cachées ;
- les règles dupliquées ;
- les composants monolithiques ;
- les calculs non versionnés ;
- les comportements non documentés.

---

## 17. Internationalisation prévue dès l’origine

Même si le français est la langue de référence initiale, le produit doit éviter :

- les textes codés en dur ;
- les formats de dates locaux imposés ;
- les devises fixes ;
- les fuseaux horaires implicites ;
- les abréviations ambiguës.

---

## 18. Critères de décision

Lorsqu’une nouvelle fonctionnalité est proposée, elle doit répondre favorablement aux questions suivantes :

1. Résout-elle un problème réel ?
2. Renforce-t-elle la compréhension ?
3. Peut-elle être expliquée ?
4. Peut-elle être mesurée ?
5. Respecte-t-elle les limites éthiques ?
6. Peut-elle être maintenue ?
7. Sa valeur justifie-t-elle sa complexité ?
8. Est-elle cohérente avec le MVP ou la roadmap ?

---

## 19. Principe final

> Athena doit aider l’utilisateur à mieux comprendre avant de l’aider à décider.

---

## 20. Signature

> **Made in Abyss : Spark by the King**

```

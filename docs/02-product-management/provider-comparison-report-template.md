# Rapport comparatif des fournisseurs de données sportives

> **Statut :** Modèle — aucun test exécuté
> **Version :** 1.0
> **Date :** 2026-07-17
> **Auteur :** Antigravity (pour Fondateur ABYSS)
> **Branche :** docs/phase-1-product-definition

Ce document constitue le modèle de rapport de comparaison. Aucun appel réseau réel n'a été effectué pour générer ce rapport. Il sera complété par le testeur après validation et exécution du harnais local.

---

## 1. Tableau des contrôles bruts

| Contrôle | football-data.org | Sportmonks | Commentaire |
|:---|:---:|:---:|:---|
| **Authentification fonctionnelle** | Non testé | Non testé | |
| **Compétitions accessibles** | Non testé | Non testé | |
| **Saison commune accessible** | Non testé | Non testé | |
| **Rencontres collectées** | 0 | 0 | |
| **Champs manquants** | Non mesuré | Non mesuré | |
| **Identifiants stables** | Non testé | Non testé | |
| **Erreurs ou limitations** | Aucune donnée | Aucune donnée | |

---

## 2. Protocole d'exécution humaine sécurisée

Le testeur local doit suivre scrupuleusement les étapes suivantes pour exécuter le comparatif :

1. **Créer les comptes** : Créer les comptes gratuits ou d'essai directement sur les portails officiels (aucun compte payant ou engagement financier ne doit être contracté).
2. **Copier la configuration** : Copier le fichier `.env.example` vers `.env.local` :
   ```bash
   cp .env.example .env.local
   ```
3. **Renseigner les clés** : Renseigner les clés d'API réelles localement à l'intérieur du fichier `.env.local`.
4. **Vérifier l'exclusion Git** : Exécuter la commande suivante pour s'assurer que `.env.local` n'est pas suivi par Git :
   ```bash
   git status --short
   ```
   Le fichier `.env.local` ne doit PAS apparaître dans la liste des fichiers modifiés ou non suivis.
5. **Vérifier les variables** : Lancer la commande de validation locale des variables sans faire de requête réseau :
   ```bash
   node scripts/compare-harness.js --check-env
   ```
6. **Tester l'authentification** : Après obtention de l'autorisation explicite du Fondateur, lancer le test minimal d'authentification réseau :
   ```bash
   node scripts/compare-harness.js --test-auth
   ```
7. **Confirmer les identifiants** : Identifier les identifiants réels des compétitions (Ligue 1, Premier League, Champions League) et la saison de référence commune disponible chez les deux fournisseurs.
8. **Approuver la configuration** : Mettre à jour la configuration locale dans le fichier de configuration et la soumettre pour validation.
9. **Lancer le comparatif** : Exécution complète non implémentée dans cette version du harnais. Une mission distincte sera nécessaire après validation de la configuration, des comptes et des droits.
10. **Générer le rapport nettoyé** : Extraire les statistiques de réussite de la comparaison exploratoire manuelle des données d'échantillon, compléter ce rapport et s'assurer qu'aucune clé API ou en-tête d'authentification ne figure dans le rapport final ou dans les logs. Les réponses brutes obtenues manuellement ou lors d'essais futurs seront documentées hors du dépôt ou dans le dossier ignoré `tmp/provider-comparison/`.

---

## 3. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Antigravity | Version initiale — Modèle de rapport sans exécution de test. |

---

> **Made in Abyss : Spark by the King**

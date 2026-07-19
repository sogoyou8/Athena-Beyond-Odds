# Dossier de décision — Choix et suite pour les fournisseurs de données sportives

**Statut :** Proposition soumise au Fondateur — En attente d'arbitrage  
**Date :** 2026-07-18  
**Auteur :** Antigravity  
**Branche :** `docs/phase-1-product-definition`  
**Contexte :** Phase 1 — Product Definition

---

## 1. Contexte et constats factuels

À l'issue de l'analyse d'environnement et de la découverte des accès réels effectuée via le harnais de test d'Athena, les faits suivants sont définitivement établis :

1. **football-data.org (Plan Gratuit) :**
   - Authentification opérationnelle (HTTP 200).
   - Accès validé aux trois compétitions cibles :
     - **Ligue 1 :** ID `2015`, code `FL1`, saison retournée `2025/26`
     - **Premier League :** ID `2021`, code `PL`, saison retournée `2025/26`
     - **UEFA Champions League :** ID `2001`, code `CL`, saison retournée `2024/25`
   - Les saisons retournées ne sont pas homogènes (décalage sur la Champions League), ce qui ne permet pas d'établir une saison commune uniforme à ce stade.

2. **Sportmonks (Plan d'essai gratuit) :**
   - Authentification opérationnelle (HTTP 200).
   - Limitation stricte du plan d'essai (permettant uniquement l'accès à 7 compétitions, dont la Superliga danoise, la Premiership écossaise et du cricket).
   - **Absence d'accès aux trois compétitions cibles** (Ligue 1, Premier League, UEFA Champions League).

3. **Conséquence directe :**
   - Le test comparatif sur l'échantillon des 18 rencontres et la validation de la saison commune restent suspendus en raison des restrictions d'accès du plan d'essai Sportmonks.
   - Aucun abonnement payant n'a été souscrit.
   - Aucun fournisseur n'est définitivement sélectionné.
   - Le fichier de configuration `scripts/compare-config.json` reste volontairement incomplet.
   - La Pull Request de Phase 1 est maintenue en mode brouillon (draft).

---

## 2. Recommandation technique et produit provisoire

Afin de ne pas bloquer le projet tout en maintenant une rigueur d'évaluation, la recommandation provisoire suivante est soumise au Fondateur :

1. **Poursuite provisoire du prototype technique sur football-data.org uniquement :**
   - Utiliser football-data.org comme source unique pour l'implémentation initiale des flux et de l'architecture en Phase 2.
   - *Avertissement :* Cette implémentation doit être présentée et documentée strictement comme un prototype temporaire, et non comme le résultat d'une comparaison complète ou d'un choix définitif de fournisseur.
2. **Démarches parallèles auprès de Sportmonks (sans engagement) :**
   - Contacter le support/commercial de Sportmonks pour solliciter un accès d'évaluation temporaire (trial bypass) incluant les trois compétitions cibles.
   - Demander une proposition commerciale écrite claire détaillant les coûts pour le périmètre du MVP, sans souscrire à aucun plan à ce stade.
3. **Maintien d'une stricte neutralité et options alternatives :**
   - Ne souscrire aucun plan payant avant décision explicite et arbitrage budgétaire du Fondateur.
   - Conserver la possibilité d'évaluer un autre fournisseur de la shortlist si les démarches auprès de Sportmonks n'aboutissent pas à des conditions acceptables.

---

## 3. Options de décision soumises au Fondateur

Pour débloquer la situation et orienter la Phase 2, quatre options sont soumises à l'arbitrage du Fondateur :

### Option 1 — Prototype exclusif football-data.org et gel de Sportmonks
- **Principe :** On acte que le MVP utilisera uniquement football-data.org. On abandonne l'évaluation de Sportmonks pour le MVP afin de réduire les coûts et la complexité d'intégration.
- **Impact :** Simplification immédiate, coût de données nul pour le démarrage, mais dépendance forte à un fournisseur dont la richesse de données (notamment statistiques avancées) est limitée.

### Option 2 — Négociation d'évaluation avec Sportmonks
- **Principe :** On suspend la comparaison finale et on engage une demande d'accès d'évaluation ciblé auprès de Sportmonks pour réaliser le test complet des 18 rencontres avant tout choix d'architecture finale.
- **Impact :** Sécurise la comparaison technique sur des bases réelles, mais introduit un délai potentiel d'attente de réponse commerciale/technique de Sportmonks.

### Option 3 — Pivot vers un troisième fournisseur de la shortlist
- **Principe :** Évaluer une alternative de la shortlist (par exemple, un fournisseur avec un plan gratuit ou d'essai plus permisif sur les ligues majeures).
- **Impact :** Maintient une démarche comparative sans dépendance à Sportmonks, mais nécessite d'adapter le harnais de comparaison à un nouveau protocole d'API.

### Option 4 — Prototype hybride avec transition planifiée (Recommandé)
- **Principe :** Développer la Phase 2 en s'appuyant sur football-data.org pour valider les modèles et interfaces d'Athena, tout en menant en parallèle les demandes d'accès d'évaluation et de tarification auprès de Sportmonks pour préparer une éventuelle migration ou intégration multi-sources future.
- **Impact :** Aucun retard sur le développement, architecture pensée pour être agnostique du fournisseur, décision finale de souscription reportée à la validation du prototype.

---

## 4. Statut final

`Validation humaine requise`

---

> **Made in Abyss : Spark by the King**

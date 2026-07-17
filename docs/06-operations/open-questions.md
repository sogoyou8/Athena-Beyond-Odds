> **Statut :** En cours  
> **Version :** 1.0  
> **Phase :** Phase 1 — Product Definition

# Questions ouvertes

Ce document centralise toutes les questions ouvertes détectées lors de la rédaction du PRD et des documents de Phase 1.

Les questions doivent être résolues avant la phase d'architecture ou de conception UX/UI selon leur impact.

---

## OQ-001 — Quotas du compte Free

- **Date d'ouverture :** 2026-07-17
- **Contexte :** Le Blueprint mentionne des quotas pour le Free User (analyses limitées, historique réduit, simulations limitées) sans préciser les valeurs numériques exactes.
- **Question :** Quel est le nombre exact d'analyses, de simulations ou de consultations autorisées par jour ou par mois pour un utilisateur Free ?
- **Impact :** Les exigences FR-021 et FR-022 ne peuvent pas être finalisées avant cette décision. Le quota influe sur l'interface (indicateurs de limite) et sur la valeur perçue de l'offre Premium.
- **Documents concernés :** [`08-user-roles.md`](../08-product-blueprint/08-user-roles.md), [`30-mvp-scope.md`](../08-product-blueprint/30-mvp-scope.md), [`product-requirements-document.md`](../02-product-management/product-requirements-document.md)
- **Statut :** Ouverte

---

## OQ-002 — Structure tarifaire Premium

- **Date d'ouverture :** 2026-07-17
- **Contexte :** Le Blueprint mentionne un modèle Free/Premium sans définir le prix, la fréquence de facturation (mensuel/annuel), ni les modalités d'essai.
- **Question :** Quel est le prix du plan Premium ? Y a-t-il une période d'essai gratuite ? Une facturation annuelle avec remise ?
- **Impact :** Les exigences relatives aux droits Premium, aux quotas Free et au parcours de conversion restent partiellement dépendantes de cette décision. La conception du parcours de conversion et de la présentation tarifaire en dépend.
- **Documents concernés :** [`pricing.md`](../07-business/pricing.md), [`business-model.md`](../07-business/business-model.md), [`08-user-roles.md`](../08-product-blueprint/08-user-roles.md)
- **Statut :** Ouverte

---

## OQ-003 — Fournisseurs de données sportives

- **Date d'ouverture :** 2026-07-17
- **Contexte :** Le Blueprint spécifie les types de données nécessaires (matchs, statistiques, compositions, cotes) mais ne nomme aucun fournisseur.
- **Question :** Quels fournisseurs de données sportives sont envisagés pour le MVP (ex. : API-Football, Opta, StatsBomb, SportRadar) ? Y a-t-il déjà un accord ou un budget identifié ?
- **Impact :** La faisabilité de FR-005, FR-006, FR-007 et NFR-010 dépend de la disponibilité et de la qualité des données fournisseurs. Cette décision impacte l'architecture data et les coûts.
- **Documents concernés :** [`17-external-integrations.md`](../08-product-blueprint/17-external-integrations.md), [`technical-architecture.md`](../04-technology/technical-architecture.md)
- **Statut :** Décision conditionnelle — validation factuelle restante (orientation approuvée le 2026-07-17 par DEC-001 ; la source exacte reste à confirmer, ainsi que la couverture, la qualité, la continuité, les droits d'usage et le coût).

---

## OQ-004 — Langue(s) initiale(s) du produit

- **Date d'ouverture :** 2026-07-17
- **Contexte :** Le Blueprint précise que le français est « la langue de référence initiale » et que l'internationalisation doit être prévue dès l'origine. La langue d'interface du MVP n'est pas explicitement définie.
- **Question :** Le MVP sera-t-il disponible uniquement en français ? En anglais également ? Quelle est la langue par défaut de l'interface utilisateur ?
- **Impact :** Influe sur NFR-011 (internationalisation), sur les exigences d'onboarding (FR-002) et sur les coûts de traduction.
- **Documents concernés :** [`02-product-principles.md`](../08-product-blueprint/02-product-principles.md), [`09-user-journeys.md`](../08-product-blueprint/09-user-journeys.md), [`product-requirements-document.md`](../02-product-management/product-requirements-document.md)
- **Statut :** Ouverte

---

## OQ-005 — MFA obligatoire pour les utilisateurs finaux

- **Date d'ouverture :** 2026-07-17
- **Contexte :** Le Blueprint impose le 2FA pour le Super Administrateur. Il ne précise pas si le MFA est obligatoire, optionnel ou absent pour les utilisateurs Free et Premium.
- **Question :** Le MFA est-il proposé à tous les utilisateurs connectés ? Obligatoire uniquement pour les admins ? Requis dès le MVP ou en V1 ?
- **Impact :** Influe sur FR-001 (inscription/connexion), sur NFR-007 (sécurité) et sur la complexité du module Identity & Access.
- **Documents concernés :** [`08-user-roles.md`](../08-product-blueprint/08-user-roles.md), [`21-security-model.md`](../08-product-blueprint/21-security-model.md)
- **Statut :** Ouverte

---

## OQ-006 — Périmètre des compétitions couvertes au MVP

- **Date d'ouverture :** 2026-07-17
- **Contexte :** Le Blueprint indique « compétitions sélectionnées » sans lister lesquelles. Le choix impacte directement les besoins en données, en modèles et en couverture.
- **Question :** Quelles ligues ou compétitions de football seront couvertes au MVP (ex. : Ligue 1, Premier League, Champions League, La Liga) ? Combien de compétitions minimum ?
- **Impact :** La portée des données à ingérer, des modèles à calibrer et de la couverture du Match Center en dépend directement.
- **Documents concernés :** [`30-mvp-scope.md`](../08-product-blueprint/30-mvp-scope.md), [`05-domain-map.md`](../08-product-blueprint/05-domain-map.md)
- **Statut :** Décision conditionnelle — validation factuelle restante (option intermédiaire resserrée approuvée le 2026-07-17 par DEC-001 ; cible de 2 à 3 compétitions maximum, liste exacte restant à confirmer après vérification des données).

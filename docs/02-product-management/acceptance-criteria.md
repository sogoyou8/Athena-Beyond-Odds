# Acceptance Criteria

> **Produit :** Athena: Beyond Odds  
> **Entreprise :** ABYSS  
> **Version :** 1.0  
> **Statut :** Brouillon  
> **Phase :** Phase 1 — Product Definition

---

## 1. Objet

Ce document définit les critères d'acceptation fonctionnels du produit minimum viable (MVP) d'Athena: Beyond Odds.

Il fournit un référentiel de validation pour l'ensemble des fonctionnalités incluses dans le périmètre du MVP (`FEAT-001` à `FEAT-020`), en traduisant les exigences du [Product Requirements Document](product-requirements-document.md) et les récits des [User Stories](user-stories.md) en scénarios testables et indépendants de toute implémentation technique ou choix de fournisseur.

---

## 2. Principes

La validation des fonctionnalités d'Athena repose sur les principes de qualité permanents suivants, dérivés des [Product Principles](../08-product-blueprint/02-product-principles.md) :

1. **Vérification comportementale :** Les critères d'acceptation décrivent le comportement visible et mesurable du système du point de vue de l'utilisateur final ou de l'opérateur.
2. **Explicabilité et factualité :** Les sorties générées par l'IA ou les moteurs probabilistes sont soumises à des règles de non-hallucination et de traçabilité des données d'origine.
3. **Indépendance technologique :** Les critères décrivent le *quoi* et non le *comment*. Ils n'imposent aucun framework, base de données, infrastructure ou fournisseur tiers.
4. **Gestion explicite du manque :** Aucun état de données manquantes ou d'incohérence ne doit être masqué ou remplacé par des valeurs par défaut incorrectes (pas d'affichage à zéro artificiel).

---

## 3. Périmètre

Ce document s'applique exclusivement aux 20 fonctionnalités fonctionnelles incluses dans le périmètre officiel du MVP (`FEAT-001` à `FEAT-020`) détaillées dans le [MVP Scope](mvp-scope.md).

Les fonctionnalités hors MVP (V1, V2, Future : `FEAT-021` à `FEAT-026`) sont hors du périmètre de validation initiale de ce document.

---

## 4. Conventions

Les critères d'acceptation de ce document utilisent les conventions suivantes pour référencer les rôles et permissions :

- **Visiteur :** Utilisateur non connecté naviguant sur les sections publiques de la plateforme.
- **Utilisateur connecté Free :** Utilisateur authentifié n'ayant pas souscrit d'abonnement actif. Soumis à des quotas d'usage.
- **Utilisateur connecté Premium :** Utilisateur authentifié disposant d'un abonnement actif. Accès complet aux probabilités détaillées et explications.
- **Administrateur :** Opérateur interne disposant des droits d'administration minimale et de supervision opérationnelle.

---

## 5. Niveaux de validation

Chaque critère d'acceptation est rattaché à l'un des trois niveaux de validation suivants :

- **Niveau 1 : Critique (Bloquant) —** La fonctionnalité ne peut pas être mise en production si ce critère n'est pas validé. Impacte directement la sécurité, la conformité légale ou le parcours d'accès de base.
- **Niveau 2 : Majeur —** Impacte la proposition de valeur principale du Match Center ou de l'explicabilité. La fonctionnalité peut être déployée en phase beta privée sous réserve d'un contournement documenté.
- **Niveau 3 : Mineur —** Amélioration de confort ou d'expérience visuelle, non bloquante pour les tests pilotes.

---

## 6. Format des critères

Les critères d'acceptation sont rédigés sous la forme de scénarios de validation comportementale structurés. Ils utilisent la syntaxe standardisée *Given-When-Then* (§7) afin de faciliter leur traduction en tests fonctionnels ou scénarios d'assurance qualité lors des phases de développement.

---

## 7. Règles Given-When-Then

Chaque scénario respecte la structure suivante :

- **Given (Étant donné) :** Définit l'état initial du système, le rôle de l'utilisateur et les préconditions nécessaires.
- **When (Quand) :** Décrit l'action déclenchante ou l'événement initié par l'utilisateur ou le système.
- **Then (Alors) :** Décrit le résultat attendu, observable et vérifiable sur l'interface ou les permissions d'accès.

---

## 8. Critères globaux du MVP

Les critères globaux suivants s'appliquent transversalement à tous les écrans d'application listés dans [Screens](../08-product-blueprint/12-screens.md) :

- **Affichage factuel :** Aucun écran ne doit afficher d'informations à zéro si la donnée réelle est inconnue (utilisation obligatoire de l'état "Donnée non disponible").
- **Confirmation des actions sensibles :** Toute action irréversible (modification d'abonnement, suppression de favoris) doit exiger une confirmation explicite de l'utilisateur.
- **Accessibilité clavier :** Les éléments interactifs principaux de l'interface doivent être navigables et activables au clavier.

---

## 9. Compte et accès

### FEAT-001 — Inscription de compte
- **AC-001 (Fonctionnel) :**
  - **Given** Un visiteur sur l'écran d'inscription.
  - **When** Il soumet une adresse e-mail valide et un mot de passe conforme aux règles de complexité.
  - **Then** Le système enregistre la demande, envoie une notification de validation d'accès, et bloque l'accès aux fonctionnalités connectées tant que la validation n'est pas confirmée.
- **AC-002 (Fonctionnel) :**
  - **Given** Un visiteur sur l'écran d'inscription.
  - **When** Il soumet une adresse e-mail déjà enregistrée ou un format d'e-mail invalide.
  - **Then** Le système affiche un message d'erreur clair et compréhensible sans divulguer de détails techniques, et n'envoie aucune notification.
- **AC-003 (Données) :**
  - **Given** Une tentative d'inscription réussie.
  - **When** Le compte est validé par l'utilisateur.
  - **Then** Le système enregistre l'événement de validation avec la date et l'heure sans perte d'information.

### FEAT-002 — Connexion et authentification
- **AC-004 (Fonctionnel) :**
  - **Given** Un utilisateur inscrit mais non connecté.
  - **When** Il soumet ses identifiants exacts sur l'écran de connexion.
  - **Then** Le système valide ses droits d'accès et le redirige vers son Dashboard personnalisé.
- **AC-005 (Fonctionnel) :**
  - **Given** Un utilisateur sur l'écran de connexion.
  - **When** Il saisit un mot de passe erroné ou un identifiant inconnu.
  - **Then** Le système refuse la connexion, affiche un message d'erreur générique de connexion échouée, et n'expose aucun détail interne.
- **AC-006 (Sécurité) :**
  - **Given** Un utilisateur connecté.
  - **When** Il initie une action de déconnexion.
  - **Then** La session active est immédiatement révoquée et tout accès ultérieur aux sections connectées exige une ré-authentification.

### FEAT-003 — Profil et préférences
- **AC-007 (Fonctionnel) :**
  - **Given** Un utilisateur connecté sur son écran de profil.
  - **When** Il configure ses choix de langue, de fuseau horaire de match et d'alertes autorisées et valide la modification.
  - **Then** Le système enregistre ses préférences de manière persistante.
- **AC-008 (Fonctionnel) :**
  - **Given** Un utilisateur modifiant ses préférences.
  - **When** Une erreur de communication survient lors de la validation.
  - **Then** Le système affiche un message d'erreur compréhensible et non bloquant, et conserve l'état initial des préférences de l'utilisateur sans perte silencieuse.
- **AC-009 (UX) :**
  - **Given** Un utilisateur connecté sans préférences configurées.
  - **When** Il accède au produit pour la première fois.
  - **Then** Le système applique et affiche une configuration par défaut pertinente.

---

## 10. Onboarding

### FEAT-004 — Onboarding initial
- **AC-010 (Fonctionnel) :**
  - **Given** Un utilisateur connecté se connectant pour la première fois.
  - **When** La séquence d'onboarding s'affiche.
  - **Then** L'utilisateur est guidé à travers 5 étapes fonctionnelles (langue, fuseau horaire de match, niveau d'expertise, favoris et types d'alertes autorisées).
- **AC-011 (UX) :**
  - **Given** Un utilisateur dans la séquence d'onboarding.
  - **When** Il clique sur l'action d'annulation ou de saut de l'onboarding.
  - **Then** Le système ferme l'onboarding, applique la configuration par défaut et le redirige vers le Dashboard.
- **AC-012 (Opérationnel) :**
  - **Given** Un utilisateur ayant finalisé l'onboarding.
  - **When** Il accède à sa session suivante.
  - **Then** La séquence d'onboarding ne s'affiche plus et ses choix configurés sont appliqués.

---

## 11. Dashboard

### FEAT-005 — Dashboard personnalisé
- **AC-013 (Fonctionnel) :**
  - **Given** Un utilisateur connecté ayant configuré des favoris.
  - **When** Il accède au Dashboard personnalisé (point d'entrée).
  - **Then** Il voit en priorité les rencontres du jour associées à ses compétitions ou équipes favorites, ainsi que ses analyses récentes.
- **AC-014 (Fonctionnel) :**
  - **Given** Un utilisateur sur son Dashboard.
  - **When** Une erreur temporaire empêche le chargement de la section des analyses récentes.
  - **Then** Le reste du Dashboard s'affiche normalement et la section affiche un message compréhensible de non-disponibilité temporaire sans bloquer l'interface.
- **AC-015 (Données) :**
  - **Given** Un utilisateur connecté n'ayant aucun favori configuré.
  - **When** Il charge son Dashboard.
  - **Then** Le système lui présente une sélection par défaut des compétitions et rencontres majeures du jour.

---

## 12. Découverte des matchs

### FEAT-006 — Liste des matchs du jour
- **AC-016 (Fonctionnel) :**
  - **Given** Un utilisateur sur la liste des matchs.
  - **When** Il consulte la liste des matchs du jour.
  - **Then** Les rencontres du jour s'affichent regroupées par compétition, affichant l'heure locale configurée par l'utilisateur, les deux équipes, l'état (scheduled, live, finished) et le score actuel.
- **AC-017 (Fonctionnel) :**
  - **When** Aucun match n'est programmé pour le jour sélectionné.
  - **Then** Le système affiche un message d'information compréhensible indiquant qu'aucun match n'est prévu.
- **AC-018 (Fonctionnel) :**
  - **Given** La liste des matchs du jour affichée.
  - **When** L'utilisateur applique un filtre de compétition.
  - **Then** Seules les rencontres de cette compétition sont affichées.

---

## 13. Recherche

### FEAT-007 — Recherche globale autocomplete
- **AC-019 (Fonctionnel) :**
  - **Given** Le champ de recherche globale visible.
  - **When** L'utilisateur saisit au moins 3 caractères.
  - **Then** Le système affiche des suggestions de résultats structurées par catégorie (équipes, matchs, compétitions).
- **AC-020 (Fonctionnel) :**
  - **Given** La saisie de caractères spéciaux non gérés ou aucun résultat trouvé.
  - **When** L'utilisateur soumet sa recherche.
  - **Then** Le système affiche un message d'information compréhensible indiquant qu'aucun résultat ne correspond, sans générer de dysfonctionnement de l'interface.
- **AC-021 (Fonctionnel) :**
  - **Given** Une liste de suggestions affichée.
  - **When** L'utilisateur clique sur une suggestion.
  - **Then** Il est redirigé vers la fiche détaillée correspondante (Match Center, équipe ou compétition).

---

## 14. Match Center

### FEAT-008 — Fiche d'information Match Center
- **AC-022 (Fonctionnel) :**
  - **Given** Un utilisateur consultant la fiche Match Center.
  - **When** L'écran se charge.
  - **Then** Il affiche l'état réel de la rencontre (scheduled, postponed, live, finished, etc.), le score, l'horaire, le lieu, et les indisponibilités de joueurs majeures (blessures et suspensions).
- **AC-023 (Fonctionnel) :**
  - **Given** Une panne d'accès aux données d'un match.
  - **When** L'utilisateur ouvre la fiche match.
  - **Then** Le système redirige l'utilisateur vers un écran d'erreur compréhensible et non bloquant.
- **AC-024 (UX) :**
  - **Given** Une fiche match affichée.
  - **When** L'utilisateur navigue sur un support mobile.
  - **Then** La mise en page s'adapte sans chevauchement de texte et les boutons d'action restent utilisables par saisie tactile.

---

## 15. Statistiques et forme

### FEAT-009 — Affichage de la forme et des stats de base
- **AC-025 (Fonctionnel) :**
  - **Given** Un utilisateur sur la fiche Match Center.
  - **When** Il consulte la zone de forme et de statistiques.
  - **Then** Le système affiche le classement des équipes et l'historique des résultats sur les 5 dernières rencontres jouées pour chaque équipe.
- **AC-026 (Fonctionnel) :**
  - **Given** Une absence d'historique de forme pour l'une des équipes (ex. nouvelle équipe promue).
  - **When** L'écran est affiché.
  - **Then** Le système affiche "Donnée non disponible" à l'emplacement de l'historique manquant sans interrompre l'affichage des autres statistiques.
- **AC-027 (Qualité) :**
  - **Given** Un utilisateur Free connecté.
  - **When** Il consulte le Match Center.
  - **Then** Les statistiques de base sont affichées, mais les indicateurs de statistiques avancées (xG, xA) affichent un visuel verrouillé avec invitation à passer Premium.

---

## 16. Probabilités et confiance

### FEAT-010 — Moteur de probabilités et score de confiance
- **AC-028 (Fonctionnel) :**
  - **Given** Un utilisateur connecté.
  - **When** Il consulte les probabilités de match.
  - **Then** Le système affiche la répartition des probabilités 1N2 normalisée (somme égale à 100 %) et l'indicateur synthétique de score de confiance associé.
- **AC-029 (Fonctionnel) :**
  - **Given** Un dysfonctionnement ou une absence de données d'entrée pour le calcul.
  - **When** Les probabilités sont requises.
  - **Then** Le système affiche une mention explicite de non-disponibilité à la place des pourcentages, sans afficher de valeurs à zéro.
- **AC-030 (Qualité) :**
  - **Given** Un utilisateur connecté Free.
  - **When** Il consulte les probabilités.
  - **Then** Seules les probabilités globales 1N2 sont affichées ; le détail du consensus et les intervalles d'incertitude affichent un indicateur d'accès Premium.

---

## 17. Explainable AI

### FEAT-011 — Résumé d'analyse généré par IA
- **AC-031 (Fonctionnel) :**
  - **Given** Un utilisateur connecté Premium.
  - **When** Il consulte le résumé d'analyse.
  - **Then** Le système affiche une synthèse textuelle explicative de la répartition des probabilités, sans formuler de promesse de gain ni de résultat garanti.
- **AC-032 (Fonctionnel) :**
  - **Given** Une erreur dans la génération automatique du résumé.
  - **When** Le Match Center est chargé.
  - **Then** La zone affiche un message compréhensible de non-disponibilité temporaire, sans perturber le reste de la fiche de match.
- **AC-033 (Qualité) :**
  - **Given** Un utilisateur Free.
  - **When** Il charge le Match Center.
  - **Then** La zone de synthèse IA est visible mais masquée par un visuel d'accès Premium.

### FEAT-012 — Affichage hiérarchisé des facteurs explicatifs
- **AC-034 (Fonctionnel) :**
  - **Given** Un utilisateur connecté.
  - **When** Il consulte les facteurs clés.
  - **Then** Le système liste de manière hiérarchisée et ordonnée les facteurs favorables et défavorables majeurs de chaque équipe.
- **AC-035 (Fonctionnel) :**
  - **Given** Une indisponibilité de données pour l'un des facteurs.
  - **When** Les facteurs sont chargés.
  - **Then** Le facteur incomplet n'est pas affiché et le système présente uniquement les autres facteurs validés.
- **AC-036 (Données) :**
  - **Given** La liste des facteurs affichée.
  - **When** L'utilisateur consulte un facteur clé.
  - **Then** Chaque facteur cite la donnée factuelle d'origine qui le soutient.

---

## 18. Sources et fraîcheur

### FEAT-013 — Indicateur de fraîcheur et traçabilité des sources
- **AC-037 (Fonctionnel) :**
  - **Given** Un utilisateur connecté.
  - **When** Il regarde la zone des sources.
  - **Then** Le système affiche la date et l'heure de la dernière mise à jour des données (fraîcheur) et la liste des sources de données d'entrée utilisées pour l'analyse.
- **AC-038 (Fonctionnel) :**
  - **Given** Une impossibilité de déterminer la fraîcheur d'une source.
  - **When** L'écran est chargé.
  - **Then** Le système affiche "Mise à jour : Non disponible" à la place de l'horodatage.
- **AC-039 (Données) :**
  - **Given** L'affichage des sources.
  - **When** L'utilisateur consulte la liste des sources.
  - **Then** Les sources affichées correspondent aux données réelles configurées pour la rencontre pilotes.

---

## 19. Favoris

### FEAT-014 — Synchronisation des favoris
- **AC-040 (Fonctionnel) :**
  - **Given** Un utilisateur connecté sur une fiche match, équipe ou compétition.
  - **When** Il clique sur l'action d'ajout aux favoris.
  - **Then** L'entité est marquée comme favorite, ses préférences sont enregistrées de façon persistante, et l'entité apparaît sur son Dashboard.
- **AC-041 (Fonctionnel) :**
  - **Given** Un utilisateur connecté tentant de retirer un favori.
  - **When** La synchronisation échoue suite à une défaillance de communication.
  - **Then** L'interface affiche un message d'erreur compréhensible, et l'entité reste temporairement dans les favoris sans perte silencieuse des préférences de l'utilisateur.
- **AC-042 (UX) :**
  - **Given** Un utilisateur connecté ayant des favoris enregistrés.
  - **When** Il se connecte sur un autre terminal ou réinitialise son cache local.
  - **Then** Ses favoris sont correctement chargés et affichés dès l'ouverture de sa session.

---

## 20. Notifications

### FEAT-015 — Notifications d'événements de match
- **AC-043 (Fonctionnel) :**
  - **Given** Un utilisateur connecté ayant configuré et autorisé les notifications de match.
  - **When** Une rencontre de ses favoris atteint un déclencheur (rappel avant-match, début ou fin de rencontre).
  - **Then** Le système transmet une notification conforme aux préférences de l'utilisateur.
- **AC-044 (Opérationnel) :**
  - **Given** Une erreur d'envoi d'une notification.
  - **When** Le canal principal configuré par l'utilisateur est indisponible.
  - **Then** Le système enregistre l'échec de distribution avec son contexte et son horodatage, et n'interrompt pas le fonctionnement de l'application.
- **AC-045 (Business) :**
  - **Given** Un utilisateur modifiant ses consentements de notification.
  - **When** Il désactive les notifications.
  - **Then** Le système cesse immédiatement de lui envoyer des messages et enregistre le retrait du consentement.

---

## 21. Free et Premium

### FEAT-016 — Tunnel d'abonnement Premium
- **AC-046 (Fonctionnel) :**
  - **Given** Un utilisateur connecté Free sur la page de tarification.
  - **When** Il sélectionne l'offre, soumet son paiement sécurisé et finalise l'opération.
  - **Then** Le système confirme la transaction, valide son éligibilité et active ses droits d'accès Premium immédiatement sans déconnexion.
- **AC-047 (Fonctionnel) :**
  - **Given** Un utilisateur connecté Premium sur son écran de profil.
  - **When** Il clique sur l'action de résiliation d'abonnement et confirme son choix.
  - **Then** Le système enregistre la résiliation, confirme que les accès Premium restent actifs jusqu'à la date d'échéance payée, et ne présente aucun parcours d'entrave ou dark pattern.
- **AC-048 (Fonctionnel) :**
  - **Given** Un utilisateur connecté Free ayant atteint sa limite d'usage Free.
  - **When** Il tente d'ouvrir une fiche Match Center supplémentaire.
  - **Then** Le système bloque l'affichage de l'analyse, présente un message compréhensible de limite d'usage atteinte et affiche un lien d'accès au parcours d'abonnement Premium.

---

## 22. Qualité et signalement

### FEAT-017 — Signalement d'anomalies de données
- **AC-049 (Fonctionnel) :**
  - **Given** Un utilisateur connecté sur le Match Center.
  - **When** Il clique sur "Signaler une erreur" à côté d'une donnée clé, remplit le formulaire et valide.
  - **Then** Le système enregistre le signalement avec le contexte nécessaire, affiche une confirmation, et le rend consultable dans l'administration minimale.
- **AC-050 (Fonctionnel) :**
  - **Given** Un utilisateur connecté soumettant un signalement.
  - **When** Une erreur de transmission survient lors de la soumission.
  - **Then** L'interface affiche un message d'erreur compréhensible et n'efface pas les données saisies par l'utilisateur pour éviter toute perte silencieuse.
- **AC-051 (Business) :**
  - **Given** Un signalement enregistré par le système.
  - **When** L'administrateur consulte le signalement.
  - **Then** Il contient obligatoirement l'identifiant du match, l'identifiant de la donnée signalée, la catégorie d'erreur choisie, le commentaire de l'utilisateur, ainsi que l'identifiant de l'utilisateur et l'horodatage.

---

## 23. Administration minimale

### FEAT-018 — Administration et logs
- **AC-052 (Fonctionnel) :**
  - **Given** Un utilisateur connecté disposant du rôle d'administrateur.
  - **When** Il accède au portail d'administration.
  - **Then** Il peut consulter les anomalies de données signalées, modifier les rôles de compte des utilisateurs et suspendre des accès.
- **AC-053 (Fonctionnel) :**
  - **Given** Un administrateur tentant de suspendre un compte.
  - **When** Une défaillance système se produit.
  - **Then** L'action est refusée, le compte utilisateur reste actif et un message d'erreur compréhensible s'affiche à l'administrateur.
- **AC-054 (Sécurité) :**
  - **Given** Un administrateur connecté.
  - **When** Il valide une modification sensible (changement de rôle, suspension).
  - **Then** Le système enregistre l'événement dans un journal d'audit interne (contenant l'administrateur, l'action, l'utilisateur concerné et l'horodatage).

---

## 24. Données manquantes

### FEAT-019 — Gestion des données manquantes
- **AC-055 (Fonctionnel) :**
  - **Given** Une fiche match contenant des données non disponibles pour un champ.
  - **When** Le Match Center est chargé.
  - **Then** Le système affiche explicitement "Donnée non disponible" à l'emplacement concerné sans insérer la valeur zéro.
- **AC-056 (Fonctionnel) :**
  - **Given** L'absence de la majorité des statistiques pour un match programmé.
  - **When** La fiche match est ouverte.
  - **Then** L'interface affiche les informations d'identité du match disponibles et indique clairement que l'analyse est partielle en raison de données manquantes.
- **AC-057 (Données) :**
  - **Given** Une fiche de match avec données manquantes.
  - **When** L'utilisateur consulte la zone des sources.
  - **Then** Le système indique quelles données d'entrée n'ont pas pu être récupérées.

---

## 25. Résilience produit

### FEAT-020 — Résilience et états d'erreur
- **AC-058 (Fonctionnel) :**
  - **Given** Un match dans l'état réel `finished`.
  - **When** Une mise à jour tente de modifier son statut en `live`.
  - **Then** Le système rejette l'opération et conserve le match dans l'état finalisé.
- **AC-059 (Fonctionnel) :**
  - **Given** Une indisponibilité système majeure.
  - **When** Un utilisateur tente d'accéder à l'application.
  - **Then** L'interface affiche un écran d'erreur compréhensible, non bloquant, et n'expose aucun détail technique interne.
- **AC-060 (Fonctionnel) :**
  - **Given** Une perte de connexion réseau en cours de navigation.
  - **When** L'utilisateur tente une action.
  - **Then** L'interface affiche une notification claire indiquant la perte de connexion réseau et propose une option de rafraîchissement non bloquante.

---

## 26. Sécurité et confidentialité

- **AC-061 (Sécurité) - Niveau 1 :**
  - **Given** Un utilisateur connecté.
  - **When** Il déclenche une action de déconnexion.
  - **Then** La session active est révoquée et tout accès aux sections connectées exige une nouvelle authentification.
- **AC-062 (Sécurité) - Niveau 1 :**
  - **Given** Un utilisateur connecté Free ou Premium.
  - **When** Il demande la suppression de ses données personnelles de compte.
  - **Then** Le système supprime les informations personnelles identifiables et n'interrompt pas l'historique d'audit légal obligatoire.

---

## 27. Performance et expérience

- **AC-063 (Performance) - Niveau 1 :**
  - **Given** Un utilisateur accédant à une fiche Match Center.
  - **When** La fiche se charge en conditions réseau pilotes.
  - **Then** L'affichage complet de la page s'effectue en moins de 2,5 secondes (Largest Contentful Paint < 2,5 s). (Réf : [PRD §24 NFR-001](product-requirements-document.md#nfr-001--performance)).
- **AC-064 (Performance) - Niveau 2 :**
  - **Given** Un utilisateur saisissant du texte dans la recherche.
  - **When** Il saisit le troisième caractère.
  - **Then** Les suggestions de recherche semi-automatique s'affichent en moins de 500 millisecondes (p95). (Réf : [PRD §24 NFR-001](product-requirements-document.md#nfr-001--performance)).
- **AC-065 (UX) - Niveau 2 :**
  - **Given** L'interface responsive affichée sur mobile web.
  - **When** L'utilisateur parcourt un Match Center.
  - **Then** Aucun chevauchement de texte n'apparaît et les actions de favori ou de signalement restent utilisables par saisie tactile. (Réf : [Product Principles §12](../08-product-blueprint/02-product-principles.md)).

---

## 28. Données, traçabilité et critères non fonctionnels complémentaires

- **AC-066 (Données) - Niveau 1 :**
  - **Given** Un match terminé.
  - **When** Une mise à jour ou action tente de modifier l'historique des probabilités calculées pour ce match.
  - **Then** Le système bloque l'opération et conserve l'historique probabiliste immuable. (Réf : [Business Rules §3](../08-product-blueprint/14-business-rules.md)).
- **AC-067 (Données) - Niveau 2 :**
  - **Given** Le calcul des probabilités consensus 1N2 (Victoire domicile, Nul, Victoire extérieur) affiché sur une fiche match.
  - **When** Les pourcentages sont additionnés.
  - **Then** La somme totale est strictement égale à 100 % (la règle d'arrondi et la tolérance restant à définir — Règle à valider). (Réf : [Business Rules §3](../08-product-blueprint/14-business-rules.md)).
- **AC-068 (Données) - Niveau 2 :**
  - **Given** Les informations de match affichées.
  - **When** L'utilisateur consulte l'indicateur de fraîcheur.
  - **Then** Il affiche l'horodatage exact de la dernière ingestion et la liste des sources associées. (Réf : [PRD §24 NFR-010](product-requirements-document.md#nfr-010--qualité-des-données)).

### NFR-004 — Scalabilité
- **AC-073 (Opérationnel) :**
  - **Given** Le produit en conditions d'usage représentatives (pics d'audience attendus lors de grands matchs).
  - **When** Le niveau de consultation simultanée atteint le niveau de charge attendu.
  - **Then** Les parcours essentiels (liste des matchs, consultation d'une fiche Match Center, authentification) restent utilisables sans dégradation fonctionnelle majeure.
  - **Preuve attendue :** Résultat d'un scénario de validation de charge représentatif du produit pilote.
  - **Seuil ou statut :** Seuil à valider.

### NFR-005 — Maintenabilité
- **AC-074 (Opérationnel) :**
  - **Given** Une règle de calcul, d'affichage ou de restriction d'accès documentée dans le périmètre MVP.
  - **When** Une modification de cette règle est appliquée et validée.
  - **Then** Les parcours fonctionnels non concernés par la modification restent conformes à leurs critères d'acceptation d'origine, sans régression détectée.
  - **Preuve attendue :** Résultat de validation des critères d'acceptation sur les parcours non modifiés.
  - **Seuil ou statut :** Aucune régression sur les parcours non impactés.

### NFR-006 — Observabilité
- **AC-075 (Opérationnel) :**
  - **Given** Un opérateur accédant aux informations de suivi du produit.
  - **When** Un événement fonctionnel significatif s'est produit (erreur, action sensible, anomalie de données, échec de distribution).
  - **Then** Les événements nécessaires au diagnostic et au suivi du parcours sont consultables avec leur contexte et leur horodatage.
  - **Preuve attendue :** Vérification qu'un ensemble représentatif d'événements fonctionnels est consultable dans le contexte de supervision.
  - **Seuil ou statut :** Seuil à valider.

### NFR-002 — Disponibilité
- **AC-076 (Qualité) :**
  - **Given** Une période mensuelle d'exploitation du MVP est terminée.
  - **When** La disponibilité du produit sur cette période est évaluée en excluant les périodes de maintenance planifiée définies.
  - **Then** La disponibilité mesurée est au moins égale à 99,5 %.
  - **Preuve attendue :** Rapport mensuel de disponibilité permettant d'identifier la période observée, les indisponibilités prises en compte et les maintenances planifiées exclues.
  - **Référence :** PRD §24 — NFR-002.
  - **Seuil ou statut :** ≥ 99,5 % mensuel hors maintenance planifiée.

---

## 29. Critères de sortie fonctionnels

Les quatre critères globaux de sortie fonctionnels suivants doivent être validés par des tests d'intégration comportementaux pour autoriser le lancement du MVP :

### AC-069 (Fonctionnel) — Parcours critiques de bout en bout
- **Given** Un visiteur accédant au produit.
- **When** Il déroule successivement l'inscription, la connexion, l'onboarding, la configuration de favoris, la consultation d'un Match Center avec probabilités, et un parcours d'abonnement Premium.
- **Then** L'intégralité du flux s'exécute sans erreur fonctionnelle ni blocage de navigation.
- **Preuve attendue :** Rapport d'exécution des scénarios d'intégration sans échec.
- **Seuil ou statut :** Tous les parcours critiques nominaux validés.

### AC-070 (Qualité) — Absence de blocage critique
- **Given** Le catalogue complet des fonctionnalités MVP déployé.
- **When** Le système est soumis aux tests de validation.
- **Then** Aucun incident de niveau 1 (Critique) n'est ouvert sur les fonctionnalités d'accès, d'affichage ou de monétisation.
- **Preuve attendue :** Registre des incidents d'assurance qualité vierge de tout incident critique.
- **Seuil ou statut :** Zéro anomalie bloquante ouverte.

### AC-071 (UX) — Analyses compréhensibles
- **Given** Un panel d'utilisateurs pilotes connectés.
- **When** Ils évaluent les probabilités, niveaux de confiance, résumés et facteurs explicatifs du Match Center.
- **Then** Au moins 70 % des répondants déclarent que les informations fournies sont claires et ont amélioré leur compréhension du match. (Réf : [PRD §27](product-requirements-document.md#27-mesure-du-succès)).
- **Preuve attendue :** Synthèse des formulaires d'évaluation du pilote.
- **Seuil ou statut :** Taux de compréhension validé ≥ 70 %.

### AC-072 (Sécurité) — Sécurité, confidentialité et administration
- **Given** Un administrateur connecté et des utilisateurs actifs.
- **When** Il consulte les informations opérationnelles et exerce les actions administratives autorisées, notamment la gestion des rôles et la suspension des accès telles que définies dans FEAT-018.
- **Then** Les fonctions administratives minimales, les contrôles de sécurité, de confidentialité et les éléments de traçabilité requis sont vérifiés sans non-conformité critique ouverte.
- **Preuve attendue :** Rapport de validation du parcours administrateur et logs d'audit.
- **Seuil ou statut :** Seuil à valider.

---

## 30. Critères non fonctionnels (récapitulatif)

Les critères d'acceptation non fonctionnels suivants doivent être validés :

- **AC-063 (Performance) :** Largest Contentful Paint < 2,5 s. (Réf : [PRD §24 NFR-001](product-requirements-document.md#nfr-001--performance)).
- **AC-064 (Performance) :** Suggestions de recherche < 500 ms (p95). (Réf : [PRD §24 NFR-001](product-requirements-document.md#nfr-001--performance)).
- **AC-065 (UX) :** Pas de chevauchement de texte sur mobile web. (Réf : [Product Principles §12](../08-product-blueprint/02-product-principles.md)).
- **AC-066 (Données) :** Blocage de modification rétroactive des probabilités d'un match terminé. (Réf : [Business Rules §3](../08-product-blueprint/14-business-rules.md)).
- **AC-068 (Données) :** Horodatage de la dernière ingestion affiché sur chaque fiche. (Réf : [PRD §24 NFR-010](product-requirements-document.md#nfr-010--qualité-des-données)).
- **AC-073 (Opérationnel) :** Maintien des parcours essentiels lors d'un pic de charge représentatif — Seuil à valider. (Réf : [PRD §24 NFR-004](product-requirements-document.md#nfr-004--scalabilité)).
- **AC-074 (Opérationnel) :** Aucune régression sur les parcours non impactés après modification d'une règle documentée. (Réf : [PRD §24 NFR-005](product-requirements-document.md#nfr-005--maintenabilité)).
- **AC-075 (Opérationnel) :** Événements de diagnostic consultables avec contexte et horodatage — Seuil à valider. (Réf : [PRD §24 NFR-006](product-requirements-document.md#nfr-006--observabilité)).
- **AC-076 (Qualité) :** Disponibilité mensuelle du produit ≥ 99,5 % hors maintenance planifiée. (Réf : [PRD §24 NFR-002](product-requirements-document.md#nfr-002--disponibilité)).

---

## 31. Hypothèses

Les hypothèses opérationnelles suivantes ont été retenues pour l'évaluation de ces critères :

- **H-001 :** Les scénarios comportementaux (Given-When-Then) couvrent la totalité des exigences logiques requises pour le test pilote.
- **H-002 :** Les performances de calcul et d'affichage restent dans les limites des seuils définis (LCP < 2,5 s).

---

## 32. Questions ouvertes

Les questions ouvertes suivantes impactent la validation finale des critères d'acceptation et sont répertoriées dans [`docs/06-operations/open-questions.md`](../06-operations/open-questions.md) :

- **OQ-001 (Quotas Free) :** Le seuil numérique exact d'analyses autorisées déterminera la validation du blocage de quota de la fonctionnalité `FEAT-016` (actuellement : `Seuil à valider`).
- **OQ-002 (Tarifs Premium) :** La structure de facturation impactera l'affichage du parcours d'abonnement de la fonctionnalité `FEAT-016` (actuellement : `Règle à valider`).
- **OQ-003 (Fournisseurs de données) :** Définira la liste et le format exact des sources de données d'entrée affichées dans `FEAT-013`.
- **OQ-004 (Langues) :** Déterminera les traductions de l'onboarding pour `FEAT-004`.
- **OQ-005 (MFA) :** Déterminera si des validations d'accès supplémentaires sont requises à la connexion pour `FEAT-002`.
- **OQ-006 (Compétitions) :** Définira les ligues incluses pour la liste des matchs de `FEAT-006`.

---

## 33. Gouvernance

Toute modification de ce document ou de ses scénarios de validation comportementale doit être soumise à la gouvernance suivante :

1. **Proposition :** Détection et formulation d'une mise à jour nécessaire sur un critère d'acceptation.
2. **Revue :** Analyse de la cohérence avec le PRD et le catalogue par l'équipe produit.
3. **Approbation :** Approbation finale du Fondateur ABYSS avant mise à jour du document.

---

## 34. Matrices de couverture

### 34.1 Matrice Fonctionnalités vers AC

| ID Fonctionnalité | Exigence PRD | Récit US | Critères d'acceptation (AC) associés |
|:---|:---|:---|:---|
| `FEAT-001` | FR-001 | US-001 | `AC-001`, `AC-002`, `AC-003` |
| `FEAT-002` | FR-013, NFR-007 | US-002 | `AC-004`, `AC-005`, `AC-006` |
| `FEAT-003` | FR-017 | US-003 | `AC-007`, `AC-008`, `AC-009` |
| `FEAT-004` | FR-002, NFR-011 | US-004 | `AC-010`, `AC-011`, `AC-012` |
| `FEAT-005` | FR-003 | US-005 | `AC-013`, `AC-014`, `AC-015` |
| `FEAT-006` | FR-004 | US-006 | `AC-016`, `AC-017`, `AC-018` |
| `FEAT-007` | FR-009 | US-007 | `AC-019`, `AC-020`, `AC-021` |
| `FEAT-008` | FR-005, NFR-001 | US-008 | `AC-022`, `AC-023`, `AC-024` |
| `FEAT-009` | FR-006 | US-009 | `AC-025`, `AC-026`, `AC-027` |
| `FEAT-010` | FR-007, NFR-012 | US-010 | `AC-028`, `AC-029`, `AC-030` |
| `FEAT-011` | FR-010 | US-011 | `AC-031`, `AC-032`, `AC-033` |
| `FEAT-012` | FR-019 | US-012 | `AC-034`, `AC-035`, `AC-036` |
| `FEAT-013` | FR-011, NFR-010 | US-013 | `AC-037`, `AC-038`, `AC-039` |
| `FEAT-014` | FR-008 | US-014 | `AC-040`, `AC-041`, `AC-042` |
| `FEAT-015` | FR-012 | US-015 | `AC-043`, `AC-044`, `AC-045` |
| `FEAT-016` | FR-018, FR-021 | US-016 | `AC-046`, `AC-047`, `AC-048` |
| `FEAT-017` | FR-016 | US-017 | `AC-049`, `AC-050`, `AC-051` |
| `FEAT-018` | FR-022, NFR-006 | US-018 | `AC-052`, `AC-053`, `AC-054` |
| `FEAT-019` | FR-014 | US-019 | `AC-055`, `AC-056`, `AC-057` |
| `FEAT-020` | FR-015, FR-020 | US-020 | `AC-058`, `AC-059`, `AC-060` |

### 34.2 Matrice NFR vers AC

| NFR | Intitulé exact | AC associés | Type | Résultat ou seuil | Référence exacte |
|:---|:---|:---|:---|:---|:---|
| **NFR-001** | Performance | `AC-063`, `AC-064` | Performance | LCP < 2,5 s · Recherche p95 < 500 ms | PRD §24 · NFR-001 |
| **NFR-002** | Disponibilité | `AC-059`, `AC-076` | Fonctionnel / Qualité | Comportement dégradé compréhensible (`AC-059`) · Disponibilité ≥ 99,5 % mensuel hors maintenance planifiée (`AC-076`) | PRD §24 · NFR-002 |
| **NFR-003** | Fiabilité | `AC-008`, `AC-041` | Fonctionnel | Robustesse des écritures sans perte silencieuse | PRD §24 · NFR-003 |
| **NFR-004** | Scalabilité | `AC-073` | Opérationnel | Parcours essentiels maintenus lors d'un pic de charge — Seuil à valider | PRD §24 · NFR-004 |
| **NFR-005** | Maintenabilité | `AC-074` | Opérationnel | Aucune régression sur parcours non impactés après modification documentée | PRD §24 · NFR-005 |
| **NFR-006** | Observabilité | `AC-044`, `AC-054`, `AC-075` | Opérationnel | Événements consultables avec contexte et horodatage — Seuil à valider | PRD §24 · NFR-006 |
| **NFR-007** | Sécurité | `AC-006`, `AC-054`, `AC-061` | Sécurité | Révocabilité immédiate session · Journalisation audit | PRD §24 · NFR-007 |
| **NFR-008** | Confidentialité | `AC-062` | Sécurité | Suppression des données personnelles identifiables | PRD §24 · NFR-008 |
| **NFR-009** | Responsive et mobile | `AC-024`, `AC-065` | UX | Pas de chevauchement de texte · Actions tactiles fonctionnelles | PRD §24 · NFR-009 |
| **NFR-010** | Qualité des données | `AC-039`, `AC-068` | Données | Provenance et horodatage d'ingestion affiché | PRD §24 · NFR-010 |
| **NFR-011** | Internationalisation | `AC-007`, `AC-010` | Fonctionnel | Langue configurée appliquée globalement | PRD §24 · NFR-011 |
| **NFR-012** | Traçabilité des modèles | `AC-066` | Données | Historique probabilités immuable après fin de match | PRD §24 · NFR-012 |

---

## 35. Documents de référence

| Document | Rôle |
|:---|:---|
| [Product Requirements Document](product-requirements-document.md) | Source des exigences fonctionnelles (FR) et non fonctionnelles (NFR). |
| [User Personas](user-personas.md) | Définition des personas d'utilisateurs (`PER-001` à `PER-006`). |
| [User Stories](user-stories.md) | Récits utilisateurs servant de base aux critères comportementaux. |
| [Features](features.md) | Catalogue des fonctionnalités d'Athena (`FEAT-001` à `FEAT-026`). |
| [Prioritization](prioritization.md) | Priorisation et matrice des fonctionnalités. |
| [MVP Scope](mvp-scope.md) | Périmètre d'inclusion fonctionnelle du MVP. |
| [Blueprint — Screens](../08-product-blueprint/12-screens.md) | Définition des écrans et zones de l'application. |
| [Blueprint — Business Rules](../08-product-blueprint/14-business-rules.md) | Règles métier appliquées (probabilités, transitions de match). |

---

## 36. Historique des versions

| Version | Date | Auteur | Description |
|:---|:---|:---|:---|
| 1.0 | 2026-07-17 | Fondateur ABYSS + Antigravity | Rédaction initiale du document des critères d'acceptation fonctionnels, structuration Given-When-Then, niveaux de validation et matrice de couverture. |
| 1.1 | 2026-07-17 | Fondateur ABYSS + Antigravity | Ajout AC-076 (disponibilité NFR-002), correction AC-072 (formulation administrative précise), mise à jour matrices NFR et récapitulatif §31. |

---

> **Made in Abyss : Spark by the King**

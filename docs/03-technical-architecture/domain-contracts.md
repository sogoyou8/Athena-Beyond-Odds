# Conception détaillée — Contrats Conceptuels du Domaine

* **Statut :** Approuvé (DEC-004)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## 1. Principes généraux du domaine

Le domaine représente le cœur métier d'Athena. Il est normalisé et agnostique vis-à-vis des formats des fournisseurs (ADR-003).

* **Pas de préfixe "Athena"** : Les structures de données normalisées portent des noms métier purs (`Match`, `Team`, `Season`, `Competition`).
* **Immuabilité** : Les objets du domaine, une fois créés par les mappers d'infrastructure, ne doivent pas être altérés directement sans règles métiers explicites.
* **Validation stricte** : Aucun objet de domaine ne peut être instancié dans un état invalide ou incomplet (garanti par des constructeurs stricts ou des schémas de validation).

---

## 2. Entités de domaine (Spécification conceptuelle TypeScript)

Bien que l'écriture du code applicatif soit suspendue, voici les structures types des contrats de domaine sous forme de types ou d'interfaces conceptuels :

### A. Team (Équipe)

```typescript
export interface Team {
  /** Identifiant unique interne de l'équipe dans le système Athena */
  readonly id: string;
  /** Nom complet de l'équipe (ex: "Paris Saint-Germain") */
  readonly name: string;
  /** Nom court ou abrégé (ex: "PSG") */
  readonly shortName: string;
  /** Code de trois lettres (ex: "PSG") */
  readonly tla: string;
  /** URL du logo de l'équipe (si disponible) */
  readonly crestUrl: string | null;
  /** Métadonnées du fournisseur pour la traçabilité */
  readonly providerMetadata: ProviderMetadata;
}
```

### B. Competition (Compétition)

```typescript
export interface Competition {
  /** Identifiant unique de la compétition (ex: "FR-L1") */
  readonly id: string;
  /** Nom officiel (ex: "Ligue 1") */
  readonly name: string;
  /** Code de la compétition (ex: "FL1") */
  readonly code: string;
  /** Région ou pays (ex: "France") */
  readonly areaName: string;
  /** Saison en cours de traitement */
  readonly currentSeason: Season;
  /** Métadonnées du fournisseur */
  readonly providerMetadata: ProviderMetadata;
}
```

### C. Season (Saison)

```typescript
export interface Season {
  /** Identifiant unique de la saison */
  readonly id: string;
  /** Année de début (ex: 2026) */
  readonly startYear: number;
  /** Année de fin (ex: 2027) */
  readonly endYear: number;
  /** Journée de championnat courante (ex: 12) */
  readonly currentMatchday: number;
  /** Métadonnées du fournisseur */
  readonly providerMetadata: ProviderMetadata;
}
```

### D. Match (Match)

```typescript
export interface Match {
  /** Identifiant unique interne d'Athena */
  readonly id: string;
  /** ID de la compétition associée */
  readonly competitionId: string;
  /** Saison associée */
  readonly seasonId: string;
  /** Journée de championnat (ex: 14) */
  readonly matchday: number;
  /** Date et heure de début du match en UTC */
  readonly utcDate: Date;
  /** Statut actuel du match */
  readonly status: MatchStatus;
  /** Équipe à domicile */
  readonly homeTeam: Team;
  /** Équipe à l'extérieur */
  readonly awayTeam: Team;
  /** Score actuel ou final du match */
  readonly score: Score;
  /** Métadonnées du fournisseur */
  readonly providerMetadata: ProviderMetadata;
}
```

---

## 3. Objets de valeur et types associés

### A. MatchStatus (Statut du Match)

Représente l'état du match unifié à l'échelle de l'application :

```typescript
export type MatchStatus =
  | 'SCHEDULED'   // Match planifié, non démarré
  | 'LIVE'        // Match en cours (première mi-temps, mi-temps, seconde mi-temps)
  | 'FINISHED'    // Match terminé
  | 'POSTPONED'   // Match reporté
  | 'CANCELLED';  // Match annulé
```

### B. Score (Score du Match)

Structure de score unifiée prenant en compte les différentes étapes du jeu :

```typescript
export interface Score {
  /** Score à la mi-temps */
  readonly halfTime: {
    readonly home: number | null;
    readonly away: number | null;
  };
  /** Score final (ou en cours si LIVE) */
  readonly fullTime: {
    readonly home: number | null;
    readonly away: number | null;
  };
  /** Score après prolongations (si applicable) */
  readonly extraTime?: {
    readonly home: number | null;
    readonly away: number | null;
  };
  /** Score après tirs au but (si applicable) */
  readonly penalties?: {
    readonly home: number | null;
    readonly away: number | null;
  };
}
```

### C. ProviderMetadata (Métadonnées du Fournisseur)

Indispensable pour maintenir le lien avec le fournisseur brut sans coupler les champs métiers :

```typescript
export interface ProviderMetadata {
  /** Nom du fournisseur (ex: "football-data.org") */
  readonly providerName: string;
  /** Identifiant brut chez ce fournisseur (ex: "4532") */
  readonly externalId: string;
  /** Date de dernière mise à jour récupérée */
  readonly lastUpdated: Date;
}
```

---

> **Made in Abyss : Spark by the King**

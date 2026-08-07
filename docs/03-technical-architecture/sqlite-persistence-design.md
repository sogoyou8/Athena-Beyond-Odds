# Conception détaillée — Principes de persistance SQLite

* **Statut :** Approuvé (DEC-004)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`
* **Référence de décision :** ADR-006 (SQLite locale, minimale et désactivable)

---

## 1. Rôle de la couche de persistance

Le stockage local permet d'éviter de solliciter l'API football-data.org pour des données immuables déjà ingérées (ex: résultats de matchs terminés).

* **Pas de persistance de données brutes** : Seules les entités normalisées d'Athena (les instances validées de `Match`, `Team`, `Season`, `Competition`) sont enregistrées. Les payloads JSON bruts des APIs externes ne sont pas conservés.
* **Conservation minimale** : Le stockage est conçu comme un cache persistant local léger (pas de conservation longue durée non contrôlée).

---

## 2. Structure relationnelle conceptuelle (Schéma SQL)

Bien qu'aucun fichier SQL ou migration ne soit créé à ce stade, voici le schéma de table minimal prévu pour SQLite :

```sql
-- Table des équipes
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    tla TEXT NOT NULL,
    crest_url TEXT,
    provider_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    last_updated DATETIME NOT NULL
);

-- Table des compétitions
CREATE TABLE IF NOT EXISTS competitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    area_name TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    last_updated DATETIME NOT NULL
);

-- Table des matchs
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    competition_id TEXT NOT NULL,
    season_id TEXT NOT NULL,
    matchday INTEGER NOT NULL,
    utc_date DATETIME NOT NULL,
    status TEXT NOT NULL,
    home_team_id TEXT NOT NULL,
    away_team_id TEXT NOT NULL,
    half_time_home INTEGER,
    half_time_away INTEGER,
    full_time_home INTEGER,
    full_time_away INTEGER,
    provider_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    last_updated DATETIME NOT NULL,
    FOREIGN KEY(competition_id) REFERENCES competitions(id),
    FOREIGN KEY(home_team_id) REFERENCES teams(id),
    FOREIGN KEY(away_team_id) REFERENCES teams(id)
);
```

---

## 3. Rendre la persistance désactivable et substituable

Conformément aux contraintes du Fondateur (DEC-004), la persistance SQLite doit pouvoir être totalement contournée ou désactivée à tout moment.

### A. Le Port `MatchRepository`

La couche Application interagit uniquement avec l'interface `MatchRepository` sans savoir si une base SQLite est active sous le capot :

```typescript
import { Match } from '../../../domain/Match';

export interface MatchRepository {
  save(match: Match): Promise<void>;
  saveBulk(matches: Match[]): Promise<void>;
  findById(id: string): Promise<Match | null>;
  findByCompetition(competitionId: string): Promise<Match[]>;
}
```

### B. Double implémentation d'infrastructure

Deux adaptateurs du port `MatchRepository` coexisteront :
1. **`SQLiteMatchRepository`** : Écrit et lit dans le fichier SQLite local (`athena.db`) à l'aide de requêtes préparées (via `better-sqlite3` ou `@libsql/client`).
2. **`InMemoryMatchRepository`** : Utilise une structure de données JavaScript (`Map<string, Match>`) en mémoire vive pour simuler le stockage. Utile en développement déconnecté ou si l'utilisateur souhaite désactiver l'écriture disque.

### C. Pilotage par configuration

L'activation du stockage sur disque ou en mémoire est pilotée par la variable d'environnement `PERSISTENCE_MODE` dans `.env.local` :

```typescript
// Exemple conceptuel de résolution
export class MatchRepositoryFactory {
  static create(): MatchRepository {
    const mode = process.env.PERSISTENCE_MODE || 'sqlite';
    if (mode === 'sqlite') {
      return new SQLiteMatchRepository();
    }
    return new InMemoryMatchRepository(); // Désactivation de SQLite
  }
}
```

---

> **Made in Abyss : Spark by the King**

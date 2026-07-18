# Conception détaillée — Principes du cache mémoire local

* **Statut :** Approuvé (DEC-004)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`
* **Référence de décision :** ADR-007 (Cache mémoire local dans le processus)

---

## 1. Objectifs du Cache

Pour respecter le quota très restrictif de l'API de football-data.org (10 requêtes par minute maximum), un cache mémoire local (in-process) est positionné directement derrière l'adaptateur de données dans la couche d'infrastructure.

* **Aucune donnée brute conservée** : Seuls les objets normalisés du domaine (`Match`, `Team`, `Season`, `Competition`) sont stockés dans le cache.
* **Durée de vie courte** : Le cache n'est pas conçu pour une rétention longue. Il sert uniquement à amortir les requêtes répétées sur des intervalles courts.
* **Désactivable** : Un commutateur de configuration permet d'exécuter l'application sans cache pour les tests unitaires et d'intégration.

---

## 2. Stratégie de cycle de vie et TTL (Time-To-Live)

La durée de conservation des données en cache est différenciée selon la volatilité intrinsèque de l'état du match :

### A. Données Historiques et Statiques (TTL Long)
* **Matchs terminés (`status = 'FINISHED'`)** : Les scores ne changeront plus. Le cache peut expirer après **1 heure** (ou 24 heures en base de données persistante).
* **Données de structure (`Team`, `Competition`, `Season`)** : Très peu volatiles au cours d'une journée. TTL de **12 heures**.

### B. Données en cours de jeu (TTL Court)
* **Matchs en direct (`status = 'LIVE'`)** : Les scores et événements peuvent évoluer rapidement. Pour préserver la fraîcheur tout en évitant les surcoûts d'API, le TTL est fixé à **60 secondes**.
* **Matchs planifiés imminents (moins de 2 heures avant le coup d'envoi)** : Changements d'horaire ou reports possibles de dernière minute. TTL de **5 minutes**.

---

## 3. Implémentation technique conceptuelle

Le cache sera encapsulé dans un décorateur d'infrastructure qui implémente l'interface `SportsDataProvider` :

```typescript
import { SportsDataProvider } from './SportsDataProvider';
import { Match } from '../../../domain/Match';

export class CachedSportsDataProvider implements SportsDataProvider {
  // Stockage local en mémoire vive (Map avec timestamp d'expiration)
  private cache = new Map<string, { value: any; expiresAt: number }>();

  constructor(
    private readonly next: SportsDataProvider,
    private readonly isEnabled: boolean = true
  ) {}

  async getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]> {
    if (!this.isEnabled) {
      return this.next.getMatches(competitionCode, fromDate, toDate);
    }

    const cacheKey = `matches:${competitionCode}:${fromDate?.toISOString()}:${toDate?.toISOString()}`;
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    // Récupération depuis l'adaptateur sous-jacent (ex: FootballDataOrgAdapter)
    const matches = await this.next.getMatches(competitionCode, fromDate, toDate);

    // Détermination dynamique du TTL selon les statuts des matchs
    const hasLiveMatch = matches.some(m => m.status === 'LIVE');
    const ttlSeconds = hasLiveMatch ? 60 : 300; // 1 min si live, 5 min sinon

    this.cache.set(cacheKey, {
      value: matches,
      expiresAt: Date.now() + ttlSeconds * 1000
    });

    return matches;
  }

  async getCompetitions(): Promise<any> { /* ... */ }
  async getMatchDetails(externalMatchId: string): Promise<any> { /* ... */ }
}
```

---

## 4. Configuration et Débrayage

Le cache peut être configuré et désactivé via le fichier `.env.local` :

```bash
# Activation/Désactivation du cache mémoire local (true/false)
CACHE_ENABLED=true
```

En cas de désactivation (`CACHE_ENABLED=false`), la fabrique d'infrastructure instanciera directement l'adaptateur de données sans l'envelopper dans le décorateur de cache.

---

> **Made in Abyss : Spark by the King**

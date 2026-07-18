# Conception détaillée — Contrat d'Abstraction du Fournisseur Sportif

* **Statut :** Approuvé (DEC-004)
* **Date :** 2026-07-18
* **Auteur :** Antigravity
* **Branche :** `architecture/phase-2-technical-design`

---

## 1. Description du Port `SportsDataProvider`

Le port `SportsDataProvider` est une interface d'infrastructure secondaire définie dans la couche Application du module d'ingestion. Elle isole complètement la logique métier (Match Center et calculs probabilistes) des spécificités des APIs externes (football-data.org, Sportmonks).

Le nom exact de ce contrat est : **`SportsDataProvider`**

---

## 2. Définition de l'interface conceptuelle

L'interface expose des méthodes asynchrones basées exclusivement sur les entités normalisées du Domaine (`Match`, `Competition`, etc.), garantissant qu'aucun format propriétaire de fournisseur ne traverse la frontière du port.

```typescript
import { Match } from '../../../domain/Match';
import { Competition } from '../../../domain/Competition';

export interface SportsDataProvider {
  /**
   * Récupère la liste des compétitions disponibles auprès du fournisseur actif.
   * Doit filtrer et lever des erreurs spécifiques en cas de non-autorisation.
   */
  getCompetitions(): Promise<Competition[]>;

  /**
   * Récupère les matchs planifiés, en cours ou terminés pour une compétition donnée
   * sur une plage temporelle optionnelle.
   *
   * @param competitionCode Le code normalisé de la compétition (ex: "FL1" pour Ligue 1)
   * @param fromDate Date de début de plage (optionnel)
   * @param toDate Date de fin de plage (optionnel)
   */
  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]>;

  /**
   * Récupère les détails en temps réel d'un match spécifique (statistiques comprises).
   *
   * @param externalMatchId L'identifiant externe du match chez le fournisseur actif
   */
  getMatchDetails(externalMatchId: string): Promise<Match>;
}
```

---

## 3. Gestion des Erreurs et Garde-fous

Les adaptateurs concrétisant ce port doivent obligatoirement intercepter les exceptions réseau ou HTTP spécifiques au fournisseur et les encapsuler dans des classes d'erreurs normalisées d'Athena (définies dans `src/shared/errors/`).

### Erreurs typées du Port :

1. **`ProviderRateLimitError`** : Levée lorsque l'API externe renvoie un code HTTP 429 (Trop de requêtes). Permet au cache (ADR-007) ou au planificateur de suspendre temporairement les appels.
2. **`ProviderQuotaExceededError`** : Levée lorsque les limites du plan gratuit (0 €) sont atteintes.
3. **`ProviderAuthError`** : Levée en cas de clé API expirée ou invalide.
4. **`ProviderUnavailableError`** : Levée en cas d'erreur 5xx de l'API distante.
5. **`ProviderDataMappingError`** : Levée si le payload reçu du fournisseur ne correspond pas à la structure attendue ou viole les contraintes de normalisation du Domaine (ADR-003).

---

## 4. Fabrique d'Adaptateurs (SportsDataProviderFactory)

Pour découpler l'instanciation des adaptateurs, une fabrique sera implémentée dans la couche d'infrastructure. Elle choisira l'implémentation en fonction de la variable d'environnement `SPORTS_DATA_PROVIDER` définie dans `.env.local` :

```typescript
// Exemple conceptuel de résolution
export class SportsDataProviderFactory {
  static create(providerName: string): SportsDataProvider {
    switch (providerName.toLowerCase()) {
      case 'footballdataorg':
        return new FootballDataOrgAdapter();
      case 'mock':
        return new InMemorySportsDataProvider();
      default:
        throw new Error(`Fournisseur de données non supporté : ${providerName}`);
    }
  }
}
```

---

> **Made in Abyss : Spark by the King**

# Phase 3.1 — Autorisation détaillée de la première tranche frontend

* **Date :** 2026-08-07
* **Responsable :** Fondateur ABYSS
* **Statut :** Approuvée par le Fondateur — en attente de fusion de la PR #18
* **Décision de référence :** `DEC-015` dans `docs/06-operations/decision-log.md`
* **Commit de référence :** `2069e9a4acb4f5a32e888172f8450227d7e95712`
* **Branche d'autorisation :** `architecture/phase-3-1-dec-015-authorization`

---

## Condition préalable absolue

**Aucun code d'implémentation n'est autorisé avant la réunion de l'intégralité des conditions suivantes :**

1. Audit de conformité de la PR #18 concluant.
2. Validation explicite du Fondateur ABYSS.
3. Fusion de la PR #18 par merge commit (méthode : Create a merge commit) dans `architecture/phase-2-technical-design`.
4. Audit post-fusion de la PR #18 concluant.

La non-satisfaction d'une seule de ces quatre conditions bloque intégralement la tranche de code.

---

## 1. Périmètre fonctionnel autorisé

La première tranche d'implémentation frontend couvre **une seule vue principale, en lecture seule**, exposant les données de la compétition `FL1` (Ligue 1) issues des deux seuls endpoints disponibles du backend Phase 2 :

```text
GET /health
GET /competitions/FL1/matches
```

### Contraintes fonctionnelles strictes

| Contrainte | Valeur |
|---|---|
| Compétition | `FL1` uniquement |
| Mode | Lecture seule absolue |
| Vues | 1 seule vue principale |
| Hébergement | Same-Origin via `express.static` |
| Polling automatique | Interdit |
| Retry automatique | Interdit |
| Persistance de session | Interdite (`localStorage`, cookie, serveur) |

---

## 2. Périmètre des fichiers autorisés (15 fichiers maximum)

### 2.1 — Fichiers nouveaux autorisés à la création (11 fichiers)

Seuls les 11 fichiers suivants sont autorisés à la création dans le dépôt Git :

| # | Fichier | Responsabilité |
|---|---|---|
| 1 | `src/frontend/public/index.html` | Squelette HTML5 sémantique |
| 2 | `src/frontend/styles/main.css` | Styles CSS natifs et variables tokens |
| 3 | `src/frontend/ts/main.ts` | Point d'entrée TypeScript client |
| 4 | `src/frontend/ts/api-client.ts` | Client Fetch Same-Origin `/health` et `/competitions/FL1/matches` |
| 5 | `src/frontend/ts/render.ts` | Fonctions de rendu DOM textuel sécurisé via `textContent` |
| 6 | `tsconfig.client.json` | Configuration TypeScript client dédiée |
| 7 | `scripts/copy-assets.js` | Script Node.js natif de nettoyage et de copie des assets |
| 8 | `tests/frontend/api-client.test.ts` | Tests unitaires du client Fetch avec mocks |
| 9 | `tests/frontend/render.test.ts` | Tests unitaires DOM de `render.ts` avec `@vitest-environment happy-dom` |
| 10 | `tests/frontend/main.test.ts` | Tests d'orchestration client avec `@vitest-environment happy-dom` |
| 11 | `tests/integration/static-serving.test.ts` | Tests d'intégration Express du service statique via Supertest et fixture temporaire |

### 2.2 — Fichiers existants autorisés à la modification (4 fichiers)

Seuls les 4 fichiers existants suivants sont autorisés à la modification :

| # | Fichier | Modification autorisée |
|---|---|---|
| 1 | `src/app.ts` | Ajout de `CreateAppOptions` et montage de `express.static(publicPath)` après les routeurs API |
| 2 | `tsconfig.json` | Ajout de `"src/frontend/**/*"` dans le tableau `exclude` du backend |
| 3 | `package.json` | Ajout des scripts de build client et de `"happy-dom": "16.0.0"` dans `devDependencies` |
| 4 | `package-lock.json` | Mise à jour automatique suite à `npm install --save-dev --save-exact happy-dom@16.0.0` |

> Aucun autre fichier existant ne peut être modifié. Aucun autre fichier nouveau ne peut être créé.

---

## 3. Dépendance de développement autorisée

La seule nouvelle dépendance npm autorisée dans le projet est :

```text
Package       : happy-dom
Clef          : devDependencies uniquement
Version exacte: 16.0.0
```

**Commande exacte et unique autorisée :**

```bash
npm install --save-dev --save-exact happy-dom@16.0.0
```

**Restrictions :**

- Utilisation exclusive sous la directive `// @vitest-environment happy-dom` dans les fichiers de test client.
- Aucun import de `happy-dom` n'est autorisé sous `src/`.
- Aucune autre dépendance (production ou développement) n'est autorisée.

---

## 4. Configuration TypeScript client (`tsconfig.client.json`)

La configuration client dédiée devra spécifier exactement les champs suivants :

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "lib": ["DOM", "ES2022"],
    "types": [],
    "rootDir": "./src/frontend/ts",
    "outDir": "./dist/public/js",
    "strict": true,
    "noEmitOnError": true,
    "declaration": false,
    "sourceMap": false
  },
  "include": ["src/frontend/ts/**/*"]
}
```

**Règle d'import obligatoire :** Toutes les importations relatives inter-modules dans `src/frontend/ts/` utiliseront l'extension `.js` :

```typescript
import { fetchScheduledMatches } from './api-client.js';
```

**Séparation backend/frontend :** Le `tsconfig.json` backend existant devra exclure explicitement `src/frontend/**/*` de sa compilation.

---

## 5. Séquence de build autorisée

Les scripts npm suivants sont approuvés pour intégration dans `package.json` :

```json
{
  "build:clean":  "node scripts/copy-assets.js clean",
  "build:server": "tsc",
  "build:client": "tsc -p tsconfig.client.json",
  "build:assets": "node scripts/copy-assets.js copy",
  "build":        "npm run build:clean && npm run build:server && npm run build:client && npm run build:assets"
}
```

### Règle CWD-indépendant obligatoire

Le script `scripts/copy-assets.js` doit utiliser **exclusivement** les modules Node.js natifs (`node:fs`, `node:path`, `node:url`) et déduire la racine du projet à partir d'`import.meta.url` :

```javascript
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
```

Aucun appel à `process.cwd()` n'est autorisé pour la résolution de chemin dans ce script.

---

## 6. Service statique Express et ordre des middlewares

### 6.1 — Extension de `createApp` (100% rétrocompatible)

```typescript
export interface CreateAppOptions {
  publicPath?: string;
}

export function createApp(
  customProvider?: SportsDataProvider,
  options: CreateAppOptions = {}
): Express
```

### 6.2 — Ordre structurel imposé des middlewares

L'ordre suivant est **strictement imposé** et constitue une garantie structurelle de priorité des routes API sur le service statique :

```text
1. app.use(express.json())
2. app.use('/', createHealthRouter())
3. app.use('/', createMatchesRouter(provider))
4. app.use(express.static(publicPath))
```

`express.static` est **toujours monté en dernier**, après l'intégralité des routeurs API.

### 6.3 — Résolution de `publicPath` par défaut

La résolution par défaut de `publicPath` doit utiliser `fileURLToPath(import.meta.url)` pour remonter à la racine du dépôt et cibler `<repo>/dist/public`, **indépendamment du répertoire de travail** (`process.cwd()`) :

```typescript
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaultPublicPath = resolve(__dirname, '..', 'public');
```

---

## 7. Stratégie des tests autorisés (4 fichiers de tests)

### 7.1 — Tests unitaires frontend (`tests/frontend/`)

| Fichier | Environnement | Contenu autorisé |
|---|---|---|
| `api-client.test.ts` | Node (défaut Vitest) | Tests de `api-client.ts` avec mocks `fetch` |
| `render.test.ts` | `happy-dom` | Tests de rendu DOM de `render.ts` via `textContent` |
| `main.test.ts` | `happy-dom` | Tests d'orchestration de `main.ts` |

La directive d'activation de l'environnement DOM est :

```typescript
// @vitest-environment happy-dom
```

### 7.2 — Tests d'intégration statique (`tests/integration/static-serving.test.ts`)

Le test d'intégration doit respecter les règles suivantes :

- Utilisation de répertoires temporaires isolés créés par `fs.mkdtempSync`.
- Injection via `createApp(undefined, { publicPath: tempDir })`.
- Vérification via `supertest` (déjà présent comme dépendance).
- **Aucune dépendance à un build préalable résiduel.**
- **Aucun lancement de sous-processus `execSync`** pour produire un build.

---

## 8. Règles de sécurité et de rendu

| Règle | Détail |
|---|---|
| Rendu DOM | Exclusivement via `textContent`. `innerHTML` non nettoyé interdit |
| Secrets | Aucune clé API, token ou secret dans le code client |
| Requêtes réseau | URLs relatives uniquement (`/health`, `/competitions/FL1/matches`) |
| Requêtes directes | Aucun appel direct vers `football-data.org` depuis le navigateur |
| Données personnelles | Aucune collecte, aucun tracking, aucun cookie |

---

## 9. Politique CSS — Apparence provisoire uniquement

L'apparence de la première tranche est **provisoire et neutre** :

- Le CSS natif s'adapte à `prefers-color-scheme` (clair/sombre) avec bascule manuelle en session uniquement.
- Le CSS utilise exclusivement des **variables tokens neutres techniques provisoires** (ex : `--color-surface-base`, `--font-family-base`).

**Sont strictement interdits lors de la première tranche :**

- Toute palette hexadécimale de marque Athena finale.
- Toute typographie commerciale dédiée.
- Tout logo officiel ou icône propriétaire.

---

## 10. Questions ouvertes — Inchangées (OQ-001 à OQ-006)

La réalisation de la première tranche frontend ne résout, ne tranche, ni ne documente aucune des questions ouvertes suivantes :

| ID | Objet |
|---|---|
| `OQ-001` | Stratégie de persistance (SQLite, autre) |
| `OQ-002` | Authentification et gestion des utilisateurs |
| `OQ-003` | Modèle commercial et monétisation |
| `OQ-004` | Palette de marque et charte graphique officielle |
| `OQ-005` | Stratégie de déploiement en production |
| `OQ-006` | Sélection du fournisseur de données définitif |

---

## 11. Interdictions strictes de la première tranche

Sont **strictement interdits** lors de la réalisation :

```text
Tout framework JS (React, Vue, Svelte, Angular, Next.js)
Toute bibliothèque UI (Tailwind, Bootstrap, Material UI)
Tout routeur client ou gestionnaire d'état global
Tout bundler supplémentaire (Vite, Webpack, Rollup, Parcel)
Tout moteur de templates serveur additionnel
Tout appel réseau direct vers football-data.org depuis le navigateur
Toute exposition de clé API ou secret dans le code client
Tout polling automatique ou retry automatique
Toute modification des contrats d'API backend existants
Toute résolution arbitraire des questions ouvertes OQ-001 à OQ-006
Tout import de happy-dom sous src/
Tout usage de process.cwd() pour la résolution de chemin dans copy-assets.js
Tout innerHTML non nettoyé dans les fonctions de rendu
Tout fichier au-delà des 15 fichiers listés en section 2
```

---

## 12. Critères de réception de la tranche

À l'issue de l'implémentation, la Pull Request de code devra satisfaire **l'intégralité** des critères suivants :

1. **Tests :** La totalité des 146 tests backend existants réussit sans modification ni désactivation.
2. **Nouveaux tests :** Les tests frontend unitaires et d'intégration statique réussissent tous.
3. **TypeScript backend :** `npm run typecheck` exit 0 (aucune erreur de compilation backend).
4. **TypeScript client :** `tsc -p tsconfig.client.json` exit 0 (aucune erreur de compilation client).
5. **Build complet :** `npm run build` exit 0.
6. **Périmètre de fichiers :** Exactement 11 fichiers créés + 4 modifiés (15 au total).
7. **Sécurité :** Aucun secret, aucun `innerHTML`, aucun appel direct à `football-data.org`.
8. **`git status --short` :** Propre (0 ligne) hors branch.

---

```text
AUTORISATION DOCUMENTAIRE PREMIÈRE TRANCHE FRONTEND PHASE 3.1 FORMALISÉE — CODE AUTORISABLE UNIQUEMENT APRÈS FUSION ET AUDIT DE DEC-015
```

---

> Made in Abyss : Spark by the King

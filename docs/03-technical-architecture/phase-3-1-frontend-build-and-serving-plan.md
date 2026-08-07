# Phase 3.1 — Stratégie de build frontend et service same-origin Express

* **Date :** 2026-08-07
* **Responsable :** Fondateur ABYSS
* **Statut :** Cadrage proposé pour validation
* **Référence :** `88184110dbff27d695728900c0c2635bd8c7d956`

---

## 1. Contraintes et objectifs de build

La stratégie de build et de service des ressources frontend s'inscrit dans les contraintes suivantes :

```text
Aucun framework frontend (React, Vue, Svelte, Angular)
Aucun bundler frontend supplémentaire (Webpack, Rollup, Parcel, Vite)
Aucun moteur de templates serveur supplémentaire (EJS, Pug, Handlebars)
Aucune bibliothèque UI (Tailwind, Bootstrap, Material UI)
0 nouvelle dépendance npm obligatoire
```

L'objectif est d'utiliser l'outillage TypeScript et Node.js déjà installé dans le projet pour compiler le code client et servir les fichiers statiques.

---

## 2. Analyse de la configuration actuelle du dépôt

L'inspection réelle des fichiers du dépôt établit la configuration suivante :

- **TypeScript :** `typescript ^5.7.2` installé.
- **Compiler Options (`tsconfig.json`) :**
  - `target: "ES2022"`
  - `module: "NodeNext"`
  - `rootDir: "./src"`
  - `outDir: "./dist"`
- **Dépendances de production :** `express ^4.21.2`.
- **Scripts npm actuels :**
  - `"build": "tsc"`
  - `"start": "node dist/server.js"`
  - `"typecheck": "tsc --noEmit"`
  - `"test": "vitest run"`

---

## 3. Stratégie de compilation TypeScript client

### Problématique de compilation
Le fichier `tsconfig.json` actuel cible Node.js (`module: "NodeNext"`, `outDir: "./dist"`). Il compile le backend depuis `./src` vers `./dist`. Pour compiler un script client TypeScript devant s'exécuter dans le navigateur sans ajouter de bundler, deux options sont analysées :

### Option A — Configuration TypeScript client séparée (`tsconfig.client.json`)
Créer un fichier de configuration dédié `tsconfig.client.json` qui réutilise le binaire `tsc` déjà installé :
- **rootDir :** `./src/frontend/ts`
- **outDir :** `./dist/public/js`
- **target :** `ES2022` ou `ES2020`
- **module :** `ESNext` ou `preserve`
- **lib :** `["DOM", "ES2022"]`

### Recommandation documentaire
La stratégie recommandée est **l'Option A (`tsconfig.client.json`)**, car elle permet d'inclure les types `DOM` pour le code client sans polluer la vérification de type du backend Node.js.

```text
Commande de build client recommandée (future) :
npx tsc -p tsconfig.client.json
```

> **Note :** Aucun fichier `tsconfig.client.json` n'est créé pendant cette mission documentaire.

---

## 4. Stratégie de gestion des fichiers HTML et CSS

Le compilateur TypeScript (`tsc`) ne copie pas les fichiers non-TypeScript (HTML, CSS). Une stratégie sans dépendance npm externe est nécessaire pour acheminer `index.html` et `main.css` vers `dist/public/`.

### Solution recommandée : Script Node.js natif (`scripts/copy-assets.js`)
Un script Node.js minimal utilisant le module natif `node:fs` (fonction `fs.cpSync` ou `fs.copyFileSync`) est recommandé.

Exemple conceptuel du script futur :

```javascript
// scripts/copy-assets.js (CONCONCEPTUEL — NON CRÉÉ)
import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve('src/frontend/public');
const stylesSrc = path.resolve('src/frontend/styles');
const distPublic = path.resolve('dist/public');

fs.mkdirSync(distPublic, { recursive: true });
fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(distPublic, 'index.html'));
fs.copyFileSync(path.join(stylesSrc, 'main.css'), path.join(distPublic, 'main.css'));
```

### Avantage principal
- **0 nouvelle dépendance npm** (n'utilise ni `copyfiles`, ni `shx`, ni de commandes shell non portables comme `cp -r`).

---

## 5. Stratégie de service Same-Origin avec Express

### Emplacement de la modification Express future
Dans `src/app.ts`, la fonction `createApp()` sera modifiée pour intégrer le middleware statique Express :

```typescript
// Modification future proposée pour src/app.ts (CONCEPTUELLE — NON IMPLÉMENTÉE)
import path from 'node:path';
import express, { Express } from 'express';

export function createApp(customProvider?: SportsDataProvider): Express {
  const app = express();
  app.use(express.json());

  // Service des assets statiques du frontend
  const publicPath = path.resolve(process.cwd(), 'dist/public');
  app.use(express.static(publicPath));

  const provider = customProvider ?? resolveSportsDataProvider();

  app.use('/', createHealthRouter());
  app.use('/', createMatchesRouter(provider));

  return app;
}
```

### Ordre des middlewares
1. `express.json()` — Décodage JSON.
2. `express.static('dist/public')` — Service des fichiers statiques (`index.html`, `main.css`, `js/main.js`).
3. `createHealthRouter()` — Endpoint `GET /health`.
4. `createMatchesRouter()` — Endpoint `GET /competitions/:code/matches`.

### Comportement 404
Si une ressource statique ou une route API n'existe pas, Express retourne son comportement 404 standard. Les contrats des endpoints existants restent 100% identiques.

---

## 6. URLs navigateur et requêtes same-origin

Le client navigateur s'exécute sur l'origine unique du serveur Express (ex: `http://localhost:3000`).

- Accès à l'application : `GET /` (sert `dist/public/index.html`).
- Fichier de styles : `GET /main.css` (sert `dist/public/main.css`).
- Script client : `GET /js/main.js` (sert `dist/public/js/main.js`).
- Requête Santé : `GET /health` (URL relative, sans hostname/port en dur).
- Requête Matchs : `GET /competitions/FL1/matches` (URL relative).

---

## 7. Workflow de développement et scripts npm futurs proposables

Pour une future autorisation d'implémentation, l'enchaînement des scripts dans `package.json` sera le suivant :

```json
{
  "scripts": {
    "build:server": "tsc",
    "build:client": "tsc -p tsconfig.client.json",
    "copy:assets": "node scripts/copy-assets.js",
    "build": "tsc && tsc -p tsconfig.client.json && node scripts/copy-assets.js",
    "start": "node dist/server.js"
  }
}
```

Ce workflow garantit un build 100% reproductible sans aucune nouvelle dépendance npm.

---

## 8. Bilan des dépendances

```text
Nouvelles dépendances npm de production (runtime) : 0
Nouvelles dépendances npm de développement (devDependencies) : à arbitrer
```

### Runtime et build

Toutes les opérations de build, compilation client et service statique sont réalisées avec la pile existante (`typescript ^5.7.2`, `express ^4.21.2`, `node.js` natif). **0 nouvelle dépendance npm de production.**

### Tests DOM — Arbitrage futur requis

Les tests d'intégration Express pour le service des assets statiques sont réalisables sans dépendance supplémentaire (`supertest ^7.2.2` est déjà présent).

En revanche, les tests DOM automatisés du code client TypeScript nécessiteront un environnement DOM simulé. L'environnement Vitest actuel est configuré exclusivement en `environment: 'node'`. Les librairies DOM (`jsdom`, `happy-dom`, `@vitest/browser`) sont **absentes** du projet.

L'ajout d'une `devDependency` de test DOM (ex: `jsdom` ou `happy-dom`) devra faire l'objet d'un **arbitrage explicite du Fondateur** lors de la prochaine autorisation d'implémentation. Aucune dépendance n'est installée par la présente mission documentaire.

---

```text
BUILD ET SERVICE FRONTEND PHASE 3.1 CADRÉS — SAME-ORIGIN EXPRESS PRIVILÉGIÉ, IMPLÉMENTATION ENCORE INTERDITE
```

---

> Made in Abyss : Spark by the King

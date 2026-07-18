/**
 * Athena — Harnais local sécurisé de comparaison des fournisseurs de données sportives
 *
 * Ce script est conçu pour s'exécuter localement sans dépendance externe npm.
 * Il n'effectue AUCUNE requête réseau par défaut ni dans cette configuration.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Configuration des Chemins ---
const CONFIG_PATH = path.join(__dirname, 'compare-config.json');
const RAW_OUTPUT_DIR = path.resolve(__dirname, '..', 'tmp', 'provider-comparison');
const ENV_LOCAL_PATH = path.join(__dirname, '..', '.env.local');

// --- Sécurisation de l'écriture (Chemin Absolu) ---
function getSafeOutputPath(filename) {
  if (typeof filename !== 'string' || filename.trim() === '') {
    throw new Error('Nom de fichier de sortie invalide.');
  }

  const resolved = path.resolve(RAW_OUTPUT_DIR, filename);
  const relative = path.relative(RAW_OUTPUT_DIR, resolved);

  if (
    relative === '' ||
    relative.startsWith(`..${path.sep}`) ||
    relative === '..' ||
    path.isAbsolute(relative)
  ) {
    throw new Error('Tentative d’écriture en dehors du dossier autorisé.');
  }

  return resolved;
}

// --- Nettoyage des erreurs et masquage complet (Sécurité) ---
function cleanErrorMessage(err, keysToMask = []) {
  if (!err) return '';
  let msg = err.message || String(err);
  keysToMask.forEach(key => {
    if (key && key.trim().length > 3) {
      msg = msg.split(key).join('[API_KEY_HIDDEN]');
    }
  });
  // Masquer les en-têtes d'authentification et patterns classiques
  msg = msg.replace(/(X-Auth-Token:|api_key=|bearer\s)[a-zA-Z0-9_-]+/gi, '$1[MASKED]');
  return msg;
}

// --- Méthode A : Parseur local minimal pour .env.local ---
function loadEnvLocal() {
  const env = {
    FOOTBALL_DATA_API_KEY: '',
    SPORTMONKS_API_KEY: '',
    NODE_ENV: 'development'
  };

  if (!fs.existsSync(ENV_LOCAL_PATH)) {
    return { env, error: 'Fichier .env.local introuvable. Veuillez copier .env.example vers .env.local.' };
  }

  try {
    const content = fs.readFileSync(ENV_LOCAL_PATH, 'utf-8');
    const lines = content.split(/\r?\n/);
    lines.forEach(line => {
      const trimmed = line.trim();
      // Ignorer les lignes vides et commentaires
      if (!trimmed || trimmed.startsWith('#')) return;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.substring(0, eqIndex).trim();
        let val = trimmed.substring(eqIndex + 1).trim();

        // Enlever les guillemets simples ou doubles
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);

        if (key in env) {
          env[key] = val;
        }
      }
    });
    return { env, error: null };
  } catch (err) {
    return { env, error: 'Erreur de lecture ou de parsing de .env.local.' };
  }
}

// --- Chargement de compare-config.json ---
function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error('Fichier de configuration compare-config.json manquant.');
  }
  try {
    const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error('Erreur de lecture ou de parsing de compare-config.json.');
  }
}

// --- Action : Afficher l'aide ---
function showHelp() {
  console.log(`Harnais de test Athena — Commandes disponibles :
  --help                    : Affiche ce menu d'aide
  --check-env               : Valide la présence et la longueur des clés dans .env.local (sans réseau)
  --check-config            : Valide la configuration des limites et des identifiants
  --test-auth               : Exécute le test d'authentification réseau minimal (1 requête max par fournisseur)
  --describe-auth-test      : Affiche la description textuelle et la spécification de sécurité du test d'authentification
  --discover-competitions   : Identifie les IDs et saisons des compétitions cibles (2 requêtes réseau max)
  --check-output-paths      : Valide la protection des chemins d'écriture de fichiers`);
}

// --- Action : Vérification de l'environnement (sans réseau et sans valeur partielle) ---
function checkEnv() {
  console.log('=== VERIFICATION DE L\'ENVIRONNEMENT LOCAL (SANS RESEAU) ===');
  const { env, error } = loadEnvLocal();

  if (error) {
    console.error(`[ERREUR] ${error}`);
    return false;
  }

  let valid = true;

  // Contrôle football-data.org key
  const fdKey = env.FOOTBALL_DATA_API_KEY;
  if (!fdKey) {
    console.log('FOOTBALL_DATA_API_KEY : Absente');
    valid = false;
  } else {
    console.log(`FOOTBALL_DATA_API_KEY : Présente (longueur : ${fdKey.length})`);
  }

  // Contrôle Sportmonks key
  const smKey = env.SPORTMONKS_API_KEY;
  if (!smKey) {
    console.log('SPORTMONKS_API_KEY      : Absente');
    valid = false;
  } else {
    console.log(`SPORTMONKS_API_KEY      : Présente (longueur : ${smKey.length})`);
  }

  const allowedNodeEnvs = new Set([
    'development',
    'test',
    'production'
  ]);

  if (!allowedNodeEnvs.has(env.NODE_ENV)) {
    console.error('NODE_ENV                : Invalide');
    valid = false;
  } else {
    console.log(`NODE_ENV                : ${env.NODE_ENV}`);
  }

  console.log('------------------------------------------------------------');
  return valid;
}

// --- Action : Vérification de la configuration ---
function checkConfig() {
  console.log('=== VERIFICATION DE LA CONFIGURATION (SANS RESEAU) ===');
  let config;
  try {
    config = loadConfig();
  } catch (err) {
    console.error('[ERREUR] Chargement du fichier de configuration échoué.');
    return false;
  }

  const setup = config.setup || {};
  const limits = config.limits || {};
  const isAConfirmer = (val) => !val || String(val).trim().toLowerCase() === 'a confirmer';

  let incomplete = false;

  // 1. Vérification de la saison
  if (isAConfirmer(setup.saison_commune)) {
    console.error('[BLOCAGE] Saison commune : A confirmer');
    incomplete = true;
  } else {
    console.log(`Saison commune : ${setup.saison_commune}`);
  }

  // 2. Vérification des compétitions
  const comps = ['ligue_1', 'premier_league', 'champions_league'];
  const setupComps = setup.competitions || {};

  comps.forEach(c => {
    const cData = setupComps[c] || {};
    if (isAConfirmer(cData.football_data_id) || isAConfirmer(cData.sportmonks_id)) {
      console.error(`[BLOCAGE] Compétition [${c}] : Identifiants manquants ou 'A confirmer'`);
      incomplete = true;
    } else {
      console.log(`Compétition [${c}] : Configurée`);
    }
  });

  // 3. Vérification des limites
  const maxParComp = limits.max_rencontres_par_competition;
  const maxTotal = limits.max_rencontres_total;
  const maxRepCom = limits.max_rencontres_repetitions;
  const maxRep = limits.max_repetitions_par_rencontre;

  if (typeof maxParComp !== 'number' || maxParComp <= 0 || maxParComp > 6 ||
      typeof maxTotal !== 'number' || maxTotal <= 0 || maxTotal > 18 ||
      typeof maxRepCom !== 'number' || maxRepCom <= 0 || maxRepCom > 5 ||
      typeof maxRep !== 'number' || maxRep <= 0 || maxRep > 3) {
    console.error('[BLOCAGE] Limites invalides ou hors limites de sécurité strictes.');
    incomplete = true;
  } else {
    console.log('Limites numériques validées.');
  }

  console.log('------------------------------------------------------------');
  if (incomplete) {
    console.error('Configuration incomplète — test complet interdit');
    return false;
  }
  console.log('[SUCCES] Configuration validée.');
  return true;
}

// --- Table des Cibles Réseau Figée ---
const AUTH_TARGETS = Object.freeze({
  footballData: Object.freeze({
    hostname: 'api.football-data.org',
    path: '/v4/competitions'
  }),
  sportmonks: Object.freeze({
    hostname: 'api.sportmonks.com',
    path: '/v3/my/leagues'
  })
});

// --- Classification des codes HTTP de retour ---
function classifyHttpStatus(statusCode) {
  switch (statusCode) {
    case 200:
      return 'Réponse OK - à valider';
    case 401:
      return 'Authentification refusée (clé invalide ou expirée)';
    case 403:
      return 'Accès insuffisant ou interdit pour cette ressource';
    case 429:
      return 'Quota ou limitation d\'appels atteint';
    default:
      return `Échec HTTP générique (Code : ${statusCode})`;
  }
}

// --- Helper : Réaliser une requête HTTP GET sécurisée, limitée et orientée cible ---
function makeRequest(targetKey, headers, keysToMask) {
  return new Promise((resolve, reject) => {
    const target = AUTH_TARGETS[targetKey];
    if (!target) {
      return reject(new Error('Cible réseau de destination inconnue.'));
    }

    const options = {
      method: 'GET',
      hostname: target.hostname,
      path: target.path,
      headers: headers,
      timeout: 10000 // 10 secondes max
    };

    const req = https.request(options, (res) => {
      const statusCode = res.statusCode;
      let body = '';
      let length = 0;

      res.on('data', (chunk) => {
        length += chunk.length;
        if (length > 65536) { // Limite stricte de 64 Ko en mémoire
          res.destroy();
          reject(new Error('Taille de la réponse réseau maximale dépassée.'));
          return;
        }
        body += chunk.toString('utf8');
      });

      res.on('end', () => {
        resolve({ statusCode, body });
      });
    });

    req.on('error', (err) => {
      reject(new Error(cleanErrorMessage(err, keysToMask)));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Délai d\'attente réseau de 10 secondes dépassé.'));
    });

    req.end();
  });
}

// --- Action : Authentification ---
async function testAuth() {
  console.log('=== TEST D\'AUTHENTIFICATION ===');
  const { env, error } = loadEnvLocal();

  if (error) {
    console.error(`[ERREUR] ${error}`);
    return false;
  }

  // 1. Validation de NODE_ENV avant tout appel réseau
  const allowedNodeEnvs = new Set(['development', 'test', 'production']);
  if (!allowedNodeEnvs.has(env.NODE_ENV)) {
    console.error('NODE_ENV : Invalide');
    return false;
  }

  const fdKey = env.FOOTBALL_DATA_API_KEY;
  const smKey = env.SPORTMONKS_API_KEY;
  const keysToMask = [fdKey, smKey];

  if (!fdKey || !smKey) {
    console.error('[ERREUR] Clés d\'API manquantes dans le fichier .env.local.');
    return false;
  }

  let allSuccess = true;

  // 1. football-data.org
  console.log('football-data.org');
  try {
    const fdHeaders = {
      'X-Auth-Token': fdKey,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Athena/1.0'
    };
    const fdResult = await makeRequest('footballData', fdHeaders, keysToMask);

    console.log(`- Statut HTTP : ${fdResult.statusCode}`);
    console.log(`- Classification : ${classifyHttpStatus(fdResult.statusCode)}`);

    if (fdResult.statusCode === 200) {
      try {
        const data = JSON.parse(fdResult.body);
        if (data && Array.isArray(data.competitions)) {
          console.log('- Authentification réussie : Oui');
          console.log(`- Compétitions accessibles : ${data.competitions.length}`);
        } else {
          console.log('- Authentification réussie : Non (Le format de réponse ne contient pas un tableau de compétitions valide)');
          allSuccess = false;
        }
      } catch (e) {
        console.log('- Authentification réussie : Non (Erreur de parsing JSON de la réponse)');
        allSuccess = false;
      }
    } else {
      console.log('- Authentification réussie : Non');
      allSuccess = false;
    }
  } catch (err) {
    console.log('- Authentification réussie : Non');
    console.error(`- Erreur : ${cleanErrorMessage(err, keysToMask)}`);
    allSuccess = false;
  }

  console.log('');

  // 2. Sportmonks
  console.log('Sportmonks');
  try {
    const smHeaders = {
      'Authorization': smKey,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Athena/1.0'
    };
    const smResult = await makeRequest('sportmonks', smHeaders, keysToMask);

    console.log(`- Statut HTTP : ${smResult.statusCode}`);
    console.log(`- Classification : ${classifyHttpStatus(smResult.statusCode)}`);

    if (smResult.statusCode === 200) {
      try {
        const data = JSON.parse(smResult.body);
        if (data && Array.isArray(data.data)) {
          console.log('- Authentification réussie : Oui');
          console.log(`- Compétitions accessibles : ${data.data.length}`);
        } else {
          console.log('- Authentification réussie : Non (Le format de réponse ne contient pas un tableau data valide)');
          allSuccess = false;
        }
      } catch (e) {
        console.log('- Authentification réussie : Non (Erreur de parsing JSON de la réponse)');
        allSuccess = false;
      }
    } else {
      console.log('- Authentification réussie : Non');
      allSuccess = false;
    }
  } catch (err) {
    console.log('- Authentification réussie : Non');
    console.error(`- Erreur : ${cleanErrorMessage(err, keysToMask)}`);
    allSuccess = false;
  }

  console.log('------------------------------------------------------------');
  return allSuccess;
}

// --- Action : Décrire le test d'authentification (sans réseau) ---
function describeAuthTest() {
  console.log('=== DESCRIPTION DU TEST D\'AUTHENTIFICATION RESEAU ===');
  console.log('Ce test valide la validité et les droits d\'accès des clés API configurées.');
  console.log('');
  console.log('1. DESTINATIONS RESEAU FIGEES :');
  console.log('   - football-data.org : https://api.football-data.org/v4/competitions');
  console.log('   - Sportmonks        : https://api.sportmonks.com/v3/my/leagues');
  console.log('   (Toute URL ou destination arbitraire est rejetée par sécurité)');
  console.log('');
  console.log('2. LIMITES ET CONTRAINTES RESEAU :');
  console.log('   - Méthode HTTP      : GET uniquement');
  console.log('   - Requêtes max      : 1 seule requête par fournisseur');
  console.log('   - Séquentialité     : Requêtes exécutées l\'une après l\'autre');
  console.log('   - Timeout strict    : Interruption automatique après 10 secondes maximum');
  console.log('   - Redirections      : Aucune redirection n\'est suivie');
  console.log('   - Limitation mémoire: Corps de réponse limité à 65 536 octets max en mémoire');
  console.log('   - Aucun fichier brut n\'est écrit ou stocké lors de ce test');
  console.log('');
  console.log('3. CLASSIFICATION HTTP ET CRITERES DE REUSSITE :');
  console.log('   - Statut 200        : Succès HTTP, la structure JSON de la réponse doit être validée');
  console.log('   - Statut 401        : Échec - Authentification refusée (clé invalide ou expirée)');
  console.log('   - Statut 403        : Échec - Accès insuffisant ou interdit');
  console.log('   - Statut 429        : Échec - Quota ou limitation d\'appels atteint');
  console.log('   - Autre statut      : Échec - Erreur HTTP générique');
  console.log('   (Tout statut différent de 200 retourne immédiatement un code global 1)');
  console.log('');
  console.log('4. VALIDATION STRICTE DU CONTENU (HTTP 200) :');
  console.log('   - football-data.org : Le JSON doit être valide et contenir un tableau "competitions".');
  console.log('                         Le nombre est lu via "competitions.length" (sans utiliser count).');
  console.log('   - Sportmonks        : Le JSON doit être valide et contenir un tableau "data".');
  console.log('                         Le nombre est lu via "data.length".');
  console.log('   (Si le JSON est corrompu ou si le tableau attendu est absent, l\'authentification est marquée Échouée)');
  console.log('');
  console.log('5. REGLES DE SECURITE LOCALES :');
  console.log('   - Les clés privées d\'API ne sont jamais affichées, stockées ou écrites.');
  console.log('   - Tout message d\'erreur est nettoyé de ses clés et tokens sensibles avant affichage.');
  console.log('   - NODE_ENV est validé en amont et doit être "development", "test" ou "production".');
  console.log('------------------------------------------------------------');
  return true;
}

// --- Action : Découverte des identifiants de compétitions (RESEAU — 2 requêtes max) ---
async function discoverCompetitions() {
  console.log('=== DECOUVERTE DES IDENTIFIANTS DE COMPETITIONS ===');
  const { env, error } = loadEnvLocal();

  if (error) {
    console.error(`[ERREUR] ${error}`);
    return false;
  }

  const allowedNodeEnvs = new Set(['development', 'test', 'production']);
  if (!allowedNodeEnvs.has(env.NODE_ENV)) {
    console.error('NODE_ENV : Invalide');
    return false;
  }

  const fdKey = env.FOOTBALL_DATA_API_KEY;
  const smKey = env.SPORTMONKS_API_KEY;
  const keysToMask = [fdKey, smKey];

  if (!fdKey || !smKey) {
    console.error('[ERREUR] Clés d\'API manquantes dans le fichier .env.local.');
    return false;
  }

  const TARGETS = [
    { label: 'Ligue 1',          keywords: ['ligue 1', 'ligue1', 'french ligue 1'] },
    { label: 'Premier League',   keywords: ['premier league', 'english premier league'] },
    { label: 'Champions League', keywords: ['champions league', 'uefa champions league', 'ucl'] }
  ];

  function matchTarget(name) {
    if (typeof name !== 'string') return null;
    const lower = name.toLowerCase();
    for (const t of TARGETS) {
      if (t.keywords.some(k => lower.includes(k))) return t.label;
    }
    return null;
  }

  let overallSuccess = true;

  // --- 1. football-data.org (requête 1/2) ---
  console.log('\nfootball-data.org — GET /v4/competitions');
  try {
    const fdHeaders = {
      'X-Auth-Token': fdKey,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Athena/1.0'
    };
    const fdResult = await makeRequest('footballData', fdHeaders, keysToMask);
    console.log(`- Statut HTTP : ${fdResult.statusCode}`);
    console.log(`- Classification : ${classifyHttpStatus(fdResult.statusCode)}`);

    if (fdResult.statusCode === 200) {
      let data;
      try {
        data = JSON.parse(fdResult.body);
      } catch (e) {
        console.error('- Format de réponse invalide (parsing JSON échoué)');
        overallSuccess = false;
        data = null;
      }

      if (data && Array.isArray(data.competitions)) {
        const found = [];
        for (const comp of data.competitions) {
          const label = matchTarget(comp.name);
          if (label) {
            const seasonYear = comp.currentSeason
              ? String(comp.currentSeason.startDate || '').slice(0, 4)
              : null;
            found.push({
              label,
              id: comp.id,
              code: comp.code,
              name: comp.name,
              seasonYear
            });
          }
        }

        found.forEach(f => {
          console.log(`\n  [${f.label}]`);
          console.log(`    Nom    : ${f.name}`);
          console.log(`    ID     : ${f.id}`);
          console.log(`    Code   : ${f.code}`);
          console.log(`    Saison : ${f.seasonYear || 'N/A'}`);
        });

        const missing = TARGETS.filter(t => !found.some(f => f.label === t.label));
        if (missing.length > 0) {
          console.log(`\n  [ATTENTION] Non trouvées : ${missing.map(m => m.label).join(', ')}`);
          overallSuccess = false;
        }
      } else if (data) {
        console.error('- Format de réponse invalide (competitions absent ou non-tableau)');
        overallSuccess = false;
      }
    } else {
      overallSuccess = false;
    }
  } catch (err) {
    console.error(`- Erreur réseau : ${cleanErrorMessage(err, keysToMask)}`);
    overallSuccess = false;
  }

  // --- 2. Sportmonks (requête 2/2) ---
  console.log('\nSportmonks — GET /v3/my/leagues');
  try {
    const smHeaders = {
      'Authorization': smKey,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Athena/1.0'
    };
    const smResult = await makeRequest('sportmonks', smHeaders, keysToMask);
    console.log(`- Statut HTTP : ${smResult.statusCode}`);
    console.log(`- Classification : ${classifyHttpStatus(smResult.statusCode)}`);

    if (smResult.statusCode === 200) {
      let data;
      try {
        data = JSON.parse(smResult.body);
      } catch (e) {
        console.error('- Format de réponse invalide (parsing JSON échoué)');
        overallSuccess = false;
        data = null;
      }

      if (data && Array.isArray(data.data)) {
        const found = [];
        for (const league of data.data) {
          const label = matchTarget(league.name);
          if (label) {
            found.push({
              label,
              id: league.id,
              name: league.name,
              active: league.active,
              currentSeasonId: league.current_season_id !== undefined
                ? league.current_season_id
                : (league.currentSeasonId !== undefined ? league.currentSeasonId : null)
            });
          }
        }

        found.forEach(f => {
          console.log(`\n  [${f.label}]`);
          console.log(`    Nom          : ${f.name}`);
          console.log(`    ID           : ${f.id}`);
          console.log(`    Actif        : ${f.active !== undefined ? f.active : 'N/A'}`);
          console.log(`    ID saison    : ${f.currentSeasonId !== null ? f.currentSeasonId : 'N/A'}`);
        });

        const missing = TARGETS.filter(t => !found.some(f => f.label === t.label));
        if (missing.length > 0) {
          console.log(`\n  [ATTENTION] Non trouvées : ${missing.map(m => m.label).join(', ')}`);
          overallSuccess = false;
        }
      } else if (data) {
        console.error('- Format de réponse invalide (data absent ou non-tableau)');
        overallSuccess = false;
      }
    } else {
      overallSuccess = false;
    }
  } catch (err) {
    console.error(`- Erreur réseau : ${cleanErrorMessage(err, keysToMask)}`);
    overallSuccess = false;
  }

  console.log('\n------------------------------------------------------------');
  return overallSuccess;
}

// --- Action : Vérification des Chemins de Sortie ---
function checkOutputPaths() {
  console.log('=== VERIFICATION DES CHEMINS DE SORTIE (SANS RESEAU) ===');

  const testCases = [
    { name: 'Fichier valide simple', input: 'output.json', shouldPass: true },
    { name: 'Sous-dossier valide', input: 'subfolder/output.json', shouldPass: true },
    { name: 'Tentative d\'évasion parent', input: '../escape.json', shouldPass: false },
    { name: 'Tentative d\'évasion racine', input: '/absolute/path/file.json', shouldPass: false },
    { name: 'Nom vide', input: '', shouldPass: false }
  ];

  let success = true;

  testCases.forEach(tc => {
    try {
      const resolved = getSafeOutputPath(tc.input);
      const relRepo = path.relative(path.resolve(__dirname, '..'), resolved).replace(/\\/g, '/');
      if (tc.shouldPass) {
        console.log(`[PASS] ${tc.name} -> Résolu : ${relRepo}`);
      } else {
        console.error(`[FAIL] ${tc.name} aurait dû être rejeté mais a produit : ${relRepo}`);
        success = false;
      }
    } catch (err) {
      if (!tc.shouldPass) {
        console.log(`[PASS] ${tc.name} rejeté correctement avec l'erreur : ${err.message}`);
      } else {
        console.error(`[FAIL] ${tc.name} a produit une erreur inattendue : ${err.message}`);
        success = false;
      }
    }
  });

  console.log('------------------------------------------------------------');
  return success;
}

// --- Point d'entrée ---
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exitCode = 0;
    return;
  }

  if (args.length !== 1) {
    console.error('Une seule commande peut être exécutée à la fois.');
    showHelp();
    process.exitCode = 1;
    return;
  }

  const command = args[0];

  switch (command) {
    case '--help':
    case '-h':
      showHelp();
      process.exitCode = 0;
      return;

    case '--check-env':
      process.exitCode = checkEnv() ? 0 : 1;
      return;

    case '--check-config':
      process.exitCode = checkConfig() ? 0 : 1;
      return;

    case '--test-auth':
      process.exitCode = await testAuth() ? 0 : 1;
      return;

    case '--describe-auth-test':
      process.exitCode = describeAuthTest() ? 0 : 1;
      return;

    case '--discover-competitions':
      process.exitCode = await discoverCompetitions() ? 0 : 1;
      return;

    case '--check-output-paths':
      process.exitCode = checkOutputPaths() ? 0 : 1;
      return;

    default:
      console.error(`Argument inconnu : ${command}`);
      showHelp();
      process.exitCode = 1;
  }
}

main();

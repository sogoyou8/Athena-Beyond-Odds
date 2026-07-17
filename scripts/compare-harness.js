/**
 * Athena — Harnais local sécurisé de comparaison des fournisseurs de données sportives
 *
 * Ce script est conçu pour s'exécuter localement sans dépendance externe npm.
 * Il n'effectue AUCUNE requête réseau par défaut ni dans cette configuration.
 */

const fs = require('fs');
const path = require('path');

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
  --help                 : Affiche ce menu d'aide
  --check-env            : Valide la présence et la longueur des clés dans .env.local (sans réseau)
  --check-config         : Valide la configuration des limites et des identifiants
  --test-auth            : Préparation uniquement — aucune requête réseau implémentée
  --check-output-paths   : Valide la protection des chemins d'écriture de fichiers`);
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

// --- Action : Authentification ---
function testAuth() {
  console.log('=== TEST D\'AUTHENTIFICATION ===');
  console.error('Préparation uniquement — aucune requête réseau implémentée');
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
function main() {
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
      testAuth();
      process.exitCode = 1; // test-auth n'étant pas implémenté réseau, il retourne 1 par sécurité
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

/**
 * Rendu DOM textuel sécurisé — Athena Frontend Phase 3.1, Phase 3.3 & Phase 3.4
 *
 * Utilise exclusivement textContent et document.createElement pour l'injection dynamique.
 * Interdiction absolue de toute primitive d'injection HTML brute.
 *
 * Référence : DEC-019 (Form 5) / DEC-024 (Season Strength) / DEC-027 (H2H)
 */

import {
  MatchDTO,
  AnalyticalMatchEntryDTO,
  TeamFormDTO,
  SeasonStrengthProfileDTO,
  SeasonStrengthSegmentDTO,
  HeadToHeadProfileDTO,
  HeadToHeadSegmentDTO,
} from './api-client.js';

export type ClientState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'matches'; data: MatchDTO[] | AnalyticalMatchEntryDTO[] }
  | { status: 'empty' }
  | { status: 'competitionUnavailable' }
  | { status: 'rateLimited' }
  | { status: 'providerUnavailable' }
  | { status: 'networkUnavailable' }
  | { status: 'healthUnavailable' };

export interface RenderOptions {
  onRetry?: () => void;
}

export function renderUI(
  container: HTMLElement,
  announcer: HTMLElement | null,
  state: ClientState,
  options: RenderOptions = {}
): void {
  // Réinitialiser le conteneur principal
  container.replaceChildren();

  const announce = (message: string) => {
    if (announcer) {
      announcer.textContent = message;
    }
  };

  switch (state.status) {
    case 'initial':
    case 'loading': {
      announce('Chargement des matchs en cours...');
      const loadingBox = document.createElement('div');
      loadingBox.className = 'state-container';
      
      const title = document.createElement('h3');
      title.className = 'state-title';
      title.textContent = 'Chargement en cours';
      
      const msg = document.createElement('p');
      msg.className = 'state-message';
      msg.textContent = 'Récupération des matchs de Ligue 1...';
      
      loadingBox.append(title, msg);
      container.append(loadingBox);
      break;
    }

    case 'matches': {
      announce(`${state.data.length} matchs disponibles.`);
      const grid = document.createElement('div');
      grid.className = 'match-grid';

      for (const item of state.data) {
        const card = 'match' in item ? createAnalyticalMatchCard(item) : createMatchCard(item);
        grid.append(card);
      }

      container.append(grid);
      break;
    }

    case 'empty': {
      const message = 'Aucun match programmé sur la période disponible.';
      announce(message);

      const emptyBox = document.createElement('div');
      emptyBox.className = 'state-container';

      const title = document.createElement('h3');
      title.className = 'state-title';
      title.textContent = 'Aucun match';

      const msg = document.createElement('p');
      msg.className = 'state-message';
      msg.textContent = message;

      emptyBox.append(title, msg);
      container.append(emptyBox);
      break;
    }

    case 'competitionUnavailable': {
      const message = 'Seule la Ligue 1 (FL1) est disponible sur ce prototype.';
      announce(message);

      const box = document.createElement('div');
      box.className = 'state-container';

      const title = document.createElement('h3');
      title.className = 'state-title';
      title.textContent = 'Compétition indisponible';

      const msg = document.createElement('p');
      msg.className = 'state-message';
      msg.textContent = message;

      box.append(title, msg);
      container.append(box);
      break;
    }

    case 'rateLimited': {
      const message = 'Données temporairement inaccessibles suite à une limite de requêtes.';
      announce(message);
      container.append(createErrorStateBox('Limite de requêtes', message, options.onRetry));
      break;
    }

    case 'providerUnavailable': {
      const message = 'Service de données temporairement indisponible.';
      announce(message);
      container.append(createErrorStateBox('Service indisponible', message, options.onRetry));
      break;
    }

    case 'networkUnavailable': {
      const message = 'Connexion réseau indisponible. Vérifiez votre connexion internet.';
      announce(message);
      container.append(createErrorStateBox('Erreur réseau', message, options.onRetry));
      break;
    }

    case 'healthUnavailable': {
      const message = 'Service en maintenance ou indisponible.';
      announce(message);
      container.append(createErrorStateBox('Maintenance', message, options.onRetry));
      break;
    }
  }
}

function createErrorStateBox(titleText: string, messageText: string, onRetry?: () => void): HTMLElement {
  const box = document.createElement('div');
  box.className = 'state-container';

  const title = document.createElement('h3');
  title.className = 'state-title';
  title.textContent = titleText;

  const msg = document.createElement('p');
  msg.className = 'state-message';
  msg.textContent = messageText;

  box.append(title, msg);

  if (onRetry) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'retry-btn';
    btn.textContent = 'Réessayer';
    btn.addEventListener('click', () => {
      onRetry();
    });
    box.append(btn);
  }

  return box;
}

export function createFormBadges(teamForm: TeamFormDTO): HTMLElement {
  const container = document.createElement('div');
  container.className = 'form-container';

  if (teamForm.availability === 'INSUFFICIENT_DATA') {
    const span = document.createElement('span');
    span.className = 'form-insufficient';
    span.textContent = 'Données de forme indisponibles';
    container.append(span);
    return container;
  }

  if (teamForm.availability === 'UNAVAILABLE') {
    const span = document.createElement('span');
    span.className = 'form-unavailable';
    span.textContent = 'Forme temporairement indisponible';
    container.append(span);
    return container;
  }

  const list = document.createElement('ul');
  list.className = 'form-list';
  list.setAttribute('aria-label', 'Forme récente');

  for (const res of teamForm.results) {
    const item = document.createElement('li');
    const badge = document.createElement('span');

    let letter = 'N';
    let fullText = 'Nul';
    let cssClass = 'form-badge-draw';

    if (res === 'WIN') {
      letter = 'V';
      fullText = 'Victoire';
      cssClass = 'form-badge-win';
    } else if (res === 'LOSS') {
      letter = 'D';
      fullText = 'Défaite';
      cssClass = 'form-badge-loss';
    }

    badge.className = `form-badge ${cssClass}`;
    badge.textContent = letter;
    badge.setAttribute('title', fullText);
    badge.setAttribute('aria-label', fullText);

    item.append(badge);
    list.append(item);
  }

  container.append(list);
  return container;
}

/**
 * Formate un nombre à virgule flottante avec exactement 2 décimales pour la présentation UI.
 */
function formatRatio(value: number): string {
  return value.toFixed(2);
}

/**
 * Crée le rendu d'une ligne de métriques de segment de force saisonnière.
 */
function createSeasonSegmentElement(label: string, segment: SeasonStrengthSegmentDTO): HTMLElement {
  const row = document.createElement('div');
  row.className = 'season-segment-row';

  const labelEl = document.createElement('span');
  labelEl.className = 'season-segment-label';
  labelEl.textContent = label;
  row.append(labelEl);

  if (segment.availability === 'INSUFFICIENT_DATA') {
    const msg = document.createElement('span');
    msg.className = 'season-insufficient';
    msg.textContent = 'Données saisonnières insuffisantes';
    row.append(msg);
    return row;
  }

  if (segment.availability === 'UNAVAILABLE') {
    const msg = document.createElement('span');
    msg.className = 'season-unavailable';
    msg.textContent = 'Profil saisonnier indisponible';
    row.append(msg);
    return row;
  }

  const m = segment.metrics;
  const metricsEl = document.createElement('div');
  metricsEl.className = 'season-metrics-list';

  // Format compact et clair : MJ, V-N-D, Pts, Pts/M, BP, BC, Diff, BP/M, BC/M
  const items: { label: string; value: string; title: string }[] = [
    { label: 'MJ', value: String(m.played), title: 'Matchs joués' },
    { label: 'V-N-D', value: `${m.wins}-${m.draws}-${m.losses}`, title: 'Victoires-Nuls-Défaites' },
    { label: 'Pts', value: String(m.points), title: 'Points' },
    { label: 'Pts/M', value: formatRatio(m.pointsPerMatch), title: 'Points par match' },
    { label: 'BP', value: String(m.goalsFor), title: 'Buts pour' },
    { label: 'BC', value: String(m.goalsAgainst), title: 'Buts contre' },
    { label: 'Diff', value: (m.goalDifference > 0 ? `+${m.goalDifference}` : String(m.goalDifference)), title: 'Différence de buts' },
    { label: 'BP/M', value: formatRatio(m.goalsForPerMatch), title: 'Buts marqués par match' },
    { label: 'BC/M', value: formatRatio(m.goalsAgainstPerMatch), title: 'Buts encaissés par match' },
  ];

  for (const item of items) {
    const metricItem = document.createElement('span');
    metricItem.className = 'season-metric-item';
    metricItem.title = item.title;
    metricItem.setAttribute('aria-label', `${item.title}: ${item.value}`);

    const mLabel = document.createElement('span');
    mLabel.className = 'season-metric-label';
    mLabel.textContent = `${item.label}: `;

    const mValue = document.createElement('span');
    mValue.className = 'season-metric-value';
    mValue.textContent = item.value;

    metricItem.append(mLabel, mValue);
    metricsEl.append(metricItem);
  }

  row.append(metricsEl);
  return row;
}

/**
 * Crée le bloc UI "Saison" pour une équipe dans la carte de match (DEC-024).
 * Affiche le segment Global (overall) et le segment contextualisé (Domicile ou Extérieur).
 */
export function createSeasonStrengthElement(profile: SeasonStrengthProfileDTO): HTMLElement {
  const container = document.createElement('div');
  container.className = 'season-strength-container';
  container.setAttribute('aria-label', 'Profil de force saisonnier');

  const title = document.createElement('div');
  title.className = 'season-strength-title';
  title.textContent = 'Profil saison';
  container.append(title);

  // 1. Segment Overall (Global)
  const overallEl = createSeasonSegmentElement('Global', profile.overall);
  overallEl.classList.add('season-overall');
  container.append(overallEl);

  // 2. Segment Contextual (Domicile ou Extérieur selon venue)
  const contextualLabel = profile.contextual.venue === 'HOME' ? 'Domicile' : 'Extérieur';
  const contextualEl = createSeasonSegmentElement(contextualLabel, profile.contextual.segment);
  contextualEl.classList.add('season-contextual');
  container.append(contextualEl);

  return container;
}

/**
 * Formate une date ISO UTC au format court français "JJ/MM/AAAA".
 */
function formatShortDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return '';
  }
}

/**
 * Crée l'élément UI d'un segment H2H (Overall ou SAME_VENUE).
 */
function createHeadToHeadSegmentElement(label: string, segment: HeadToHeadSegmentDTO): HTMLElement {
  const el = document.createElement('div');
  el.className = 'h2h-segment';

  const segLabel = document.createElement('div');
  segLabel.className = 'h2h-segment-label';
  segLabel.textContent = label;
  el.append(segLabel);

  if (segment.availability !== 'AVAILABLE' || segment.homeTeam === null || segment.awayTeam === null) {
    const status = document.createElement('span');
    status.className = `h2h-segment-status h2h-status-${segment.availability.toLowerCase()}`;
    status.textContent = segment.availability === 'INSUFFICIENT_DATA' ? 'Données insuffisantes' : 'Indisponible';
    el.append(status);
    return el;
  }

  // Stats bar
  const stats = document.createElement('div');
  stats.className = 'h2h-stats';
  stats.setAttribute('aria-label', `${label}: ${segment.sampleSize} confrontation(s)`);

  const buildStat = (labelText: string, value: string | number): HTMLElement => {
    const item = document.createElement('span');
    item.className = 'h2h-stat-item';
    const l = document.createElement('span');
    l.className = 'h2h-stat-label';
    l.textContent = `${labelText} `;
    const v = document.createElement('span');
    v.className = 'h2h-stat-value';
    v.textContent = String(value);
    item.append(l, v);
    return item;
  };

  const home = segment.homeTeam;
  const away = segment.awayTeam;

  stats.append(
    buildStat('Joués', segment.sampleSize!),
    buildStat('V DOM', home.wins),
    buildStat('N', home.draws),
    buildStat('V EXT', away.wins),
    buildStat('BM DOM', home.goalsFor),
    buildStat('BM EXT', away.goalsFor),
  );

  el.append(stats);

  // Métadonnées : période historique et saisons couvertes
  const metaContainer = document.createElement('div');
  metaContainer.className = 'h2h-meta-row';

  if (segment.oldestMeetingDate && segment.latestMeetingDate) {
    const oldestStr = formatShortDate(segment.oldestMeetingDate);
    const latestStr = formatShortDate(segment.latestMeetingDate);

    if (oldestStr && latestStr) {
      const periodEl = document.createElement('span');
      periodEl.className = 'h2h-period';
      if (oldestStr === latestStr) {
        periodEl.textContent = oldestStr;
      } else {
        periodEl.textContent = `${oldestStr} → ${latestStr}`;
      }
      metaContainer.append(periodEl);
    }
  }

  if (segment.seasonsCovered !== null && segment.seasonsCovered > 0) {
    const coverage = document.createElement('span');
    coverage.className = 'h2h-seasons-covered';
    coverage.textContent = `${segment.seasonsCovered} saison${segment.seasonsCovered > 1 ? 's' : ''} couverte${segment.seasonsCovered > 1 ? 's' : ''}`;
    metaContainer.append(coverage);
  }

  if (metaContainer.childNodes.length > 0) {
    el.append(metaContainer);
  }

  return el;
}

/**
 * Crée le bloc UI "Head-to-Head" pour la carte de match (DEC-027).
 */
export function createHeadToHeadElement(profile: HeadToHeadProfileDTO): HTMLElement {
  const container = document.createElement('div');
  container.className = 'h2h-container';
  container.setAttribute('aria-label', 'Head-to-Head contextualisé');

  const title = document.createElement('div');
  title.className = 'h2h-title';
  title.textContent = 'Confrontations directes';
  container.append(title);

  const overallEl = createHeadToHeadSegmentElement('Global', profile.overall);
  overallEl.classList.add('h2h-overall');
  container.append(overallEl);

  const contextualEl = createHeadToHeadSegmentElement('Même config. de terrain', profile.contextual.segment);
  contextualEl.classList.add('h2h-contextual');
  container.append(contextualEl);

  return container;
}

/**
 * Crée le bloc UI "Repos & congestion" pour une équipe (DEC-029 / DEC-030).
 */
export function createScheduleLoadTeamElement(
  teamLabel: string,
  profile: import('./api-client.js').ScheduleLoadProfileDTO
): HTMLElement {
  const el = document.createElement('div');
  el.className = 'schedule-load-team';

  const labelEl = document.createElement('div');
  labelEl.className = 'schedule-load-team-label';
  labelEl.textContent = teamLabel;
  el.append(labelEl);

  if (profile.availability === 'UNAVAILABLE') {
    const status = document.createElement('div');
    status.className = 'schedule-load-status';
    status.textContent = 'Indisponible';
    el.append(status);
    return el;
  }

  if (profile.availability === 'INSUFFICIENT_DATA') {
    const status = document.createElement('div');
    status.className = 'schedule-load-status';
    status.textContent = 'Données insuffisantes';
    el.append(status);
    return el;
  }

  // État AVAILABLE : métriques factuelles
  const grid = document.createElement('div');
  grid.className = 'schedule-load-grid';

  const buildRow = (rowLabel: string, val: string | number, extraBadge?: HTMLElement) => {
    const row = document.createElement('div');
    row.className = 'schedule-load-row';
    const l = document.createElement('span');
    l.className = 'schedule-load-row-label';
    l.textContent = rowLabel;
    const v = document.createElement('span');
    v.className = 'schedule-load-row-val';
    v.textContent = String(val);
    row.append(l, v);
    if (extraBadge) {
      row.append(extraBadge);
    }
    return row;
  };

  // Dernier match
  let shortRestBadge: HTMLElement | undefined;
  if (profile.shortRest === true) {
    shortRestBadge = document.createElement('span');
    shortRestBadge.className = 'short-rest-badge';
    shortRestBadge.textContent = 'Repos court';
  }
  const lastMatchText = profile.daysSinceLastMatch !== null ? `${profile.daysSinceLastMatch} j` : '—';
  grid.append(buildRow('Dernier match', lastMatchText, shortRestBadge));

  // Matchs (7 / 14 / 28 j)
  const m7 = profile.matchesLast7Days !== null ? profile.matchesLast7Days : '—';
  const m14 = profile.matchesLast14Days !== null ? profile.matchesLast14Days : '—';
  const m28 = profile.matchesLast28Days !== null ? profile.matchesLast28Days : '—';
  grid.append(buildRow('Matchs (7 / 14 / 28 j)', `${m7} / ${m14} / ${m28}`));

  // Repos min. (14 j)
  const minRestText = profile.minimumRestDaysInLast14Days !== null ? `${profile.minimumRestDaysInLast14Days} j` : '—';
  grid.append(buildRow('Repos min. (14 j)', minRestText));

  el.append(grid);
  return el;
}

/**
 * Crée le bloc UI "Repos & congestion" pour la carte de match (DEC-029 / DEC-030).
 */
export function createScheduleLoadElement(
  load: {
    home: import('./api-client.js').ScheduleLoadProfileDTO;
    away: import('./api-client.js').ScheduleLoadProfileDTO;
  }
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'schedule-load-container';
  container.setAttribute('aria-label', 'Repos et congestion calendaire');

  const header = document.createElement('div');
  header.className = 'schedule-load-header';

  const title = document.createElement('div');
  title.className = 'schedule-load-title';
  title.textContent = 'Repos & congestion';

  const notice = document.createElement('div');
  notice.className = 'schedule-load-notice';
  notice.textContent = 'Charge dans cette compétition';

  header.append(title, notice);
  container.append(header);

  const teamsContainer = document.createElement('div');
  teamsContainer.className = 'schedule-load-teams';

  const homeEl = createScheduleLoadTeamElement('Domicile', load.home);
  homeEl.classList.add('schedule-load-home');

  const awayEl = createScheduleLoadTeamElement('Extérieur', load.away);
  awayEl.classList.add('schedule-load-away');

  teamsContainer.append(homeEl, awayEl);
  container.append(teamsContainer);

  return container;
}

function createMatchCard(match: MatchDTO): HTMLElement {
  const card = document.createElement('article');
  card.className = 'match-card';

  const meta = document.createElement('div');
  meta.className = 'match-meta';

  const matchdaySpan = document.createElement('span');
  matchdaySpan.textContent = `Journée ${match.matchday}`;

  const dateSpan = document.createElement('span');
  try {
    const d = new Date(match.utcDate);
    dateSpan.textContent = d.toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    dateSpan.textContent = match.utcDate;
  }

  meta.append(matchdaySpan, dateSpan);

  const teams = document.createElement('div');
  teams.className = 'match-teams';

  const homeRow = document.createElement('div');
  homeRow.className = 'team-row';
  const homeName = document.createElement('span');
  homeName.className = 'team-name';
  homeName.textContent = match.homeTeam.name || match.homeTeam.shortName || match.homeTeam.tla || 'Équipe domicile';
  const homeScore = document.createElement('span');
  homeScore.className = 'team-score';
  homeScore.textContent = match.score?.fullTime?.home !== null && match.score?.fullTime?.home !== undefined ? String(match.score.fullTime.home) : '-';
  homeRow.append(homeName, homeScore);

  const awayRow = document.createElement('div');
  awayRow.className = 'team-row';
  const awayName = document.createElement('span');
  awayName.className = 'team-name';
  awayName.textContent = match.awayTeam.name || match.awayTeam.shortName || match.awayTeam.tla || 'Équipe extérieure';
  const awayScore = document.createElement('span');
  awayScore.className = 'team-score';
  awayScore.textContent = match.score?.fullTime?.away !== null && match.score?.fullTime?.away !== undefined ? String(match.score.fullTime.away) : '-';
  awayRow.append(awayName, awayScore);

  teams.append(homeRow, awayRow);

  const badge = document.createElement('span');
  badge.className = 'match-status-badge';
  badge.textContent = match.status;

  card.append(meta, teams, badge);
  return card;
}

function createAnalyticalMatchCard(entry: AnalyticalMatchEntryDTO): HTMLElement {
  const card = createMatchCard(entry.match);

  const homeFormEl = createFormBadges(entry.form.home);
  homeFormEl.classList.add('home-form');

  const awayFormEl = createFormBadges(entry.form.away);
  awayFormEl.classList.add('away-form');

  const teamsEl = card.querySelector('.match-teams');
  if (teamsEl) {
    const rows = teamsEl.querySelectorAll('.team-row');
    if (rows.length >= 2) {
      rows[0].append(homeFormEl);
      rows[1].append(awayFormEl);
    }
  }

  // Intégrer les blocs Season Strength si présents (DEC-024)
  if (entry.seasonStrength) {
    const analyticsSection = document.createElement('div');
    analyticsSection.className = 'match-analytics-section';

    const homeStrengthEl = createSeasonStrengthElement(entry.seasonStrength.home);
    homeStrengthEl.classList.add('home-season-strength');

    const awayStrengthEl = createSeasonStrengthElement(entry.seasonStrength.away);
    awayStrengthEl.classList.add('away-season-strength');

    analyticsSection.append(homeStrengthEl, awayStrengthEl);
    card.append(analyticsSection);
  }

  // Intégrer le bloc H2H si présent (DEC-027 Phase 3.4)
  if (entry.headToHead) {
    const h2hEl = createHeadToHeadElement(entry.headToHead);
    card.append(h2hEl);
  }

  // Intégrer le bloc Repos & Congestion si présent (DEC-029 / DEC-030 Phase 3.5)
  if (entry.scheduleLoad) {
    const scheduleLoadEl = createScheduleLoadElement(entry.scheduleLoad);
    card.append(scheduleLoadEl);
  }

  return card;
}

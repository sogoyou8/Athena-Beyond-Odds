/**
 * Rendu DOM textuel sécurisé — Athena Frontend Phase 3.1
 * 
 * Utilise exclusivement textContent et document.createElement pour l'injection dynamique.
 * Interdiction absolue de toute primitive d'injection HTML brute.
 */

import { MatchDTO, AnalyticalMatchEntryDTO, TeamFormDTO } from './api-client.js';

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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC';
  } catch {
    dateSpan.textContent = match.utcDate;
  }

  meta.append(matchdaySpan, dateSpan);

  const teams = document.createElement('div');
  teams.className = 'match-teams';

  const homeRow = document.createElement('div');
  homeRow.className = 'team-row';
  const homeName = document.createElement('span');
  homeName.textContent = match.homeTeam.name || match.homeTeam.shortName || match.homeTeam.tla || 'Équipe domicile';
  const homeScore = document.createElement('span');
  homeScore.textContent = match.score?.fullTime?.home !== null && match.score?.fullTime?.home !== undefined ? String(match.score.fullTime.home) : '-';
  homeRow.append(homeName, homeScore);

  const awayRow = document.createElement('div');
  awayRow.className = 'team-row';
  const awayName = document.createElement('span');
  awayName.textContent = match.awayTeam.name || match.awayTeam.shortName || match.awayTeam.tla || 'Équipe extérieure';
  const awayScore = document.createElement('span');
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

  return card;
}

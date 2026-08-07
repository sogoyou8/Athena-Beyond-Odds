/**
 * Orchestration principale Frontend — Athena Phase 3.1
 */

import { checkHealth, fetchScheduledMatches } from './api-client.js';
import { renderUI, ClientState } from './render.js';

export interface AppDependencies {
  checkHealthImpl?: typeof checkHealth;
  fetchMatchesImpl?: typeof fetchScheduledMatches;
}

export class AthenaApp {
  private container: HTMLElement;
  private announcer: HTMLElement | null;
  private themeToggleBtn: HTMLButtonElement | null;
  private checkHealthFn: typeof checkHealth;
  private fetchMatchesFn: typeof fetchScheduledMatches;
  private state: ClientState = { status: 'initial' };

  constructor(
    container: HTMLElement,
    announcer: HTMLElement | null = null,
    themeToggleBtn: HTMLButtonElement | null = null,
    deps: AppDependencies = {}
  ) {
    this.container = container;
    this.announcer = announcer;
    this.themeToggleBtn = themeToggleBtn;
    this.checkHealthFn = deps.checkHealthImpl ?? checkHealth;
    this.fetchMatchesFn = deps.fetchMatchesImpl ?? fetchScheduledMatches;
  }

  public init(): void {
    this.initTheme();
    this.loadData();
  }

  public getState(): ClientState {
    return this.state;
  }

  public initTheme(): void {
    if (!this.themeToggleBtn) return;

    // Détection initiale via prefers-color-scheme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme: 'light' | 'dark' = prefersDark ? 'dark' : 'light';

    const updateThemeUI = (theme: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', theme);
      if (this.themeToggleBtn) {
        this.themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      }
    };

    updateThemeUI(currentTheme);

    this.themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      updateThemeUI(currentTheme);
    });
  }

  public async loadData(): Promise<void> {
    this.setState({ status: 'loading' });

    const isHealthy = await this.checkHealthFn();
    if (!isHealthy) {
      this.setState({ status: 'healthUnavailable' });
      return;
    }

    const result = await this.fetchMatchesFn('FL1');

    switch (result.type) {
      case 'success':
        if (result.data.length === 0) {
          this.setState({ status: 'empty' });
        } else {
          this.setState({ status: 'matches', data: result.data });
        }
        break;

      case 'competitionUnavailable':
        this.setState({ status: 'competitionUnavailable' });
        break;

      case 'rateLimited':
        this.setState({ status: 'rateLimited' });
        break;

      case 'providerUnavailable':
        this.setState({ status: 'providerUnavailable' });
        break;

      case 'networkError':
        this.setState({ status: 'networkUnavailable' });
        break;

      case 'unexpectedError':
        this.setState({ status: 'providerUnavailable' });
        break;
    }
  }

  private setState(newState: ClientState): void {
    this.state = newState;
    renderUI(this.container, this.announcer, this.state, {
      onRetry: () => this.loadData()
    });
  }
}

// Démarrage automatique au chargement du DOM si présent
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const announcer = document.getElementById('status-announcer');
    const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement | null;

    if (mainContent) {
      const app = new AthenaApp(mainContent, announcer, themeToggle);
      app.init();
    }
  });
}

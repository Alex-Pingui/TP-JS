import EntitiesProvider from "../services/entities_provider.js";
import EntityAll from "./EntityAll.js";

export default class Home {
  constructor() {
    this.allEntities = [];
  }

  async render() {
    return `
      <main class="container py-4">
        <h1>Accueil</h1>
        <p>Bienvenue sur l'application de gestion des entités.</p>

        <div class="mb-4">
          <input
            id="home-search"
            class="form-control form-control-lg"
            type="search"
            placeholder="Rechercher une entité par nom..."
            aria-label="Recherche rapide"
          />
        </div>

        <div id="search-results" class="alert alert-info" style="display: none;">
          Résultats de la recherche :
          <ul id="results-list" class="mt-2 mb-0"></ul>
        </div>
        <div>
        <h2>Entités favorites</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 favorite-entities"></div>
        </div>
      </main>
    `;
  }

  async after_render() {
    this.allEntities = await EntitiesProvider.fetchEntities();
    this.setupSearchInput();
    EntityAll.removeFavorite();
    EntityAll.reloadFavorites();
  }

  setupSearchInput() {
    const input = document.getElementById('home-search');
    input.addEventListener('input', (e) => this.handleSearch(e));
    input.addEventListener('keypress', (e) => this.handleSearchSubmit(e));
  }

  handleSearch(e) {
    const term = e.target.value.toLowerCase().trim();
    const resultsDiv = document.getElementById('search-results');

    if (term.length < 2) {
      resultsDiv.style.display = 'none';
      return;
    }

    const matches = this.filterEntities(term);
    this.displayResults(matches);
  }

  handleSearchSubmit(e) {
    if (e.key === 'Enter') {
      const term = document.getElementById('home-search').value.trim();
      const firstMatch = this.allEntities.find(entity =>
        entity.nom.toLowerCase().includes(term.toLowerCase())
      );
      if (firstMatch) {
        window.location.hash = `/entities/${firstMatch.id}`;
      }
    }
  }

  filterEntities(term) {
    return this.allEntities.filter(entity =>
      entity.nom.toLowerCase().includes(term) ||
      entity.comportement.toLowerCase().includes(term)
    );
  }

  displayResults(entities) {
    const resultsDiv = document.getElementById('search-results');
    const resultsList = document.getElementById('results-list');

    if (entities.length === 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    resultsList.innerHTML = entities
      .slice(0, 5)
      .map(entity =>
        `<li>
          <a href="#/entities/${entity.id}" class="text-decoration-none">
            ${entity.nom} (${entity.pv} PV)
          </a>
        </li>`
      ).join('');

    resultsDiv.style.display = 'block';
  }
}

export default class Home {
  async render() {
    return `
      <main class="container py-4">
        <h1>Accueil</h1>
        <p>Bienvenue sur l'application de gestion des entités.</p>

        <div class="mb-3">
          <input
            id="home-search"
            class="form-control"
            type="search"
            placeholder="Rechercher une entité..."
            aria-label="Recherche sur la page d'accueil"
          />
        </div>

        <p class="text-muted">
          Utilisez la barre de recherche pour commencer, ou allez dans "Toutes les entités".
        </p>
      </main>
    `;
  }

  async after_render() {
    const input = document.getElementById('home-search');
    if (!input) return;

    // Ici, tu pourras plus tard ajouter ta logique :
    // input.addEventListener('input', (e) => { ... });
  }
}

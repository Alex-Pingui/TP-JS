import EntityProvider from '../services/entities_provider.js';

export default class EntityAll {
    async render() {
        let entities = await EntityProvider.fetchEntities();
        let view =  /*html*/`
            <h2>Toutes les entités</h2>
            <div class="mb-3">
                <input
                    id="entity-search"
                    class="form-control"
                    type="text"
                    placeholder="Rechercher une entité..."
                />
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${entities.map(entity =>
                    /*html*/`
                    <div class="col entity-card">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <img class="bd-placeholder-img card-img-top" data-src="./images/${entity.image}" />
                                <p class="card-text entity-text">
                                    ${entity.nom} - ${entity.comportement}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <a href="#/entities/${entity.id}" class="btn btn-sm btn-outline-secondary">
                                            Voir ${entity.nom}
                                        </a>
                                    </div>
                                    <small class="text-body-secondary">
                                        ${entity.pv} <i class="bi bi-heart" style="font-size: 1.3rem;"></i>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
        ).join('\n ')
            }
            </div>
        `;
        return view;
    }

    async after_render() {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.2,
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.src) {
                    entry.target.src = entry.target.dataset.src;
                }
            });
        }, options);
        document
            .querySelectorAll('img.card-img-top')
            .forEach(img => observer.observe(img));
        const searchInput = document.getElementById('entity-search');
        if (!searchInput) return;
        const cards = Array.from(document.querySelectorAll('.entity-card'));
        const filterCards = (value) => {
            const term = value.toLowerCase();
            cards.forEach(card => {
                const textEl = card.querySelector('.entity-text');
                const text = textEl ? textEl.textContent.toLowerCase() : '';
                if (text.includes(term)) {
                    card.classList.remove('d-none');
                } else {
                    card.classList.add('d-none');
                }
            });
        };
        searchInput.addEventListener('input', (e) => {
            filterCards(e.target.value);
        });
    }
}

import EntityProvider from '../services/entities_provider.js';

export default class EntityAll {
    #entitiesToFight=0;
    static favoritesEntities={};
    static addedFavoritesEntities=0;

    async render() {
        let entities = await EntityProvider.fetchEntities();

        let view =  /*html*/`
            <div>
            <h2>Entités favorites</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 favorite-entities"></div>
            </div>
            <h2>Entités sélectionnées pour combattre</h2>
            <div class="row row-cols-1 row-cols-md-2 g-3 mb-4 selected-entities">
                <!-- Les entités sélectionnées apparaîtront ici -->
            </div>
            <div class="mb-4">
                <button class="btn btn-danger w-100 start-fight-btn" disabled="disabled">Démarrer le combat</button>
            </div>
            
            <hr>

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
                                    <div class="btn-group gap-1">
                                    <a href="#/entities" class="btn btn-sm btn-outline-secondary add-favorite" id="${entity.id}">Ajouter aux favoris</a>
                                        <a href="#/entities/${entity.id}" class="btn btn-sm btn-outline-secondary">
                                            Voir
                                        </a>
                                        <button class="btn btn-sm btn-outline-secondary add-to-fight" id="${entity.id}">Sélectionner</button>
                                    </div>
                                    <small class="text-body-secondary">
                                        ${entity.pv} <i class="bi bi-heart text-danger" style="font-size: 1.3rem;"></i>
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
        EntityAll.setupLazyLoading();
        this.setupSearch();
        EntityAll.addFavorite();
        EntityAll.removeFavorite("/entities");
        EntityAll.reloadFavorites();
        this.setupAddEntityToFight();
        this.setupRemoveEntityToFight();
    }

    static setupLazyLoading() {
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
    }

    setupSearch() {
        const searchInput = document.getElementById('entity-search');
        if (!searchInput) return;
        const cards = Array.from(document.querySelectorAll('.entity-card'));
        searchInput.addEventListener('input', (e) => {
            this.filterCards(cards, e.target.value);
        });
    }

    setupAddEntityToFight() {
        let btns=document.querySelectorAll(".add-to-fight");
        btns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            let entityPromise=EntityProvider.fetchEntity(btn.id);
            entityPromise.then(
                entity => {
                    if(this.#entitiesToFight<2) {
                        this.#entitiesToFight++;
                        
                        btn.classList.remove('btn-outline-secondary');
                        btn.classList.add('btn-success');
                        btn.textContent = "Sélectionné";
                        btn.disabled = true;

                        document.querySelector(".start-fight-btn").disabled = this.#entitiesToFight < 1;
                        document.querySelector(".selected-entities").innerHTML+=`<div class="col entity-card selected-fighter" data-id="${entity.id}">
                        <div class="card shadow-sm border-warning">
                            <div class="card-body">
                                <img class="bd-placeholder-img card-img-top" data-src="./images/${entity.image}"/>
                                <p class="card-text entity-text">
                                    ${entity.nom} - ${entity.comportement}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group gap-1">
                                        <button class="btn btn-sm btn-outline-danger remove-to-fight" data-id="${entity.id}">Retirer du combat</button>
                                    </div>
                                    <small class="text-body-secondary">
                                        ${entity.pv} <i class="bi bi-heart text-danger" style="font-size: 1.3rem;"></i>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>`;
                        EntityAll.setupLazyLoading();
                        
                        
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    else{
                        alert("Il y a déjà 2 entités sélectionnées pour combattre");
                    }
                }
            ).catch(error => console.log(error));
        }))
    }

    setupRemoveEntityToFight() {
        if (this._removeClickHandler) {
            document.removeEventListener('click', this._removeClickHandler);
        }

        this._removeClickHandler = (e) => {
            if (e.target.classList.contains('remove-to-fight')) {
                e.preventDefault();
                const card = e.target.closest('.selected-fighter');

                if (card) {
                    const entityId = card.dataset.id;
                    card.remove();
                    this.#entitiesToFight--;
                    document.querySelector(".start-fight-btn").disabled = this.#entitiesToFight < 1;

                    const addBtn = document.querySelector(`.add-to-fight[id="${entityId}"]`);
                    if (addBtn) {
                        addBtn.classList.remove('btn-success');
                        addBtn.classList.add('btn-outline-secondary');
                        addBtn.textContent = "Sélectionner";
                        addBtn.disabled = false;
                    }
                }
            } else if (e.target.classList.contains('start-fight-btn')) {
                const selectedCards = document.querySelectorAll('.selected-fighter');
                if (selectedCards.length === 2) {
                    const id1 = selectedCards[0].dataset.id;
                    const id2 = selectedCards[1].dataset.id;
                    localStorage.setItem('combatEntities', JSON.stringify([id1, id2]));
                    window.location.hash = '#/combat';
                } else if (selectedCards.length === 1) {
                    const id1 = selectedCards[0].dataset.id;
                    localStorage.setItem('combatEntities', JSON.stringify([id1, null]));
                    window.location.hash = '#/combat';
                }
            }
        };

        document.addEventListener('click', this._removeClickHandler);
    }

    filterCards(cards, value) {
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
    }

    static addFavorite(){
        let btns=document.querySelectorAll(".add-favorite");
        btns.forEach(btn => btn.addEventListener('click', (e) => {
            let entityPromise=EntityProvider.fetchEntity(btn.id);
            entityPromise.then(
                entity => {
                    EntityAll.favoritesEntities[entity.id]=`<div class="col entity-card" id="${entity.id}">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <img class="bd-placeholder-img card-img-top" data-src="./images/${entity.image}"/>
                                <p class="card-text entity-text">
                                    ${entity.nom} - ${entity.comportement}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group gap-1">
                                        <a href="#/entities" class="btn btn-sm btn-outline-secondary remove-favorite" id="${entity.id}">Retirer des favoris</a>
                                    </div>
                                    <small class="text-body-secondary">
                                        ${entity.pv} <i class="bi bi-heart" style="font-size: 1.3rem;"></i>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    EntityAll.addedFavoritesEntities++;
                    EntityAll.reloadFavorites();
                }
            ).catch(error => console.log(error));
        }))
    }

    static removeFavorite(fromPage){
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-favorite')) {
                const card = e.target.closest('.entity-card');

                if (card) {
                    EntityAll.favoritesEntities[card.id]="";
                    EntityAll.addedFavoritesEntities--;
                    console.log(EntityAll.addedFavoritesEntities);
                    card.querySelector(".remove-favorite").href=`#${fromPage}`;
                    EntityAll.reloadFavorites();
                }
            }
        })
    }

    static reloadFavorites(){
        let favoritesEntitiesDiv=document.querySelector(".favorite-entities");
        favoritesEntitiesDiv.innerHTML="";
        if(EntityAll.addedFavoritesEntities===0){
            favoritesEntitiesDiv.innerHTML="<p>Aucune entité ajoutée dans les favoris</p>";
            return;
        }
        Object.values(EntityAll.favoritesEntities).forEach((entityHTML) => {
           favoritesEntitiesDiv.innerHTML+=entityHTML;
            EntityAll.setupLazyLoading();
        });
    }
}

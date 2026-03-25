import EntityProvider from "../services/entities_provider";

export default class FightEntitiesSelector {
    async render(){
        let entities = await EntityProvider.fetchEntities();
        let view =  /*html*/`
            <h2>Toutes les entités</h2>
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

        let entityCard=document.querySelector("#entity-card");
        entityCard.addEventListener('click', )
        return view;
    }
}
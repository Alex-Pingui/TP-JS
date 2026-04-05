import EntitiesProvider from "../services/entities_provider.js";

export default class Fights{
    #fights;

    constructor(){
        this.#fights=[];
    }

    async render(){
        this.#fights=await EntitiesProvider.fetchFights();

        let view =  /*html*/`
            <div>
                <h2>Combats</h2>
                <div class="fights-list">
                    <div class="row row-cols-1 row-cols-md-2 g-3 mb-4 fight">
                    </div>
                    <div class="fight-note">
                    </div>
                </div>
            </div>
            `;
        return view;
    }

    async after_render(){
        this.setupFights();
        this.setupLazyLoading();
    }

    setupLazyLoading() {
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

    setupFights(){
        let fightsDiv=document.querySelector(".fights-list");
        console.log(this.#fights);
        this.#fights.forEach(fight =>{
            console.log(fight);
            let entity1=fight.entity1;
            let entity2=fight.entity2;

            fightsDiv.innerHTML+=`<h3>Combat entre ${entity1.nom} et ${entity2.nom}</h3>`;

            console.log(entity1);
            fightsDiv.innerHTML+=`<div class="col entity-card selected-fighter" data-id="${entity1.id}">
                        <div class="card shadow-sm border-warning">
                            <div class="card-body">
                                <img class="bd-placeholder-img card-img-top" data-src="./images/${entity1.image}" style="width: 120px; height: 120px; object-fit: cover;"/>
                                <p class="card-text entity-text">
                                    ${entity1.nom} - ${entity1.comportement}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group gap-1">
                                    </div>
                                    <span>
                                    ${entity1.pv} 
                                    <small>
                                    <img class="card-img-top" data-src="./images/heart.png" style="width: 20px; height: 20px;">
                                    </small>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>`;

            fightsDiv.innerHTML+=`<div class="col entity-card selected-fighter" data-id="${entity2.id}">
                        <div class="card shadow-sm border-warning">
                            <div class="card-body">
                                <img class="bd-placeholder-img card-img-top" data-src="./images/${entity2.image}" style="width: 120px; height: 120px; object-fit: cover;"/>
                                <p class="card-text entity-text">
                                    ${entity2.nom} - ${entity2.comportement}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group gap-1">
                                    </div>
                                    <span>
                                    ${entity2.pv} 
                                    <small>
                                    <img class="card-img-top" data-src="./images/heart.png" style="width: 20px; height: 20px;">
                                    </small>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>`;

            fightsDiv.innerHTML+=`
            <h4>Résultats</h4>
            <p>Gagnant: ${fight.winner.nom}</p>
            <p>Note attribuée: ${fight.note}</p>
            `;
        });
    }
}
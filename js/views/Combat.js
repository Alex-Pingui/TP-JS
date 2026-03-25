import EntityProvider from "../services/entities_provider.js";

export default class Combat {
    constructor() {
        this.entities = [];
        this.fighter1 = null;
        this.fighter2 = null;
        this.fighter1Damages = [];
        this.fighter2Damages = [];
        this.turn = 0;
        this.isFighting = false;
    }

    async render() {
        this.entities = await EntityProvider.fetchEntities();
        [this.fighter1, this.fighter2] = this.pickRandomFighters();
        
        // Charge les damages de chaque combattant
        this.fighter1Damages = await EntityProvider.fetchEntityDamages(this.fighter1.id);
        this.fighter2Damages = await EntityProvider.fetchEntityDamages(this.fighter2.id);

        return /*html*/`
            <div class="container py-4">
                <h2>Combat</h2>
                
                <div class="mb-4">
                    <button id="new-fight" class="btn btn-success me-2">
                        <i class="bi bi-arrow-clockwise"></i> Nouveau combat
                    </button>
                    <button id="start-fight" class="btn btn-danger">
                        <i class="bi bi-play"></i> Démarrer le combat
                    </button>
                </div>

                <div class="row">
                    <!-- Fighter 1 -->
                    <div class="col-md-6 mb-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h4>${this.fighter1.nom}</h4>
                                <img class="img-fluid mb-3" 
                                     src="./images/${this.fighter1.image}" 
                                     style="width: 120px; height: 120px; object-fit: cover;" />
                                <p class="card-text">${this.fighter1.comportement}</p>
                                
                                <div class="mb-2">
                                    <label class="form-label">PV: <span id="pv1">${this.fighter1.pv}</span></label>
                                    <div class="progress">
                                        <div class="progress-bar bg-danger" 
                                             id="health1" 
                                             style="width: 100%" 
                                             role="progressbar">
                                        </div>
                                    </div>
                                </div>
                                <small class="text-muted">
                                    Dégâts: ${this.fighter1Damages.map(d => `${d.type}:${d.degats}`).join(', ')}
                                </small>
                            </div>
                        </div>
                    </div>

                    <!-- Fighter 2 -->
                    <div class="col-md-6 mb-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h4>${this.fighter2.nom}</h4>
                                <img class="img-fluid mb-3" 
                                     src="./images/${this.fighter2.image}" 
                                     style="width: 120px; height: 120px; object-fit: cover;" />
                                <p class="card-text">${this.fighter2.comportement}</p>
                                
                                <div class="mb-2">
                                    <label class="form-label">PV: <span id="pv2">${this.fighter2.pv}</span></label>
                                    <div class="progress">
                                        <div class="progress-bar bg-danger" 
                                             id="health2" 
                                             style="width: 100%" 
                                             role="progressbar">
                                        </div>
                                    </div>
                                </div>
                                <small class="text-muted">
                                    Dégâts: ${this.fighter2Damages.map(d => `${d.type}:${d.degats}`).join(', ')}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="combat-log" class="card mt-4">
                    <div class="card-header">
                        <h5>Journal de combat</h5>
                    </div>
                    <div class="card-body p-0">
                        <ul id="log-list" class="list-group list-group-flush">
                            <li class="list-group-item">Cliquez sur "Démarrer le combat".</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    pickRandomFighters() {
        const shuffled = [...this.entities].sort(() => 0.5 - Math.random());
        return [shuffled[0], shuffled[1]];
    }

    getRandomDamage(damages) {
        if (!damages || damages.length === 0) {
            return { type: 'coup', degats: 10 }; // fallback
        }
        const randomDamage = damages[Math.floor(Math.random() * damages.length)];
        return {
            type: randomDamage.type,
            degats: randomDamage.degats
        };
    }

    log(message) {
        const logList = document.getElementById('log-list');
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>[Tour ${this.turn}]</strong> ${message}`;
        logList.insertBefore(li, logList.firstChild);
        
        while (logList.children.length > 10) {
            logList.removeChild(logList.lastChild);
        }
    }

    updateHealth(fighter, newPv, fighterIndex) {
        fighter.pv = newPv;
        const pvSpan = document.getElementById(`pv${fighterIndex}`);
        const healthBar = document.getElementById(`health${fighterIndex}`);
        
        pvSpan.textContent = newPv;
        const percent = Math.max(0, (newPv / fighter.maxPv) * 100);
        healthBar.style.width = `${percent}%`;
        healthBar.className = `progress-bar ${percent > 50 ? 'bg-success' : percent > 20 ? 'bg-warning' : 'bg-danger'}`;
    }

    async after_render() {
        this.fighter1.maxPv = this.fighter1.pv;
        this.fighter2.maxPv = this.fighter2.pv;

        this.updateHealth(this.fighter1, this.fighter1.pv, 1);
        this.updateHealth(this.fighter2, this.fighter2.pv, 2);

        document.getElementById('new-fight').addEventListener('click', () => {
            window.location.hash = '/combat';
        });

        document.getElementById('start-fight').addEventListener('click', () => {
            if (!this.isFighting) {
                this.isFighting = true;
                this.fightLoop();
            }
        });
    }

    async fightLoop() {
        while (this.fighter1.pv > 0 && this.fighter2.pv > 0 && this.isFighting) {
            this.turn++;
            
            // Fighter1 attaque
            const dmg1 = this.getRandomDamage(this.fighter1Damages);
            this.fighter2.pv = Math.max(0, this.fighter2.pv - dmg1.degats);
            this.log(`<span class="text-danger">${this.fighter1.nom}</span> (${dmg1.type}) inflige <strong>${dmg1.degats}</strong> dégâts à ${this.fighter2.nom}`);
            this.updateHealth(this.fighter2, this.fighter2.pv, 2);

            if (this.fighter2.pv <= 0) break;

            // Fighter2 attaque
            const dmg2 = this.getRandomDamage(this.fighter2Damages);
            this.fighter1.pv = Math.max(0, this.fighter1.pv - dmg2.degats);
            this.log(`<span class="text-primary">${this.fighter2.nom}</span> (${dmg2.type}) inflige <strong>${dmg2.degats}</strong> dégâts à ${this.fighter1.nom}`);
            this.updateHealth(this.fighter1, this.fighter1.pv, 1);

            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (this.isFighting) {
            const winner = this.fighter1.pv > 0 ? this.fighter1.nom : this.fighter2.nom;
            this.log(`<span class="text-success fs-5">🎉 ${winner} gagne le combat !</span>`);
            this.isFighting = false;
        }
    }
}

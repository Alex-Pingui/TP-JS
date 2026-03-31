import EntityProvider from "../services/entities_provider.js";

export default class Combat {
    constructor() {
        this.entities = [];
        this.fighter1 = null;
        this.fighter2 = null;
        this.fighter1Damages = [];
        this.fighter2Damages = [];
        this.turn = 1;
        this.isFighting = false;
        this.isPlayerTurn = true;
    }

    async render() {
        this.entities = await EntityProvider.fetchEntities();
        
        const storedEntities = localStorage.getItem('combatEntities');
        if (storedEntities) {
            try {
                const ids = JSON.parse(storedEntities);
                this.fighter1 = this.entities.find(e => e.id == ids[0]);
                this.fighter2 = this.entities.find(e => e.id == ids[1]);
                localStorage.removeItem('combatEntities');
            } catch (e) {
                console.error("Erreur de parsing des entités:", e);
            }
        }

        if (!this.fighter1 || !this.fighter2) {
            [this.fighter1, this.fighter2] = this.pickRandomFighters();
        }

        await this.loadDamages();

        return /*html*/`
            <div class="container py-4">
                <h2>Combat au tour par tour</h2>
                
                <div class="mb-4">
                    <button id="new-fight" class="btn btn-success me-2">
                        <i class="bi bi-arrow-clockwise"></i> Changer les combattants
                    </button>
                    <button id="start-fight" class="btn btn-danger">
                        <i class="bi bi-play"></i> Démarrer le combat
                    </button>
                </div>

                <div class="row">
                    <!-- Fighter 1 (Player) -->
                    <div class="col-md-6 mb-4">
                        <div class="card border-primary">
                            <div class="card-header bg-primary text-white">
                                Vous
                            </div>
                            <div class="card-body text-center">
                                <h4 id="name1">${this.fighter1.nom}</h4>
                                <img id="img1" class="img-fluid mb-3" 
                                     src="./images/${this.fighter1.image}" 
                                     style="width: 120px; height: 120px; object-fit: cover;" />
                                <p id="comp1" class="card-text">${this.fighter1.comportement}</p>
                                
                                <div class="mb-2">
                                    <label class="form-label">PV: <span id="pv1">${this.fighter1.pv}</span></label>
                                    <div class="progress">
                                        <div class="progress-bar bg-success" 
                                             id="health1" 
                                             style="width: 100%" 
                                             role="progressbar">
                                        </div>
                                    </div>
                                </div>
                                <div id="actions-panel" class="mt-3 d-none">
                                    <hr>
                                    <h5>Vos Actions</h5>
                                    <div id="player-attacks" class="d-flex justify-content-center flex-wrap gap-2">
                                        <!-- Actions will be generated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fighter 2 (Enemy) -->
                    <div class="col-md-6 mb-4">
                        <div class="card border-danger">
                            <div class="card-header bg-danger text-white">
                                Adversaire
                            </div>
                            <div class="card-body text-center">
                                <h4 id="name2">${this.fighter2.nom}</h4>
                                <img id="img2" class="img-fluid mb-3" 
                                     src="./images/${this.fighter2.image}" 
                                     style="width: 120px; height: 120px; object-fit: cover;" />
                                <p id="comp2" class="card-text">${this.fighter2.comportement}</p>
                                
                                <div class="mb-2">
                                    <label class="form-label">PV: <span id="pv2">${this.fighter2.pv}</span></label>
                                    <div class="progress">
                                        <div class="progress-bar bg-success" 
                                             id="health2" 
                                             style="width: 100%" 
                                             role="progressbar">
                                        </div>
                                    </div>
                                </div>
                                <small class="text-muted" id="damages2">
                                    Dégâts: ${this.fighter2Damages.length ?
                                        this.fighter2Damages.map(d => `${d.type}:${d.degats}`).join(', ')
                                    : 'Aucun'}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="combat-log" class="card mt-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>Journal de combat</h5>
                        <span id="turn-indicator" class="badge bg-secondary">En attente</span>
                    </div>
                    <div class="card-body p-0">
                        <ul id="log-list" class="list-group list-group-flush">
                            <li class="list-group-item">Prêt pour un nouveau combat !</li>
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

    async loadDamages() {
        try {
            const [fighter1DamageInstances, fighter2DamageInstances] = await Promise.all([
                EntityProvider.fetchEntityDamages(this.fighter1.id),
                EntityProvider.fetchEntityDamages(this.fighter2.id)
            ]);

            this.fighter1Damages = fighter1DamageInstances.map(damage => ({
                type: damage.type,
                degats: damage.degats
            }));

            this.fighter2Damages = fighter2DamageInstances.map(damage => ({
                type: damage.type,
                degats: damage.degats
            }));
            
            if(this.fighter1Damages.length === 0) this.fighter1Damages.push({ type: 'Coup de base', degats: 2 });
            if(this.fighter2Damages.length === 0) this.fighter2Damages.push({ type: 'Coup de base', degats: 2 });

        } catch (error) {
            console.error('Erreur chargement damages:', error);
            this.fighter1Damages = [{ type: 'Coup', degats: 10 }];
            this.fighter2Damages = [{ type: 'Coup', degats: 10 }];
        }
    }

    getRandomDamage(damages) {
        return damages[Math.floor(Math.random() * damages.length)];
    }

    log(message) {
        const logList = document.getElementById('log-list');
        if (!logList) return;

        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>[Tour ${this.turn}]</strong> ${message}`;
        logList.insertBefore(li, logList.firstChild);

        while (logList.children.length > 10) {
            logList.removeChild(logList.lastChild);
        }
    }

    updateHealth(fighterState, newPv, fighterIndex) {
        fighterState.currentPv = newPv;
        const pvSpan = document.getElementById(`pv${fighterIndex}`);
        const healthBar = document.getElementById(`health${fighterIndex}`);

        if (!pvSpan || !healthBar) return;

        pvSpan.textContent = newPv;
        const percent = Math.max(0, (newPv / fighterState.maxPv) * 100);
        healthBar.style.width = `${percent}%`;
        healthBar.className = `progress-bar ${percent > 50 ? 'bg-success' : percent > 20 ? 'bg-warning' : 'bg-danger'}`;
    }

    async after_render() {
        this.initFightersState();

        const newFightBtn = document.getElementById('new-fight');
        const startFightBtn = document.getElementById('start-fight');

        if (newFightBtn) {
            newFightBtn.addEventListener('click', () => this.newFight());
        }
        if (startFightBtn) {
            startFightBtn.addEventListener('click', () => this.startFight());
        }
    }

    initFightersState() {
        this.fighter1.currentPv = this.fighter1.pv;
        this.fighter1.maxPv = this.fighter1.pv;
        
        this.fighter2.currentPv = this.fighter2.pv;
        this.fighter2.maxPv = this.fighter2.pv;

        this.updateHealth(this.fighter1, this.fighter1.currentPv, 1);
        this.updateHealth(this.fighter2, this.fighter2.currentPv, 2);
    }

    updateUIFighters() {
        document.getElementById('name1').textContent = this.fighter1.nom;
        document.getElementById('img1').src = `./images/${this.fighter1.image}`;
        document.getElementById('comp1').textContent = this.fighter1.comportement;
        
        document.getElementById('name2').textContent = this.fighter2.nom;
        document.getElementById('img2').src = `./images/${this.fighter2.image}`;
        document.getElementById('comp2').textContent = this.fighter2.comportement;

        const damages2El = document.getElementById('damages2');
        if (damages2El) {
            damages2El.textContent = `Dégâts: ${this.fighter2Damages.map(d => `${d.type}:${d.degats}`).join(', ')}`;
        }
    }

    async newFight() {
        this.turn = 1;
        this.isFighting = false;
        
        const startBtn = document.getElementById('start-fight');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.display = 'inline-block';
        }
        document.getElementById('actions-panel').classList.add('d-none');
        document.getElementById('turn-indicator').textContent = 'En attente';
        document.getElementById('turn-indicator').className = 'badge bg-secondary';

        [this.fighter1, this.fighter2] = this.pickRandomFighters();
        await this.loadDamages();
        
        this.initFightersState();
        this.updateUIFighters();

        const logList = document.getElementById('log-list');
        if (logList) {
            logList.innerHTML = '<li class="list-group-item">Nouveaux combattants prêts ! Cliquez "Démarrer le combat".</li>';
        }
    }

    startFight() {
        this.isFighting = true;
        this.turn = 1;
        this.isPlayerTurn = true;
        
        const startBtn = document.getElementById('start-fight');
        if (startBtn) {
            startBtn.style.display = 'none';
        }

        document.getElementById('actions-panel').classList.remove('d-none');
        this.log('Le combat commence !');

        if (this.fighter1.comportement.toLowerCase() === 'passif' && this.fighter2.comportement.toLowerCase() === 'passif') {
            this.log(`<span class="text-warning fs-5">Match nul ! Les deux entités sont pacifiques et refusent de se battre.</span>`);
            this.endFight('Personne', null);
            return;
        }

        this.setupPlayerActions();
        this.processTurn();
    }

    setupPlayerActions() {
        const actionsContainer = document.getElementById('player-attacks');
        actionsContainer.innerHTML = '';

        if (this.fighter1.comportement.toLowerCase() === 'passif') {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.innerHTML = `<strong>Passer le tour</strong>`;
            btn.onclick = () => this.playerPassTurn();
            actionsContainer.appendChild(btn);
        } else {
            this.fighter1Damages.forEach((attack) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-primary';
                btn.innerHTML = `<strong>${attack.type}</strong> <span class="badge bg-light text-dark">${attack.degats} DMG</span>`;
                btn.onclick = () => this.playerAttack(attack);
                actionsContainer.appendChild(btn);
            });
        }
    }

    playerPassTurn() {
        if (!this.isFighting || !this.isPlayerTurn) return;

        this.log(`<span class="text-secondary">${this.fighter1.nom}</span> est pacifique et passe son tour.`);
        this.setPlayerActionsEnabled(false);
        
        if (this.isFighting) {
            this.isPlayerTurn = false;
            this.processTurn();
        }
    }

    setPlayerActionsEnabled(enabled) {
        const actionsContainer = document.getElementById('player-attacks');
        if(!actionsContainer) return;
        const buttons = actionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    processTurn() {
        if (!this.isFighting) return;

        const turnIndicator = document.getElementById('turn-indicator');
        if (this.isPlayerTurn) {
            turnIndicator.textContent = "C'est votre tour !";
            turnIndicator.className = 'badge bg-primary';
            this.setPlayerActionsEnabled(true);
        } else {
            turnIndicator.textContent = "Tour de l'adversaire...";
            turnIndicator.className = 'badge bg-danger';
            this.setPlayerActionsEnabled(false);
            
            setTimeout(() => {
                this.enemyAttack();
            }, 1000);
        }
    }

    playerAttack(attack) {
        if (!this.isFighting || !this.isPlayerTurn) return;

        this.fighter2.currentPv = Math.max(0, this.fighter2.currentPv - attack.degats);
        this.log(`<span class="text-primary">${this.fighter1.nom}</span> utilise <strong>${attack.type}</strong> et inflige <strong>${attack.degats}</strong> dégâts !`);
        this.updateHealth(this.fighter2, this.fighter2.currentPv, 2);

        this.setPlayerActionsEnabled(false);
        this.checkWinCondition();

        if (this.isFighting) {
            this.isPlayerTurn = false;
            this.processTurn();
        }
    }

    enemyAttack() {
        if (!this.isFighting || this.isPlayerTurn) return;

        if (this.fighter2.comportement.toLowerCase() === 'passif') {
            this.log(`<span class="text-secondary">${this.fighter2.nom}</span> est pacifique et passe son tour.`);
        } else {
            const attack = this.getRandomDamage(this.fighter2Damages);
            
            this.fighter1.currentPv = Math.max(0, this.fighter1.currentPv - attack.degats);
            this.log(`<span class="text-danger">${this.fighter2.nom}</span> riposte avec <strong>${attack.type}</strong> et inflige <strong>${attack.degats}</strong> dégâts !`);
            this.updateHealth(this.fighter1, this.fighter1.currentPv, 1);
            
            this.checkWinCondition();
        }

        if (this.isFighting) {
            this.turn++;
            this.isPlayerTurn = true;
            this.processTurn();
        }
    }

    checkWinCondition() {
        if (this.fighter2.currentPv <= 0) {
            this.endFight(this.fighter1.nom, true);
        } else if (this.fighter1.currentPv <= 0) {
            this.endFight(this.fighter2.nom, false);
        }
    }

    endFight(winnerName, playerWon) {
        this.isFighting = false;
        this.setPlayerActionsEnabled(false);
        
        const turnIndicator = document.getElementById('turn-indicator');
        turnIndicator.textContent = "Combat terminé";
        turnIndicator.className = 'badge bg-dark';

        if (playerWon === null) {
            // Le match nul est déjà géré dans le log, on peut laisser vide
        } else if (playerWon) {
            this.log(`<span class="text-success fs-5">Victoire ! ${winnerName} a gagné le combat !</span>`);
        } else {
            this.log(`<span class="text-danger fs-5">Défaite... ${winnerName} vous a vaincu.</span>`);
        }

        const startBtn = document.getElementById('start-fight');
        if (startBtn) {
            startBtn.style.display = 'inline-block';
            startBtn.disabled = true;
        }
    }
}

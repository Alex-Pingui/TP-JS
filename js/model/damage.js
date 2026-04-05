export default class Damage {
    #id;
    #type;
    #degats;

    constructor(entityId, data) {
        this.#id = entityId;
        this.#type = data["type"];
        this.#degats = data["degats"];
    }

    get id() { return this.#id; }

    get type() { return this.#type; }

    get degats() { return this.#degats; }

    showDamage() {
        return /*html*/`
            <div class="card mb-2">
                <div class="card-body">
                    <h6 class="card-title">Type: ${this.#type}</h6>
                    <p class="card-text">Dégâts: <strong>${this.#degats}</strong></p>
                </div>
            </div>
        `;
    }

    toString() {
        return `Dégât causé par ${this.#id} de type ${this.#type}: -${this.#degats}pv`;
    }
}

export default class Damage {
    #id;
    #type;
    #degats;

    constructor(entityId, data){
        this.#id = entityId;
        this.#type = data["type"];
        this.#degats = data["degats"];
    }

    showDamage(){
        return '<section class="damage">' +
            '<p>Type: ${this.#type}</p>' +
            '<p>Dégats: ${this.#degats}</p>' +
            '</section>';
    }

    toString(){
        return `Dégat causé par ${this.#id} de type ${this.#type}: -${this.#degats}pv`;
    }
}
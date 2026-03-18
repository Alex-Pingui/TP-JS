export default class Damage {
    #id;
    #type;
    #degats;

    constructor(data){
        this.#id = data["id"];
        this.#type = data["type"];
        this.#degats = data["degats"];
    }

    toString(){
        return `Dégat causé par ${this.#id} de type ${this.#type}: -${this.#degats}pv`;
    }
}
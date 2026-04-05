export default class Armor{
    #material;
    #successProbability;

    constructor(data){
        this.#material = data["material"];
        this.#successProbability = data["successProbability"];
    }

    get material() { return this.#material; }
    get successProbability() { return this.#successProbability; }

    tryToProtect(){
        const random = Math.random();
        return random < this.#successProbability;
    }
}
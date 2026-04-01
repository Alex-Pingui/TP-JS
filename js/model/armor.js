export default class Armor{
    #material;
    #successProbability;

    constructor(data){
        this.#material = data["material"];
        this.#successProbability = data["successProbability"];
    }

    tryToProtect(){

    }
}
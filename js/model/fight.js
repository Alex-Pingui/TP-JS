import EntitiesProvider from "../services/entities_provider.js";

export default class Fight{
    #entity1;
    #entity2;
    #winner;
    #note;

    constructor(entity1, entity2, winner, note){
        this.#entity1 = entity1;
        this.#entity2 = entity2;
        this.#winner = winner;
        this.#note = note;
    }

    static async fromJson(json){
        let entity1=await EntitiesProvider.fetchEntity(json["entity1"]);
        let entity2=await EntitiesProvider.fetchEntity(json["entity2"]);
        let winner=await EntitiesProvider.fetchEntity(json["winner"]);

        console.log(entity1);

        return new Fight(
            entity1,
            entity2,
            winner,
            json["note"]
        );
    }

    toJson(){
        return {
            "entity1": this.#entity1.id,
            "entity2": this.#entity2.id,
            "winner": this.#winner.id,
            "note": this.#note
        };
    }

    get entity1(){
        return this.#entity1;
    }

    get entity2(){
        return this.#entity2;
    }

    get winner(){
        return this.#winner;
    }

    get note(){
        return this.#note;
    }
}
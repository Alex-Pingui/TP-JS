export default class Fight{
    #entityId1;
    #entityId2;
    #winnerId;
    #note;

    constructor(entity1, entity2, winner, note){
        this.#entityId1 = entity1.id;
        this.#entityId2 = entity2.id;
        this.#winnerId = winner.id;
        this.#note = note;
    }

    toJson(){
        return {
            "entity1": this.#entityId1,
            "entity2": this.#entityId2,
            "winner": this.#winnerId,
            "note": this.#note
        };
    }
}
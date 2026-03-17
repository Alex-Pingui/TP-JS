export class Entity{
    #id;
    #nom;
    #type;
    #pv;
    #hauteur;
    #largeur;
    #image;

    constructor(data){
        this.#id = data["id"];
        this.#nom = data["nom"];
        this.#type = data["type"];
        this.#pv = data["pv"];
        this.#hauteur = data["hauteur"];
        this.#largeur = data["largeur"];
        this.#image = data["image"];
    }

    toString(){
        return `Entité ${this.#nom}`;
    }
}
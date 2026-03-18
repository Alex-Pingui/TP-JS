export default class Entity{
    #id;
    #nom;
    #comportement;
    #categories;
    #description;
    #pv;
    #hauteur;
    #largeur;
    #image;

    constructor(data){
        this.#id = data["id"];
        this.#nom = data["nom"];
        this.#comportement = data["comportement"];
        this.#categories = data["categories"];
        this.#description = data["description"];
        this.#pv = data["pv"];
        this.#hauteur = data["hauteur"];
        this.#largeur = data["largeur"];
        this.#image = data["image"];
    }

    toString(){
        return `Entité ${this.#nom}`;
    }
}
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

    get id() { return this.#id; }

    get nom() { return this.#nom; }

    get comportement() { return this.#comportement; }

    get categories() { return this.#categories; }

    get description() { return this.#description; }

    get pv() { return this.#pv; }

    get hauteur() { return this.#hauteur; }

    get largeur() { return this.#largeur; }
    
    get image() { return this.#image; }

    toString(){
        return `Entité ${this.#nom}`;
    }
}
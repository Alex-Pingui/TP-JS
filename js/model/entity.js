import loadImage from "../utils/image_loading.js";

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
    #armor;

    #selectedToFight;

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
        this.#armor = null;
        this.#selectedToFight=false;
    }

    get armor() { return this.#armor; }
    set armor(armor) { this.#armor = armor; }

    get id() { return this.#id; }

    get nom() { return this.#nom; }

    get comportement() { return this.#comportement; }

    get categories() { return this.#categories; }

    get description() { return this.#description; }

    get pv() { return this.#pv; }

    get hauteur() { return this.#hauteur; }

    get largeur() { return this.#largeur; }
    
    get image() { return this.#image; }

    get isSelected(){
        return this.#selectedToFight;
    }

    set selectedToFight(selectedToFight){
        this.#selectedToFight = selectedToFight;
    }
    render(entityDamages){
        let damagesList="";
        if(entityDamages.length>0){
            damagesList+="<ul>";
            entityDamages.forEach(damage => {
                damagesList+="<li>" +
                    damage.showDamage() +
                    "</li>";
            });
            damagesList+="</ul>";
        }
        else{
            damagesList+="<p>Aucun dégats ne peut être affligé par cet entité</p>"
        }

        return `<section id='${this.#id}'>` +
            `<h1>Entité ${this.#nom}</h1>` +
            loadImage(`images/${this.#image}`, `Image de l'entité ${this.#nom}`) +
            `<p>PV: ${this.#pv}</p>` +
            '<h2>Description</h2>' +
            `<p>${this.#description}</p>` +
            this.#showCaracteristiques() +
            `<h2>Dégats affligeables par ${this.#nom}</h2>` +
            damagesList +
            "</section>";
    }

    #showCaracteristiques(){
        let categoriesUl="<ul>";
        for(let categorie of this.#categories){
            categoriesUl+=`<li>${categorie}</li>`;
        }
        categoriesUl+=`</ul>`;

        return '<section class="caracteristiques">' +
            '<h2>Caractéristiques</h2>' +
            `<p><strong>Comportement</strong>: ${this.#comportement}</p>` +
            '<p><strong>Catégories: </strong></p>' +
            categoriesUl +
            `<p>Hauteur: ${this.#hauteur} | Largeur: ${this.#largeur}</p>` +
            '</section>';
    }

    toString(){
        return `Entité ${this.#nom}`;
    }
}
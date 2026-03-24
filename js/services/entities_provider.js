import {ENDPOINT} from "../config.js";
import Entity from "../model/entity.js";
import Damage from "../model/damage.js";

export default class EntitiesProvider{
    static async fetchEntities(){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let entities=await fetch(`${ENDPOINT}/entites`, options);
        let json=entities.json();

        let entitiesList=[];
        json.then(
            list => {
                list.forEach(entityData => entitiesList.push(new Entity(entityData)));
                entitiesList.forEach(entity => console.log(entity.toString()));
                return entitiesList;
            }
        ).catch(error => console.log(error));
    }

    static async fetchEntity(id){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let entity=await fetch(`${ENDPOINT}/entites/${id}`, options);
        let entityData=await entity.json();
        return new Entity(entityData);
    }

    static async fetchDamages(){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let damages=await fetch(`${ENDPOINT}/degats`, options);
        let json=damages.json();

        let damagesList=[];
        json.then(
            list => {
                list.forEach(damage => damagesList.push(new Damage(damage)));
                damagesList.forEach(damage => console.log(damage.toString()));
                return damagesList;
            }
        ).catch(error => console.log(error));
    }

    static async fetchEntityDamages(id){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let damages=await fetch(`${ENDPOINT}/degats/${id}`, options);
        let damagesList = [];
        if(damages.ok) {
            let damagesData = await damages.json();
            console.log(damagesData);

            damagesData["degats"].forEach(damage => damagesList.push(new Damage(damagesData["id"], damage)));
        }
        return damagesList;
    }
}
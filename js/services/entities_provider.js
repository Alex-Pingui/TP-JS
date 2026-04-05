import {ENDPOINT} from "../config.js";
import Entity from "../model/entity.js";
import Damage from "../model/damage.js";
import Armor from "../model/armor.js";
import Fight from "../model/fight.js";

export default class EntitiesProvider{
    static async fetchEntities(){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(`${ENDPOINT}/entites`, options);
        const list = await response.json();
        return list.map(entityData => new Entity(entityData));
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

    static async fetchArmors(){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let armors=await fetch(`${ENDPOINT}/armors`, options);
        let armorsList=[];
        if(armors.ok) {
            let armorsData = await armors.json();
            let armorsArray = Array.isArray(armorsData) ? armorsData : (armorsData["armors"] || []);
            armorsArray.forEach(armor => armorsList.push(new Armor(armor)));
        }
        return armorsList;
    }

    static async addFight(fight){
        const options={
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fight.toJson())
        };
        await fetch(`${ENDPOINT}/fights`, options);
    }

    static async fetchFights(){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let response=await fetch(`${ENDPOINT}/fights`, options);
        let fights=[];
        if(response.ok) {
            let fightsData = await response.json();
            fights=Promise.all(
                fightsData.map(fight => Fight.fromJson(fight))
            );
        }
        return fights;
    }
}
import {ENDPOINT} from "../config.js";
import {Entity} from "../model/entity.js";

export default class EntitiesProvider{
    static async fetchEntities(){
        const options={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let entities=await fetch(`${ENDPOINT}/entities`, options);
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
}
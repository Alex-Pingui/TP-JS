import EntitiesProvider from "../services/entities_provider.js";

export default class EntityData{
    static async render(entityId){
        let entity=await EntitiesProvider.fetchEntity(entityId);
        console.log(entity.toString());
        let entityDamages=await EntitiesProvider.fetchEntityDamages(entityId);
        return entity.render(entityDamages);
    }
}
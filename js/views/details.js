import EntitiesProvider from "../services/entities_provider.js";

export default class DetailsEntite{
    async render(){
        let entity=await EntitiesProvider.fetchEntity(1);
        console.log(entity);
    }
}
import EntitiesProvider from "../services/entities_provider.js";
import Utils from "../services/ParsedURL.js";

export default class EntityDetail {
    constructor() {
        this.entityId = null;
        this.entity = null;
        this.damages = null;
    }

    async render() {
        const request = Utils.parseRequestURL();
        this.entityId = request.id;
        
        if (!this.entityId) {
            return `<h2>Entité non trouvée</h2>`;
        }
        this.entity = await EntitiesProvider.fetchEntity(this.entityId);
        this.damages = await EntitiesProvider.fetchEntityDamages(this.entityId);
        
        if (!this.entity) {
            return `<div class="alert alert-warning">Entité ${this.entityId} introuvable</div>`;
        }
        return this.entity.render(this.damages);
    }

    async after_render() {
        console.log('EntityDetail rendered:', this.entityId, this.entity);
    }
}

let tempData = {
    "entities": [
        {
            "id": 1,
            "nom": "Villager",
            "type": "passif",
            "pv": 20,
            "hauteur": 1.95,
            "largeur": 0.6
        },
        {
            "id": 2,
            "nom": "Zombie",
            "type": "hostile",
            "pv": 20,
            "hauteur": 1.95,
            "largeur": 0.6
        }
    ]
};

export default class EntityAll {
  render(container) {
    container.innerHTML = `
      <main>
        <h1>Tous les entités</h1>
        <p>Liste des entités disponibles.</p>
        <ul id="entity-list"></ul>
      </main>
    `;
    tempData.entities.forEach(entity => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entity.id} ${entity.nom} (Type: ${entity.type}, PV: ${entity.pv}, Hauteur: ${entity.hauteur}m, Largeur: ${entity.largeur}m)`;
        document.getElementById("entity-list").appendChild(listItem);
    });
    // EntityProvider.getAll()
    //     .then(entities => {
    //         const list = document.getElementById("entity-list");
    //         entities.forEach(entity => {
    //             const listItem = document.createElement("li");
    //             listItem.textContent = `${entity.id} ${entity.nom} (Type: ${entity.type}, PV: ${entity.pv}, Hauteur: ${entity.hauteur}m, Largeur: ${entity.largeur}m)`;
    //             list.appendChild(listItem);
    //         });
    //     })
    //     .catch(error => {
    //         const list = document.getElementById("entity-list");
    //         list.innerHTML = `<p>Erreur : ${error.message}</p>`;
    //     });
  }
}

export default class About {
  async render() {
    return `
      <main>
        <h1>À propos</h1>
        <p>Vous trouverez ici les informations sur l'application.</p>
        <p>Cette application a été développée pour gérer les entités et leurs interactions.</p>
        <p>Elle utilise une architecture SPA (Single Page Application) avec du JavaScript moderne.</p>
        <p>Les données sont récupérées depuis une API REST, et l'interface est conçue pour être réactive et facile à utiliser.</p>
        <p>Si vous avez des questions ou des suggestions, n'hésitez pas à consulter nos profils !</p>
        <p>Développé par <a href="https://github.com/Lasufa" target="_blank" rel="noopener noreferrer">Franchet Sileye</a>
         et <a href="https://github.com/Alex-Pingui" target="_blank" rel="noopener noreferrer">Guihard Alexandre</a>, étudiants en informatique.</p>
        <p>Merci de votre visite !</p>
      </main>
    `;
  }
}

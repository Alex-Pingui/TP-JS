# SPA Entités Minecraft

## Groupe

### Alexandre GUIHARD
### Sileye FRANCHET

## Utilisation

## Serveur

Avant de lancer un client, il faut tout d'abord lancer le serveur json qui va effectuer
les différentes intéractions avec le json grâce à la commande suivante exécutée à la racine du projet
```bash
npx json-server --watch data/entities.json
```

## Client

Pour lancer un client, vous devez exécuter, à la racine du projet la commande ci-dessous:
```bash
php -S localhost:8000
```
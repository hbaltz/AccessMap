# AccessMap
![Logo](/AccessMap/src/assets/logo.png)

Une carte interactive pour voir l'accessibilité des lieux pour les personnes en situation de handicap

## Données :

J'utilise les données de [Acceslibre](https://acceslibre.beta.gouv.fr/) pour afficher les établissements. N'hésitez pas à aller sur leur site pour voir ce qu'ils font. De plus vous pouvez devenir contributeur pour aider à étoffer la base de données des établissements accessibles aux personnes en situation de handicap.

## Dépendances du projet
* Node.js : ^18.19.1 || ^20.11.1 || ^22.0.0 	

## Comment lancer le projet

Pour le moment, je ne documenterais ici que comment le lancer en mode 'développement'.

1. Créer un fichier d'environnement de développement en vous basant sur [./src/environments/environment.ts](./src/environments/environment.ts), dans ce même dossier créer un fichier nommé `environment.development.ts`. Vous pouvez le faire avec la commande suivante:

```bash
cp ./src/environments/environment.ts ./src/environments/environment.development.ts
```

2. Dans [./src/environments/environment.development.ts](./src/environments/environment.development.ts) remplissez la valeur `ACCES_LIBRE_API_KEY` avec votre clé api accès libre (contacter accès libre si vous n'en avez pas déjà une).

3. Installez les dépendances du projet
```bash
npm i
```

4. Lancez le projet 
```bash
npm start
```

5. Allez sur [http://localhost:4200/](http://localhost:4200/) pour voir le site
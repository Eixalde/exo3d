# CONTRIBUTING

## NPM to handle web related dependancies

On a debian derivative (for example Ubuntu):

```shell
sudo apt install nodejs npm
```

## Outils utilisé pour la qualité de code

### Pre-commit to have safe commits

The project needs pre-commit for any contribution so we need to install it on the dev machine :

```shell
pip3 install pre-commit
```

And then we need to install it in the project to activate the gitt hooks :

```shell
pre-commit install
```
We also need to install some tools needed by pre-commit to install its plugins dependancies:

```shell
sudo apt install ruby-dev
```

### Standardjs et Snazzy pour linter le code javascript

```shell
npm install standard --global
npm install snazzy --global
```

### Les dépendance locales

Ceci permet d'installer toutes les dépendances locale diu projet (comme par exemple jest le gestionnaire de test) :

```shell
npm install
```

Il est possible que cela affiche quelques "vulnerabilities" due à des dépendances de jest. Ce n'est pas grave car il ne sera pas déployé en production.

## Prettier setup on VSCode

<https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code>

Also use the .prettierrc.json config file to get the right config for your own VSCode.

## Comment lancer les tests ?

Comme nous utilisons les ESM (ECMAcript modules) on ne peut pas utiliser
la commande simple `npm test` mais à la place il faut utiliser la commande
(qui active lsupport de ESM):

```shell
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

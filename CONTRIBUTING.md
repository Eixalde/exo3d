# CONTRIBUTING

## NPM to handle web related dependancies

On Ubuntu the default version of node.js is way outdated. So we need to use a
PPA to get the minimal version that support ECMAscrip Module (14.13.1).

See [How To Install Node.js on Ubuntu 20.04 - with Apt Using a NodeSource PPA](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04#option-2-%E2%80%94-installing-node-js-with-apt-using-a-nodesource-ppa)

Then you can install NPM:

```shell
sudo apt install npm
```

## Tools for the quality of the code

### Pre-commit to have safe commits

The project needs pre-commit for any contribution so we need to install it on
the dev machine:

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

### Local dependencies

This allows to install all local dependencies of the project (e.g. the test
manager "jest")

```shell
npm install
```

There may be "vulnerabilities" involved, due to jest's dependencies. It isn't a
problem because jest won't be deployed in production.

## Prettier setup on VSCode

[How To Format Code with Prettier in Visual Studio Code](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code)

Also use the .prettierrc.json config file to get the right config for your own VSCode.

## How to launch tests

As we are using ESM (ECMAscript modules) we can't use the command `npm test` but
instead we use the following (enables ESM support) :

```shell
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

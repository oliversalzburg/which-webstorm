# which-webstorm

Finds WebStorm

[![NPM Version](https://img.shields.io/npm/v/which-webstorm)](https://www.npmjs.com/package/which-webstorm) [![QA](https://github.com/oliversalzburg/which-webstorm/actions/workflows/qa.yml/badge.svg)](https://github.com/oliversalzburg/which-webstorm/actions/workflows/qa.yml)

## Usage

### As a module

```js
import whichWebstorm from "which-webstorm";
console.log(await whichWebstorm()); // prints path to WebStorm binary
console.log(whichWebstorm.sync()); // prints path to WebStorm binary
```

### As a command

```shell
$ which-webstorm
C:\Program Files (x86)\JetBrains\WebStorm 163.4396.14\bin\WebStorm.exe
```

### Opening a WebStorm project

Open the current working directory in WebStorm:

```shell
$ wstorm
```

Open a specific directory in WebStorm:

```shell
$ wstorm /home/oliver/projects/which-webstorm
```

## Release Process

```
npm version patch --message "chore: Version bump %s"
```

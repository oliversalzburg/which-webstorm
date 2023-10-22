# which-webstorm

Finds WebStorm

[![QA](https://github.com/oliversalzburg/which-webstorm/actions/workflows/qa.yml/badge.svg)](https://github.com/oliversalzburg/which-webstorm/actions/workflows/qa.yml)

## Usage

### As a module

```js
const whichWebstorm = require("which-webstorm");
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

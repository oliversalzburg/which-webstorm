# which-webstorm

Finds WebStorm

[![QA](https://github.com/oliversalzburg/which-webstorm/actions/workflows/test.yml/badge.svg)](https://github.com/oliversalzburg/which-webstorm/actions/workflows/test.yml)

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

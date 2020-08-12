# which-webstorm

Finds WebStorm

[![Build Status](https://travis-ci.org/oliversalzburg/which-webstorm.svg?branch=master)](https://travis-ci.org/oliversalzburg/which-webstorm)

## Usage

### As a module

```js
const whichWebstorm = require("which-webstorm");
console.log(whichWebstorm()); // prints path to WebStorm binary
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

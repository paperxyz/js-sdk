#!/usr/bin/env node
const shell = require("shelljs");

console.log("hi");
shell.exec("yarn manypkg check");
shell.exec("yarn turbo prune --scope=paper-web --docker");
shell.exec("cp ./out/yarn.lock ./apps/paper-web/");

shell.exit(0);

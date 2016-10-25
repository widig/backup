declare function require(name:string);

var fs = require("fs");

console.log(fs.readFileSync("index.js","utf8"));

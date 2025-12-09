const fs = require('node:fs');
fs.writeFileSync('./new.txt', 'some text');
fs.copyFileSync('./new.txt', './newCpy.txt');
fs.renameSync('./newCpy.txt', './renamed.txt');
console.log(fs.readdirSync('.'));


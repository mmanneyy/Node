const fs = require('node:fs');
if(!fs.existsSync('./barev.txt')) {
    fs.openSync('./barev.txt', 'w+');
}
fs.writeFileSync('./barev.txt', 'bareev');
const data = fs.readFileSync('./barev.txt');
console.log(data.toString());
fs.appendFileSync('./barev.txt', ' arev');
const data2 = fs.readFileSync('./barev.txt');
console.log(data2.toString());
fs.unlinkSync('./barev.txt');
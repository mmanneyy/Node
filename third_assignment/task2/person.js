const { log } = require('node:console');
const fs = require('node:fs');
fs.readFile('./person.json', 'utf8', (err, data) => {
    if(err) throw err;
    const obj = JSON.parse(data);
    console.log(obj);
    obj.bool = true;
    obj.skills.push("dancing");
    const js = JSON.stringify(obj);
    fs.writeFileSync('./person.json', js);
    fs.writeFileSync('./new.json', js);
});

const path = require('node:path');
const fs = require('node:fs');
const filePath = process.argv[2];
console.log(filePath);
console.log(path.dirname(path.resolve(filePath)));
console.log(path.basename(filePath));
console.log(path.extname(filePath));
console.log(path.parse(filePath));
fs.readFile(filePath, 'utf8', (err, data) => {
    if(err) throw err;
    const obj = JSON.parse(data);
    obj.timestamp = Date.now();
    const str = JSON.stringify(obj);
    const outputDir = './output';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const outputPath = path.join(outputDir, path.basename(filePath));
    fs.writeFileSync(outputPath, str, 'utf8', (err) => {
        if(err) throw err;
    });
    const bf = Buffer.from(str);
    const hx = bf.toString('hex');
    const tmpBf = Buffer.from(hx, 'hex');
    const finalBf = tmpBf.toString();
})
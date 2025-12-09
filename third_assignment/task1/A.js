const path = require('node:path');
console.log(__dirname);
console.log(__filename);
console.log(path.basename(__filename));
console.log(path.extname(__filename));
const p = path.join("src", "utils", "data.json");
console.log(p);
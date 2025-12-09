const path = require('node:path');
const nP = path.normalize('./User/Desktop///folder/file');
console.log(nP);
const prs = path.parse('~/Desktop/Node/third_assignment/task1/B.js');
console.log(prs);
const frmt = path.format(prs);
console.log(frmt);

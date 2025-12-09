const res = require('./mixExports');
console.log(res);
//prints 1 and 2, cause the first 2 lines are adding keys and values to the module.exports object
//the third line is changing the reference of exports to another different object
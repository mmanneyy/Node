const a = require('./counter');
console.log(a);
console.log('hi');
delete require.cache[require.resolve('./counter')]
const b = require('./counter');
console.log(b);
//we delete the object from the cache, that's why when we require it the 2nd time it executes the module again
const {addInCache, deletee} = require('./ownCache');
const a = addInCache('./smth');
console.log(a);
const b = addInCache('./smth');
console.log(b);
deletee('./smth');
const c = addInCache('./smth');
console.log(c);

const a = require('./counter');
console.log(a);
const b = require('./counter');
console.log(b);
const c = require('./counter');
console.log(c);

//առաջին require֊ի ժամանակ բերում ա require֊ի cache֊ի մեջ տեղադրում ա տվյալ օբյեկտը, հետագայում արդեդն ավելանում են argumnet֊ները, բայց
//cache֊ը մնում ա 0 lenght֊ով
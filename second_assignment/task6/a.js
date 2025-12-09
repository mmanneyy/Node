console.log("A starts");
require('./b');
console.log("A ends");

//it loads a.js, then starts loading b.js. Since a.js is already loaded, 
// Node should resolve the b.js fully and then continue resolving a.js
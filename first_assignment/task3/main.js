const {User, validateUser, ROLE} = require("./userService.js");

const Bob = new User("Bob", 24, "builder");
ROLE.push(Bob.role);
console.log(validateUser(Bob));
console.log(ROLE);


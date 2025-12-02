class User {
    constructor(name, age, role) {
        this.name = name;
        this.age = age;
        this.role = role;
    }
}

function validateUser(user) {
    if(user && user.name && user.age && user.role) return true;
    return false;
}

const ROLE = [];

module.exports = {User, validateUser, ROLE};
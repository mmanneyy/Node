console.log("Inside x");
const y = require('./y');
module.exports = {
    value: 'x value',
    yvalue: y.value
}
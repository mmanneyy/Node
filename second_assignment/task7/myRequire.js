const fs = require('fs');
const path = require('path');

function myRequire(fPath) {
    const full = path.resolve(fPath);
    const text = fs.readFileSync(full);
    const module = {exports: {}};
    const wrapper = new Function('exxports','require', 'module', '__filename', '__dirname', text);
    wrapper(module.exports, myRequire, module, full, path.dirname(full));
    return module.exports;
}

module.exports = myRequire;
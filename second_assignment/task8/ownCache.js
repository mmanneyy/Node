const myCache = {};

function addInCache(path) {
    if(myCache[path]) {
        console.log(`from cache: ${myCache[path]}`);
        return myCache[path].exports;
    }

    const module = {exports: {}};   
    if(path === './smth') {
        module.exports.value = Math.random();
    }
    myCache[path] = module;
    return module.exports;
}

function deletee(path) {
    delete myCache[path];
}

module.exports = {myCache, addInCache, deletee};
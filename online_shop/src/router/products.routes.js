const fs = require ('node:fs');
const path = require('node:path');
const parseURL = require('../utils/parseURL');
const sendRes = require('../utils/sendResponse');
const PRODUCTS_FILE = path.join(__dirname, '..', '..', 'data', 'products.json');
const bodyParser = require('../utils/bodyParser');
const { title } = require('node:process');
function findProduct() {
    if(!fs.existsSync(PRODUCTS_FILE)) return [];
    const str = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    if(!str) return [];
    return JSON.parse(str);
}
function saveProduct(product) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(product, null, 2), 'utf-8');
}
function nextId(products) {
    if(products.length === 0) return 1;
    return Math.max(...products.map(u => u.id)) + 1;
}
function productUpdate(product, field, data) {
    if(field !== 'title' && field !== 'price' && field !== 'inStock') return false;
    if(field === 'title') {
        if(typeof data !== 'string') return false;
        product.title = data;
    }
    if(field === 'price') {
        if(typeof data !== 'number') return false;
        product.price = data;
    }
    if(field === 'inStock') {
        if(typeof data !== 'boolean') return false;
        product.inStock = data;
    }
}

module.exports = function products(req, res) {
    const {pathName, resourceId} = parseURL(req.url);
    if(pathName !== '/products') {
        return false;
    }
    if(req.method === 'GET' && !resourceId) {
        try {
            const products = findProduct();
            sendRes(res, 200, products);
        } catch (err) {
            sendRes(res, 500, { error: 'failed to read the file'});
        }
        return true;
    }
    if(req.method === 'GET' && resourceId) {
        try {
            const products = findProduct();
            const product = products.find(u => String(u.id) === String(resourceId));
            if(!product) {
                sendRes(res, 404, {error: 'product not found'});
                return true;
            }
            sendRes(res, 200, product);
        } catch (err) {
            sendRes(res, 500, { error: 'failed to read the file'});
        }
        return true;
    }
    if(req.method === 'POST' && resourceId) {
        sendRes(res, 400, {error: 'POST must not include the id'});
        return true;
    }
    if(req.method === 'POST' && !resourceId) {
        bodyParser(req)
        .then((data) => {
            if(data.title === undefined || typeof data.title !== 'string' || 
                data.price === undefined || typeof data.price !== 'number' ||
                data.inStock === undefined || typeof data.inStock !== 'boolean') {
                    sendRes(res, 400, {error: 'all the fields are required for posting the product'});
                    return;
                }
                const products = findProduct();
                const newProduct = {
                    id: nextId(products),
                    title: data.title,
                    price: data.price,
                    inStock: data.inStock
                }
                products.push(newProduct);
                saveProduct(products);
                sendRes(res, 201, newProduct);
        })
        .catch((err) => {sendRes(res, 400, {error: err.message})});
        return true;
    }
    if(req.method === 'PUT' && !resourceId) {
        sendRes(res, 400, {eroor: 'product\'s id is required'});
        return true;
    }
    if(req.method === 'PUT' && resourceId) {
        const products = findProduct();
        const product = products.findIndex(u => String(u.id) === String(resourceId));
        if(product === -1) {
            sendRes(res, 404, {error: 'product not found'});
            return;
        }
        bodyParser(req) 
        .then((data) => {
            if(!data || (data.title === undefined && data.price === undefined && data.inStock === undefined)) {
                sendRes(res, 400, {error: 'provide at least one field: title, price, inStock'});
                return;
            }
            if(data.title !== undefined) {
                if(typeof data.title !== 'string') {
                    sendRes(res, 400, {error: 'title must be string'});
                    return;
                }
                productUpdate(products[product], 'title', data.title);
            }
            if(data.price !== undefined) {
                if(typeof data.price !== 'number') {
                    sendRes(res, 400, {error: 'price must be a number'});
                    return;
                }
                productUpdate(products[product], 'price', data.price);
            }
            if(data.inStock !== undefined) {
                if(typeof data.inStock !== 'boolean') {
                    sendRes(res, 400, {error: 'inStock must be boolean'});
                    return;
                }
                productUpdate(products[product], 'inStock', data.inStock);
            }
            saveProduct(products);
            sendRes(res, 200, products[product]);
        })
        .catch ((err) => sendRes(res, 400, {error: err.message}));
        return true;
    }
    if(req.method === 'DELETE' && !resourceId) {
        sendRes(res, 400, {error: 'user nnot found'});
        return true;
    }
    if(req.method === 'DELETE' && resourceId) {
        const products = findProduct();
        const product = products.findIndex(p => String(p.id) === String(resourceId));
        if(product === -1) {
            sendRes(res, 400, {error: 'product not found'});
            return true;
        }
        const deletedPrdct = product.spliec(product, 1)[0];
        saveProduct(products);
        sendRes(res, 200, deletedPrdct);
        return true;
    }
    sendRes(res, 405, {error: 'method not allowed'});
    return true;
}
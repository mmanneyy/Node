const fs = require('node:fs');
const path = require('node:path');
const parseURL = require('../utils/parseURL');
const bodyParser = require('../utils/bodyParser');
const sendRes = require('../utils/sendResponse');
const USERS_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');
const PRODUCTS_FILE = path.join(__dirname, '..', '..', 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, '..', '..', 'data', 'orders.json');
function findOrders() {
    if(!fs.existsSync(ORDERS_FILE)) return [];
    const str = fs.readFileSync(ORDERS_FILE, 'utf-8');
    if(!str) return [];
    return JSON.parse(str);
}
function saveOrder(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}
function nextId(orders) {
    if(orders.length === 0) return 1;
    return Math.max(...orders.map(o => o.id)) + 1;
}
function orderUpdate(order, field, data) {
    if(field !== 'quantity') return false;
    order.quantity = data;
}
module.exports = function orders(req, res) {
    const {pathName, resourceId} = parseURL(req.url);
    if(pathName !== '/orders') {
        return false;
    }
    if(req.method === 'GET' && !resourceId) {
        try {
            const orders = findOrders();
            sendRes(res, 200, orders);
        } catch (err) {
            sendRes(res, 500, {error: 'failed to read the file'});
        }
        return true;
    }
    if(req.method === 'GET'  && resourceId) {
        try{
            const orders = findOrders();
            const order = orders.find(o => String(o.id) === String(resourceId));
            if(!order) {
                sendRes(res, 404, {error: 'order not found'});
                return true;
            }
            sendRes(res, 200, order);
        } catch (err) {
            sendRes(res, 500, {error: 'failed to read the file'});
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
            if(data.userId === undefined || data.productId === undefined || data.quantity === undefined) {
                sendRes(res, 400, {error: 'user id, product id and quantity are required'});
                return true;
            } 
            if(typeof data.userId !== 'number') {
                sendRes(res, 400, {error: 'users id should be of type number'});
                return;
            }
            if(typeof data.productId !== 'number') {
                sendRes(res, 400, {error: 'products id should be of type number'});
                return;
            }
            if(typeof data.quantity !== 'number') {
                sendRes(res, 400, {error: 'product quantity should be of type number'});
                return;
            }
            if(data.quantity <= 0) {
                sendRes(res, 400, {error: 'quantity must be grater than 0'});
                return;
            }
            if(!fs.existsSync(USERS_FILE)) {
                sendRes(res, 500, {error: 'users data does not exist'});
                return;
            }
            const ustr = fs.readFileSync(USERS_FILE, 'utf-8');
            const users = ustr ? JSON.parse(ustr) : [];
            const user = users.find(u => String(u.id) === String(data.userId));
            if(!user) {
                sendRes(res, 404, {error: 'user not found'});
                return;
            }
            if(!fs.existsSync(PRODUCTS_FILE)) {
                sendRes(res, 500, {error: 'products data not found'});
                return;
            }
            const pstr = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
            const products = pstr ? JSON.parse(pstr) : [];
            const product = products.find(p => String(p.id) === String(data.productId));
            if(!product) {
                sendRes(res, 404, {error: 'product not found'});
                return;
            }
            if(product.inStock !== true) {
                sendRes(res, 409, {error: 'product is out of stock'});
                return;
            }
            const orders = findOrders();
            const newOrder = {
                id: nextId(orders),
                userId: data.userId, 
                productId: data.productId, 
                quantity: data.quantity
            };
            orders.push(newOrder);
            saveOrder(orders);
            sendRes(res, 201, newOrder);
        })
        .catch((err) => sendRes(res, 400, {error: err.message}));
        return true;
    }
    if(req.method === 'PUT' && !resourceId) {
        sendRes(res, 400, {error: 'order\'s id is required'});
        return true;
    }
    if(req.method === 'PUT' && resourceId) {
        const orders = findOrders();
        const order = orders.findIndex(o => String(o.id) === String(resourceId));
        if(order === -1) {
            sendRes(res, 404, {error: 'order not found'});
            return true;
        }
        bodyParser(req)
        .then((data) => {
            if(!data || data.quantity === undefined) {
                sendRes(res, 400, {error: 'quantity is required'});
                return;
            }
            if(typeof data.quantity !== 'number' || data.quantity <= 0) {
                sendRes(res, 400, {error: 'quantity must be greater than 0'});
                return;
            }
            orderUpdate(orders[order], 'quantity', data.quantity);
            saveOrder(orders);
            sendRes(res, 200, orders[order]);
        })
        .catch((err) => sendRes(res, 400, {error: err.message}));
        return true;
    }
    if(req.method === 'DELETE' && !resourceId) {
        sendRes(res, 400, {error: 'order id is required'});
        return true;
    }
    if(req.method === 'DELETE' && resourceId) {
        const orders = findOrders();
        const order = orders.findIndex(o => String(o.id) === String(resourceId));
        if(order === -1) {
            sendRes(res, 404, {error: 'order not found'});
            return;
        }
        const deletedOrd = orders.splice(order, 1)[0];
        saveOrder(orders);
        sendRes(res, 200, deletedOrd);
        return true;
    }
    sendRes(res, 405, {error: 'method not allowed'});
    return true;
}
const fs = require('node:fs');
const path = require('node:path');
const parseURL = require('../utils/parseURL');
const sendRes = require('../utils/sendResponse');   
const USERS_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');
const bodyParser = require('../utils/bodyParser');
function findUser() {
    if(!fs.existsSync(USERS_FILE)) return [];
    const str = fs.readFileSync(USERS_FILE, 'utf-8');
    if(!str) return [];
    return JSON.parse(str);
}
function saveUser(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}
function nextId(users) {
    if(users.length === 0) return 1;
    return Math.max(...users.map(u => u.id)) + 1;
}
function userUpdate(user, field, data) {
    if(field !== 'email' && field !== 'name') return false;
    if(field === 'email') {
        user.email = data;
    }
    if(field === 'name') {
        user.name = data;
    }
}
module.exports = function users(req, res) {
    const {pathName, resourceId}  = parseURL(req.url);
    if(pathName !== '/users') {
        return false;
    }
    if(req.method === 'GET' && !resourceId) {
        try {
            const users = findUser();
            sendRes(res, 200, users);
        } catch (err) {
            sendRes(res, 500, {error: 'failed to read the file'});
        }
        return true;
    }
    if(req.method === 'GET' && resourceId) {
        try {
            const users = findUser();
            const user = users.find(u => String(u.id) === String(resourceId));
            if(!user) {
                sendRes(res, 404 , {error: 'user not found'});
                return true;
            }
            sendRes(res, 200, user);
        } catch (err) {
            sendRes(res, 500, {error: 'failed to read the file'});
        }
        return true;
    }

    if(req.method === 'POST' && resourceId) {
        sendRes(res, 400, {error: `POST must not include the id`});
        return true;
    }
    if(req.method === 'POST' && !resourceId) {
        bodyParser(req)
        .then((data) => { 
            if(!data.email || typeof data.email !== 'string') {
                sendRes(res, 400, {error: 'email is required'});
                return; 
            }
            const users = findUser();
            const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
            if(exists) {
                sendRes(res, 409, {error: 'user with that email already exists'});
                return;
            }
            const newUser = {
                id: nextId(users),
                email: data.email,
                name: data.name
            }
            users.push(newUser);
            saveUser(users);
            sendRes(res, 201, newUser);
        })
        .catch((err) => {sendRes(res, 400, { error: err.message })});
        return true;
    }
    if(req.method === 'PUT' && !resourceId) {
        sendRes(res, 400, {error: 'user\'s id is required'});
        return true;
    }
    if(req.method === 'PUT' && resourceId) {
        const users = findUser();
        const user = users.findIndex(u => String(u.id) === String(resourceId));
        if(user === -1) {
            sendRes(res, 404, {error: 'user not found'});
            return true;
        }
        bodyParser(req)
        .then((data) => {
            if (!data || (data.email === undefined && data.name === undefined)) {
                sendRes(res, 400, { error: 'provide at least one field: email or name' });
                return;
            }
            if(data.email !== undefined) {
                if(typeof data.email !== 'string' || !data.email.trim()) {
                    sendRes(res, 400, {error: 'email must be a non-emty string'});
                    return;
                }
                const emailToLwr = data.email.toLowerCase();
                const exists = users.some((u, i) => {
                    i !== user && u.email.email.toLowerCase() === emailToLwr;
                });
                if(exists) {
                    sendRes(res, 409, {error: 'user with that email already exists'});
                    return;
                }
                userUpdate(users[user], 'email', data.email);
            }
            if(data.name !== undefined) {
                if(typeof data.name !== 'string') {
                    sendRes(res, 400, {error: 'name must be a string'});
                    return;
                }
                userUpdate(users[user], 'name', data.name);
            }
            saveUser(users);
            sendRes(res, 200, users[user]);
        })
        .catch((err) => sendRes(res, 400, {error: err.message}));
        return true;
    }
    if(req.method === 'DELETE' && !resourceId) {
        sendRes(res, 400, {error: 'user id is required'});
        return true;
    }
    if(req.method === 'DELETE' && resourceId) {
        const users = findUser();
        const user = users.findIndex(u => String(u.id) === String(resourceId));
        if(user === -1) {
            sendRes(res, 404, {error: 'user not found'});
            return true;
        }
        const deletedUsr = users.splice(user, 1)[0];
        saveUser(users);
        sendRes(res, 200, deletedUsr);
        return true;
    }
    sendRes(res, 405, {error: 'Method not allowed'});
    return true;
}
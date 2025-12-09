const EventEmitter = require('node:events');
const fs = require('node:fs');
const event = new EventEmitter;
event.on('info', (str) => {
    fs.appendFileSync('./loger/iformation.log', str + '\n');
});
event.on('warn', (str) => {
    fs.appendFileSync('loger/warnings.log', str + '\n');
});
event.on('error', (str) => {
    fs.appendFileSync('./loger/error/log', str + '\n');
});
event.on('login', (str) => {
    fs.appendFileSync('./loger/login.log', str + '\n');
});
event.on('logout', (str) => {
    fs.appendFileSync('./loger/logout.log', str + '\n');
});
event.emit('info', "new information received");
event.emit('info', "new information received 2");
event.emit('login', "new user logged in");
event.emit('logout', "new user logged out");
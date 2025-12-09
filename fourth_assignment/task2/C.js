const EventEmitter = require('node:events');
const fs = require('node:fs');
const path = require('node:path');

const logger = new EventEmitter();
logger.on('info', () => {
    fs.appendFileSync('./iformation.log', 'some info');
});
logger.on('warn', () => {
    fs.appendFileSync('./warning.log', 'some warning');
});
logger.on('error', () => {
    fs.appendFileSync('./error.log', 'some error');
});

logger.emit('info');
logger.emit('warn');
logger.emit('error');
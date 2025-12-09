const EventEmitter = require('node:events');
const { emit } = require('node:process');
class EE extends EventEmitter{
    constructor() {
        super();
    }
    start() {
        this.emit('start');
    }
    end() {
        this.emit('end');
    }
}

const event = new EE;
event.on('start', () => console.log('started'));
event.on('end', () => console.log('end'));
event.start();
event.end();
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
let count = 0;

emitter.on('tick', (n) => {
    console.log('tick number', n);  
})

emitter.on('done', () => {
    console.log('done');
    clearInterval(timer);
})

const timer = setInterval(() =>{
    count++;
    emitter.emit('tick', count);
    if(count === 5) {
        emitter.emit('done');
    }

    
})

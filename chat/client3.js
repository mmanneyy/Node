require('dotenv').config();
const net = require('node:net');
const PORT = process.env.PORT;
const readLine = require('node:readline');
const client = net.connect(PORT, () => {
    console.log("Connected to server");
    
});

const rd = readLine.createInterface({input: process.stdin});

client.on('data', (data) => {
    console.log(data.toString());
    
});
rd.on('line', (data) => {
    client.write(data);
});
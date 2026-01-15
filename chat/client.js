require('dotenv').config({quiet: true});
const PORT = process.env.PORT;
const net = require('net');
const readLine = require('readline');
const client = net.createConnection(PORT, () => {
    console.log("Connected to server");
});
const rd = readLine.createInterface({input: process.stdin});
client.on('data', (data) => {
    console.log(data.toString());
});
rd.on('line', (data) => {
    client.write(data);
})
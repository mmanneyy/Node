const {PORT} = require('./configs');
const http = require('http');
const orders = require('./router/orders.routes');
const products = require('./router/products.routes');
const users = require('./router/users.routes');
const ROUTERS = [users, products, orders];
const server = http.createServer((req, res) => {
    for(const router of ROUTERS) {
        if(router(req, res)) {
            return;
        }
    }
    res.writeHead(404, {"content-type": 'application/json'});
    res.end(JSON.stringify({error: 'rout not found'}));
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
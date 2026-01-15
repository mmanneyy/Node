module.exports = function bodyParser(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString('utf-8');
        });
        req.on('end', () => {
            if(!body) {
                resolve({});
                return;
            }
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (err) {
                reject(new Error('invalid json body'));
            }
        });
        req.on('error', (err) => {
            reject(err);
        });
    })
}
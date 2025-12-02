const PORT = 3000;
const databaseURL = "https://google.com";
let isProduction = true;
function getEnvironmentInfo() {
    return `${PORT}, ${databaseURL}, ${isProduction}`
}

module.exports = {port: PORT, url: databaseURL, production: isProduction, env: getEnvironmentInfo};
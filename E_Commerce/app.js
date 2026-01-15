require('dotenv').config({quiet: true});
const express = require('express');
const app = express();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    
})
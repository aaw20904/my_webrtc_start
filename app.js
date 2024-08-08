
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https')

 const options = {
   key: fs.readFileSync("./example.key"),
   cert:fs.readFileSync("./example.crt")
 }

app.get('/xxx', (req, res) => {
    res.send('Hello World!');
});

app.use(express.static('public'));

 // Create HTTPS server
const server = https.createServer(options, app);
server.listen(443,()=>console.log("https...."));


//Run app, then load http://localhost:port in a browser to see the output.
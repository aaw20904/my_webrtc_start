
const express = require('express');
const app = express();

 const options = {
   key:'',
   cert:''
 }
 
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('Example app listening on port port!');
});


//Run app, then load http://localhost:port in a browser to see the output.
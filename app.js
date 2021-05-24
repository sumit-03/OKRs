const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile("index.html");
});

app.use('/', (req, res) => {
    res.send("No extra route implemented");
});


app.listen(9000, ()=> {
    console.log("server running and serving the frontend at 9000");
})
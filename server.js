var express = require('express'),
  app = express(),
  port = process.env.PORT || 4040,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require('./api/routes/h3Routes'); //importing route
routes(app); //register the route
app.listen(port);
  
console.log('h3 restful API server started on: ' + port);  
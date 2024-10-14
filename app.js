const express = require("express");
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

require('./app/config/db')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require("./app/routes");
app.use('/', routes);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT http://localhost/" + PORT);
});

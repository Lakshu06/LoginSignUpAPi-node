var express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var passport = require('passport');
var app = express();

//Config for JWT strategy
require("./middleware/jwt");
require('./config/connection');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const api = require('./routes/user');
app.use('/', api);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});
'use strict';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');
const tesla = require('./tesla');
const cors = require('cors');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

function getToken(req){
    var authorization = req.get("Authorization");
    var array = authorization.split(" ");
    var token = array[1];
    return token;
}

function getTenantName(req){
  var host = req.get('host');
  var array = host.split(".");
  var tenant = array[0];
  return tenant;
}
app.get('/', (req, res) => {
  res.send('api-service.phowma.com\n');
});

app.post('/signin', (req,res) => {
    var tenant = getTenantName(req);
    var username = req.body.username;
    var password = req.body.password;
    var signinPromise = api.signin(tenant,username,password);
    signinPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.get('/vehicles/locations', (req, res) => {
    var token = getToken(req);
    var locationsPromise = tesla.locations(token);
    locationsPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.send(err);
    });
});
app.listen(PORT, HOST);

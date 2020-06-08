'use strict';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');
const tesla = require('./tesla');
const vexService = require('./vex');
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
    if (token === "replacewithtoken" || token === "replacwithtoken")
        return process.env.AUTH_TOKEN;
    else
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

app.post('/signup', (req, res) => {
    var tenant = getTenantName(req);
    var signupParams = {
        tenant: tenant,
        username: req.body.username,
        password: req.body.password
    };
    var signupPromise = api.signup(signupParams);
    signupPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.status(err.statusCode).send(err.error);
    });
});

app.post('/signin', (req, res) => {
    var tenant = getTenantName(req);
    var signinParams = {
        tenant: tenant,
        username: req.body.username,
        password: req.body.password
    }; 
    var signinPromise = api.signin(signinParams);
    signinPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.status(err.statusCode).send(err.error);
    });
});

app.post('/confirmSignUp', (req, res) => {
    var tenant = getTenantName(req);
    var confirmSignUpParams = {
        tenant: tenant,
        username: req.body.username,
        code: req.body.code
    };
    var confirmSignUpPromise = api.confirmSignUp(confirmSignUpParams);
    confirmSignUpPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.status(err.statusCode).send(err.error);
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

app.get('/vehicles', (req, res) => {
    var token = getToken(req);
    var vehiclesPromise = tesla.vehicles(token);
    vehiclesPromise.then(function(result){
        res.json(result.response);
    }).catch(function(err){
        res.send(err);
    });
});

// This is temporary to make sure internal api works
app.get('/vexAuth', (req, res) => {
    console.log("server /vexAuth");
    var vexAuthPromise = vexService.getAuthToken();
    vexAuthPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.status(400).json(err);
    });
});
// This is temporary to make ure internal api works
app.get('/testCreateStore', (req, res) => {
    var body = {
        store: {
            name: "test3",
            time_zone: "Eastern Time (US & Canada)",
            cell_phone: "7813547330"
        }
    };
    var username = "members@vexapps.com"
    var password = "6BLxQBkHvTQVejbo5YzM";
    var createStorePromise = vexService.createStore(body, username, password);
    createStorePromise.then(function(results){
        res.json(results);
    }).catch(function(err){
        console.log("err: "+err);
        res.status(400).json(err);
    });
});
app.listen(PORT, HOST);

'use strict';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function getTenantName(req){
  var host = req.get('host');
  var array = host.split(".");
  var tenant = array[0];
  return tenant;
}
app.get('/', (req, res) => {
  res.send('tenant.phowma.com\n');
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

app.listen(PORT, HOST);

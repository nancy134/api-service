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
    if (!authorization) return "noAuthorizationHeader";
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

function errorResponse(res, err){
    if (err.statusCode){
        res.status(err.statusCode).send(err);
    } else {
        res.status(400).send(err);
    }
}

Object.prototype.getName = function() {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function formatError(err){
    var ret = {};

    if (err.statusCode) ret.statusCode = err.statusCode;
    else err.statusCode = 500;
    if (err.message) ret.message = err.message;
    else ret.message = "Unknown error";
    ret.originalMessage = err;
    ret.service = "ApiService";

    if (err.error){
        if (err.error.service){
            ret = err.error;
        } else if (err.error.getName() === "String"){
            ret.message = err.error;
        }
    }
    return(ret);
}

app.get('/', (req, res) => {
  res.send('api-service.phowma.com\n');
});

app.post('/signup', (req, res) => {
    var tenant = getTenantName(req);
    var signupPromise = api.signup(
        tenant,
        req.body.username,
        req.body.password
    );
    signupPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/signin', (req, res) => {
    var tenant = getTenantName(req);
    var signinPromise = api.signin(
        tenant,
        req.body.username,
        req.body.password
    );
    signinPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/refreshToken', (req, res) => {
    var tenant = getTenantName(req);
    api.refreshToken(tenant, req.body.refreshToken).then(function(result){
        res.status(201).json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/confirmSignUp', (req, res) => {
    var tenant = getTenantName(req);
    var confirmSignUpPromise = api.confirmSignUp(
        tenant,
        req.body.username,
        req.body.code
    );
    confirmSignUpPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    }); 
});

app.post('/forgotPassword', (req, res) => {
    var tenant = getTenantName(req);
    var forgotPasswordPromise = api.forgotPassword(
        tenant,
        req.body.username
    );
    forgotPasswordPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/confirmForgotPassword', (req, res) => {
    var tenant = getTenantName(req);
    var confirmForgotPasswordPromise = api.confirmForgotPassword(
        tenant,
        req.body.code,
        req.body.password,
        req.body.username
    );
    confirmForgotPasswordPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/deleteUser', (req, res) => {
    var tenant = getTenantName(req);
    var deleteUserPromise = api.deleteUser(tenant, req.query.email);
    deleteUserPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
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
    var vexAuthPromise = vexService.getAuthToken(process.env.VEX_AUTH_USERNAME, process.env.VEX_AUTH_PASSWORD);
    vexAuthPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        res.status(400).json(err);
    });
});
// This is temporary to make ure internal api works
app.get('/testCreateStore', (req, res) => {
    var body = {
        "store":
        {
            "name" : "testCreateStore@vexapps.com",
            "short_name" : "testCreateStore@vexapps.com",
            "formatted_name" : "testCreateStore@vexapps.com",
            "time_zone": "Eastern Time (US & Canada)",
            "cell_phone" : "7813547330",
            "active" : true,
            "address_attributes" : {
                "country" : "US",
                "state": "Massachusetts",
                "street":"11 Town House Road",
                "city": "Weston",
                "zip": "02495"
            },
            "users_attributes": [
            {
                "name": "testCreateStore@vexapps.com",
                "email" : "testCreateStore@vexapps.com",
                "cognito" : true,
                "password" : "12345678",
                "password_confirmation" : "12345678"
            }]
        }
    };

    var username = "members@vexapps.com"
    var password = "6BLxQBkHvTQVejbo5YzM";
    var createStorePromise = vexService.createStore(body, username, password);
    createStorePromise.then(function(results){
        res.json(results);
    }).catch(function(err){
        res.status(400).json(err);
    });
});

// This is temporary to make sure interal api works
app.get('/testPostConfirm', (req, res) => {
    var username = req.query.email;
    var postConfirmPromise = vexService.postConfirm(username);
    postConfirmPromise.then(function(results){
        res.json(results);
    }).catch(function(err){
        res.status(400).json(err);
    });
});

////////////////////////////
// billing-service
////////////////////////////

app.get('/billing/getClientToken', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getClientToken(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.status(400).send(err);
        }
    });
});

app.post('/billing/paymentMethod', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createPaymentMethod(tenant, IdToken, req.body).then(function(customerResult){
        res.send(customerResult);
    }).catch(function(err){
        res.send(err);
    });
});

app.get('/billing/paymentMethod', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getPaymentMethod(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.get('/billing/billingEvents/play/:id', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var id = req.params.id;
    api.playBillingEvents(tenant, IdToken, id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billing/billingEvents', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var id = req.params.id;
    api.getBillingEvents(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

//////////////////////////////
// user-service
//////////////////////////////

app.get('/users', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getUsers(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.status(400).send(err);
        }
    });
});

app.get('/user/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getUserMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.status(400).send(err);
        }
    });
});

app.put('/user/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.updateUserMe(tenant, IdToken, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.status(400).send(err);
        }
    });
});

app.get('/user/enums', (req, res) => {
    api.getUserEnums().then(function(result){
        res.send(result);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.status(400).send(err);
        }
    });
});

/////////////////////////////////////////
// listing-service
/////////////////////////////////////////

app.get('/listings', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getListings(tenant,IdToken,req.query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/listings/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getListingsMe(tenant, IdToken, req.query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/listings', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createListing(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/listings/:id/directPublications', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.directPublication(tenant, IdToken, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/listings/:id/publications', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.unpublish(tenant, IdToken, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.listen(PORT, HOST);

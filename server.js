'use strict';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');
const tesla = require('./tesla');
const vexService = require('./vex');
const cors = require('cors');
const url = require('url');
const utilities = require('./utilities');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const cookieParser = require('cookie-parser');
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(bodyParser.json({limit: '10mb'}));
var corsOptions = {
    origin: [
        "http://localhost:3000", 
        "https://www.murbansw.com", 
        "https://www.sabresw.com",
        "https://www.findingcre.com",
        "https://local.phowma.com"
    ],
    credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser());

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
  if (tenant === "www" && array[1] === "murbansw") tenant="mu-api";
  if (tenant === "localhost:49163") tenant="sc-api";
  return tenant;
}

function errorResponse(res, err){
    if (err && err.statusCode){
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

app.get('/api', (req, res) => {
   res.send('api-service/api\n');
});

app.get('/test', (req, res) => {
    var tenant = getTenantName(req);
    res.send(tenant);
});

////////////////////////////////////
// auth-service
///////////////////////////////////

app.post('/signup', (req, res) => {
    var tenant = getTenantName(req);
    var signupPromise = api.signup(
        tenant,
        req.body
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

app.post('/resendConfirmationCode', (req, res) => {
    var tenant = getTenantName(req);
    api.resendConfirmationCode(tenant, req.body.username).then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattederror = formaterror(err);
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

app.get('/cc/authurl', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    if (req.cookies && req.cookies.cc_refresh_token){
        var query = "refresh_token="+req.cookies.cc_refresh_token;
        api.ccRefreshToken(tenant, IdToken, query).then(function(authToken){
            api.getCCAuthUrl(tenant, IdToken).then(function(result){
                var ret = {
                    authUrl: result,
                    access_token: authToken.access_token,
                    refresh_token: authToken.refresh_token
                }; 
                var domain = utilities.getDomain(req);

                res.cookie('cc_refresh_token', authToken.refresh_token, {
                    maxAge: 86400 * 1000, // 24 hours
                    secure: true, // cookie must be sent over https / ssl
                    //domain: domain
                });

                res.send(ret);
            }).catch(function(err){
                errorResponse(res,err);
            });
        }).catch(function(err){
            api.getCCAuthUrl(tenant, IdToken).then(function(result){
                var ret = {
                    authUrl: result
                };
                res.send(ret);
            }).catch(function(err){
                errorResponse(res, err);
            });
        });
    } else {
        api.getCCAuthUrl(tenant, IdToken).then(function(result){
            var ret = {
                authUrl: result
            };
            res.send(ret);
        }).catch(function(err){
            errorResponse(res, err);
        });
    }
});

app.get('/cc/authToken', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getCCAuthToken(tenant, IdToken, query).then(function(result){

        var domain = utilities.getDomain(req);
        
        if (result.refresh_token){
            res.cookie('cc_refresh_token', result.refresh_token, {
                maxAge: 86400 * 1000, // 24 hours
                secure: true, // cookie must be sent over https / ssl
                //domain: domain
            });
        }
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/cc/refreshToken', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.ccRefreshToken(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/authurl', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);

    if (req.cookies && req.cookies.refresh_token){
        var body = {
            refresh_token: req.cookies.refresh_token
        };
        api.getSparkRefreshToken(tenant, IdToken, body).then(function(authToken){
            api.getSparkAuthUrl(tenant, IdToken).then(function(result){
                var ret = {
                    authUrl: result,
                    access_token: authToken.access_token,
                    refresh_token: authToken.refresh_token
                };
                var domain = utilities.getDomain(req);
                res.cookie('refresh_token', ret.refresh_token, {
                    maxAge: 86400 * 1000, // 24 hours
                    secure: true, // cookie must be sent over https / ssl
                    //domain: domain
                });

                res.send(ret);
            }).catch(function(err){
                errorResponse(res, err);
            });
        }).catch(function(err){
            api.getSparkAuthUrl(tenant, IdToken).then(function(result){
                var ret = {
                    authUrl: result
                };
                res.send(ret);
            }).catch(function(err){
                errorResponse(res,err);
            });
        });
    } else {
        api.getSparkAuthUrl(tenant, IdToken).then(function(result){
            var ret = {
                authUrl: result
            };
            res.send(ret);
        }).catch(function(err){
            errorResponse(res,err);
        });
    }
});

app.post('/spark/authToken', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getSparkAuthToken(tenant, IdToken, req.body).then(function(result){

        var domain = utilities.getDomain(req);
        res.cookie('refresh_token', result.refresh_token, {
            maxAge: 86400 * 1000, // 24 hours
            secure: true, // cookie must be sent over https / ssl
            //domain: domain 
        });



        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/logouturl', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getSparkLogoutUrl(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res,err);
    });
});

app.post('/spark/refreshToken', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getSparkRefreshToken(tenant, IdToken, req.body).then(function(result){
        res.status(201).send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/google/auth', (req, res) => {
    var tenant = getTenantName(req);
    api.getGoogleTokens(tenant, req.body).then(function(tokens){
        res.send(tokens);
    }).catch(function(err){
        errorResponse(res, err);
    }); 
});

app.post('/google/emails', (req, res) => {
    var tenant = getTenantName(req);
    api.sendGoogleEmail(tenant, req.body).then(function(email){
        res.send(email);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

//////////////////////////////////////////
// Smartcar
//////////////////////////////////////////

app.post('/smartcar/auth', (req, res) => {
    var tenant = getTenantName(req);
    api.getSmartcarTokens(tenant, req.body).then(function(tokens){
        console.log(tokens);
        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 86400 * 1000,
            secure: true
        });
        res.send(tokens);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});

app.get('/smartcar/authurl', (req, res) => {
    var tenant = getTenantName(req);
    console.log(req.cookies);
    if (req.cookies && req.cookies.refreshToken){
        var body = {
            refresh_token: req.cookies.refreshToken
        };
        api.getSmartcarRefreshToken(tenant, body).then(function(authToken){
            api.getSmartcarAuthUrl(tenant).then(function(result){
                var ret = {
                    authUrl: result,
                    access_token: authToken.access_token,
                    refresh_token: authToken.refresh_token
                };
                var domain = utilities.getDomain(req);
                res.cookie('refresh_token', ret.refresh_token, {
                    maxAge: 86400 * 1000, // 24 hours
                    secure: true, // cookie must be sent over https / ssl
                    //domain: domain
                });

                res.send(ret);
            }).catch(function(err){
                console.log("err1:");
                console.log(err);
                errorResponse(res, err);
            });
        }).catch(function(err){
            console.log("err2:");
            console.log(err);
            api.getSmartcarAuthUrl(tenant).then(function(result){
                var ret = {
                    authUrl: result
                };
                res.send(ret);
            }).catch(function(err){
                console.log("err3:");
                console.log(err);
                errorResponse(res,err);
            });
        });
    } else {
        api.getSmartcarAuthUrl(tenant).then(function(result){
            var ret = {
                authUrl: result
            };
            res.send(ret);
        }).catch(function(err){
            console.log("err4:");
            console.log(err);
            errorResponse(res,err);
        });
    }
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
        res.send(results);
    }).catch(function(err){
        res.status(400).json(err);
    });
});
////////////////////////////
// constant-service
////////////////////////////

app.get('/cc/emails', (req, res) => {
    var accessToken = utilities.getAccessToken(req);
    api.getCampaigns(accessToken).then(function(campaigns){
        res.send(campaigns);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

app.get('/cc/emails/:id', (req, res) => {
    var accessToken = utilities.getAccessToken(req);
    api.getCampaign(accessToken, req.params.id).then(function(campaign){
        res.send(campaign);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

app.post('/cc/emails', (req, res) => {
    api.createCampaign(req.body).then(function(campaign){
        res.send(campaign);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

app.put('/cc/emails/:campaignId', (req, res) => {
    api.updateCampaign(req.params.campaignId, req.body).then(function(campaign){
        res.send(campaign);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

app.post('/cc/tokeninfo', (req, res) => {
    api.tokenInfo(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/cc/accounts', (req, res) => {
    var accessToken = utilities.getAccessToken(req);
    api.ccAccount(accessToken).then(function(account){
        res.send(account);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

app.get('/cc/contacts', (req, res) => {
    var accessToken = utilities.getAccessToken(req);
    api.ccContacts(accessToken).then(function(contacts){
        res.send(contacts);
    }).catch(function(err){
        res.status(400).send(err);
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

app.get('/billing/paymentMethod/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getPaymentMethodMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res,err);
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
        errorResponse(res, err);
    });
});

app.get('/billing/paymentSecret/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getPaymentSecretMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
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

app.get('/billing/billingCycles', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var id = req.params.id;
    api.getBillingCycles(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/billing/billingCycles', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createBillingCycle(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/billing/billingCycles/:id', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteBillingCycle(tenant, IdToken, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/billing/billingCycles/:id', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteBillingCycle(tenant, IdToken, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billing/promotions', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getPromotions(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/billing/promotions', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createPromotion(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/billing/promotions/:id/codes', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var id = req.params.id;
    api.createPromotionCode(tenant, IdToken, id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billing/codes', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getCodes(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res,err);
    });
});

app.post('/billing/codes/validate', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.validatePromoCode(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billing/users/codes/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getUserCodeMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billing/billingCycles/:id/billingEvents', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var id = req.params.id;
    api.getBillingEvents(tenant, IdToken, id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billing/billingCycles/:id/billingEvents/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var id = req.params.id;
    api.getBillingEventsMe(tenant, IdToken, id).then(function(result){
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
    var query = url.parse(req.url).query;
    api.getUsers(tenant, IdToken, query).then(function(result){
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

app.get('/users/invitations', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getUserInvite(req.query.token, req.query.email).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/users/invitations', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.acceptInvite(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
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

app.get('/associations/me/users', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getAssociatesMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/associations/users/invite', (req, res) => {
   var tenant = getTenantName(req);
   var IdToken = getToken(req);
   var domain = utilities.getDomain(req);
   api.inviteAssociate(tenant, IdToken, req.body, domain).then(function(result){
       res.send(result);
   }).catch(function(err){
       errorResponse(res, err);
   });
});

app.put('/associations/:associationId/users/:userId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var domain = utilities.getDomain(req);
    var associationId = req.params.associationId;
    var userId = req.params.userId;
    api.resendInvite(tenant, IdToken, domain, associationId, userId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/associations/:associationId/users/:userId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.removeAssociate(tenant, IdToken, req.params.associationId, req.params.userId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/me/contacts', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getContactsMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/users/me/contacts', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createContactsMe(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/me/groups', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getGroupsMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/users/me/groups', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createGroupsMe(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/me/clients/:id/groups', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getClientGroupsMe(tenant, IdToken, req.params.id, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/me/groups/:id/clients', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getGroupClientsMe(tenant, IdToken, req.params.id, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/users/me/groups/clients', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createClientGroupMe(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/clients/upload', upload.single('file'), function(req, res, next){
    var tenant = getTenantName(req);
    var IdToken = getToken(req);

    api.clientsUpload(tenant, IdToken, req.file, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

// This is an API to opt in to receive emails
app.post('/users', (req, res) => {
    var tenant = getTenantName(req);
    api.userOptIn(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

// This is an API to opt out of receiving emails
app.put('/users', (req, res) => {
    var tenant = getTenantName(req);
    api.userOptOut(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


/////////////////////////////////////////
// listing-service
/////////////////////////////////////////

app.get('/listings', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getListings(tenant,IdToken,query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/listingMarkers', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getListingMarkers(tenant,IdToken,query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/listings/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getListingsMe(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/listingMarkers/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getListingMarkersMe(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/:cognitoId/listings', (req, res) => {
    var tenant = getTenantName(req);
    var query = url.parse(req.url).query;
    api.getUserListings(tenant, req.params.cognitoId, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/:cognitoId/listingMarkers', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getUserListingMarkers(tenant, IdToken, req.params.cognitoId, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/admin/listingVersions', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getAdminListingVersions(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/lists/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getListsMe(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

/*
app.get('/listings/:id', (req, res) => {
    var id = req.params.id;
    api.getListing(id).then(function(result){
        api.getUser(result.listing.owner).then(function(owner){
            result.listing.owner = owner;
            res.send(result);
        }).catch(function(err){
            errorResponse(res,err);
        });
    }).catch(function(err){
        errorResponse(res,err);
    });
});
*/
app.get('/listings/:id', (req, res) => {
    var id = req.params.id;
    api.getListing(id).then(function(result){
        api.getUser(result.listing.owner).then(function(owner){
            if (owner.AssociationId){
                api.getAssociates(owner.AssociationId).then(function(associates){
                    result.listing.owner = owner;
                    for (var i=0; i<result.listing.users.length; i++){
                        for (var j=0; j<associates.length; j++){
                            if (associates[j].email === result.listing.users[i].email){
                                result.listing.users[i] = associates[j];
                            }
                        }
                    }
                    // Add associates information to each user
                    res.send(result);
                }).catch(function(err){
                    errorResponse(res, err);
                });
            } else {
                result.listing.owner = owner;
                for (var i=0; i<result.listing.users.length; i++){
                    if (owner.email === result.listing.users[i].email){
                        result.listing.users[i] = owner;
                    }
                }
                res.send(result);
            }
        }).catch(function(err){
            errorResponse(res,err);
        });
    }).catch(function(err){
        errorResponse(res,err);
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

app.post('/lists/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createListMe(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/lists/:id', (req,res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.updateListMe(tenant, IdToken, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/lists/:id', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteListMe(tenant, IdToken, req.params.id).then(function(result){
        res.json(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/lists/:ListId/listItems/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    req.body.ListId = req.params.ListId;
    api.createListItemMe(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/lists/:ListId/listItems/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var ListId = req.params.ListId;
    var query = url.parse(req.url).query;
    api.getListItemsMe(tenant, IdToken, ListId, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/listItems/:ListItemId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var ListItemId = req.params.ListItemId;
    api.deleteListItemMe(tenant, IdToken, ListItemId).then(function(result){
        res.json(result);
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

app.post('/listings/users', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.addListingUser(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/listings/:ListingVersionId/users/:UserId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteListingUser(tenant, IdToken, req.params.ListingVersionId, req.params.UserId).then(function(result){
        res.send("ok");
    }).catch(function(err){
        errorResponse(res,err);
    });
});

app.get('/listings/:listingVersionId/tenants/:tenantId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getTenant(tenant, IdToken, req.params.listingVersionId, req.params.tenantId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res,err);
    }); 
});

app.get('/listings/:listingVersionId/tenants', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getTenants(tenant, IdToken, req.params.listingVersionId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/listings/:listingVersionId/tenants', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createTenant(tenant, IdToken, req.params.listingVersionId, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/listings/:listingVersionId/tenants/:tenantId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.updateTenant(tenant, IdToken, req.params.listingVersionId, req.params.tenantId, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/listings/:listingVersionId/tenants/:tenantId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteTenant(tenant, IdToken, req.params.listingVersionId, req.params.tenantId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/listings/:listingVersionId/condos/:condoId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getCondo(tenant, IdToken, req.params.listingVersionId, req.params.condoId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res,err);
    }); 
});

app.get('/listings/:listingVersionId/condos/:condoId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getCondo(tenant, IdToken, req.params.listingVersionId, req.params.condoId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res,err);
    }); 
});

app.post('/listings/:listingVersionId/condos', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.createCondo(tenant, IdToken, req.params.listingVersionId, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/listings/:listingVersionId/condos/:condoId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.updateCondo(tenant, IdToken, req.params.listingVersionId, req.params.condoId, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/listings/:listingVersionId/condos/:condoId', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteCondo(tenant, IdToken, req.params.listingVersionId, req.params.condoId).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/listings/users/associates/me', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.getListingsUsersAssociatesMe(tenant, IdToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res,err);
    });
});

//////////////////////////////////
// mail-service
//////////////////////////////////

app.post('/mail/listing/inquiry', (req, res) => {
   api.mailListingInquiry(req.body).then(function(result){
       res.send(result);
   }).catch(function(err){
       res.send(err);
   });
});

app.post('/mail/sendListing', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.mailSendListing(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/mail/contactus', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.mailContactUs(tenant, IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

//////////////////////////////////
// spark-service
//////////////////////////////////

app.get('/spark/collections', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getCollections(tenant, sparkAccessToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/collections/:id', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getCollection(tenant, sparkAccessToken, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/collectionListings/', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getCollectionListings(tenant, sparkAccessToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/system', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getSystem(tenant, sparkAccessToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/savedsearches', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getSavedSearches(tenant, sparkAccessToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/listings', (req, res) => {
    var tenant =  getTenantName(req);
    var sparkAccessToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getSparkListings(tenant, sparkAccessToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/emails/:id', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.createSparkEmail(tenant, sparkAccessToken, req.params.id).then(function(result){
        api.createStripoEmail(tenant, result).then(function(email){
            res.send(email);
        }).catch(function(err){
            res.send("error");
            //errorResponse(res, err);
        });
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/emails/:id/mustache', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.createSparkEmailData(tenant, sparkAccessToken, req.params.id, req.body).then(function(emailData){
        api.createSparkEmailFromTemplate(tenant, sparkAccessToken, emailData).then(function(html){
            res.send(html);
        }).catch(function(err){
            errorResponse(res, err);
        });
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/accounts/:id', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getSparkAccount(tenant, sparkAccessToken, req.params.id).then(function(account){
        res.send(account);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/constants', (req, res) => {
    var tenant = getTenantName(req);
    var query = url.parse(req.url).query;
    api.findSparkConstant(tenant, query).then(function(constant){
        res.send(constant);
    }).catch(function(err){
        errorResponse(res, err);
    }); 
});

app.post('/spark/constants', (req, res) => {
    var tenant = getTenantName(req);
    api.createSparkConstant(tenant, req.body).then(function(constant){
        res.send(constant);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/contacts', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getSparkContacts(tenant, sparkAccessToken).then(function(contacts){
        res.send(contacts);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/purchased', (req, res) => {
    var tenant = getTenantName(req);
    api.sparkPurchased(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/canceled', (req, res) => {
    var tenant = getTenantName(req);
    api.sparkCanceled(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/reviewed', (req, res) => {
    var tenant = getTenantName(req);
    api.sparkReviewed(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/paymentsuccess', (req, res) => {
    var tenant = getTenantName(req);
    api.sparkPaymentSuccess(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/spark/paymentfailure', (req, res) => {
    var tenant = getTenantName(req);
    api.sparkPaymentFailure(tenant, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/templates', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getSparkTemplates(tenant, sparkAccessToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/spark/templates/:id', (req, res) => {
    var tenant = getTenantName(req);
    var sparkAccessToken = getToken(req);
    api.getSparkTemplate(tenant, sparkAccessToken, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});
//////////////////////////////////
// smartcar-service
//////////////////////////////////

app.get('/smartcar/authurl', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);

    if (req.cookies && req.cookies.refresh_token){
        var body = {
            refresh_token: req.cookies.refresh_token
        };
        api.getSmartcarRefreshToken(tenant, IdToken, body).then(function(authToken){
            api.getSmartcarAuthUrl(tenant, IdToken).then(function(result){
                var ret = {
                    authUrl: result,
                    access_token: authToken.access_token,
                    refresh_token: authToken.refresh_token
                };
                var domain = utilities.getDomain(req);
                res.cookie('refresh_token', ret.refresh_token, {
                    maxAge: 86400 * 1000, // 24 hours
                    secure: true, // cookie must be sent over https / ssl
                    //domain: domain
                });

                res.send(ret);
            }).catch(function(err){
                errorResponse(res, err);
            });
        }).catch(function(err){
            api.getSmartcarAuthUrl(tenant, IdToken).then(function(result){
                var ret = {
                    authUrl: result
                };
                res.send(ret);
            }).catch(function(err){
                errorResponse(res,err);
            });
        });
    } else {
        api.getSmartcarAuthUrl(tenant, IdToken).then(function(result){
            var ret = {
                authUrl: result
            };
            res.send(ret);
        }).catch(function(err){
            errorResponse(res,err);
        });
    }
});

app.get('/smartcar/vehicles', (req, res) => {
    var tenant = getTenantName(req);
    var accessToken = getToken(req);
    api.getSmartcarVehicles(tenant, accessToken).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});

app.get('/smartcar/vehicles/:id/location', (req, res) => {
    var tenant = getTenantName(req);
    var accessToken = getToken(req);
    var id = req.params.id
    api.getSmartcarLocation(tenant, accessToken,id).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});


app.get('/smartcar/vehicles/:id/vin', (req, res) => {
    var tenant = getTenantName(req);
    var accessToken = getToken(req);
    var id = req.params.id
    api.getSmartcarVin(tenant, accessToken,id).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});
//////////////////////////////////
// image-service
//////////////////////////////////

app.get('/library/images', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    var query = url.parse(req.url).query;
    api.getImages(tenant, IdToken, query).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/library/images/:id', (req, res) => {
    var tenant = getTenantName(req);
    var IdToken = getToken(req);
    api.deleteImage(tenant, IdToken, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/library/upload', upload.single('image'), function(req, res, next){
    var tenant = getTenantName(req);
    var IdToken = getToken(req);

    api.libraryUpload(tenant, IdToken, req.file, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/smartcar/vehicles/:id/battery', (req, res) => {
    var tenant = getTenantName(req);
    var accessToken = getToken(req);
    var id = req.params.id
    api.getSmartcarBattery(tenant, accessToken,id).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});



app.listen(PORT, HOST);

module.exports = app;

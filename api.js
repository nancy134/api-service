const rp = require('request-promise');
const axios = require('axios');
const vexService = require('./vex');
const utilities = require('./utilities');
const userService = require('./user');
const billingService = require('./billing');

Object.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

var getTenant = function(tenant){
    return new Promise(function(resolve, reject) {

        url = process.env.TENANT_SERVICE + "/tenant/" +
            "?name=" + tenant;
        var options = {
            uri: url,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        })
        .catch(function(err){
            reject(err);
        });
    });
}
var signUp = function(cognito_client_id, cognito_pool_id, username, password){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/signUp";
        var body = {
            cognitoClientId: cognito_client_id,
            cognitoPoolId: cognito_pool_id,
            username: username,
            password: password
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err)
        });
    });
}
var confirmSignUp = function(cognito_client_id, username, code){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/confirmSignUp";
        var body = {
            cognitoClientId: cognito_client_id,
            username: username,
            code: code
        };
        var options = {
            method: 'POST',
            url: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            if (resp.statusCode && resp.statusCode === 400){
                reject(resp);
            } else {
                resolve(resp);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}
var initiateAuth = function(cognito_client_id, username, password){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/initiateAuth";
        var body = { cognitoClientId: cognito_client_id,
            username: username,
            password: password};
        var options = {
            method: 'POST',
            uri: url,
            body: body, 
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        })
        .catch(function(err){
            reject(err);
        });
    });
}

var refreshTokenI = function(cognito_client_id, refreshToken){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/refreshToken";
        var body = {
            cognitoClientId: cognito_client_id,
            refreshToken: refreshToken
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
             resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var forgotPassword = function(cognito_client_id, username){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/forgotPassword";
        var body = {
            cognitoClientId: cognito_client_id,
            username: username
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var confirmForgotPassword = function(cognito_client_id, code, password, username){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/confirmForgotPassword";
        var body = {
            cognitoClientId: cognito_client_id,
            code: code,
            password: password,
            username: username
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var postConfirm = function(resp, tenant, username){
    return new Promise(function(resolve, reject){
        if (tenant === "murban-api"){
            var postConfirmPromise = vexService.postConfirm(username);
            postConfirmPromise.then(function(results){
                resolve(results);
            }).catch(function(err){
                reject(err);
            });
        } else {
            resolve(resp);
        }
    });
}

var postSignin = function(resp, tenant, email){
    return new Promise(function(resolve, reject){
        if (tenant === "murban-api"){
            var postSigninPromise = vexService.postSignin(email);
            postSigninPromise.then(function(result){
                resp.store_id = result.users[0].store_id;
                resolve(resp);
            }).catch(function(err){
                reject(err);
            });
        } else {
            resolve(resp);
        }
    });
}

exports.signup = function(tenant, username, password){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => signUp(resp.cognito_client_id, resp.cognito_pool_id, username, password))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.confirmSignUp = function(tenant, username, code){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => confirmSignUp(resp.cognito_client_id, username, code))
        .then(resp => postConfirm(resp, tenant, username))
        .then(resp => resolve(resp))
        .catch(err => reject(err)); 
    });
}

exports.signin = function(tenant, username, password){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => initiateAuth(resp.cognito_client_id, username, password))
        .then(authResp => postSignin(authResp, tenant, username))
        .then(function(postSigninResp){
            resolve(postSigninResp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.refreshToken = function(tenant, refreshToken){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => refreshTokenI(resp.cognito_client_id, refreshToken))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.forgotPassword = function(tenant, username){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => forgotPassword(resp.cognito_client_id, username))
        .then(function(forgotPasswordResp){
            resolve(forgotPasswordResp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.confirmForgotPassword = function(tenant, code, password, username){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => confirmForgotPassword(resp.cognito_client_id, code, password, username))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

//////////////////////////////
// billing-service
//////////////////////////////

exports.createPaymentMethod = function(tenant, IdToken, customerData){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp => billingService.createPaymentMethod(
             IdToken,
             resp.cognito_client_id,
             resp.cognito_pool_id,
             customerData))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPaymentMethod = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(
            resp =>
                billingService.getPaymentMethod(
                    IdToken,
                    resp.cognito_client_id,
                    resp.cognito_pool_id
                ))
       .then(function(resp){
           resolve(resp);
       }).catch(function(err){
           reject(err);
       });
    });
}

exports.getClientToken = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(
            resp =>
                billingService.getClientToken(
                    IdToken,
                    resp.cognito_client_id,
                    resp.cognito_pool_id
                )
        ).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

// Need to add security
exports.deleteUser = function(tenant, email){
    return new Promise(function(resolve, reject){
        getTenant(tenant).then(function(resp){
            url = process.env.AUTH_SERVICE + "/deleteUser/" +
                "?email=" + email +
                "&userPoolId=" + resp.cognito_pool_id;
            var options = {
                uri: url,
                json: true
            };
            rp(options).then(function(resp){
                resolve(resp);
            })
            .catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

/////////////////////////////////////////////
//// user-service
/////////////////////////////////////////////

exports.getUsers = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp =>
            userService.getUsers(IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
};

exports.getUserMe = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp =>
            userService.getUserMe(IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
};

exports.updateUserMe = function(tenant, IdToken, id, body){
    return new Promise(function(resolve, reject){
        getTenant(tenant)
        .then(resp =>
            userService.updateUserMe(id, body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUserEnums = function(){
    return new Promise(function(resolve, reject){
        userService.getUserEnums().then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

const rp = require('request-promise');

var getTenant = function(params){
    return new Promise(function(resolve, reject) {

        url = process.env.TENANT_SERVICE + "/tenant/" +
            "?name=" + params.tenant;
        var options = {
            uri: url,
            json: true
        };
        rp(options).then(function(resp){
            var ret = {
                username: params.username,
                password: params.password,
                code: params.code,
                cognito_client_id: resp.cognito_client_id
            }
            resolve(ret);
        })
        .catch(function(err){
            reject(err);
        });
    });
}
var signUp = function(params){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/signUp";
        var body = {
            cognitoClientId: params.cognito_client_id,
            username: params.username,
            password: params.password
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
var confirmSignUp = function(params){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/confirmSignUp";
        var body = {
            cognitoClientId: params.cognito_client_id,
            username: params.username,
            code: params.code
        };
        var options = {
            method: 'POST',
            url: url,
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
var initiateAuth = function(params){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/initiateAuth";
        var body = { cognitoClientId: params.cognito_client_id,
            username: params.username,
            password: params.password};
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
exports.signup = function(params){
    return new Promise(function(resolve, reject){
        getTenant(params)
        .then(signUp)
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.confirmSignUp = function(params){
    return new Promise(function(resolve, reject){
        getTenant(params)
        .then(confirmSignUp)
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.signin = function(params){
    return new Promise(function(resolve, reject){
        getTenant(params)
        .then(initiateAuth)
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}


const axios = require('axios');
const utilities = require('./utilities');

exports.getCCAuthUrl = function(IdToken, cognito_client_id, cognito_pool_id, ccClientId){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/cc/auth?clientId=" + ccClientId;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getCCAuthToken = function(IdToken, cognito_client_id, cognito_pool_id, query){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/cc/authToken?" + query;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.ccRefreshToken = function(IdToken, cognito_client_id, cognito_pool_id, query){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/cc/refreshToken?" + query;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSparkAuthUrl = function(IdToken, cognito_client_id, cognito_pool_id, sparkClientId){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/spark/authurl?clientId=" + sparkClientId;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSparkAuthToken = function(IdToken, cognito_client_id, cognito_pool_id, body){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/spark/authToken";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSparkLogoutUrl = function(IdToken, cognito_client_id, cognito_pool_id, sparkClientId){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/spark/logoutUrl?clientId=" + sparkClientId;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSparkRefreshToken = function(IdToken, cognito_client_id, cognito_pool_id, body){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/spark/refreshToken";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getGoogleTokens = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/google/auth";
        var options = {
            url: url,
            method: 'POST',
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSmartcarTokens = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/smartcar/auth";
        var options = {
            url: url,
            method: 'POST',
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSmartcarAuthUrl = function(){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/smartcar/authurl";
        var options = {
            url: url,
            method: 'GET'
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getSmartcarRefreshToken = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/smartcar/refreshToken";
        var options = {
            url: url,
            method: 'POST',
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}


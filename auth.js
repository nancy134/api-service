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


const axios = require('axios')
const utilities = require('./utilities');

exports.getUsers = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/users";
        bearerToken = "Bearer " + IdToken;
        var headers = {
            "Authorization" : bearerToken,
            "com-sabresw-cognito-client-id": cognito_client_id,
            "com-sabresw-cognito-pool-id": cognito_pool_id
        };
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
             reject(retErr);
        });
    });
}

exports.getUserMe = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/user/me";
        bearerToken = "Bearer " + IdToken;
        var headers = {
            "Authorization" : bearerToken,
            "com-sabresw-cognito-client-id": cognito_client_id,
            "com-sabresw-cognito-pool-id": cognito_pool_id 
        };
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.updateUserMe = function(id, body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/user/me";
        bearerToken = "Bearer " + IdToken;
        var headers = {
            "Authorization" : bearerToken,
            "com-sabresw-cognito-client-id": cognito_client_id,
            "com-sabresw-cognito-pool-id": cognito_pool_id
        };
        var options = {
            url: url,
            method: 'PUT',
            headers: headers,
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.getUserEnums = function(){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/enums";
        var options = {
            url: url,
            method: 'GET'
        }
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

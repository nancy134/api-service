const axios = require('axios')
const utilities = require('./utilities');

exports.getUserProfile = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/user?" +
            "cognitoClientId=" + cognito_client_id +
            "&cognitoPoolId=" + cognito_pool_id;
        bearerToken = "Bearer " + IdToken;
        var headers = {
            "Authorization" : bearerToken
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

exports.updateUserProfile = function(id, body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/users/" + id;
        body.cognitoClientId = cognito_client_id;
        body.cognitoPoolId = cognito_pool_id;
        bearerToken = "Bearer " + IdToken;
        var headers = {
            "Authorization" : bearerToken
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



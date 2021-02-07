const axios = require('axios');
const utilities = require('./utilities');

exports.createListMe = function(body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE + "/lists/me";
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
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.getListsMe = function(query, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url = process.env.LISTING_SERVICE + "/lists/me?" + query;
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

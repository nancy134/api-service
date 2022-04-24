const axios = require('axios');
const utilities = require('./utilities');

exports.createListItemMe = function(body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url =
            process.env.LISTING_SERVICE +
            "/lists/" + 
            body.ListId + 
            "/listItems/me";
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

exports.getListItemsMe = function(ListId, IdToken, query, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url =
            process.env.LISTING_SERVICE + 
            "/lists/" +
            ListId +
            "/listItems/me";
        if (query) url += "?" + query;
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

exports.deleteListItemMe = function(ListItemId, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url =
            process.env.LISTING_SERVICE +
            "/listItems/"+
            ListItemId;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: "DELETE",
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

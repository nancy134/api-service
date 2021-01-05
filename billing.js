const axios = require('axios');
const utilities = require('./utilities');

exports.getClientToken = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE+"/getClientToken"
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

exports.createPaymentMethod = function(IdToken, cognito_client_id, cognito_pool_id, customerData){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE+"/paymentMethod";
        var bearerToken = "Bearer " + IdToken;
        var headers = {
            "Authorization" : bearerToken,
            "com-sabresw-cognito-client-id": cognito_client_id,
            "com-sabresw-cognito-pool-id": cognito_pool_id
        };
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            data: customerData
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        }); 
    });
}

exports.getPaymentMethod = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE+"/paymentMethod";
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

exports.getBillingCycle = function(IdToken, cognito_client_id, cognito_pool_id, id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingCycles/" + id;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
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

exports.getBillingEvents = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingEvents/";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
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

exports.deleteBillingEvents = function(IdToken, cognito_client_id, cognito_pool_id, id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingCycles/" + id + "/billingEvents";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: "DELETE",
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(err);
        });
    });
}

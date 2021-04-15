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

exports.getBillingCycles = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingCycles";
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

exports.deleteBillingCycle = function(IdToken, cognito_client_id, cognito_pool_id, id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingCycles/" + id;
        var headers = utilities.createHeaders(IdToken, cognito_client-id, cognito_pool_id);
        var options = {
            url: url,
            method: 'DELETE',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getPromotions = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/promotions";
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

exports.createPromotionCode = function(IdToken, cognito_client_id, cognito_pool_id, promotionId, body){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/promotions/"+promotionId+"/codes";
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

exports.getCodes = function(IdToken, query, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/codes";
        if (query) url += "?"+query;
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

exports.getBillingEvents = function(IdToken, cognito_client_id, cognito_pool_id, id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingCycles/" + id + "/billingEvents/";
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

exports.getBillingEventsMe = function(IdToken, cognito_client_id, cognito_pool_id, id){
    return new Promise(function(resolve, reject){
        url = process.env.BILLING_SERVICE + "/billingCycles/" + id + "/billingEvents/me";
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

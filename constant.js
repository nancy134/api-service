const axios = require('axios');
const utilities = require('./utilities');

exports.getCampaigns = function(accessToken){
    return new Promise(function(resolve, reject){
        url = process.env.CONSTANT_SERVICE + "/emails";
        var headers = utilities.createConstantHeaders(accessToken);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        }
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.createCampaign = function(body){
    return new Promise(function(resolve, reject){
        url = process.env.CONSTANT_SERVICE + "/cc/emails";
        var options = {
            url: url,
            method: 'POST',
            data: body
        }
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.updateCampaign = function(campaignId, body){
    return new Promise(function(resolve, reject){
        url = process.env.CONSTANT_SERVICE + "/cc/emails/" + campaignId;
        var options = {
            url: url,
            method: 'PUT',
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.tokenInfo = function(body){
    return new Promise(function(resolve, reject){
        url = process.env.CONSTANT_SERVICE + "/cc/tokenInfo";
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

exports.getAccount = function(accessToken){
    return new Promise(function(resolve, reject){
        url = process.env.CONSTANT_SERVICE + "/account";
        var headers = utilities.createConstantHeaders(accessToken);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        }
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}


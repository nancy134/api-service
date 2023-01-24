const axios = require('axios');
const utilities = require('./utilities');

exports.getVehicles = function(accessToken){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles";
        var headers = utilities.createSmartcarHeaders(accessToken);
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

exports.getLocation = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/location";
        var headers = utilities.createSmartcarHeaders(accessToken);
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

exports.getVin = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/vin";
        var headers = utilities.createSmartcarHeaders(accessToken);
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

exports.getBattery = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/battery";
        var headers = utilities.createSmartcarHeaders(accessToken);
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



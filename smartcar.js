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

exports.getOdometer = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/odometer";
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

exports.getVehicleAttributes = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id;
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

exports.getTirePressure= function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/tires/pressure";
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

exports.getFuel= function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/fuel";
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

exports.getCharge= function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/charge";
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



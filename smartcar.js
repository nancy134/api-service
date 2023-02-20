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

exports.getPermissions = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/permissions";
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

exports.controlCharge= function(accessToken, id, body){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/charge";
        var headers = utilities.createSmartcarHeaders(accessToken);
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


exports.controlSecurity = function(accessToken, id, body){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/security";
        var headers = utilities.createSmartcarHeaders(accessToken);
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


exports.getEngineOil = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/engine/oil";
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


exports.getBatteryCapacity = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/battery/capacity";
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

exports.getUser = function(accessToken){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/user";
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

exports.getTeslaCompass = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/tesla/compass";
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


exports.getTeslaChargeAmperage = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SMARTCAR_SERVICE + "/vehicles/" + id + "/tesla/charge/ammeter";
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



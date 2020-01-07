const rp = require('request-promise');

function vehicles(access_token){
    return new Promise(function(resolve, reject){
        url = process.env.TESLA_SERVICE + "/vehicles";
        var bearerToken = "Bearer " + access_token;
        var headers = {
            "Authorization" : bearerToken,
        }
        var options = {
            uri: url,
            headers: headers,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

function vehicle(access_token, id){
    return new Promise(function(resolve, reject){
        url = process.env.TESLA_SERVICE + "/vehicle/" + id;
        var bearerToken = "Bearer " + access_token;
        var headers = {
            "Authorization" : bearerToken,
        }
        var options = {
            uri: url,
            headers: headers,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}
function location(access_token, id, name){
    return new Promise(function(resolve, reject){
        url = process.env.TESLA_SERVICE + "/vehicle/" + id + "/location";
        var bearerToken = "Bearer " + access_token;
        var headers = {
            "Authorization" : bearerToken,
        }
        var options = {
            uri: url,
            headers: headers,
            json: true
        };
        rp(options).then(function(resp){
            resp.name = name; 
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}
exports.locations = function(access_token){
    return new Promise(function(resolve, reject){ 
        var vehiclesPromise = new vehicles(access_token);
        vehiclesPromise.then(function(data){
            var locationPromises = [];
            for(var i=0; i<data.response.length; i++){
                var locationPromise = new location(access_token, data.response[i].id_s, data.response[i].display_name);
                locationPromises.push(locationPromise);
            }
            return Promise.all(locationPromises);
        }).then(function(vehicles){
            resolve(vehicles);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.vehicles = vehicles;

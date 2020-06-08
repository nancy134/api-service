const rp = require('request-promise');

var getAuthToken = function(){
    return new Promise(function(resolve, reject){
        var body = {
            email: process.env.VEX_AUTH_USERNAME,
            password: process.env.VEX_AUTH_PASSWORD
        };
        console.log("body: "+JSON.stringify(body));
        var options = {
           method: 'POST',
           uri: process.env.AUTH_SERVICE + "/vexAuth",
           body: body,
           json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var createStore = function(body, username, token){
    return new Promise(function(resolve, reject){
        console.log("body: "+JSON.stringify(body));
        var headers = {
            'X-User-Email': username,
            'X-User-Token': token
        };
        var options = {
            method: 'POST',
            uri: process.env.VEX_SERVICE+"/store",
            body: body,
            headers: headers,
            json: true
        };
        console.log("options: "+JSON.stringify(options));
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            console.log("err: "+err);
            reject(err);
        });
    });
}

exports.getAuthToken = getAuthToken;
exports.createStore = createStore;

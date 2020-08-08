const rp = require('request-promise');
function createStoreBody(username){
    var body = {
        "store":
        {
            "name" : username,
            "short_name" : username,
            "formatted_name" : username,
            "time_zone": "Eastern Time (US & Canada)",
            "cell_phone" : "7813547330",
            "active" : true,
            "address_attributes" : {
                "country" : "US",
                "state": "Massachusetts",
                "street":"11 Town House Road",
                "city": "Weston",
                "zip": "02495"
            },
            "users_attributes": [
            {
                "name": username,
                "email" : username,
                "cognito" : true,
                "password" : "12345678",
                "password_confirmation" : "12345678"
            }]
       }
    };
    return body;
}

var getAuthToken = function(authEmail, authPassword){
    return new Promise(function(resolve, reject){
        var body = {
            email: authEmail,
            password: authPassword 
        };
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

var createStore = function(body, authEmail, token){
    return new Promise(function(resolve, reject){
        var headers = {
            'X-User-Email': authEmail,
            'X-User-Token': token
        };
        var options = {
            method: 'POST',
            uri: process.env.VEX_SERVICE+"/store",
            body: body,
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

var addTemplate = function(templateName, userEmail, userPassword){
    return new Promise(function(resolve, reject){
        getAuthToken(userEmail, userPassword).then(function(authResp){
            var options = {
                method: 'GET',
                uri: process.env.VEX_SERVICE+"/template?name="+templateName+"&escape=true"
            };
            rp(options).then(function(templateResp){
                var email = "webpagetest02@vexapps.com";
                var body = createStoreBody(email);
                body.store.formatted_name = templateResp;
                createStore(body, userEmail, authResp.auth_token).then(function(storeResp){
                    resolve(storeResp);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
        });
    });
}


var findUser = function(authEmail, token, email){
    return new Promise(function(resolve, reject){
        var headers = {
            'X-User-Email': authEmail,
            'X-User-Token': token
        };
        var options = {
            method: 'GET',
            uri: process.env.VEX_SERVICE+"/users/search?email="+email,
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

var postConfirm = function(username){
    return new Promise(function(resolve, reject){
        getAuthToken(process.env.VEX_AUTH_USERNAME, process.env.VEX_AUTH_PASSWORD).then(function(resp){
            var body = createStoreBody(username);
            body.store.remote_logo_url = "http://dev.virtualopenexchange.com/templates/blankUser.jpg";
            createStore(body, process.env.VEX_AUTH_USERNAME, resp.auth_token).then(function(store){
                addTemplate(
                    "webpage",
                    body.store.users_attributes[0].name,
                    body.store.users_attributes[0].password
                ).then(function(tempResp){
                    resolve(store);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        }); 
    });
}

var postSignin = function(email){
    return new Promise(function(resolve, reject){
        getAuthToken(process.env.VEX_AUTH_USERNAME, process.env.VEX_AUTH_PASSWORD).then(function(resp){
            findUser(process.env.VEX_AUTH_USERNAME, resp.auth_token, email).then(function(user){
                resolve(user);
            }).catch(function(err){
                reject(err);
            }); 
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getAuthToken = getAuthToken;
exports.createStore = createStore;
exports.postConfirm = postConfirm;
exports.postSignin = postSignin;

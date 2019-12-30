const rp = require('request-promise');

exports.signin = function(tenant, username, password){
    return new Promise(function(resolve, reject) {

        url = process.env.TENANT_SERVICE + "/tenant/" +
            "?name=" + tenant;
        var options = {
            uri: url,
            json: true
        };
        rp(options).then(function(resp){
            var ret = {
                username: username,
                password: password,
                cognito_client_id: resp.cognito_client_id
            }
            resolve(ret);
        })
        .catch(function(err){
            reject(err);
        });

    }).then(function(result) {

        return new Promise(function(resolve, reject){
            var url = process.env.AUTH_SERVICE + "/initiateAuth";
            var body = { cognitoClientId: result.cognito_client_id,
                       username: result.username,
                       password: result.password};
            var options = {
                method: 'POST',
                uri: url,
                body: body, 
                json: true
            };
            rp(options).then(function(resp){
                resolve(resp);
            })
            .catch(function(err){
                reject(err);
            });
        });
    }).catch(function(err){
        reject(err);
    });
}

const axios = require('axios');

exports.getTenant = function(tenant){
    return new Promise(function(resolve, reject) {

        url = process.env.TENANT_SERVICE + "/tenant" +
            "?name=" + tenant;
        var options = {
            url: url,
            method: 'GET'
        };
        axios(options).then(function(resp){
            resolve(resp.data);
        })
        .catch(function(err){
            reject(err);
        });
    });
}

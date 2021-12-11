const axios = require('axios');
const utilities = require('./utilities');

exports.createEmail = function(body){
    console.log("body:");
    console.log(body);
    return new Promise(function(resolve, reject){
        var url = process.env.STRIPO_SERVICE + "/emails";
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


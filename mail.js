const axios = require('axios');
const utilities = require('./utilities');

exports.listingInquiry = function(mailData){
    return new Promise(function(resolve, reject){
        url = process.env.MAIL_SERVICE + "/listing/inquiry";
        var options = {
            url: url,
            method: 'POST',
            data: mailData
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

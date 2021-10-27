const axios = require('axios');
const utilities = require('./utilities');
const FormData = require('form-data');
const fs = require('fs');

function removeUploadedFile(filePath){
    fs.unlink(filePath, (err) => {
        if (err) {
           console.log(err)
        }
    });
}

exports.getImages = function(authParams, query){
    return new Promise(function(resolve, reject){
        url = process.env.IMAGE_SERVICE + "/images";
        if (query){
            url = url + "?" + query;
        }
        var headers = utilities.createHeaders(
            authParams.IdToken,
            authParams.cognitoClientId,
            authParams.cognitoPoolId
        );
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

exports.deleteImage = function(authParams, id){
    return new Promise(function(resolve, reject){
        url = process.env.IMAGE_SERVICE + "/images/" + id;
        var headers = utilities.createHeaders(
            authParams.IdToken,
            authParams.cognitoClientId,
            authParams.cognitoPoolId
        );
        var options = {
            url: url,
            method: 'DELETE',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.libraryUpload = function(authParams, file, body){
    return new Promise(function(resolve, reject){

        var data = new FormData();
        data.append('image', fs.createReadStream(file.path));
        data.append('originalname', file.originalname);
        data.append('order', body.order);

        var url = process.env.IMAGE_SERVICE + "/upload";
        var headers = utilities.createHeaders(
            authParams.IdToken,
            authParams.cognitoClientId,
            authParams.cognitoPoolId,
            data
        );
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            data:data 
        };
        axios(options).then(function(result){
            removeUploadedFile(file.path);
            resolve(result.data);
        }).catch(function(err){
            removeUploadedFile(file.path);
            reject(utilities.processAxiosError(err));
        });
    });
}

const axios = require('axios');
const utilities = require('./utilities');

exports.getListings = function(query, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url = process.env.LISTING_SERVICE+"/listings?"+query;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.getListingMarkers = function(query, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url = process.env.LISTING_SERVICE+"/listingMarkers?"+query;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'GET',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.getListingsMe = function(query, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url = process.env.LISTING_SERVICE + "/listings/me?" + query;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
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

exports.getListingMarkersMe = function(query, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url = process.env.LISTING_SERVICE + "/listingMarkers/me?" + query;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
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

exports.getListing = function(id){
    return new Promise(function(resolve, reject){
        var url = process.env.LISTING_SERVICE + "/listings/" + id;
        var options = {
            url: url,
            method: 'GET'
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.createListing = function(body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE+"/listings";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            data: body
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.directPublication = function(id, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE + "/listings/"+id+"/directPublications";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'POST',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.unpublish = function(id, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE + "/listings/"+id+"/publications";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'DELETE',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.billingCyclePlay = function(body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE + "/billingCycles/play";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'POST',
            data: body,
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.addListingUser = function(body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE + "/listings/users";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'POST',
            data: body,
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
           reject(utilities.processAxiosError(err));
        });
    });
}

exports.deleteListingUser = function(listingVersionId, userId, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.LISTING_SERVICE + "/listings/"+listingVersionId+"/users/"+userId;
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
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


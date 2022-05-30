const axios = require('axios');
const utilities = require('./utilities');

exports.getCollections = function(accessToken){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/listingcarts";
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.getCollection = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/listingcarts/" + id;
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.getCollectionListings = function(accessToken, body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/collectionListings";
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.getSystem = function(accessToken){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/system";
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.getSavedSearches = function(accessToken, query){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/savedSearches";
        if (query){
            url += "?" + query;
        }
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.getListings = function(accessToken, query){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/listings";
        var headers = utilities.createSparkHeaders(accessToken);
        if (query){
            url += "?" + query;
        }
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

exports.createEmail = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/emails/" + id;
        var headers = utilities.createSparkHeaders(accessToken);
        var options = {
            url: url,
            method: 'POST',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.createEmailData = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/emails/" + id + "/mustache";
        var headers = utilities.createSparkHeaders(accessToken);
        var options = {
            url: url,
            method: 'POST',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getAccount = function(accessToken, id){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/accounts/" + id;
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.findConstant = function(query){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/constants?" + query;
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

exports.createConstant = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/constants";
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

exports.getContacts = function(accessToken){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/contacts";
        var headers = utilities.createSparkHeaders(accessToken);
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

exports.purchased = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/purchased";
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

exports.canceled = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/canceled";
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

exports.reviewed = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/reviewed";
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

exports.paymentSuccess = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/paymentsuccess";
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

exports.paymentFailure = function(body){
    return new Promise(function(resolve, reject){
        var url = process.env.SPARK_SERVICE + "/paymentfailure";
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


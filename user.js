const axios = require('axios')
const utilities = require('./utilities');

exports.getUsers = function(query, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/users";
        if (query){
            url = url + "?" + query;
        }
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

exports.getUserMe = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/user/me";
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

exports.updateUserMe = function(id, body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/user/me";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'PUT',
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

exports.getUser = function(id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/users/" + id;
        var options = {
            url: url,
            method: 'GET'
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });

}

exports.getUserInvite = function(token, email){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/users/invitations?token="+token;
        if (email){
            url = url + "&email="+email;
        }
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

exports.acceptInvite = function(IdToken, cognito_client_id, cognito_pool_id, body){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/users/invitations";
        var headers = utilities.createHeaders(IdToken, cognito_client_id, cognito_pool_id);
        var options = {
            url: url,
            method: 'PUT',
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

exports.getUserEnums = function(){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/enums";
        var options = {
            url: url,
            method: 'GET'
        }
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            var retErr = utilities.processAxiosError(err);
            reject(retErr);
        });
    });
}

exports.inviteUserMe = function(associationId, body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/associations/"+associationId+"/users/me";
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
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.createAssociationMe = function(body, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/associations/me";
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
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.getAssociatesMe = function(IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/associations/me/users";
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

exports.getAssociates = function(associationId){
    return new Promise(function(resolve, reject){
        url = process.env.USER_SERVICE + "/associations/" + associationId + "/users";
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

exports.removeAssociate = function(associationId, userId, IdToken, cognito_client_id, cognito_pool_id){
    return new Promise(function(resolve, reject){
        var url = process.env.USER_SERVICE + "/associations/"+associationId+"/users/"+userId;
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

// get back associate record
exports.getAssociate = function(IdToken, cognito_client_id, cognito_pool_id, associationId, userId){
    return new Promise(function(resolve, reject){
        var url = process.env.USER_SERVICE + "/associations/"+associationId+"/users/"+userId;
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


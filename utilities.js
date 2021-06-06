exports.processAxiosError = function(error){
    if (error.response){
        return(error.response.data);
    } else if (error.request){
        return(error.request);
    } else {
        return(error.message);
    }
}

exports.createHeaders = function(IdToken, cognito_client_id, cognito_pool_id){
    var bearerToken = "Bearer " + IdToken;
    var headers = {
        "Authorization" : bearerToken,
        "com-sabresw-cognito-client-id": cognito_client_id,
        "com-sabresw-cognito-pool-id": cognito_pool_id
    };
    return headers;
}

exports.getDomain = function(req){
    var host = req.get('host')
    var parts = host.split(".");
    var domain = null;
    if (parts.length > 2){
        domain = parts[1]+"."+parts[2]; 
    }
    return domain;
}


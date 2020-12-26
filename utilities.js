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


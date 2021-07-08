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
    var origin = req.headers.origin;
 
    var parts = origin.split("//");
    var domain = null;
    if (parts.length > 1){
        domain = parts[1]; 
    }
    return domain;
}

exports.createAssociationInvite = function(domain, user, invitedUser){
    var inviterName = null;
    if (user.first && user.last) {
        inviterName = user.first + " " + user.last;
    } else {
        inviterName = user.email;
    }
    var inviteMessage = "";
    inviteMessage += "<html><body>";
    inviteMessage += "<p>You are invited to join FindingCRE as an associate of " + inviterName + "</p>";
    inviteMessage += '<p>Go to <a href="https://'+domain+'/account?token='+invitedUser.associationToken+'" >Join FindingCRE</a></p>';
    inviteMessage += "</body></html>";

    var mailBody = {
        userEmail: user.email,
        associateEmail: invitedUser.email,
        subject: "FindingCRE associate invite",
        message: inviteMessage 
    };

    return mailBody;
}



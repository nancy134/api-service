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
exports.createAssociateInviteLink = function(domain, invitedUser){
    var inviteLink = 
        'https://' +
        domain +
        '/account?token=' +
        invitedUser.associationToken;
    return inviteLink;
}
exports.createAssociationInvite = function(domain, user, invitedUser){
    var inviterName = null;
    if (user.first && user.last) {
        inviterName = user.first + " " + user.last;
    } else {
        inviterName = user.email;
    }
    var inviteMessage = "";
    inviteMessage += '<html><body>';
    inviteMessage += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">';
    inviteMessage += '<div style="border:1px solid black; width: 600px; text-align: left; padding: 5px; font-family: Tahoma; font-size: 12pt; font-color: #424242;">';
    inviteMessage += '<p align="center">You have been invited to join FindingCRE as an associate of ' + inviterName + '</p>';
    inviteMessage += '<p align="center" style="font-size:14pt"><a href="https://'+domain+'/account?token='+invitedUser.associationToken+'" >Click here to accept your invitation</a></p>';
    inviteMessage += '<footer><div align="center">';
    inviteMessage += '<a href="https://www.findingcre.com"><img src="https://sabre-images.s3.amazonaws.com/FindingCRELogo.png" alt="FindingCRE - Commercial Real Estate for Sale or Lease" title="FindingCRE - Commercial Real Estate for Sale or Lease"></a>';
    inviteMessage += '</div></footer>';
    inviteMessage += '</div>';
    inviteMessage += '</td></tr></table>';
    inviteMessage += "</body></html>";

    var mailBody = {
        userEmail: user.email,
        associateEmail: invitedUser.email,
        subject: "FindingCRE associate invite",
        message: inviteMessage 
    };

    return mailBody;
}



const rp = require('request-promise');
const axios = require('axios');
const vexService = require('./vex');
const utilities = require('./utilities');
const userService = require('./user');
const billingService = require('./billing');
const listingService = require('./listing');
const tenantService = require('./tenant');
const listService = require('./list');
const listItemService = require('./listItem');
const mailService = require('./mail');

Object.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

var signUp = function(cognito_client_id, cognito_pool_id, userBody){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/signUp";
        var body = {
            cognitoClientId: cognito_client_id,
            cognitoPoolId: cognito_pool_id,
            username: userBody.username,
            password: userBody.password,
            role: userBody.role
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err)
        });
    });
}
var confirmSignUp = function(cognito_client_id, username, code){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/confirmSignUp";
        var body = {
            cognitoClientId: cognito_client_id,
            username: username,
            code: code
        };
        var options = {
            method: 'POST',
            url: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            if (resp.statusCode && resp.statusCode === 400){
                reject(resp);
            } else {
                resolve(resp);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

var resendConfirmationCode = function(cognito_client_id, username){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/resendConfirmationCode";
        var body = {
            cognitoClientId: cognito_client_id,
            username: username
        };
        var options = {
            method: 'POST',
            url: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });

    });
}

var initiateAuth = function(cognito_client_id, username, password){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/initiateAuth";
        var body = { cognitoClientId: cognito_client_id,
            username: username,
            password: password};
        var options = {
            method: 'POST',
            uri: url,
            body: body, 
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        })
        .catch(function(err){
            reject(err);
        });
    });
}

var refreshTokenI = function(cognito_client_id, refreshToken){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/refreshToken";
        var body = {
            cognitoClientId: cognito_client_id,
            refreshToken: refreshToken
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
             resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var forgotPassword = function(cognito_client_id, username){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/forgotPassword";
        var body = {
            cognitoClientId: cognito_client_id,
            username: username
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var confirmForgotPassword = function(cognito_client_id, code, password, username){
    return new Promise(function(resolve, reject){
        var url = process.env.AUTH_SERVICE + "/confirmForgotPassword";
        var body = {
            cognitoClientId: cognito_client_id,
            code: code,
            password: password,
            username: username
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

var postConfirm = function(resp, tenant, username){
    return new Promise(function(resolve, reject){
        if (tenant === "murban-api"){
            var postConfirmPromise = vexService.postConfirm(username);
            postConfirmPromise.then(function(results){
                resolve(results);
            }).catch(function(err){
                reject(err);
            });
        } else {
            resolve(resp);
        }
    });
}

var postSignin = function(resp, tenant, email){
    return new Promise(function(resolve, reject){
        if (tenant === "murban-api"){
            var postSigninPromise = vexService.postSignin(email);
            postSigninPromise.then(function(result){
                resp.store_id = result.users[0].store_id;
                resolve(resp);
            }).catch(function(err){
                reject(err);
            });
        } else {
            resolve(resp);
        }
    });
}

exports.signup = function(tenant, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => signUp(resp.cognito_client_id, resp.cognito_pool_id, body))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.confirmSignUp = function(tenant, username, code){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => confirmSignUp(resp.cognito_client_id, username, code))
        .then(resp => postConfirm(resp, tenant, username))
        .then(resp => resolve(resp))
        .catch(err => reject(err)); 
    });
}

exports.resendConfirmationCode = function(tenant, username){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => resendConfirmationCode(resp.cognito_client_id, username))
        .then(resp => resolve(resp))
        .catch(err => reject(err));
    });
}

exports.signin = function(tenant, username, password){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => initiateAuth(resp.cognito_client_id, username, password))
        .then(authResp => postSignin(authResp, tenant, username))
        .then(function(postSigninResp){
            resolve(postSigninResp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.refreshToken = function(tenant, refreshToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => refreshTokenI(resp.cognito_client_id, refreshToken))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.forgotPassword = function(tenant, username){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => forgotPassword(resp.cognito_client_id, username))
        .then(function(forgotPasswordResp){
            resolve(forgotPasswordResp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.confirmForgotPassword = function(tenant, code, password, username){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => confirmForgotPassword(resp.cognito_client_id, code, password, username))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

//////////////////////////////
// billing-service
//////////////////////////////

exports.createPaymentMethod = function(tenant, IdToken, customerData){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => billingService.createPaymentMethod(
             IdToken,
             resp.cognito_client_id,
             resp.cognito_pool_id,
             customerData))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPaymentMethod = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(
            resp =>
                billingService.getPaymentMethod(
                    IdToken,
                    resp.cognito_client_id,
                    resp.cognito_pool_id
                ))
       .then(function(resp){
           resolve(resp);
       }).catch(function(err){
           reject(err);
       });
    });
}

exports.getPaymentMethodMe = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getPaymentMethodMe(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(intent){
                resolve(intent);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getClientToken = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(
            resp =>
                billingService.getClientToken(
                    IdToken,
                    resp.cognito_client_id,
                    resp.cognito_pool_id
                )
        ).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPaymentSecretMe = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            // 1. Get user
            userService.getUserMe(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(user){
                // 2. If they have a secret, send back
                if (user.paymentSecret){
                    resolve(user);
                 // 3. If they don't have a secret, create intent
                } else {
                    billingService.createPaymentSecret(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(result){
                         // 4. Update user with secret
                         var body = {
                             paymentSecret: result.client_secret
                         }
                         userService.updateUserMe(user.id, body, IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(updatedUser){
                             resolve(updatedUser);
                         }).catch(function(err){
                             reject(err);
                         });
                     }).catch(function(err){
                         reject(err);
                     });
                }
             }).catch(function(err){
                 reject(err);
             });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.playBillingEvents = function(tenant, IdToken, id){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getBillingCycle(IdToken, resp.cognito_client_id, resp.cognito_pool_id, id).then(function(billingCycle){
                billingService.deleteBillingEvents(IdToken, resp.cognito_client_id, resp.cognito_pool_id, billingCycle.id).then(function(billingEvents){
                    listingService.billingCyclePlay(billingCycle, IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(playResults){
                        resolve(playResults);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err)
        });
    });
}

exports.getBillingCycles = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getBillingCycles(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(billingCycles){
                resolve(billingCycles);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPromotions = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getPromotions(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(promotions){
                resolve(promotions);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPromotion = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.createPromotion(
                IdToken,
                resp.cognito_client_id,
                resp.cognito_pool_id,
                body)
            .then(function(promotion){
                resolve(promotion);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPromotionCode = function(tenant, IdToken, promotionId, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.createPromotionCode(IdToken, resp.cognito_client_id, resp.cognito_pool_id, promotionId, body).then(function(userPromotion){
                resolve(userPromotion);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getCodes = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getCodes(IdToken, query, resp.cognito_client_id, resp.cognito_pool_id).then(function(codes){
                resolve(codes);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getBillingEvents = function(tenant, IdToken, id){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getBillingEvents(
                IdToken,
                resp.cognito_client_id,
                resp.cognito_pool_id,
                id)
            .then(function(billingEvents){
                resolve(billingEvents);
            }).catch(function(err){
                reject(err);
            });
        });
    });
}

exports.getBillingEventsMe = function(tenant, IdToken, id){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getBillingEventsMe(
                IdToken,
                resp.cognito_client_id,
                resp.cognito_pool_id,
                id)
            .then(function(billingEvents){
                resolve(billingEvents);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.validatePromoCode = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.validatePromoCode(
                IdToken,
                resp.cognito_client_id,
                resp.cognito_pool_id,
                body)
            .then(function(userCode){
                resolve(userCode);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUserCodeMe = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            billingService.getUserCodeMe(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(userCode){
                resolve(userCode);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

// Need to add security
exports.deleteUser = function(tenant, email){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            url = process.env.AUTH_SERVICE + "/deleteUser/" +
                "?email=" + email +
                "&userPoolId=" + resp.cognito_pool_id;
            var options = {
                uri: url,
                json: true
            };
            rp(options).then(function(resp){
                resolve(resp);
            })
            .catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

/////////////////////////////////////////////
//// user-service
/////////////////////////////////////////////

exports.getUsers = function(tenant, IdToken,query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            userService.getUsers(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
};

exports.getUserMe = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            userService.getUserMe(IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
};

exports.updateUserMe = function(tenant, IdToken, id, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            userService.updateUserMe(id, body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUser = function(id){
    return new Promise(function(resolve, reject){
        userService.getUser(id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUserInvite = function(token, email){
    return new Promise(function(resolve, reject){
        userService.getUserInvite(token, email).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.acceptInvite = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            userService.acceptInvite(IdToken, resp.cognito_client_id, resp.cognito_pool_id, body).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getAssociatesMe = function(tenant, IdToken){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            userService.getAssociatesMe(IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(associations){
                resolve(associations);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getAssociates = function(associationId){
    return new Promise(function(resolve, reject){
        userService.getAssociates(associationId).then(function(associates){
            resolve(associates);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUserEnums = function(){
    return new Promise(function(resolve, reject){
        userService.getUserEnums().then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.removeAssociate = function(tenant, IdToken, associationId, userId){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            userService.removeAssociate(associationId, userId, IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}
 
///////////////////////////////////
// listing-service
///////////////////////////////////

exports.getListings = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.getListings(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getListingMarkers = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.getListingMarkers(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getListingsMe = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.getListingsMe(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getAdminListingVersions = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.getAdminListingVersions(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getListsMe = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listService.getListsMe(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getListItemsMe = function(tenant, IdToken, ListId){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listItemService.getListItemsMe(ListId, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.deleteListItemMe = function(tenant, IdToken, ListItemId){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listItemService.deleteListItemMe(ListItemId, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.deleteListMe = function(tenant, IdToken, id){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listService.deleteListMe(id, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getListingMarkersMe = function(tenant, IdToken, query){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.getListingMarkersMe(query, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getListing = function(id){
    return new Promise(function(resolve, reject){
        listingService.getListing(id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createListing = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.createListing(body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createListMe = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listService.createListMe(body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.updateListMe = function(tenant, IdToken, id, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listService.updateListMe(id, body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createListItemMe = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listItemService.createListItemMe(body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.directPublication = function (tenant, IdToken, id){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.directPublication(id, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.unpublish = function(tenant, IdToken, id){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp =>
            listingService.unpublish(id, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });           
}

exports.createList = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant)
        .then(resp => 
            listService.createList(body, IdToken, resp.cognito_client_id, resp.cognito_pool_id))
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.addListingUser = function(tenant, IdToken, body){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            listingService.addListingUser(body, IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.deleteListingUser = function(tenant, IdToken, listingVersionId, userId){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            listingService.deleteListingUser(listingVersionId, userId, IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

////////////////////////////////
// mail-service
////////////////////////////////

exports.mailListingInquiry = function(body){
    return new Promise(function(resolve, reject){
        listingService.getListing(body.ListingVersionId).then(function(listing){
            body.subject =
                "Inquiry on "+
                listing.listing.address +
                " " +
                listing.listing.city;
            userService.getUser(listing.listing.owner).then(function(user){
                body.broker=user.email;
                mailService.listingInquiry(body).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.inviteAssociate = function(tenant, IdToken, body, domain){
    var inviteMessage = "";
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            // Get the current user
            exports.getUserMe(tenant, IdToken).then(function(user){
                if (user.email === body.inviteeEmail){
                    var ret = {
                        statusCode: 400,
                        message: "Cannot invite yourself"
                    };
                    reject(ret);
                  
                } else {


                body.userEmail = user.email;
                // If user has association
                if (!user.AssociationId){
                    // Create Association
                    var associationBody = {
                        name: body.associationName
                    };
                    userService.createAssociationMe(associationBody, IdToken, resp.cognito_client_id, resp.cognito_pool_id).then(function(association){
                        var userBody = {
                            email: body.inviteeEmail
                        };
                        userService.inviteUserMe(
                            association.id,
                            userBody,
                            IdToken,
                            resp.cognito_client_id,
                            resp.cognito_pool_id
                        ).then(function(invitedUser){
                            var mailBody = utilities.createAssociationInvite(domain, user, invitedUser);
                            mailService.sendAssociationInvite(
                                mailBody,
                                IdToken,
                                resp.cognito_client_id,
                                resp.cognito_pool_id
                            ).then(function(mailResult){
                                resolve(mailResult);
                            }).catch(function(err){
                                reject(err);
                            });
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                // If user does not have association
                }else{
                    var userBody = {
                        email: body.inviteeEmail
                    };
                    userService.inviteUserMe(
                        user.AssociationId,
                        userBody,
                        IdToken,
                        resp.cognito_client_id,
                        resp.cognito_pool_id
                    ).then(function(invitedUser){
                        var mailBody = utilities.createAssociationInvite(domain, user, invitedUser);
                        mailService.sendAssociationInvite(
                            mailBody,
                            IdToken,
                            resp.cognito_client_id,
                            resp.cognito_pool_id
                        ).then(function(mailResult){
                            resolve(mailResult);
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                }
                }
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.resendInvite = function(tenant, IdToken, domain, associationId, userId){
    return new Promise(function(resolve, reject){
        tenantService.getTenant(tenant).then(function(resp){
            exports.getUserMe(
                tenant,
                IdToken
            ).then(function(user){
                userService.getAssociate(
                    IdToken,
                    resp.cognito_client_id,
                    resp.cognito_pool_id,
                    associationId, 
                    userId
                ).then(function(invitedUser){
                    var mailBody = utilities.createAssociationInvite(domain, user, invitedUser);
                    mailService.sendAssociationInvite(
                        mailBody,
                        IdToken,
                        resp.cognito_client_id,
                        resp.cognito_pool_id
                    ).then(function(mailResult){
                        resolve(mailResult);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

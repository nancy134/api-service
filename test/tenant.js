const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const tenantService = require("../tenant");


var mock = new MockAdapter(axios);

describe("tenants", () => {

    beforeEach(() => {
        process.env.TENANT_SERVICE = "https://tenant-api.phowma.com/";
        url = process.env.TENANT_SERVICE + "/tenant?name=sabre-api";
    });

    it('get tenant success', done => {

        mock.onGet(url).reply(200, {
            id: 2,
            name: "sabre-api",
            cognito_pool_id: "us-east-1_M0pJ75x7f",
            cognito_client_id: "52380a496h19smuev2kori3mtd",
            createdAt: "2020-11-28T13:24:45.393Z",
            updatedAt: "2020-11-28T13:24:45.393Z"
        });

        tenantService.getTenant("sabre-api").then(function(result){
            done();
        }).catch(function(err){
            done()
        });
    });

    it('get tenant failure', done => {

        mock.onGet(url).reply(400, {
            statusCode: 400,
            message: "400 error"
        });

        tenantService.getTenant("sabre-api").then(function(result){
            done();
        }).catch(function(err){
            done()
        });
    });

});

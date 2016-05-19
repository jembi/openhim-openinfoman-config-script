var assert = require('assert');
var sinon = require('sinon');
var nock = require("nock");
var http = require('http');

var app = require('../lib/app.js');

var expectedResponse = {
  "providers": {
      "careServicesRequest": "http://localhost:8984/CSD/csr/providers/careServicesRequest",
      "careServicesRequests": {
          "urn:ihe:iti:csd:2014:stored-function:facility-search": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:facility-search",
          "urn:ihe:iti:csd:2014:adhoc": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:adhoc",
          "urn:ihe:iti:csd:2014:stored-function:service-search": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:service-search",
          "urn:ihe:iti:csd:2014:stored-function:organization-search": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:organization-search",
          "urn:ihe:iti:csd:2014:stored-function:provider-search": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:provider-search",
          "urn:openhie.org:openinfoman:modtimes": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:modtimes",
          "urn:openhie.org:openinfoman:service_create": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:service_create",
          "urn:openhie.org:openinfoman:mark_duplicate": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:mark_duplicate",
          "urn:openhie.org:openinfoman:simple_merge": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:simple_merge",
          "urn:openhie.org:openinfoman:mark_potential_duplicate": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:mark_potential_duplicate",
          "urn:openhie.org:openinfoman:delete_potential_duplicate": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:delete_potential_duplicate",
          "urn:openhie.org:openinfoman:organization_create": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:organization_create",
          "urn:openhie.org:openinfoman:provider_create": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:provider_create",
          "urn:openhie.org:openinfoman:facility_create": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:facility_create",
          "urn:openhie.org:openinfoman:delete_duplicate": "http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:delete_duplicate"
      }
  },
  "RapidProContacts": {
      "careServicesRequest": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest",
      "careServicesRequests": {
          "urn:ihe:iti:csd:2014:stored-function:facility-search": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:facility-search",
          "urn:ihe:iti:csd:2014:adhoc": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:adhoc",
          "urn:ihe:iti:csd:2014:stored-function:service-search": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:service-search",
          "urn:ihe:iti:csd:2014:stored-function:organization-search": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:organization-search",
          "urn:ihe:iti:csd:2014:stored-function:provider-search": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:provider-search",
          "urn:openhie.org:openinfoman:modtimes": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:modtimes",
          "urn:openhie.org:openinfoman:service_create": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:service_create",
          "urn:openhie.org:openinfoman:mark_duplicate": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:mark_duplicate",
          "urn:openhie.org:openinfoman:simple_merge": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:simple_merge",
          "urn:openhie.org:openinfoman:mark_potential_duplicate": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:mark_potential_duplicate",
          "urn:openhie.org:openinfoman:delete_potential_duplicate": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:delete_potential_duplicate",
          "urn:openhie.org:openinfoman:organization_create": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:organization_create",
          "urn:openhie.org:openinfoman:provider_create": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:provider_create",
          "urn:openhie.org:openinfoman:facility_create": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:facility_create",
          "urn:openhie.org:openinfoman:delete_duplicate": "http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:delete_duplicate"
      }
  }
};

var fs = require("fs");
var testChannels = JSON.parse(fs.readFileSync("config/test_channels.json"));

var validChannelConfig = testChannels.valid;
var invalidChannelConfig = testChannels.invalid;


describe('Get documents', function() {
  beforeEach(function() {
    nock("http://localhost:8984")
      .get("/CSD/documents.json")
      .reply(200, expectedResponse);
	});

  it('should convert openinfoman GET result to array of documents', function(done) {
  	app.getDocuments(function(err, result) {
      if(err) {
        return done(err);
      }
      assert.equal(result[0], 'providers', "Correct result array");
      assert.equal(result[1], 'RapidProContacts', "Correct result array");
      done();
    });
  });
});

describe('Register Channel: ', function(){
  beforeEach(function() {
    // mock OpenHim server reponses
    nock("http://localhost:8080")
      .get("/authenticate/root@openhim.org")
      .reply(200, {
        "salt": "test-salt",
        "ts": "test-ts"
      })
      .post("/channels", function(body){
        return body.urlPattern && body.name && body.routes[0].name
          && body.routes[0].host && body.routes[0].port? true : false;
      })
      .reply(201)
      .post("/channels", function(body){
        return body.urlPattern && body.name && body.routes[0].name
          && body.routes[0].host && body.routes[0].port? false : true;
      })
      .reply(400);
	});

  it('should register openhim channel successfully', function(done){
    app.registerChannel(validChannelConfig, function(err, result){
      if(err) {
        return done(err);
      }
      assert(result.statusCode==201, "Channel created successfully");
      done();
    });
  });

  it('should fail to register openhim channel', function(done){
    app.registerChannel(invalidChannelConfig, function(err, result){
      if(err) {
        return done(err);
      }
      assert(result.statusCode==400, "Failed to create channel");
      done();
    });
  });
});

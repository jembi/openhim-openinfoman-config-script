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

describe('Create Channel Config Object from Document Name', function() {
  it('should create a channel config object', function(done) {
  	app.createChannelConfigObject("DocumentName", function(err, result) {
      if(err) {
        return done(err);
      }
      assert.equal(result.name, 'DocumentName', "Channel Name");
      assert.equal(result.urlPattern, '^/CSD/csr/DocumentName/careServicesRequest$', "URL pattern");
      assert.equal(result.allow[0], "admin", "Clients/Roles");
      assert.equal(result.routes[0].name, 'DocumentName Route', "Route Name");
      assert.equal(result.routes[0].host, 'localhost', "Host URL");
      assert.equal(result.routes[0].port, 6000, "Host Port");
      done();
    });
  });
});


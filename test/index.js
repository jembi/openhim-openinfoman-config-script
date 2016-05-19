'use strict'

const assert = require('assert');

const index = require('../lib/index')

describe('Create Channel Config Object from Document Name', function() {
  it('should create a channel config object', function(done) {
  	index.createChannelConfigObject("DocumentName", function(err, result) {
      if(err) {
        return done(err);
      }
      assert.equal(result.name, 'DocumentName', "Channel Name");
      assert.equal(result.urlPattern, '^/CSD/csr/DocumentName/careServicesRequest.*$', "URL pattern");
      assert.equal(result.allow[0], "admin", "Clients/Roles");
      assert.equal(result.routes[0].name, 'DocumentName Route', "Route Name");
      assert.equal(result.routes[0].host, 'localhost', "Host URL");
      assert.equal(result.routes[0].port, 6000, "Host Port");
      done();
    });
  });
});

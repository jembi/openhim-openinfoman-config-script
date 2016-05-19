'use strict'

const _ = require('lodash')
const assert = require('assert');
const nock = require('nock');

const OpenHIM = require('../lib/openhim')

describe('Register Channel: ', function(){
  var checkValidRequest = function(body){
    return body.urlPattern && body.name && body.routes[0].name
      && body.routes[0].host && body.routes[0].port? true : false;
  }

  beforeEach(function() {
    // mock OpenHim server reponses
    nock("http://localhost:8080")
      .get("/authenticate/root@openhim.org")
      .reply(200, {
        "salt": "test-salt",
        "ts": "test-ts"
      })
      .post("/channels", function(body){
         return checkValidRequest(body);
      })
      .reply(201)
      .post("/channels", function(body){
        // only want to accept invalid requests here
        return checkValidRequest(body)? false : true;
      })
      .reply(400);
	});

  var testChannels = _.cloneDeep(require("../resources/test_channels.json"));
  var validChannelConfig = testChannels.valid;
  var invalidChannelConfig = testChannels.invalid;

  let apiConfig = {
    username: "root@openhim.org",
    password: "password",
    url: "https://localhost:8080"
  }

  let openhim = OpenHIM(apiConfig)

  it('should register openhim channel successfully', function(done){
    openhim.registerChannel(validChannelConfig, function(err, result){
      if(err) {
        return done(err);
      }
      assert(result.statusCode==201, "Channel created successfully");
      done();
    });
  });

  it('should fail to register openhim channel', function(done){
    openhim.registerChannel(invalidChannelConfig, function(err, result){
      if(err) {
        return done(err);
      }
      assert(result.statusCode==400, "Failed to create channel");
      done();
    });
  });
});

/* ################################## */
/* ##### Channel Registration  ##### */
/* ################################## */
const utils = require('openhim-mediator-utils');
const _ = require('lodash')

var config = _.cloneDeep(require("../config/default.json"));
var apiConfig = config.openhimApi;

exports.registerChannel = function(channelConfig, callback){

  var needle = require('needle');

  // used to bypass self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // define login credentails for authorization
  var apiURL = apiConfig.protocol+'://'+apiConfig.host+':'+apiConfig.port;
  var options = {
    "username" : apiConfig.username,
    "password" : apiConfig.password,
    "apiURL" : apiURL
  }

  // authenticate the username
  utils.authenticate(options, function(err) {
    console.log('Attempting to create/update channel');

    // print error if exist
    if (err){
      console.log(err)
      return;
    }

    // define request headers with auth credentails
    var authHeaders = utils.genAuthHeaders(options);
    var postOptions = {
      json: true,
      headers: authHeaders
    };

    // POST channel to API for creation/update
    needle.post(apiURL+'/channels', channelConfig, postOptions, function(err, resp) {

      // print error if exist
      if (err){
        console.log(err)
        return;
      }

      // check the response status from the API server
      if ( resp.statusCode === 201 ){
        // successfully created/updated
        console.log('Channel has been successfully created/updated.');
        callback(null, resp);
      }else{
        console.log('An error occured while trying to create/update the channel: '+resp.body);
        callback(null, resp);
      }

    });
  });

}

/* ################################## */
/* ##### Channel Registration  ##### */
/* ################################## */

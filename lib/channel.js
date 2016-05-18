/* ################################## */
/* ##### Channel Registration  ##### */
/* ################################## */
var fs = require("fs");

var config = JSON.parse(fs.readFileSync("config/default.json"));
var apiConfig = config.openhimApi;

exports.registerChannel = function(channelConfig, callback){

  var needle = require('needle');
  var crypto = require('crypto');

  // used to bypass self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // define login credentails for authorization
  var username = apiConfig.username;
  var password = apiConfig.password;
  var apiURL = apiConfig.protocol+'://'+apiConfig.host+':'+apiConfig.port;

  // authenticate the username
  needle.get(apiURL+'/authenticate/'+username, function(err, resp, body) {

    console.log('Attempting to create/update channel');

    // print error if exist
    if (err){
      console.log(err)
      return;
    }

    // if user isnt found - console log response body
    if ( resp.statusCode !== 200 ){
      console.log(resp.body);
      return;
    }

    // create passhash
    var shasum = crypto.createHash('sha512');
    shasum.update( body.salt + password );
    var passhash = shasum.digest('hex');

    // create token
    shasum = crypto.createHash('sha512');
    shasum.update( passhash + body.salt + body.ts );
    var token = shasum.digest('hex');

    // define request headers with auth credentails
    var options = {
      json: true,
      headers: { 'auth-username': username,
                  'auth-ts': body.ts,
                  'auth-salt': body.salt,
                  'auth-token': token }
    }

    // POST channel to API for creation/update
    needle.post(apiURL+'/channels', channelConfig, options, function(err, resp) {

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

'use strict'
const utils = require('openhim-mediator-utils')
const needle = require('needle')

module.exports = (apiConfig) => {
  // used to bypass self signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  // define login credentails for authorization
  const options = {
    username: apiConfig.username,
    password: apiConfig.password,
    apiURL: apiConfig.url
  }

  return {
    testConnection: (callback) => {
      utils.authenticate(options, function (err) {
        if (err) {
          return callback(err)
        }
        let authHeaders = utils.genAuthHeaders(options)
        needle.get(apiConfig.url + '/channels', {headers: authHeaders}, function (err, resp) {
          if (err) {
            return callback(err)
          }
          if (resp.statusCode !== 200) {
            return callback(new Error(`Received response from OpenHIM [${resp.statusCode}]: ${resp.body}`))
          }
          callback()
        })
      })
    },

    registerChannel: function (channelConfig, callback) {
      // authenticate the username
      utils.authenticate(options, function (err) {
        if (err) {
          return callback(err)
        }

        // define request headers with auth credentails
        var authHeaders = utils.genAuthHeaders(options)
        var postOptions = {
          json: true,
          headers: authHeaders
        }

        // POST channel to API for creation/update
        needle.post(apiConfig.url + '/channels', channelConfig, postOptions, function (err, resp) {
          if (err) {
            return callback(err)
          }

          // check the response status from the API server
          if (resp.statusCode === 201) {
            // successfully created/updated
            callback(null, resp)
          } else {
            callback(new Error('An error occured while trying to create/update the channel: ' + resp.body), resp)
          }
        })
      })
    }
  }
}

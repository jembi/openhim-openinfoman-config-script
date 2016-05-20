'use strict'
/* global describe it */

const assert = require('assert')

const index = require('../lib/index')

describe('Create Channel Config Object from Document Name', function () {
  it('should create a channel config object with path prefix', function (done) {
    index.createChannelConfigObject('DocumentName', { openinfoman: 'http://localhost:6000/test' }, function (err, result) {
      if (err) {
        return done(err)
      }
      assert.equal(result.name, 'DocumentName', 'Channel Name')
      assert.equal(result.urlPattern, '^/test/CSD/.*/DocumentName/.*$', 'URL pattern')
      assert.equal(result.allow[0], 'admin', 'Clients/Roles')
      assert.equal(result.routes[0].name, 'DocumentName Route', 'Route Name')
      assert.equal(result.routes[0].host, 'localhost', 'Host URL')
      assert.equal(result.routes[0].port, 6000, 'Host Port')
      done()
    })
  })

  it('should create a channel config object without path prefix', function (done) {
    index.createChannelConfigObject('DocumentName', { openinfoman: 'http://localhost:6000/' }, function (err, result) {
      if (err) {
        return done(err)
      }
      assert.equal(result.name, 'DocumentName', 'Channel Name')
      assert.equal(result.urlPattern, '^/CSD/.*/DocumentName/.*$', 'URL pattern')
      assert.equal(result.allow[0], 'admin', 'Clients/Roles')
      assert.equal(result.routes[0].name, 'DocumentName Route', 'Route Name')
      assert.equal(result.routes[0].host, 'localhost', 'Host URL')
      assert.equal(result.routes[0].port, 6000, 'Host Port')
      done()
    })
  })
})

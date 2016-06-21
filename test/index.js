'use strict'
/* global describe it */

const assert = require('assert')

const index = require('../lib/index')

describe('Create Channel Config Object from Document Object', function () {
  const testDoc1 = {
    document: 'providers',
    role: 'providers',
    functions: [
      'urn:ihe:iti:csd:2014:stored-function:facility-search',
      'urn:ihe:iti:csd:2014:adhoc'
    ],
    functionRoles: {}
  }
  const testDoc2 = {
    document: 'RapidProContacts',
    role: 'RapidProContacts',
    functions: [
      'urn:ihe:iti:csd:2014:stored-function:service-search',
      'urn:ihe:iti:csd:2014:stored-function:organization-search'
    ],
    functionRoles: {
      'urn:ihe:iti:csd:2014:stored-function:organization-search': 'admin'
    }
  }
  const testDoc3 = {
    document: 'RapidProContacts',
    role: 'RapidProContacts',
    functions: [
      'urn:ihe:iti:csd:2014:stored-function:facility-search',
      'urn:ihe:iti:csd:2014:stored-function:service-search',
      'urn:ihe:iti:csd:2014:stored-function:organization-search'
    ],
    functionRoles: {
      'urn:ihe:iti:csd:2014:stored-function:service-search': 'admin',
      'urn:ihe:iti:csd:2014:stored-function:organization-search': 'admin'
    }
  }

  it('should create a channel config object with path prefix', function (done) {
    index.createChannelConfigObject(testDoc1, { openinfoman: 'http://localhost:6000/test' }, function (err, results) {
      if (err) {
        return done(err)
      }
      assert.equal(results.length, 1, 'Only one channel')
      assert.equal(results[0].name, 'providers', 'Channel Name')
      assert.equal(results[0].urlPattern, '^/test/CSD/.*/providers/.*$', 'URL pattern')
      assert.equal(results[0].allow[0], 'providers', 'Clients/Roles')
      assert.equal(results[0].routes[0].name, 'providers route', 'Route Name')
      assert.equal(results[0].routes[0].host, 'localhost', 'Host URL')
      assert.equal(results[0].routes[0].port, 6000, 'Host Port')
      done()
    })
  })

  it('should create a channel config object without path prefix', function (done) {
    index.createChannelConfigObject(testDoc1, { openinfoman: 'http://localhost:6000/' }, function (err, results) {
      if (err) {
        return done(err)
      }
      assert.equal(results.length, 1, 'Only one channel')
      assert.equal(results[0].name, 'providers', 'Channel Name')
      assert.equal(results[0].urlPattern, '^/CSD/.*/providers/.*$', 'URL pattern')
      assert.equal(results[0].allow[0], 'providers', 'Clients/Roles')
      assert.equal(results[0].routes[0].name, 'providers route', 'Route Name')
      assert.equal(results[0].routes[0].host, 'localhost', 'Host URL')
      assert.equal(results[0].routes[0].port, 6000, 'Host Port')
      done()
    })
  })

  it('should create a different channel for CSD functions with a specific role', function (done) {
    index.createChannelConfigObject(testDoc2, { openinfoman: 'http://localhost:6000/test' }, function (err, results) {
      if (err) {
        return done(err)
      }
      assert.equal(results.length, 2, 'Create two channels')
      assert.equal(results[0].name, 'RapidProContacts', 'Channel Name')
      assert.equal(results[0].urlPattern, '^/test/CSD/.*/RapidProContacts/.*$', 'URL pattern')
      assert.equal(results[0].allow[0], 'RapidProContacts', 'Clients/Roles')
      assert.equal(results[0].allow[1], 'admin', 'Clients/Roles', 'Function role should have access to document channel')
      assert.equal(results[0].routes[0].name, 'RapidProContacts route', 'Route Name')
      assert.equal(results[0].routes[0].host, 'localhost', 'Host URL')
      assert.equal(results[0].routes[0].port, 6000, 'Host Port')

      assert.equal(results[1].name, 'RapidProContacts - admin', 'Channel Name')
      assert.equal(results[1].urlPattern, '^/test/CSD/.*/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:organization-search$', 'URL pattern')
      assert.equal(results[1].allow[0], 'admin', 'Clients/Roles')
      assert.equal(results[1].routes[0].name, 'RapidProContacts - admin route', 'Route Name')
      assert.equal(results[1].routes[0].host, 'localhost', 'Host URL')
      assert.equal(results[1].routes[0].port, 6000, 'Host Port')

      done()
    })
  })

  it('should group CSD functions with the same role in the same channel', function (done) {
    index.createChannelConfigObject(testDoc3, { openinfoman: 'http://localhost:6000/test' }, function (err, results) {
      if (err) {
        return done(err)
      }
      assert.equal(results.length, 2, 'Create two channels')
      assert.equal(results[0].name, 'RapidProContacts', 'Channel Name')

      assert.equal(results[1].name, 'RapidProContacts - admin', 'Channel Name')
      assert.equal(results[1].urlPattern, '^/test/CSD/.*/RapidProContacts/careServicesRequest/(urn:ihe:iti:csd:2014:stored-function:service-search|urn:ihe:iti:csd:2014:stored-function:organization-search)$', 'URL pattern')

      done()
    })
  })

  it('CSD function channel should have a higher priority than the document channel', function (done) {
    index.createChannelConfigObject(testDoc2, { openinfoman: 'http://localhost:6000/test' }, function (err, results) {
      if (err) {
        return done(err)
      }
      assert.equal(results.length, 2, 'Create two channels')
      assert(results[0].priority)
      assert(results[1].priority)
      assert(results[0].priority > results[1].priority, 'Document channel should have higher value (=lower priority)')

      done()
    })
  })
})

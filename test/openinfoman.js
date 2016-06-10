'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const nock = require('nock')
const _ = require('lodash')

const OpenInfoMan = require('../lib/openinfoman')
const openinfoman = OpenInfoMan('http://localhost:8984')

var expectedResponse = {
  'providers': {
    'careServicesRequest': 'http://localhost:8984/CSD/csr/providers/careServicesRequest',
    'careServicesRequests': {
      'urn:ihe:iti:csd:2014:stored-function:facility-search': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:facility-search',
      'urn:ihe:iti:csd:2014:adhoc': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:adhoc',
      'urn:ihe:iti:csd:2014:stored-function:service-search': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:service-search',
      'urn:ihe:iti:csd:2014:stored-function:organization-search': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:organization-search',
      'urn:ihe:iti:csd:2014:stored-function:provider-search': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:provider-search',
      'urn:openhie.org:openinfoman:modtimes': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:modtimes',
      'urn:openhie.org:openinfoman:service_create': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:service_create',
      'urn:openhie.org:openinfoman:mark_duplicate': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:mark_duplicate',
      'urn:openhie.org:openinfoman:simple_merge': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:simple_merge',
      'urn:openhie.org:openinfoman:mark_potential_duplicate': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:mark_potential_duplicate',
      'urn:openhie.org:openinfoman:delete_potential_duplicate': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:delete_potential_duplicate',
      'urn:openhie.org:openinfoman:organization_create': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:organization_create',
      'urn:openhie.org:openinfoman:provider_create': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:provider_create',
      'urn:openhie.org:openinfoman:facility_create': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:facility_create',
      'urn:openhie.org:openinfoman:delete_duplicate': 'http://localhost:8984/CSD/csr/providers/careServicesRequest/urn:openhie.org:openinfoman:delete_duplicate'
    }
  },
  'RapidProContacts': {
    'careServicesRequest': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest',
    'careServicesRequests': {
      'urn:ihe:iti:csd:2014:stored-function:facility-search': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:facility-search',
      'urn:ihe:iti:csd:2014:adhoc': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:adhoc',
      'urn:ihe:iti:csd:2014:stored-function:service-search': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:service-search',
      'urn:ihe:iti:csd:2014:stored-function:organization-search': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:organization-search',
      'urn:ihe:iti:csd:2014:stored-function:provider-search': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:ihe:iti:csd:2014:stored-function:provider-search',
      'urn:openhie.org:openinfoman:modtimes': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:modtimes',
      'urn:openhie.org:openinfoman:service_create': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:service_create',
      'urn:openhie.org:openinfoman:mark_duplicate': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:mark_duplicate',
      'urn:openhie.org:openinfoman:simple_merge': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:simple_merge',
      'urn:openhie.org:openinfoman:mark_potential_duplicate': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:mark_potential_duplicate',
      'urn:openhie.org:openinfoman:delete_potential_duplicate': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:delete_potential_duplicate',
      'urn:openhie.org:openinfoman:organization_create': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:organization_create',
      'urn:openhie.org:openinfoman:provider_create': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:provider_create',
      'urn:openhie.org:openinfoman:facility_create': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:facility_create',
      'urn:openhie.org:openinfoman:delete_duplicate': 'http://localhost:8984/CSD/csr/RapidProContacts/careServicesRequest/urn:openhie.org:openinfoman:delete_duplicate'
    }
  }
}

describe('Get documents', function () {
  beforeEach(function () {
    nock('http://localhost:8984')
      .get('/CSD/documents.json')
      .reply(200, expectedResponse)
  })

  it('should convert openinfoman GET result to array of document objects', function (done) {
    openinfoman.getDocuments(function (err, result) {
      if (err) {
        return done(err)
      }
      assert.equal(result[0].document, 'providers', 'Contain providers doc')
      assert.deepEqual(result[0].functions, _.keys(expectedResponse.providers.careServicesRequests), 'Contain functions for providers doc')
      assert.equal(result[1].document, 'RapidProContacts', 'Contain RapidProContacts doc')
      assert.deepEqual(result[1].functions, _.keys(expectedResponse.RapidProContacts.careServicesRequests), 'Contain functions for RapidProContacts doc')
      done()
    })
  })
})

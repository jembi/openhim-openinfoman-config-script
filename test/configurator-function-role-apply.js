'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const _ = require('lodash')
const ApplyRoleMenu = require('../lib/configurator-function-role-apply')

describe('Configurator - Apply Roles to Functions Menu', function () {
  let documents = null

  beforeEach(() => {
    documents = [
      {
        document: 'providers',
        role: 'providers',
        include: true,
        functions: [
          'urn:ihe:iti:csd:2014:stored-function:facility-search',
          'urn:ihe:iti:csd:2014:adhoc',
          'urn:ihe:iti:csd:2014:stored-function:service-search',
          'urn:ihe:iti:csd:2014:stored-function:organization-search'
        ],
        functionRoles: {}
      }
    ]
  })

  it('build the command list and include role options', (done) => {
    let menu = ApplyRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    },
      documents[0],
      documents[0].functions
    )
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 4, 'menu should contain 4 items')
    assert.equal(menu.commands['1'].text, 'Cancel')
    let contains = (text, func) => text.indexOf(func) > -1
    assert(contains(menu.commands['2'].text, 'providers'))
    assert(contains(menu.commands['3'].text, 'RapidProContacts'))
    assert(contains(menu.commands['4'].text, 'admin'))

    done()
  })

  it('should apply selected role to functions', (done) => {
    let seenCall = false

    let menu = ApplyRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      popSelf: () => {
        seenCall = true
      }
    },
      documents[0],
      ['urn:ihe:iti:csd:2014:adhoc', 'urn:ihe:iti:csd:2014:stored-function:organization-search']
    )

    menu.commands['2'].execute() // 2: providers
    assert.equal(documents[0].functionRoles['urn:ihe:iti:csd:2014:adhoc'], 'providers', 'should set the correct role')
    assert.equal(documents[0].functionRoles['urn:ihe:iti:csd:2014:stored-function:organization-search'], 'providers', 'should set the correct role')
    assert(seenCall, 'should trigger configurator.popSelf')

    done()
  })
})

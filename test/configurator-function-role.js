'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const _ = require('lodash')
const EditFunctionRoleMenu = require('../lib/configurator-function-role')

describe('Configurator - Edit Function Role Menu', function () {
  let documents = null

  beforeEach(() => {
    documents = [
      {
        document: 'providers',
        role: 'providers',
        include: true,
        functions: [
          'urn:ihe:iti:csd:2014:stored-function:facility-search',
          'urn:ihe:iti:csd:2014:adhoc'
        ],
        functionRoles: {}
      },
      {
        document: 'RapidProContacts',
        role: 'RapidProContacts',
        include: true,
        functions: [
          'urn:ihe:iti:csd:2014:stored-function:service-search',
          'urn:ihe:iti:csd:2014:stored-function:organization-search'
        ],
        functionRoles: {
          'urn:ihe:iti:csd:2014:stored-function:organization-search': 'admin'
        }
      }
    ]
  })

  it('build the command list and include role options', (done) => {
    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    },
      documents[0],
      'urn:ihe:iti:csd:2014:adhoc'
    )
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 4, 'menu should contain 4 items')
    assert.equal(menu.commands['1'].text, 'Back')

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['2'].text, 'Switch role to', 'providers'))
    assert(contains(menu.commands['3'].text, 'Switch role to', 'RapidProContacts'))
    assert(contains(menu.commands['4'].text, 'Switch role to', 'admin'))

    done()
  })

  it('build the command list and include remove and role options', (done) => {
    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    },
      documents[1],
      'urn:ihe:iti:csd:2014:stored-function:organization-search'
    )
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 4, 'menu should contain 4 items')
    assert.equal(menu.commands['1'].text, 'Back')

    assert.equal(menu.commands['2'].text, 'Remove current role', 'document[1] has existing function roles - remove option should be present')

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['3'].text, 'Switch role to', 'providers'))
    assert(contains(menu.commands['4'].text, 'Switch role to', 'RapidProContacts'))

    done()
  })

  it('Switch role command should set function role and popSelf', (done) => {
    let seenCall = false

    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      popSelf: () => {
        seenCall = true
      }
    },
      documents[0],
      'urn:ihe:iti:csd:2014:adhoc'
    )

    menu.commands['2'].execute() // 2: Switch role to providers
    assert.equal(documents[0].functionRoles['urn:ihe:iti:csd:2014:adhoc'], 'providers', 'should set the providers role')
    assert(seenCall, 'should popSelf')

    done()
  })

  it('Remove role command should remove current function role', (done) => {
    let seenCall = false

    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {}
    },
      documents[1],
      'urn:ihe:iti:csd:2014:stored-function:organization-search'
    )

    menu.commands['2'].execute() // 2: Remove current role
    assert(!documents[1].functionRoles['urn:ihe:iti:csd:2014:stored-function:organization-search'], 'should remove the admin role')

    done()
  })
})

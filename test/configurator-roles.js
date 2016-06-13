'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const _ = require('lodash')
const EditRolesMenu = require('../lib/configurator-roles')

describe('Configurator - Edit Roles Menu', function () {
  let documents = null

  beforeEach(() => {
    documents = [
      {
        document: 'providers',
        role: 'providers',
        functions: [
          'urn:ihe:iti:csd:2014:stored-function:facility-search',
          'urn:ihe:iti:csd:2014:adhoc'
        ],
        functionRoles: {}
      },
      {
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
    ]
  })

  it('build the command list and include document options', (done) => {
    let menu = EditRolesMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    })
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 8, 'menu should contain 8 items')
    assert.equal(menu.commands['1'].text, 'Back')
    assert.equal(menu.commands['2'].text, 'Add new role')

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['3'].text, 'Rename', 'providers'))
    assert(contains(menu.commands['4'].text, 'Delete', 'providers'))
    assert(contains(menu.commands['5'].text, 'Rename', 'RapidProContacts'))
    assert(contains(menu.commands['6'].text, 'Delete', 'RapidProContacts'))
    assert(contains(menu.commands['7'].text, 'Rename', 'admin'))
    assert(contains(menu.commands['8'].text, 'Delete', 'admin'))

    done()
  })

  it('back command should trigger configurator.popSelf', (done) => {
    let seenCall = false

    let menu = EditRolesMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      popSelf: () => {
        seenCall = true
      }
    })

    menu.commands['1'].execute()
    assert(seenCall)

    done()
  })

  it('add new command should push new role', (done) => {
    let roles = ['providers', 'RapidProContacts', 'admin']

    let menu = EditRolesMenu({
      documents: documents,
      roles: roles,
      prompt: (question, callback) => {
        assert.equal(question, 'What should the role be named? ')
        callback('test-role')
      },
      printCurrent: () => {}
    })

    menu.commands['2'].execute()
    assert.equal(roles.length, 4)
    assert.equal(roles[3], 'test-role', 'should add test-role to roles')

    done()
  })

  it('rename command should rename a role', (done) => {
    let roles = ['providers', 'RapidProContacts', 'admin']

    let menu = EditRolesMenu({
      documents: documents,
      roles: roles,
      prompt: (question, callback) => {
        assert.equal(question, 'What should the role be named? ')
        callback('test-role')
      },
      printCurrent: () => {}
    })

    menu.commands['5'].execute() // 5: Rename RapidProContacts
    assert.equal(roles[1], 'test-role', 'should rename RapidProContacts to test-role')
    assert.equal(documents[1].role, 'test-role', 'should rename RapidProContacts to test-role')

    done()
  })

  it('rename command should rename a function role', (done) => {
    let roles = ['providers', 'RapidProContacts', 'admin']

    let menu = EditRolesMenu({
      documents: documents,
      roles: roles,
      prompt: (question, callback) => {
        assert.equal(question, 'What should the role be named? ')
        callback('test-role')
      },
      printCurrent: () => {}
    })

    menu.commands['7'].execute() // 7: Rename admin
    assert.equal(roles[2], 'test-role', 'should rename admin to test-role')
    assert.equal(documents[1].functionRoles['urn:ihe:iti:csd:2014:stored-function:organization-search'], 'test-role', 'should rename admin to test-role')

    done()
  })

  it('delete command should delete a role', (done) => {
    let roles = ['providers', 'RapidProContacts', 'admin']

    let menu = EditRolesMenu({
      documents: documents,
      roles: roles,
      printCurrent: () => {}
    })

    menu.commands['6'].execute() // 6: Delete RapidProContacts
    assert.equal(roles.length, 2)
    assert.equal(roles[0], 'providers')
    assert.equal(roles[1], 'admin')
    assert(!documents[1].role, 'should delete RapidProContacts role')

    done()
  })
})

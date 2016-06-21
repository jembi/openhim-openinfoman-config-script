'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const _ = require('lodash')
const EditFunctionRoleMenu = require('../lib/configurator-function-role')

describe('Configurator - Edit Function Roles Menu', function () {
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

  it('build the command list and include function list', (done) => {
    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    },
      documents[0]
    )
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 5, 'menu should contain 5 items')
    assert.equal(menu.commands['1'].text, 'Cancel')
    let contains = (text, func) => text.indexOf(func) > -1
    assert(contains(menu.commands['2'].text, 'urn:ihe:iti:csd:2014:stored-function:facility-search'))
    assert(contains(menu.commands['3'].text, 'urn:ihe:iti:csd:2014:adhoc'))
    assert(contains(menu.commands['4'].text, 'urn:ihe:iti:csd:2014:stored-function:service-search'))
    assert(contains(menu.commands['5'].text, 'urn:ihe:iti:csd:2014:stored-function:organization-search'))

    done()
  })

  it('should trigger the apply role menu', (done) => {
    let seenCall = false

    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        seenCall = true
        assert.equal(doc.document, 'providers', 'should pass providers document through')
        assert.equal(functions.length, 1, 'should pass 1 function through')
        assert.equal(functions[0], 'urn:ihe:iti:csd:2014:stored-function:facility-search', 'should pass correct function through')
      }
    },
      documents[0]
    )

    menu.lineHandler('2')
    assert(seenCall)

    done()
  })

  it('should trigger the apply role menu and allow a range to be selected [2,4]', (done) => {
    let seenCall = false

    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        seenCall = true
        assert.equal(doc.document, 'providers', 'should pass providers document through')
        assert.equal(functions.length, 2, 'should pass 2 functions through')
        assert.equal(functions[0], 'urn:ihe:iti:csd:2014:stored-function:facility-search', 'should pass correct function through')
        assert.equal(functions[1], 'urn:ihe:iti:csd:2014:stored-function:service-search', 'should pass correct function through')
      }
    },
      documents[0]
    )

    menu.lineHandler('2,4')
    assert(seenCall)

    done()
  })

  it('should trigger the apply role menu and allow a range to be selected [2-4]', (done) => {
    let seenCall = false

    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        seenCall = true
        assert.equal(doc.document, 'providers', 'should pass providers document through')
        assert.equal(functions.length, 3, 'should pass 3 functions through')
        assert.equal(functions[0], 'urn:ihe:iti:csd:2014:stored-function:facility-search', 'should pass correct function through')
        assert.equal(functions[1], 'urn:ihe:iti:csd:2014:adhoc', 'should pass correct function through')
        assert.equal(functions[2], 'urn:ihe:iti:csd:2014:stored-function:service-search', 'should pass correct function through')
      }
    },
      documents[0]
    )

    menu.lineHandler('2-4')
    assert(seenCall)

    done()
  })

  it('should trigger the apply role menu and allow a range to be selected [2-4,5]', (done) => {
    let seenCall = false

    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        seenCall = true
        assert.equal(doc.document, 'providers', 'should pass providers document through')
        assert.equal(functions.length, 4, 'should pass 4 functions through')
        assert.equal(functions[0], 'urn:ihe:iti:csd:2014:stored-function:facility-search', 'should pass correct function through')
        assert.equal(functions[1], 'urn:ihe:iti:csd:2014:adhoc', 'should pass correct function through')
        assert.equal(functions[2], 'urn:ihe:iti:csd:2014:stored-function:service-search', 'should pass correct function through')
        assert.equal(functions[3], 'urn:ihe:iti:csd:2014:stored-function:organization-search', 'should pass correct function through')
      }
    },
      documents[0]
    )

    menu.lineHandler('2-4,5')
    assert(seenCall)

    done()
  })

  it('should not trigger the apply role menu if range is invalid [6]', (done) => {
    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        assert(false, 'should not trigger menu')
      }
    },
      documents[0]
    )

    menu.lineHandler('6')
    done()
  })

  it('should not trigger the apply role menu if range is invalid [0]', (done) => {
    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        assert(false, 'should not trigger menu')
      }
    },
      documents[0]
    )

    menu.lineHandler('0')
    done()
  })

  it('should not trigger the apply role menu if range is invalid [2,3,-1,4]', (done) => {
    let menu = EditFunctionRoleMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      popSelf: () => {},
      changeMenu: (Menu, doc, functions) => {
        assert(false, 'should not trigger menu')
      }
    },
      documents[0]
    )

    menu.lineHandler('2,3,-1,4')
    done()
  })
})

'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const _ = require('lodash')
const EditDocMenu = require('../lib/configurator-doc')

describe('Configurator - Edit Doc Menu', function () {
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

  it('build the command list and include role and function role options', (done) => {
    let menu = EditDocMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    },
      documents[0]
    )
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 5, 'menu should contain 5 items')
    assert.equal(menu.commands['1'].text, 'Back')
    assert.equal(menu.commands['2'].text, 'Exclude document')
    assert.equal(menu.commands['3'].text, 'Set roles for individual stored queries')

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['4'].text, 'Switch role to', 'RapidProContacts'))
    assert(contains(menu.commands['5'].text, 'Switch role to', 'admin'))

    done()
  })

  it('back command should trigger configurator.popSelf', (done) => {
    let seenCall = false

    let menu = EditDocMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      popSelf: () => {
        seenCall = true
      }
    },
      documents[0]
    )

    menu.commands['1'].execute() // 1: Back
    assert(seenCall)

    done()
  })

  it('exclude command should trigger exclude and trigger configurator.popSelf', (done) => {
    let seenCall = false

    let menu = EditDocMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      popSelf: () => {
        seenCall = true
      }
    },
      documents[0]
    )

    menu.commands['2'].execute() // 2: Exclude document
    assert(seenCall)
    assert(!documents[0].include)

    done()
  })

  it('switch command should change the document role', (done) => {
    let menu = EditDocMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {}
    },
      documents[0]
    )

    menu.commands['4'].execute() // 4: Switch role to RapidProContacts
    assert.equal(documents[0].role, 'RapidProContacts', 'should switch role to RapidProContacts')

    done()
  })

  it('set role for function command should trigger the function-role menu', (done) => {
    let seenCall = false

    let menu = EditDocMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {},
      changeMenu: (Menu, doc) => {
        seenCall = true
        assert.equal(doc.document, 'providers', 'should pass providers document through')
      }
    },
      documents[0]
    )

    menu.commands['3'].execute() // 3: Set roles for individual stored queries
    assert(seenCall)

    done()
  })
})

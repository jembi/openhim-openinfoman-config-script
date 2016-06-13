'use strict'
/* global describe it beforeEach */

const assert = require('assert')
const _ = require('lodash')
const MainMenu = require('../lib/configurator-main')

describe('Configurator - Main Menu', function () {
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

  it('build the command list and include document options', (done) => {
    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    })
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 6, 'menu should contain 6 items')
    assert.equal(menu.commands['1'].text, 'Quit')
    assert.equal(menu.commands['2'].text, 'Reset')
    assert.equal(menu.commands['3'].text, 'Done - Submit configuration to OpenHIM')
    assert.equal(menu.commands['4'].text, 'Edit Roles')

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['5'].text, 'Edit', 'providers'))
    assert(contains(menu.commands['6'].text, 'Edit', 'RapidProContacts'))

    done()
  })

  it('quit command should trigger configurator.quit', (done) => {
    let seenCall = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      quit: () => {
        seenCall = true
      }
    })

    menu.commands['1'].execute() // 1: Quit
    assert(seenCall)

    done()
  })

  it('reset command should trigger configurator.reset', (done) => {
    let seenCall = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      reset: () => {
        seenCall = true
      }
    })

    menu.commands['2'].execute() // 2: Reset
    assert(seenCall)

    done()
  })

  it('done command should trigger configurator.done', (done) => {
    let seenCall = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      done: () => {
        seenCall = true
      }
    })

    menu.commands['3'].execute() // 3: Done
    assert(seenCall)

    done()
  })

  it('edit command should trigger edit doc menu', (done) => {
    let seenCall = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      changeMenu: (Menu, param) => {
        seenCall = true
        assert.equal(param.document, 'providers', 'should pass providers document through')
      }
    })

    menu.commands['5'].execute() // 5: Edit providers
    assert(seenCall)

    done()
  })

  it('build the command list and set appropriate text for excluded documents', (done) => {
    documents[1].include = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin']
    })
    assert(menu.commands)
    assert.equal(_.keys(menu.commands).length, 6, 'menu should contain 6 items')

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['5'].text, 'Edit', 'providers'))
    assert(contains(menu.commands['6'].text, 'Include', 'RapidProContacts'), 'item 6 should be \'Include RapidProContacts\'')

    done()
  })

  it('include command should include an excluded document', (done) => {
    documents[1].include = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {}
    })

    menu.commands['6'].execute() // 6: Include RapidProContacts
    assert(documents[1].include)

    done()
  })

  it('include command should command text', (done) => {
    documents[1].include = false

    let menu = MainMenu({
      documents: documents,
      roles: ['providers', 'RapidProContacts', 'admin'],
      printCurrent: () => {}
    })

    menu.commands['6'].execute() // 6: Include RapidProContacts

    let contains = (text, op, doc) => text.indexOf(op) > -1 && text.indexOf(doc) > -1
    assert(contains(menu.commands['6'].text, 'Edit', 'RapidProContacts'), 'item 6 text should updated')

    done()
  })
})

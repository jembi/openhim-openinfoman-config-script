'use strict'
const chalk = require('chalk')
const _ = require('lodash')
const EditRolesMenu = require('./configurator-roles')
const EditDocMenu = require('./configurator-doc')

module.exports = (configurator) => {
  const printAllRoles = () => {
    console.log('Available Roles: ' + ((configurator.roles.map((r) => chalk.magenta(r))).join(', ')))
  }

  const printDoc = (doc) => {
    if (doc.include) {
      console.log(`${chalk.green(doc.document)} - role: ${doc.role ? chalk.magenta(doc.role) : '<none>'}`)
      _.keys(doc.functionRoles).forEach((func) => {
        console.log(` - ${chalk.yellow(func)} role: ${chalk.magenta(doc.functionRoles[func])}`)
      })
    } else {
      console.log(chalk.dim.green(doc.document) + ' (excluded)')
    }
  }

  let commands = {}

  const buildCommands = () => {
    for (let cmd in commands) {
      delete commands[cmd]
    }

    commands['1'] = {
      text: 'Quit',
      execute: configurator.quit
    }
    commands['2'] = {
      text: 'Reset',
      execute: configurator.reset
    }
    commands['3'] = {
      text: 'Done - Submit configuration to OpenHIM',
      execute: configurator.done
    }
    commands['4'] = {
      text: 'Edit Roles',
      execute: () => {
        configurator.changeMenu(EditRolesMenu)
      }
    }
    let i = 5
    configurator.documents.forEach((doc) => {
      commands[`${i}`] = {
        text: `${doc.include ? 'Edit' : 'Include'} ${chalk.green(doc.document)}`,
        execute: () => {
          if (doc.include) {
            configurator.changeMenu(EditDocMenu, doc)
            buildCommands()
          } else {
            doc.include = true
            buildCommands()
            configurator.printCurrent()
          }
        }
      }
      i++
    })
  }

  const printMainMenu = () => {
    console.log('Available OpenInfoMan Documents:')
    configurator.documents.forEach((doc) => {
      printDoc(doc)
    })

    console.log()
    printAllRoles()
  }

  buildCommands()

  return {
    print: printMainMenu,
    commands: commands,
    rebuildCommands: buildCommands
  }
}

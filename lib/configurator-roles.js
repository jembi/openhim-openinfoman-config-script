'use strict'
const chalk = require('chalk')
const _ = require('lodash')

module.exports = (configurator) => {
  const printAllRoles = () => {
    console.log('Available Roles: ' + ((configurator.roles.map((r) => chalk.magenta(r))).join(', ')))
  }

  let commands = {}

  const renameRoleForDocuments = (oldName, newName) => {
    configurator.documents.forEach((doc) => {
      if (doc.role === oldName) {
        doc.role = newName
      }

      _.keys(doc.functionRoles).forEach((k) => {
        if (doc.functionRoles[k] === oldName) {
          doc.functionRoles[k] = newName
        }
      })
    })
  }

  const deleteRoleForDocuments = (role) => {
    configurator.documents.forEach((doc) => {
      if (doc.role === role) {
        doc.role = null
      }

      _.keys(doc.functionRoles).forEach((k) => {
        if (doc.functionRoles[k] === role) {
          doc.functionRoles[k] = null
        }
      })
    })
  }

  const buildCommands = () => {
    for (let cmd in commands) {
      delete commands[cmd]
    }

    commands['1'] = {
      text: 'Back',
      execute: configurator.popSelf
    }
    commands['2'] = {
      text: 'Add new role',
      execute: () => {
        configurator.prompt('What should the role be named? ', (line) => {
          configurator.roles.push(line)
          buildCommands()
          configurator.printCurrent()
        })
      }
    }

    let menuI = 3
    for (let i = 0; i < configurator.roles.length; i++) {
      commands[`${menuI}`] = {
        text: `Rename ${chalk.magenta(configurator.roles[i])}`,
        execute: () => {
          configurator.prompt('What should the role be named? ', (line) => {
            renameRoleForDocuments(configurator.roles[i], line)
            configurator.roles[i] = line
            buildCommands()
            configurator.printCurrent()
          })
        }
      }
      menuI++

      commands[`${menuI}`] = {
        text: `Delete ${chalk.magenta(configurator.roles[i])}`,
        execute: () => {
          deleteRoleForDocuments(configurator.roles[i])
          configurator.roles.splice(i, 1)
          buildCommands()
          configurator.printCurrent()
        }
      }
      menuI++
    }
  }

  buildCommands()

  return {
    print: printAllRoles,
    commands: commands
  }
}

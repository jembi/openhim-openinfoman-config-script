'use strict'
const chalk = require('chalk')
const _ = require('lodash')
const EditFunctionRoleMenu = require('./configurator-function-role')

/**
 * Configurator CLI - Edit Document Menu
 */
module.exports = (configurator, document) => {
  const printDoc = () => {
    console.log(`${chalk.green(document.document)} - role: ${document.role ? chalk.magenta(document.role) : '<none>'}`)
    _.keys(document.functionRoles).forEach((func) => {
      console.log(` - ${chalk.yellow(func)} role: ${chalk.magenta(document.functionRoles[func])}`)
    })
  }

  let commands = {}

  const buildCommands = () => {
    for (let cmd in commands) {
      delete commands[cmd]
    }

    commands['1'] = {
      text: 'Back',
      execute: configurator.popSelf
    }

    commands['2'] = {
      text: 'Exclude document',
      execute: () => {
        document.include = false
        configurator.popSelf()
      }
    }

    commands['3'] = {
      text: 'Set roles for individual stored queries',
      execute: () => {
        configurator.changeMenu(EditFunctionRoleMenu, document)
      }
    }

    let menuI = 4
    configurator.roles.forEach((role) => {
      if (document.role !== role) {
        commands[`${menuI}`] = {
          text: `Switch role to ${chalk.magenta(role)}`,
          execute: () => {
            document.role = role
            buildCommands()
            configurator.printCurrent()
          }
        }
        menuI++
      }
    })
  }

  buildCommands()

  return {
    print: printDoc,
    commands: commands,
    rebuildCommands: buildCommands
  }
}

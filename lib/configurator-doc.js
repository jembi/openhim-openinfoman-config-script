'use strict'
const chalk = require('chalk')
const EditFunctionRoleMenu = require('./configurator-function-role')

module.exports = (configurator, document) => {
  const printDoc = () => {
    console.log(`${chalk.green(document.document)} - role: ${document.role ? chalk.magenta(document.role) : '<none>'}`)
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

    let menuI = 3
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
    document.functions.forEach((func) => {
      commands[`${menuI}`] = {
        text: `Set role for ${chalk.yellow(func)}${document.functionRoles[func] ? ` role: ${chalk.magenta(document.functionRoles[func])}` : ''}`,
        execute: () => {
          configurator.changeMenu(EditFunctionRoleMenu, document, func)
        }
      }
      menuI++
    })
  }

  buildCommands()

  return {
    print: printDoc,
    commands: commands,
    rebuildCommands: buildCommands
  }
}

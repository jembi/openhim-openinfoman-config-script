'use strict'
const chalk = require('chalk')

/**
 * Configurator CLI - Edit CSD Function Role Menu
 */
module.exports = (configurator, document, csdFunction) => {
  const printFunc = () => {
    console.log(`${chalk.green(document.document)} - role: ${document.role ? chalk.magenta(document.role) : '<none>'}`)
    if (document.functionRoles[csdFunction]) {
      console.log(`Function: ${chalk.yellow(csdFunction)} role: ${chalk.magenta(document.functionRoles[csdFunction])}`)
    } else {
      console.log(`Function: ${chalk.yellow(csdFunction)}`)
    }
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

    let menuI = 2
    if (document.functionRoles[csdFunction]) {
      commands[`${menuI}`] = {
        text: 'Remove current role',
        execute: () => {
          delete document.functionRoles[csdFunction]
          buildCommands()
          configurator.printCurrent()
        }
      }
      menuI++
    }

    configurator.roles.forEach((role) => {
      if (document.functionRoles[csdFunction] !== role) {
        commands[`${menuI}`] = {
          text: `Switch role to ${chalk.magenta(role)}`,
          execute: () => {
            document.functionRoles[csdFunction] = role
            configurator.popSelf()
          }
        }
        menuI++
      }
    })
  }

  buildCommands()

  return {
    print: printFunc,
    commands: commands,
    rebuildCommands: buildCommands
  }
}

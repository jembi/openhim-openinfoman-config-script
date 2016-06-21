'use strict'
const chalk = require('chalk')

/**
 * Configurator CLI - Edit CSD Function Roles Sub Menu - Pick a role and apply to several functions
 */
module.exports = (configurator, document, functions) => {
  const printInstructions = () => {
    functions.forEach((func) => {
      console.log(`${chalk.yellow(func)}`)
    })
    console.log()
    console.log('Choose a role to apply to these CSD functions')
  }

  let commands = {}

  const buildCommands = () => {
    for (let cmd in commands) {
      delete commands[cmd]
    }

    commands['1'] = {
      text: 'Cancel',
      execute: configurator.popCurrentMenu
    }

    let menuI = 2
    configurator.roles.forEach((role) => {
      commands[`${menuI}`] = {
        text: `${chalk.magenta(role)}`,
        execute: () => {
          functions.forEach((func) => {
            document.functionRoles[func] = role
          })
          configurator.popCurrentMenu()
        }
      }
      menuI++
    })
  }

  buildCommands()

  return {
    print: printInstructions,
    commands: commands,
    rebuildCommands: buildCommands
  }
}

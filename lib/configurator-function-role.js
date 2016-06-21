'use strict'
const chalk = require('chalk')
const rangeParser = require('parse-numeric-range')
const ApplyRoleMenu = require('./configurator-function-role-apply')

/**
 * Configurator CLI - Edit CSD Function Roles Menu
 */
module.exports = (configurator, document) => {
  const printInstructions = () => {
    console.log(`${chalk.green(document.document)} - role: ${document.role ? chalk.magenta(document.role) : '<none>'}`)
    console.log()
    console.log('Select the functions you want to set a role for')
    console.log('You can select ranges (x-z) and/or comma separated lists (x,z)')
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
    document.functions.forEach((func) => {
      ((menuI) => {
        commands[`${menuI}`] = {
          text: `${chalk.yellow(func)}`,
          execute: () => {
            lineHandler(`${menuI}`)
          }
        }
      })(menuI)
      menuI++
    })
  }

  const lineHandler = (line) => {
    let range = rangeParser.parse(line)

    if (!range || range.length === 0) {
      return
    }

    let inRange = range
      .map((x) => x >= 2 && x <= document.functions.length + 1)
      .reduce((a, b) => a && b)

    if (!inRange) {
      console.log('Selected value(s) are out of range')
      return
    }

    let funcs = []
    for (let i = 0; i < document.functions.length; i++) {
      if (range.indexOf(i + 2) > -1) {
        funcs.push(document.functions[i])
      }
    }

    configurator.popCurrentMenu(true)
    configurator.changeMenu(ApplyRoleMenu, document, funcs)
  }

  buildCommands()

  return {
    print: printInstructions,
    commands: commands,
    rebuildCommands: buildCommands,
    lineHandler: lineHandler
  }
}

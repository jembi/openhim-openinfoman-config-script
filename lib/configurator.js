'use strict'
const readline = require('readline')
const chalk = require('chalk')
const MainMenu = require('./configurator-main')
const async = require('async')

/*
 * CLI for configuring the infoman document roles
 */
module.exports = (documents) => {
  const rl = readline.createInterface(process.stdin, process.stdout)

  let currentMenu = null
  let menuStack = []
  let _configurator = null

  const reset = () => {
    _configurator.roles = []
    documents.forEach((doc) => {
      doc.include = true
      doc.role = doc.document
      doc.functionRoles = {}
      _configurator.roles.push(doc.document)
    })
  }

  const printCommands = () => {
    console.log('<<< Commands >>>')
    for (let cmd in currentMenu.commands) {
      let pad = (cmd.length === 1) ? '  ' : ((cmd.length === 2) ? ' ' : '')
      console.log(`${pad}${cmd}: ${currentMenu.commands[cmd].text}`)
    }
  }

  const initialRolesSetup = (callback) => {
    rl.question('Would you like the autogenerate roles based on the document names? [Y/n] ', (answer) => {
      if (answer.trim().toUpperCase() !== 'N') {
        return callback()
      }

      _configurator.roles = []
      let questions = []

      documents.forEach((doc) => {
        questions.push((qCallback) => {
          rl.question(`What role would you like to use for ${chalk.green(doc.document)}? `, (answer) => {
            doc.role = answer
            if (_configurator.roles.indexOf(answer) < 0) {
              _configurator.roles.push(answer)
            }
            qCallback()
          })
        })
      })

      async.series(questions, () => {
        callback()
      })
    })
  }

  const printCurrent = () => {
    currentMenu.print()
    console.log()
    printCommands()
    console.log()
  }

  _configurator = {
    documents: documents,
    roles: null,

    quit: () => {
      console.log('Bye')
      process.exit(0)
    },

    reset: () => {
      reset()
      initialRolesSetup(() => {
        console.log()
        currentMenu.rebuildCommands()
        printCurrent()
        rl.prompt()
      })
    },

    done: null,

    changeMenu: (Menu, param1, param2) => {
      menuStack.push(currentMenu)
      currentMenu = Menu(_configurator, param1, param2)
      printCurrent()
    },

    printCurrent: printCurrent,

    popSelf: (quiet) => {
      if (menuStack.length > 0) {
        currentMenu = menuStack.pop()
        currentMenu.rebuildCommands()
        if (!quiet) {
          printCurrent()
        }
      }
    },

    prompt: (question, callback) => {
      rl.question(question, (answer) => {
        callback(answer)
        rl.prompt()
      })
    }
  }

  return {
    run: (submitCallback) => {
      reset()

      _configurator.submit = () => {
        rl.pause()
        submitCallback(() => {
          console.log()
          console.log('Done!')
          console.log()
          rl.resume()
          printCurrent()
          rl.prompt()
        })
      }

      currentMenu = MainMenu(_configurator)

      initialRolesSetup(() => {
        console.log()
        printCurrent()
        rl.setPrompt('> ')
        rl.prompt()
      })

      rl.on('line', (line) => {
        if (currentMenu.commands[line.trim()]) {
          currentMenu.commands[line.trim()].execute()
        } else if (line.trim() === 'help') {
          printCommands()
          console.log()
        } else if (line.trim().length > 0 && currentMenu.lineHandler) {
          currentMenu.lineHandler(line.trim())
        }

        rl.prompt()
      })

      rl.on('close', () => {
        _configurator.quit()
      })
    }
  }
}

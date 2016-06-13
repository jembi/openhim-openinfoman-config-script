'use strict'
const readline = require('readline')
const MainMenu = require('./configurator-main')

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
      console.log(`  ${cmd}: ${currentMenu.commands[cmd].text}`)
    }
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
      printCurrent()
    },

    done: null,

    changeMenu: (Menu, param1, param2) => {
      menuStack.push(currentMenu)
      currentMenu = Menu(_configurator, param1, param2)
      printCurrent()
    },

    printCurrent: printCurrent,

    popSelf: () => {
      if (menuStack.length === 0) {
        console.log('this is the end')
      } else {
        currentMenu = menuStack.pop()
        currentMenu.rebuildCommands()
        printCurrent()
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
    run: (callback) => {
      reset()

      _configurator.done = () => {
        callback()
        rl.on('close', () => {})
        rl.close()
      }

      currentMenu = MainMenu(_configurator)

      printCurrent()
      rl.setPrompt('> ')
      rl.prompt()

      rl.on('line', (line) => {
        if (currentMenu.commands[line.trim()]) {
          currentMenu.commands[line.trim()].execute()
        } else if (line.trim() === 'help') {
          printCommands()
          console.log()
        }

        rl.prompt()
      })

      rl.on('close', () => {
        _configurator.quit()
      })
    }
  }
}

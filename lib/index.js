#!/usr/bin/env node
'use strict'

const commandLineArgs = require('command-line-args')
const URL = require('url')
const _ = require('lodash')
const Q = require('q')

const OpenHIM = require('./openhim')
const OpenInfoMan = require('./openinfoman')
const Configurator = require('./configurator')

const createCSDFunctionChannels = (document, url, channels) => {
  let invertedFunctionRoles = _.invertBy(document.functionRoles)
  _.keys(invertedFunctionRoles).forEach((role) => {
    let channel = _.cloneDeep(require('../resources/channelConfig.json'))

    channel.name = `${document.document} - ${role}`

    let funcPattern = invertedFunctionRoles[role].join('|')
    if (invertedFunctionRoles[role].length > 1) {
      funcPattern = `(${funcPattern})`
    }

    if (url.path.length > 1) {
      channel.urlPattern = `^${url.path}/CSD/.*/${document.document}/careServicesRequest/${funcPattern}$`
    } else {
      channel.urlPattern = `^/CSD/.*/${document.document}/careServicesRequest/${funcPattern}$`
    }
    channel.allow.push(role)
    channel.routes[0].name = channel.name + ' route'
    channel.routes[0].host = url.hostname
    channel.routes[0].port = url.port
    channel.priority = 1

    // add function role to document channel
    if (channels[0].allow.indexOf(role) < 0) {
      channels[0].allow.push(role)
    }

    channels.push(channel)
  })
}

exports.createChannelConfigObject = function (document, options, callback) {
  let channels = [_.cloneDeep(require('../resources/channelConfig.json'))]
  let url = URL.parse(options.openinfoman)

  channels[0].name = document.document
  if (url.path.length > 1) {
    channels[0].urlPattern = `^${url.path}/CSD/.*/${document.document}/.*$`
  } else {
    channels[0].urlPattern = `^/CSD/.*/${document.document}/.*$`
  }
  if (document.role) {
    channels[0].allow.push(document.role)
  }
  channels[0].routes[0].name = document.document + ' route'
  channels[0].routes[0].host = url.hostname
  channels[0].routes[0].port = url.port
  channels[0].priority = 2

  if (document.functionRoles) {
    createCSDFunctionChannels(document, url, channels)
  }

  callback(null, channels)
}

exports.run = function (options) {
  console.log('Welcome to the OpenHIM-OpenInfoMan Configurator!')
  console.log()
  console.log('This utility will generate channels in the OpenHIM for accessing documents in OpenInfoMan')
  console.log()

  const openhim = OpenHIM({
    username: options.username,
    password: options.password,
    url: options.openhim
  })

  const openinfoman = OpenInfoMan(options.openinfoman)

  openhim.testConnection((err) => {
    if (err) {
      console.error(err)
      console.log('An issue occured while trying to connect to the OpenHIM')
      console.log('Please check your OpenHIM configuration and try again')
      process.exit(1)
    }

    console.log('Fetching OpenInfoMan Documents...')
    openinfoman.getDocuments((err, docs) => {
      if (err) {
        return console.log('Couldn\'t fetch documents: ', err)
      }

      console.log(`Found ${docs.length} documents`)

      Configurator(docs).run((callback) => {
        let promises = []

        docs.forEach((doc) => {
          if (!doc.include) {
            return
          }

          console.log(`Creating channel(s) for ${doc.document}...`)
          exports.createChannelConfigObject(doc, options, (err, channels) => {
            if (err) {
              return console.log('Couldn\'t create channel object: ', err)
            }
            channels.forEach((channel) => {
              console.log(`Creating channel: ${channel.name}`)
              let defer = Q.defer()

              openhim.registerChannel(channel, (err, res) => {
                if (err) {
                  console.log(`Couldn\'t register channel for ${channel.name} with the OpenHIM: `, err)
                } else {
                  console.log(`Channel created for ${channel.name}!`)
                }
                defer.resolve()
              })

              promises.push(defer.promise)
            })
          })
        })

        Q.all(promises).then(callback)
      })
    })
  })
}

if (!module.parent) {
  const definitions = [
    { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage guide.' },
    { name: 'openinfoman', alias: 'i', defaultValue: 'http://localhost:8984', description: 'The openinfoman base url (default: http://localhost:8984)' },
    { name: 'openhim', alias: 'm', defaultValue: 'https://localhost:8080', description: 'The OpenHIMs base API url (default: https://localhost:8080)' },
    { name: 'username', alias: 'u', defaultValue: 'root@openhim.org', description: 'The OpenHIMs API username (default: root@openhim.org)' },
    { name: 'password', alias: 'p', description: 'The OpenHIMs API password' }
  ]
  var cli = commandLineArgs(definitions)
  const options = cli.parse()

  if (options.help === true) {
    console.log(cli.getUsage({
      title: 'cnf-openhim-openinfoman',
      description: 'This script creates custom channels in the OpenHIM for each registered document in an OpenInfoMan instance',
      synopsis: '$ cnf-openhim-openinfoman -i http://localhost:8984 -m https://localhost:8080 -u root@openhim.org -p password'
    }))
    process.exit()
  }

  exports.run(options)
}

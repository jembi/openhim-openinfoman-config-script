#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const URL = require('url')
const _ = require('lodash')

var OpenHIM = require('./openhim')
const OpenInfoMan = require('./openinfoman')
const Configurator = require('./configurator')

exports.createChannelConfigObject = function (name, options, callback) {
  var channelConfig = _.cloneDeep(require('../resources/channelConfig.json'))
  var url = URL.parse(options.openinfoman)
  channelConfig.name = name
  if (url.path.length > 1) {
    channelConfig.urlPattern = `^${url.path}/CSD/.*/${name}/.*$`
  } else {
    channelConfig.urlPattern = `^/CSD/.*/${name}/.*$`
  }
  channelConfig.allow.push('admin')
  channelConfig.routes[0].name = name + ' Route'
  channelConfig.routes[0].host = url.hostname
  channelConfig.routes[0].port = url.port
  callback(null, channelConfig)
}

exports.run = function (options) {
  const openhim = OpenHIM({
    username: options.username,
    password: options.password,
    url: options.openhim
  })

  const openinfoman = OpenInfoMan(options.openinfoman)

  console.log('Fetching OpenInfoMan Documents...')
  openinfoman.getDocuments((err, docs) => {
    if (err) {
      return console.log('Couldn\'t fetch documents: ', err)
    }

    Configurator(docs).run(() => {
      console.log('here')
      process.exit(0)
    })
    //docs.forEach((doc) => {
      //console.log(`Creating channel for ${doc}...`)
      //exports.createChannelConfigObject(doc, options, (err, channel) => {
        //if (err) {
          //return console.log('Couldn\'t create channel object: ', err)
        //}
        //openhim.registerChannel(channel, (err, res) => {
          //if (err) {
            //return console.log(`Couldn\'t register channel for ${doc} with the OpenHIM: `, err)
          //}
          //console.log(`Channel created for ${doc}!`)
        //})
      //})
    //})
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

#!/usr/bin/env node

var commandLineArgs = require('command-line-args');
var http = require("http");
var fs = require("fs");
const _ = require('lodash');

var OpenHIM = require('./openhim');
const OpenInfoMan = require('./openinfoman')

exports.createChannelConfigObject = function (name, callback) {
  var channelConfig = _.cloneDeep(require('../resources/channelConfig.json'));
  channelConfig.name = name;
  channelConfig.urlPattern = "^/CSD/csr/"+ name +"/careServicesRequest.*$";
  channelConfig.allow.push("admin");
  channelConfig.routes[0].name = name + " Route";
  channelConfig.routes[0].host = "localhost";
  channelConfig.routes[0].port = 6000;
  callback(null, channelConfig);
}

exports.run = function(options, callback) {
  if (!callback) {
    callback = function() {};
  }

  const openhim = OpenHIM({
    username: options.username,
    password: options.password,
    url: options.openhim
  })

  const openinfoman = OpenInfoMan(options.openinfoman)

  console.log('Fetching OpenInfoMan Documents...');
  openinfoman.getDocuments((err, docs) => {
    docs.forEach((doc) => {
      console.log(`Creating channel for ${doc}`);
      exports.createChannelConfigObject(doc, (err, channel) => {
        openhim.registerChannel(channel, (err, res) => {})
      })
    })
  })
}

if (!module.parent) {

  const definitions = [
    { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage guide.' },
    { name: 'openinfoman', alias: 'i', defaultValue: 'http://localhost:8984', description: 'The openinfoman base url' },
    { name: 'openhim', alias: 'm', defaultValue: 'https://localhost:8080', description: 'The OpenHIMs base API url' },
    { name: 'username', alias: 'u', defaultValue: 'root@openhim.org', description: 'The OpenHIMs API username' },
    { name: 'password', alias: 'p', description: 'The OpenHIMs API password' }
  ];
  var cli = commandLineArgs(definitions)
  const options = cli.parse();

  if (options.help === true) {
    console.log(cli.getUsage({
      title: 'cnf-openhim-openinfoman',
      description: 'This script creates custom channels in the OpenHIM for each registered document in an OpenInfoMan instance',
      synopsis: '$ cnf-openhim-openinfoman -i http://localhost:8984 -m https://localhost:8080 -u root@openhim.org -p password'
    }));
    process.exit();
  }

  exports.run(options);
}

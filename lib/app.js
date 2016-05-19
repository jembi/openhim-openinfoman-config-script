#!/usr/bin/env node

var commandLineArgs = require('command-line-args');
var http = require("http");
var fs = require("fs");

var config = JSON.parse(fs.readFileSync("config/default.json"));
var channel = require('./channel.js');

exports.getDocuments = getDocuments = function(callback) {
  http.get(config.openinfoman, (res) => {
    var data = "";
    var resultArray = [];

    res.setEncoding('utf8');

    res.on('error', (err) => {
      return callback(err);
    });

    res.on('data', (chunk) => {
        data+=chunk;
    });

    res.on('end', () => {
      var dataObj = JSON.parse(data);
      for(var doc in dataObj) {
        resultArray.push(doc);
      }
      callback(null, resultArray);
    });
  });
}

exports.registerChannel = channel.registerChannel;

module.exports = exports;

exports.run = function(callback) {
  if (!callback) {
    callback = function() {};
  }

  console.log('Fetching OpenInfoMan Documents...');
  exports.getDocuments((err, docs) => {
    docs.forEach((doc) => {
      console.log(`Creating channel for ${doc}`);
      
    })
  })
}

if (!module.parent) {

  const definitions = [
    { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage guide.' },
    { name: 'openinfoman', alias: 'i', defaultValue: 'http://localhost:8984/', description: 'The openinfoman base url' },
    { name: 'openhim', alias: 'm', defaultValue: 'http://localhost:8080/', description: 'The OpenHIMs base API url' },
    { name: 'username', alias: 'u', defaultValue: 'root@openhim.org', description: 'The OpenHIMs API username' },
    { name: 'password', alias: 'p', description: 'The OpenHIMs API password' }
  ];
  var cli = commandLineArgs(definitions)
  const options = cli.parse();

  if (options.help === true) {
    console.log(cli.getUsage({
      title: 'cnf-openhim-openinfoman',
      description: 'This script creates custom channels in the OpenHIM for each registered document in an OpenInfoMan instance',
      synopsis: '$ cnf-openhim-openinfoman -i http://localhost:8984/ -m http://localhost:8080/ -u root@openhim.org -p password'
    }));
    process.exit();
  }

  exports.run(options);
}

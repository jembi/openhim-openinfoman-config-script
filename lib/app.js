var http = require("http");
var fs = require("fs");
const _ = require('lodash');

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

exports.createChannelConfigObject = createChannelConfigObject = function(name, callback) {
  var channelConfig = _.cloneDeep(require('../resources/channelConfig.json'));
  channelConfig.name = name;
  channelConfig.urlPattern = "^/CSD/csr/"+ name +"/careServicesRequest.*$";
  channelConfig.allow.push("admin");
  channelConfig.routes[0].name = name + " Route";
  channelConfig.routes[0].host = "localhost";
  channelConfig.routes[0].port = 6000;
  callback(null, channelConfig);
}

exports.registerChannel = channel.registerChannel;

module.exports = exports;

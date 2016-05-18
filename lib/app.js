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

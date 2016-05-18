var http = require("http");
var fs = require("fs");

exports.getDocuments = getDocuments = function(params, callback) {
  http.get(params, (res) => {
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
  var channelConfig = {};
  fs.readFile('resources/channelConfig.json', function read(err, data) {
      if (err) {
          callback(err);
      }
      channelConfig = JSON.parse("" + data);
      channelConfig.name = name;
      channelConfig.urlPattern = "^/openinfoman/" +name+ "$";
      channelConfig.allow.push("admin");
      channelConfig.routes[0].name = name + " Route";
      channelConfig.routes[0].host = "localhost";
      channelConfig.routes[0].port = 6000;
      callback(null, channelConfig);
  });
}

module.exports = exports;

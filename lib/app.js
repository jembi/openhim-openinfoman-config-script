var http = require("http");
var fs = require("fs");

var config = JSON.parse(fs.readFileSync("config/default.json"));

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

module.exports = exports;

var http = require("http");

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

var options = {
  hostname: 'localhost',
  port: 8984,
  path: '/CSD/documents.json',
  agent: false
}

var docs = getDocuments(options, function(err, result) {
  if(err) {
    return console.log(err);
  }
  console.log(result);
  return result;
});

module.exports = exports;

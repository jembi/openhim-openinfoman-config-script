'use strict'

var http = require('http')

module.exports = (url) => {
  return {
    getDocuments: function (callback) {
      http.get(`${url}/CSD/documents.json`, (res) => {
        var data = ''
        var resultArray = []

        res.setEncoding('utf8')

        res.on('error', (err) => {
          return callback(err)
        })

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          var dataObj = JSON.parse(data)
          for (var doc in dataObj) {
            resultArray.push(doc)
          }
          callback(null, resultArray)
        })
      })
    }
  }
}

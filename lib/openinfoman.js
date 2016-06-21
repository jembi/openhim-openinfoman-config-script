'use strict'

const http = require('http')
const _ = require('lodash')

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
            resultArray.push({
              document: doc,
              functions: _.keys(dataObj[doc].careServicesRequests)
            })
          }
          callback(null, resultArray)
        })
      })
    }
  }
}

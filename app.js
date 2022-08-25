var http = require('http'),
  fs = require('fs')

const { filterTransactionsWithPostRequest } = require('./filterTransactions')

//create a server object:
http
  .createServer(async (req, res) => {
    res.write('<p>Running Filter on transactions</p>') //write a response
    res.write(await filterTransactionsWithPostRequest())

    res.end() //end the response
  })
  .listen(3000, function () {
    console.log('server start at port 3000') //the server object listens on port 3000
  })

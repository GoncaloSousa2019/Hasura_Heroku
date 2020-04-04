const express = require('express')
const port = process.env.PORT || 8080;
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(port)
console.log("Server started "+ port)
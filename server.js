const express = require('express')
const myRouter = require('./controller')
var colors = require('colors');

const port = '3001'
const host = 'localhost'
/*
  Create server
*/
const app = express();
/*
  Use Router
*/
app.use(myRouter)
/*
  Listen on port 3001
*/
app.listen(port, host, ()=> {
	console.log(colors.green("Server Listening on port 3001"))
})

const express = require('express')
const myRouter = require('./controller.js')
const port = '3001'
const host = 'localhost'

/*
  Create server
*/
const app = express();
/*
  Use router
*/


/*
  Use Router
*/
app.use(myRouter)

/*
  Listen on port 3001
*/
app.listen(port, host, ()=> {
	console.log('\x1b[32m%s\x1b[0m ', "Server Listening on port 3001")
})

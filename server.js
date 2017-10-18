const express = require('express')
const rp = require('request-promise')
const apiConfig = require('./config/api.config')
let path = require('path')


const url = `${apiConfig.url}/${apiConfig.version}/${apiConfig.bitcoinAlias}`
const proxiedURL = `${apiConfig.proxy}/${url}`

const port = '3001'
const host = 'localhost'
console.log(proxiedURL)
/*
  Create server
*/
const app = express();


/*
  Use router
*/
var myRouter = express.Router();

/*

*/
myRouter.route('/:btcAddress/transactions')
		.get((req, res)=>{
			 //rp(`${proxiedURL}/${apiConfig.token}`)
			 let btcAddress = req.params.btcAddress
			 console.log(btcAddress)
			 console.log(req.params)

			 var tokenReqOptions = {
				 method: 'GET',
				 uri: `${url}/${apiConfig.token}`,
				 json: true
			 };

			 rp(tokenReqOptions)
       .then(response=>{
				 		console.log(response)
						console.log(response.token)

						var txsReqOption = {
							method: 'GET',
						  uri: `${url}/addresses/${btcAddress}/transactions`,
						  headers: {
						    //'User-Agent': 'Request-Promise',
								"X-LedgerWallet-SyncToken":`${response.token}`
						  },
						  json: true
						};

						rp(txsReqOption)
               .then(result=>{
                 console.log(result.truncated)
								 //TODO : Sort by date and send only useful data (take into account truncated txs)
								 res.json(result)
               })
               .catch(e=>console.log(e.message))
       })
       .catch(e=>console.log(e.message))
})

myRouter.route('/:btcAddress/balance')
		.get((req, res)=>{
			//rp(`${proxiedURL}/${apiConfig.token}`)
			let btcAddress = req.params.btcAddress
			console.log(btcAddress)
			console.log(req.params)

			var tokenReqOptions = {
				method: 'GET',
				uri: `${url}/${apiConfig.token}`,
				json: true
			};

			rp(tokenReqOptions)
			.then(response=>{
					 console.log(response)
					 console.log(response.token)

					 var txsReqOption = {
						 method: 'GET',
						 uri: `${url}/addresses/${btcAddress}/transactions`,
						 headers: {
							 //'User-Agent': 'Request-Promise',
							 "X-LedgerWallet-SyncToken":`${response.token}`
						 },
						 json: true
					 };

					 rp(txsReqOption)
							.then(result=>{
								//console.log(result.truncated)
								//TODO : Compute Balance (find txs where address is in output and input)
								let balance = 0
								result.txs.map(tx => {
									if(tx.inputs !== undefined){
										tx.inputs.map(input=>{
											(btcAddress === input.address)?balance -= input.value:balance
										})
									}
									if(tx.outputs !== undefined){
										tx.outputs.map(output=>(btcAddress === output.address)?balance += output.value:balance)
									}

								})
								res.json(balance)
							})
							.catch(e=>console.log(e.message))
			})
			.catch(e=>console.log(e.message))

})

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

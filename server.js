const express = require('express')
const rp = require('request-promise')
const apiConfig = require('./config/api.config')
let path = require('path')


const url = `${apiConfig.url}/${apiConfig.version}/${apiConfig.bitcoinAlias}`
const proxiedURL = `${apiConfig.proxy}/${url}`

const port = '3001'
const host = 'localhost'

var balance = 0

const dumpConsole = (txs)=>{
	const tmp = txs.slice(0,10)
	tmp.map(tx=>{
		console.log("-------------------")
		console.log(`---------${tx.hash}--------`)
		if(tx.inputs !== undefined)
		console.log(`Outputs of length : ${tx.inputs.length}`)
		if(tx.outputs !== undefined)
		console.log(`Inputs of length : ${tx.outputs.length}`)
		console.log("-------------------")
	})
}

/*
  QuickSort by date (received_at property) in case received txs not sorted ascendant (from old to new)
*/
const sortByDate = (txs,start,end)=>{
	if(txs.length - 1 < start || start < 0 || txs.length - 1 < end || end < 0)
		return
		//console.log(`-----------------------------------------`)
		console.log(`sortByDate with length ${txs.length} start ${start} end ${end}`)
		// console.log(`First : ${start}`)
		// console.log(txs[start]['received_at'])
		// console.log(`Middle : ${Math.round((start + end)/2)}`)
		// console.log(txs[Math.round((start + end)/2)]['received_at'])
		//console.log(`-----------------------------------------`)
	let first = txs[start]['received_at'],
				second = txs[end]['received_at']

	const pivot = txs[Math.floor((start + end)/2)]['received_at']

	let firstId = start, secondId = end

	while(firstId <= secondId){

		while(first > pivot){
			firstId++
			first = txs[firstId]['received_at']
		}

		while(second < pivot){
			secondId--
			second = txs[secondId]['received_at']
		}

		if(firstId <= secondId){

			const tmp = txs[firstId]
			txs[firstId] = txs[secondId]
			txs[secondId] = tmp

			firstId++
			secondId--
		}

	}

	if(start < secondId){
		sortByDate(txs,start,secondId)
	}
	if(end < firstId){
		sortByDate(txs,firstId,end)
	}
	
}

/*
  Create server
*/
const app = express();
/*
  Use router
*/
var myRouter = express.Router();

const getTransactions = (res,txs,hash,truncated)=>{
 response = {
	 txs : txs,
	 hash : hash,
	 truncated : truncated
 }
 res.json(response)
}

const getBalance = (res,txs,hash,truncated,btcAddress)=>{

		txs.map(tx => {
			if(tx.inputs !== undefined){
				tx.inputs.map(input=>(btcAddress === input.address)?balance -= input.value:balance)
			}
			if(tx.outputs !== undefined){
				tx.outputs.map(output=>(btcAddress === output.address)?balance += output.value:balance)
			}
		})

		res.json({balance, truncated, hash})
}
const requestWithOptions = (req, res, next)=>{

	let btcAddress = req.params.btcAddress
	let blockHash = req.query.blockHash

	var tokenReqOptions = {
		method: 'GET',
		uri: `${url}/${apiConfig.token}`,
		json: true
	};

	rp(tokenReqOptions)
	.then(response=>{

			 let uri = `${url}/addresses/${btcAddress}/transactions`
			 let realUri = (blockHash !== undefined && blockHash.length > 0)?`${uri}?blockHash=${blockHash}`:uri

			 var txsReqOption = {
				 method: 'GET',
				 uri: realUri,
				 headers: {
					 //'User-Agent': 'Request-Promise',
					 "X-LedgerWallet-SyncToken":`${response.token}`
				 },
				 json: true
			 };

			 console.log(`Request with uri: ${realUri}`)

			 rp(txsReqOption)
					.then(result=>{
						console.log(`Is truncated ${result.truncated}`)
						let txs = result.txs
						const length = txs.length

						let response

						if(length > 0){

							let indexWithBlock = 0

							const formatedTxs = txs.map((tx,index) =>({
										hash : tx.hash,
										received_at : tx.received_at,
										outputs : tx.outputs,
										inputs : tx.inputs,
										block : tx.block
									})
								)

						 sortByDate(formatedTxs,0,formatedTxs.length - 1)

							const block = formatedTxs[0].block
							const hash = ( block !== undefined)?`${block.hash}`:""

							next(res,formatedTxs,hash,result.truncated,btcAddress)
						}
					})
					.catch(e=>console.log(e.message))
	})
	.catch(e=>console.log(e.message))
}

/*

*/
myRouter.route('/:btcAddress/transactions')
		.get((req, res)=>{
			requestWithOptions(req,res,getTransactions)
})


myRouter.route('/:btcAddress/balance')
		.get((req, res)=>{
			requestWithOptions(req,res,getBalance)
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

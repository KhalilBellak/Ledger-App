const express = require('express')
const { requestWithOptions, getTxs, getBalance } = require('./services.js')

var myRouter = express.Router();

/*

*/
myRouter.route('/:btcAddress/transactions')
		.get((req, res)=>{
			requestWithOptions(req,res,getTxs)
})


myRouter.route('/:btcAddress/balance')
		.get((req, res)=>{
			requestWithOptions(req,res,getBalance)
})

module.exports = myRouter

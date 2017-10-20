const express = require('express')
const { requestWithOptions, getTxs, getBalance } = require('./services.js')

var myRouter = express.Router();

/*
  API call to transactions
*/
myRouter.route('/:btcAddress/transactions')
		.get((req, res)=>{
			requestWithOptions(req,res,getTxs)
})

/*
  API call to balance
*/
myRouter.route('/:btcAddress/balance')
		.get((req, res)=>{
			requestWithOptions(req,res,getBalance)
})

module.exports = myRouter

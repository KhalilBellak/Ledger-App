const rp = require('request-promise')
const apiConfig = require('./config/api.config')


const url = `${apiConfig.url}/${apiConfig.version}/${apiConfig.bitcoinAlias}`
const proxiedURL = `${apiConfig.proxy}/${url}`

/*
  QuickSort by date (received_at property) in case received txs not sorted ascendant (from old to new)
*/
const sortByDate = (txs,start,end)=>{
	if(txs.length - 1 < start || start < 0 || txs.length - 1 < end || end < 0)
		return

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

const getTxs = (res,txs,hash,truncated)=>{
 response = {
	 txs : txs,
	 hash : hash,
	 truncated : truncated
 }
 res.json(response)
}

const getBalance = (res,txs,hash,truncated,btcAddress,balance)=>{

  let localBalance = 0
		txs.map(tx => {
			if(tx.inputs !== undefined){
				tx.inputs.map(input=>(btcAddress === input.address)?localBalance -= input.value:localBalance)
			}
			if(tx.outputs !== undefined){
				tx.outputs.map(output=>(btcAddress === output.address)?localBalance += output.value:localBalance)
			}
		})

    localBalance += balance

		res.json({balance : localBalance, truncated, hash})
}
const requestWithOptions = (req, res, next)=>{

	let btcAddress = req.params.btcAddress
	let blockHash = req.query.blockHash
  let balance = req.query.balance

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
					 "X-LedgerWallet-SyncToken":`${response.token}`
				 },
				 json: true
			 };

			 rp(txsReqOption)
					.then(result=>{

						let txs = result.txs
						const length = txs.length

						let response

						if(length > 0){

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

              const iBalance = (balance !== undefined)?parseInt(balance):0

							next(res,formatedTxs,hash,result.truncated,btcAddress,iBalance)
						}
					})
					.catch(e=>console.log(e.message))
	})
	.catch(e=>console.log(e.message))
}

module.exports = {
    requestWithOptions,
    getTxs,
    getBalance
}

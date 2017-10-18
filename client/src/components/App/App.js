//React
import React, { Component } from 'react'
//Components
import Chooser from '../Chooser/Chooser'
import Transactions from '../Transactions/Transactions'
import Balance from '../Balance/Balance'
//Styles
import './App.css'
//Constants
import C  from '../../constants.js'


export default class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      address : "",
      mode : "transactions",
      balance : 0,
      loading : false,
      txs : []
    }
    this.selectAddress = this.selectAddress.bind(this)
    this.onChangeMode = this.onChangeMode.bind(this)
    this.fetchWithMode = this.fetchWithMode.bind(this)
  }

  selectAddress(event){
    event.preventDefault()
    const { _address } = this.refs
    const { txs } = this.state

    this.setState({
      address : _address.value,
      loading: true
    })

    this.fetchWithMode(_address.value,txs)
  }

  fetchWithMode(address, txs, mode="transactions", hash=""){

    let base = `/${address}/${mode}`
    let apiPath = (hash.length > 0)?`${base}?blockHash=${hash}`:base

    console.log(`fetchWithMode with uri : ${apiPath}`)

    fetch(apiPath)
      .then(res=>res.json())
      .then(result=>{
            console.log(`fetch Responded with mode ${mode} and trancated = ${result.truncated} with blockHash : ${result.hash}`)
            if(mode === "transactions"){

               const newTxs = [...txs, ...result.txs]
              //  arr1.concat(arr2)
              if(result.truncated){
                this.fetchWithMode(address,newTxs,mode,result.hash)
              }else{
                this.setState({loading : false, txs : newTxs})
              }

            }else if(mode === "balance"){

              (result.truncated)?this.fetchWithMode(address,txs,mode,result.hash):
                                  this.setState({loading : false, balance : result.balance})

            }

      })
      .catch(e=>console.log(e.message))
  }

  onChangeMode(mode){
    const { address } = this.state
    this.setState({loading : true, mode : mode})
    this.fetchWithMode(address,mode)
  }

  render() {

    const { mode, address, loading, txs, balance } = this.state

    let loaderComp = (loading)?<div className="loader"></div>:<div></div>

    let balanceComp = (mode === "balance" && loading === false)?<Balance balance={balance}/>:<div></div>

    let txsComp = (mode === "transactions" && loading === false)?<Transactions txs={txs}/>:<div></div>

    let chooserComp = (address.length > 0)?<Chooser onChangeMode={this.onChangeMode}/>:<div></div>
    return (
          <div>
            <div className="container">
              <h1>Enter your Bitcoin address :</h1>
              <form onSubmit={this.selectAddress}>
                <input ref="_address" className="search" placeholder="Search" type="text"/>
              </form>
              {chooserComp}
              {loaderComp}
              {balanceComp}
              {txsComp}
            </div>
          </div>
  )
  }
}

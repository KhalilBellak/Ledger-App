//React
import React, { Component } from 'react'
//Components
import Chooser from '../Chooser/Chooser'
import Transactions from '../Transactions/Transactions'
import Balance from '../Balance/Balance'
import Error from '../Error/Error'
//Actions
import {
  selectAddressWithMode,
  setTransactions,
  setBalance,
  changeMode,
  showError,
  hideError
} from '../../store/actions'

//Styles
import './App.css'
//Constants
import C  from '../../constants.js'


export default class App extends Component {

  constructor(props){
    super(props)
    this.selectAddress = this.selectAddress.bind(this)
    this.onChangeMode = this.onChangeMode.bind(this)
    this.fetchWithMode = this.fetchWithMode.bind(this)
  }

  componentWillMount(){
    this.unsubscribe = this.props.store.subscribe(()=>this.forceUpdate())
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  selectAddress(event){

    event.preventDefault()

    const store = this.props.store

    const { _address } = this.refs
    const { mode } = store.getState()
    const txAddress = _address.value.trim()
    const payload = {
      address : txAddress,
      mode : mode
    }

    store.dispatch(selectAddressWithMode(payload))

    this.fetchWithMode(txAddress,[],mode)
  }

  fetchWithMode(address, txs, mode = "transactions", hash = "", balance = 0) {

    let base = `/${address}/${mode}`
    let apiPath = (hash.length > 0) ? `${base}?blockHash=${hash}&balance=${balance}` : base

    //console.log(`fetchWithMode with balance : ${balance} and path ${apiPath}`)
    fetch(apiPath)
      .then(res => res.json())
      .then(result => {

        if (mode === "transactions") {

          const newTxs = [...result.txs, ...txs]

          if (result.truncated) {
            this.fetchWithMode(address, newTxs, mode, result.hash)
          } else {
            this.props.store.dispatch(setTransactions(newTxs))
          }

        } else if (mode === "balance") {

          if (result.truncated) {
            this.fetchWithMode(address, txs, mode, result.hash,result.balance)
          } else {
            this.props.store.dispatch(setBalance(result.balance))
          }
        }

      })
      .catch(e => this.props.store.dispatch(showError(e)))
  }

  onChangeMode(mode) {

    const {
      address,
      txs,
      balanceInitialized,
      txsInitialized
    } = this.props.store.getState()

    const toFetch = ((mode === "transactions" && !txsInitialized) ||
      (mode === "balance" && !balanceInitialized))

    this.props.store.dispatch(changeMode({
      mode,
      loading: toFetch
    }))

    if (toFetch) {
      this.fetchWithMode(address, txs, mode)
    }

  }

  render() {

    const { store } = this.props

    const {
      mode,
      address,
      loading,
      txs,
      balance,
      error
    } = store.getState()

    let isFailed = (error !== null)

    let loaderComp = (loading)?<div className="loader"></div>:<div></div>

    let showBalance = (mode === "balance" && !loading && !isFailed)
    let balanceComp = showBalance?<Balance balance={balance}/>:<div></div>

    let showTxs = (mode === "transactions" && !loading && !isFailed)
    let txsComp = showTxs?<Transactions address={address} txs={txs}/>:<div></div>

    let chooserComp = (address.length > 0 && !isFailed)?<Chooser mode={mode} onChangeMode={this.onChangeMode}/>:<div></div>

    let errorComp = isFailed?<Error error={error}/>:<div></div>
    return (
          <div className="parent-container">
            <div className="container">
              <h1>Ledger App :</h1>
              <form onSubmit={this.selectAddress}>
                <input ref="_address" className="search" placeholder="Enter a Bitcoin's address ..." type="text"/>
              </form>
              {chooserComp}
              {loaderComp}
              {balanceComp}
              {errorComp}
            </div>

            <div className="table-container">
              {txsComp}
            </div>
          </div>
    )
  }

}

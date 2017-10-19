//React
import React, { Component } from 'react'
//Components
import Chooser from '../Chooser/Chooser'
import Transactions from '../Transactions/Transactions'
import Balance from '../Balance/Balance'
//Actions
import { selectAddressWithMode, setTransactions, setBalance, changeMode } from '../../store/actions'
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

  fetchWithMode(address, txs, mode = "transactions", hash = "") {

    let base = `/${address}/${mode}`
    let apiPath = (hash.length > 0) ? `${base}?blockHash=${hash}` : base

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
            this.fetchWithMode(address, txs, mode, result.hash)
          } else {
            this.props.store.dispatch(setBalance(result.balance))
          }
        }

      })
      .catch(e => console.log(e.message))
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
      balance
    } = store.getState()

    let loaderComp = (loading)?<div className="loader"></div>:<div></div>

    let balanceComp = (mode === "balance" && loading === false)?<Balance balance={balance}/>:<div></div>

    let txsComp = (mode === "transactions" && loading === false)?<Transactions address={address} txs={txs}/>:<div></div>

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

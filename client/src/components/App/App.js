//React
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
//Components
import Chooser from '../Chooser/Chooser'
import Transactions from '../Transactions/Transactions'
import Balance from '../Balance/Balance'
import Error from '../Error/Error'
import GoTopButton from '../GoTopButton/GoTopButton'
//Actions
import {
  selectAddressWithMode,
  setTransactions,
  setBalance,
  changeMode,
  showError,
  hideError,
  showGoTopButton,
  hideGoTopButton,
  goTop
} from '../../store/actions'

//Styles
import './App.css'
//Constants
import C  from '../../constants.js'


export default class App extends Component {

  constructor(props){
    super(props)
    this.selectAddress = this.selectAddress.bind(this)
    this.fetchWithMode = this.fetchWithMode.bind(this)
    this.onChangeMode = this.onChangeMode.bind(this)
    this.onScrollTable = this.onScrollTable.bind(this)
    this.goTopTable = this.goTopTable.bind(this)
    this.scrollByStep = this.scrollByStep.bind(this)
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

  onScrollTable(e){

    const store = this.props.store
    const { goTopButtonOn } = store.getState()

    e.preventDefault()

    if(e.target.scrollTop > 0 && !goTopButtonOn){
      store.dispatch(showGoTopButton())
    }else if(e.target.scrollTop === 0 && goTopButtonOn){
      store.dispatch(hideGoTopButton())
    }

  }

  goTopTable(){
    const store = this.props.store

    const intervalId = setInterval(this.scrollByStep,C.scrollTopTick)
    store.dispatch(goTop(intervalId))
  }

  scrollByStep(){
    console.log("scrollByStep")
    const store = this.props.store
    let tableNode = ReactDOM.findDOMNode(this.refs._txs)
    const scrollY = tableNode.scrollTop

    if( scrollY > 0){
      const step = (scrollY*C.scrollTopTick)/C.scrollTopDuration
      tableNode.scrollTop = (scrollY > step)?(scrollY - step):0
    }else{
      clearInterval(store.getState().intervalId)
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
      error,
      goTopButtonOn,
      goTop
    } = store.getState()

    const isFailed = (error !== null)

    const goTopComp = (goTopButtonOn)?<GoTopButton onGoTop={this.goTopTable}/>:<div></div>

    const loaderComp = (loading)?<div className="loader"></div>:<div></div>

    const showBalance = (mode === "balance" && !loading && !isFailed)
    const balanceComp = showBalance?<Balance balance={balance}/>:<div></div>

    const showTxs = (mode === "transactions" && !loading && !isFailed)
    const txsComp = showTxs?<Transactions ref="_txs" address={address} txs={txs} onScroll={this.onScrollTable} goTop={goTop}/>:<div></div>

    const chooserComp = (address.length > 0 && !isFailed)?<Chooser mode={mode} onChangeMode={this.onChangeMode}/>:<div></div>

    const errorComp = isFailed?<Error error={error}/>:<div></div>

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
              {txsComp}
              {goTopComp}
          </div>
    )
  }

}

//React
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Proptypes from 'prop-types'
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
  showGoTopButton,
  hideGoTopButton,
  goTop
} from '../../store/actions'

//Styles
import './App.css'
//Constants
import C  from '../../constants.js'

/*
  Root Component
*/
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

  /*
    Subscribe from store
  */
  componentWillMount(){
    this.unsubscribe = this.props.store.subscribe(()=>this.forceUpdate())
  }
  /*
    Unsubscribe from store
  */
  componentWillUnmount(){
    this.unsubscribe()
  }

  /*
    Triggered by "input" element when submitting a Bitcoin's Address
    e : event
  */
  selectAddress(e){

    e.preventDefault()

    const store = this.props.store

    const { _address } = this.refs
    const { mode } = store.getState()

    //Get rid of spaces at begining and end
    const txAddress = _address.value.trim()

    const payload = {
      address : txAddress,
      mode : mode
    }

    store.dispatch(selectAddressWithMode(payload))

    //Call to server
    this.fetchWithMode(txAddress,[],mode)
  }

  /*
    Call to server, recursively if truncated = true
    address : current address,
    txs : current transactions,
    mode : current mode,
    hash : current hash,
    balance : current balance
  */
  fetchWithMode(address, txs, mode = "transactions", hash = "", balance = 0) {

    //Get api path to call
    let base = `/${address}/${mode}`
    let apiPath = (hash.length > 0) ? `${base}?blockHash=${hash}&balance=${balance}`:base

    fetch(apiPath)
      .then(res => res.json())
      .then(result => {

        //In transaction mode we concatenate txs
        if (mode === "transactions") {

          const newTxs = [...result.txs, ...txs]

          if (result.truncated) {
            this.fetchWithMode(address, newTxs, mode, result.hash)
          } else {
            this.props.store.dispatch(setTransactions(newTxs))
          }

        } else if (mode === "balance") { //In balance mode we accumulate balance

          if (result.truncated) {
            this.fetchWithMode(address, txs, mode, result.hash,result.balance)
          } else {
            this.props.store.dispatch(setBalance(result.balance))
          }
        }
      })
      .catch(e => this.props.store.dispatch(showError(e)))
  }
  /*
    Triggered by Chooser component when changing mode
    Allow changing components to display (txs or balance)
    selectedMode : selected mode
  */
  onChangeMode(selectedMode) {

    const {
      address,
      txs,
      balanceInitialized,
      txsInitialized
    } = this.props.store.getState()

    /*
      We fetch only if we change mode (currentMode != selectedMode),
      and only if it's the first time we run the fetch for selectedMode
    */
    const toFetch = ((selectedMode === "transactions" && !txsInitialized) ||
      (selectedMode === "balance" && !balanceInitialized))

    this.props.store.dispatch(changeMode({
      mode : selectedMode,
      loading: toFetch
    }))

    if (toFetch) {

      this.fetchWithMode(address, txs, selectedMode)
    }

  }

  /*
    Triggered when Transactions is scrolled
    Helps to show/hide go to top button
    e : event
  */
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
  /*
    Triggered when GoTopButton is clicked on
    Helps to scroll Transactions to top
  */
  goTopTable(){

    const store = this.props.store
    const { goTopButtonOn} = store.getState()

    if(goTopButtonOn){
      const intervalId = setInterval(this.scrollByStep,C.scrollTopTick)
      store.dispatch(goTop(intervalId))
    }
  }
  /*
    Fired by setInterval to have a smooth scroll
  */
  scrollByStep(){

    const store = this.props.store
    const { intervalIds } = store.getState()

    let tableNode = ReactDOM.findDOMNode(this.refs._txs)
    const scrollY = tableNode.scrollTop

    if( scrollY > 0){
      const step = (scrollY*C.scrollTopTick)/C.scrollTopDuration
      tableNode.scrollTop = (scrollY > step)?(scrollY - step):0
    }else{
      /*
        When we are on top, we clear all intervals, happens when we
        "multi-tap" before scroll finishing (i.e. button disapearing)
      */
      if(intervalIds !== undefined && intervalIds.length > 0){
          intervalIds.map(intervalId=>clearInterval(intervalId))
      }
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
      goTopButtonOn
    } = store.getState()

    const isFailed = (error !== null)

    const goTopComp = (goTopButtonOn)?<GoTopButton onGoTop={this.goTopTable}/>:<div></div>

    const loaderComp = (loading)?<div className="loader"></div>:<div></div>

    const showBalance = (mode === "balance" && !loading && !isFailed)
    const balanceComp = showBalance?<Balance balance={balance}/>:<div></div>

    const showTxs = (mode === "transactions" && !loading && !isFailed)
    const txsComp = showTxs?<Transactions ref="_txs" address={address} txs={txs} onScroll={this.onScrollTable}/>:<div></div>

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

App.propTypes = {
  store : Proptypes.object.isRequired
}

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

    // this.state = {
    //   address : "",
    //   mode : "transactions",
    //   balance : 0,
    //   loading : false,
    //   txs : [],
    //   balanceInitialized : false,
    //   txsInitialized : false
    // }
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

    // this.setState({
    //   address : txAddress,
    //   loading: true,
    //   txs : [],
    //   balanceInitialized : (mode === "balance"),
    //   txsInitialized : (mode === "transactions")
    // })

    this.fetchWithMode(txAddress,[],mode)
  }

  fetchWithMode(address, txs, mode="transactions", hash=""){

    let base = `/${address}/${mode}`
    let apiPath = (hash.length > 0)?`${base}?blockHash=${hash}`:base

    console.log(`fetchWithMode with mode ${mode} uri : ${apiPath}`)

    fetch(apiPath)
      .then(res=>res.json())
      .then(result=>{
            console.log(`fetch Responded with mode ${mode} and trancated = ${result.truncated} with blockHash : ${result.hash}`)
            if(mode === "transactions"){
              console.log(result.txs)
               const newTxs = [...result.txs,...txs]
              //  arr1.concat(arr2)
              if(result.truncated){
                this.fetchWithMode(address,newTxs,mode,result.hash)
              }else{
                this.props.store.dispatch(setTransactions(newTxs))
                //.setState({loading : false, txs : newTxs})
              }

            }else if(mode === "balance"){

              if(result.truncated){
                this.fetchWithMode(address,txs,mode,result.hash)
              }else{
                this.props.store.dispatch(setBalance(result.balance))
                //this.setState({loading : false, balance : result.balance})
              }
            }

      })
      .catch(e=>console.log(e.message))
  }

  onChangeMode(mode){

    const { address, txs, balanceInitialized, txsInitialized } = this.props.store.getState()


    //this.setState({mode : mode})

    const toFetch = ((mode === "transactions" && !txsInitialized) ||
        (mode === "balance" && !balanceInitialized))

  this.props.store.dispatch(changeMode({mode, loading : toFetch}))

          // this.setState({
          //   loading : toFetch,
          //   balanceInitialized : true,
          //   txsInitialized : true
          // })

      if(toFetch){
        this.fetchWithMode(address,txs,mode)
      }

  }

  render() {

    const { store } = this.props

    const { mode, address, loading, txs, balance } = store.getState()

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

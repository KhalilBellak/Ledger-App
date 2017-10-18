//React
import React, { Component } from 'react'
//Components
import Chooser from '../Chooser/Chooser'
import Transactions from '../Transactions/Transactions'
//Styles
import './App.css'
//Constants
import C  from '../../constants.js'


export default class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      address : "",
      loading : false,
      txs : []
    }
    this.selectAddress = this.selectAddress.bind(this)
    this.onChoose = this.onChoose.bind(this)
  }

  selectAddress(event){
    event.preventDefault()
    const { _address } = this.refs
    this.setState({
      address : _address.value,
      loading: true
    })

    this.setState({loading : true})

    fetch(`/${_address.value}/transactions`)
      .then(res=>res.json())
      .then(result=>{
            this.setState({loading : false, txs : result.txs})
      })
      .catch(e=>console.log(e))
  }

  onChoose(mode){

    const { address } = this.state
    
    this.setState({loading : true})

    fetch(`/${address}/${mode}`)
      .then(res=>res.json())
      .then(result=>{

            if(mode === "transactions"){
              this.setState({loading : false, txs : result.txs})
            }else if(mode === "balance"){
              this.setState({loading : false, balance : result})
            }

      })
      .catch(e=>console.log(e))

  }

  render() {

    const { loading, txs } = this.state

    let loader
    if(loading){
      loader = <div className="loader"></div>
    }

    return (
          <div>
            <div className="container">
              <h1>Enter your Bitcoin address :</h1>
              <form onSubmit={this.selectAddress}>
                <input ref="_address" className="search" placeholder="Search" type="text"/>
              </form>
              {loader}
              <Chooser onChoose={this.onChoose}/>
              <Transactions txs={txs}/>
            </div>
          </div>
  )
  }
}

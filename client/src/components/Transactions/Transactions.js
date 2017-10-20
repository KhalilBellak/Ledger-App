//React
import React, {Component} from 'react'
import Proptypes from 'prop-types'
//Styles
import './Transactions.css'

/*
  Method to generate all rows with their balances
  address : current address, to compare with adresses of outputs/inputs
            compute balance
  txs : transactions
  @return : return all rows (JSX elements)
*/

const generateTxsRows = (address,txs)=>{
  return(

    (txs.length > 0)?
    txs.map((tx,index)=>{

      let totalOutputs = 0, totalInputs = 0

      if(tx.outputs !== undefined && tx.outputs.length > 0){
        tx.outputs.map(out=>{
          if(address === out.address)
            totalOutputs += out.value
          return totalOutputs
        })
      }

      if(tx.inputs !== undefined && tx.inputs.length > 0){
        tx.inputs.map(input=>{
          if(address === input.address)
            totalInputs += input.value
          return totalInputs
        })
      }

      let amount = (totalOutputs - totalInputs)/100000000
      let idAmount = (amount > 0)?"output":"input"

      return (
        <li key={index} className="item">
          <div className="header-amount">
            <div className="title">{tx.hash}</div>
            <div className="date">{tx.received_at}</div>
          </div>
          <div id={idAmount} className="details">{amount}</div>
        </li>
      )
    }):<div></div>
  )
}

/*
  Transactions Component : list all transactions with their hashes, balances and dates
  address : current Bitcoin's address
  txs : current transactions,
  onScroll : callback to notify GoTopButton to show/hide
*/
export default class Transactions extends Component {
  render(){
    const { address, txs, onScroll} = this.props
    return(
      <div className="table-container" onScroll={onScroll}>
        <ul className="list">
          {generateTxsRows(address,txs)}
        </ul>
      </div>
    )
  }
}

Transactions.propTypes = {
  address : Proptypes.string,
  txs : Proptypes.array,
  onScroll : Proptypes.func
}
Transactions.defaultProps = {
  address : "",
  txs : [],
  onScroll : e=>e

}

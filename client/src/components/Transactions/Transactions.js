import React,{ Component } from 'react'
import './Transactions.css'

export default class Transactions extends Component {

  generateTxsRows(address,txs){

    return(
      (txs.length > 0)?
      txs.map((tx,index)=>{

        let outputs, inputs
        let totalOutputs = 0, totalInputs = 0

        if(tx.outputs !== undefined && tx.outputs.length > 0){
          outputs = tx.outputs.map((out,id)=>{
            if(address === out.address)
              totalOutputs += out.value
          })
        }

        if(tx.inputs !== undefined && tx.inputs.length > 0){
          inputs = tx.inputs.map((input,id)=>{
            if(address === input.address)
              totalInputs += input.value
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
            {outputs}
            {inputs}
          </li>
        )
      }):<div></div>
    )
  }

  render(){
    const { address, txs } = this.props
    return(
      <div>
        <ul className="list">
          {this.generateTxsRows(address,txs)}
        </ul>
      </div>
    )

  }
}

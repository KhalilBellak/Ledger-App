import React,{ Component } from 'react'
import './Transactions.css'

const showInputsOutputs = false
export default class Transactions extends Component {

  generateTxsRows(txs){
    console.log("generateTxsRows")
    console.log(txs)
    return(
      (txs.length > 0)?
      txs.map((tx,index)=>{

        let outputs, inputs
        let totalOutputs = 0, totalInputs = 0

        if(tx.outputs !== undefined && tx.outputs.length > 0){
          outputs = tx.outputs.map((out,id)=>{
            totalOutputs += out.value
            if(showInputsOutputs){
              return (<div id="output" key={id} className="details item-div">{out.address}</div>)
            }
            return <div key={id}></div>
          })
        }

        if(tx.inputs !== undefined && tx.inputs.length > 0){
          inputs = tx.inputs.map((input,id)=>{
              totalInputs += input.value
              if(showInputsOutputs){
                return (<div id="input" key={id} className="details item-div">{input.address}</div>)
              }
              return <div key={id}></div>
          })
        }
        let amount = (totalInputs - totalOutputs)
        let idAmount = (amount > 0)?"output":"input"

        return (
          <li key={index} className="item">
            <div className="title item-div">{tx.hash}</div>
            <div id={idAmount} className="details item-div">{amount}</div>
            {outputs}
            {inputs}
            <div className="date">{tx.received_at}</div>
            </li>
        )
      }):<div></div>
    )
  }

  render(){
    return(
      <div>
        <ul className="list">
          {this.generateTxsRows(this.props.txs)}
        </ul>
      </div>
    )

  }
}

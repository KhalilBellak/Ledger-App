//React
import React,{ Component } from 'react'
//Styles
import './Chooser.css'

/*
  Chooser Component: allows to switch between transaction and balance mode
*/
export default class Chooser extends Component {

  constructor(props){
    super(props)
    this.changeMode = this.changeMode.bind(this)
  }

  /*
    Triggered when clicking on txs or bc divs
    e : event
  */
  changeMode(e){
    e.preventDefault()
    const id = e.target.id
    let newMode = (id === "txs")?"transactions":"balance"
    this.props.onChangeMode(newMode)
  }

  render(){

    const { mode } = this.props
    const txsSelected = (mode === "transactions"), bcSelected = (mode === "balance")

    let firstClass = txsSelected?"option selected":"option"
    let secondClass = bcSelected?"option selected":"option"
    return (
      <div className="wrapper">
        <div id="txs" className={firstClass} onClick={this.changeMode}>
          Transactions
        </div>
        <div id="bc" className={secondClass} onClick={this.changeMode}>
          Balance
        </div>
      </div>
    )
  }
}

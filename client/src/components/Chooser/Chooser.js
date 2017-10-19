//React
import React,{ Component } from 'react'
//Styles
import './Chooser.css'

export default class Chooser extends Component {

  constructor(props){
    super(props)
    this.state = { txsSelected : true, bcSelected : false}
    this.changeMode = this.changeMode.bind(this)
  }

  changeMode(e){

    e.preventDefault()

    const id = e.target.id
    const { txsSelected, bcSelected } = this.state

    if((id === "txs" && txsSelected) || (id === "bc" && bcSelected)){
      return
    }
    let mode = (id === "txs")?"transactions":"balance"
    this.props.onChangeMode(mode)
    this.setState({txsSelected : !txsSelected, bcSelected : !bcSelected})

  }
  
  render(){
    const { txsSelected, bcSelected } = this.state

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

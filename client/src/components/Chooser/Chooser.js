import React,{ Component } from 'react'
import './Chooser.css'

export default class Chooser extends Component {

  constructor(props){

    super(props)
    this.state = { txsSelected : true, bcSelected : false}

    this.onClick = this.onClick.bind(this)
  }
  onClick(e){

    e.preventDefault()

    const id = e.target.id
    const { txsSelected, bcSelected } = this.state

    if((id === "txs" && txsSelected) || (id === "bc" && bcSelected)){
      return
    }

    this.setState({txsSelected : !txsSelected, bcSelected : !bcSelected})
    
  }
  render(){
    const { txsSelected, bcSelected } = this.state

    let firstClass = txsSelected?"option selected":"option"
    let secondClass = bcSelected?"option selected":"option"
    return (
      <div className="wrapper">
        <div id="txs" className={firstClass} onClick={this.onClick}>
          Transactions
        </div>
        <div id="bc" className={secondClass} onClick={this.onClick}>
          Balance
        </div>
      </div>
    )
  }
}

//React
import React, { Component } from 'react'
import './Balance.css'

export default class Balance extends Component {
  render(){
    return (
      <div className="balance">Final Balance : {this.props.balance}</div>
    )
  }

}

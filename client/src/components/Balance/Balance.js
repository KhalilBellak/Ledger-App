//React
import React from 'react'
import Proptypes from 'prop-types' 
//Styles
import './Balance.css'


/*
  Balance Component: show balance of chosen transaction
*/
const Balance = ({balance})=><div className="balance">Balance : {balance}</div>

export default Balance


Balance.propTypes = {
  balance : Proptypes.number
}
Balance.defaultProps = {
  balance : 0
}

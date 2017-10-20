//React
import React from 'react'
import Proptypes from 'prop-types'
//Styles
import './Error.css'

/*
  Error Component : To display error if Bitcoin's address is invalid
  error : error to display
*/

const ErrorComp = ({error})=>(
    <div className="error">
      <div>{`Oops ! Your Bitcoin's address is invalid !`}</div>
      <div className="error-message">{error.message}</div>
    </div>
)

export default ErrorComp

ErrorComp.propTypes = {
  error : Proptypes.object
}
ErrorComp.defaultProps = {
  error : new Error("An unknown error occured!")
}

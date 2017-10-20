import React from 'react'
import './Error.css'

/*
  Error Component : To displqy error if Bitcoin's address is invalid
  error : error to display
*/

const Error = ({error})=>(
    <div className="error">
      <div>{`Oops ! Your Bitcoin's address is invalid !`}</div>
      <div className="error-message">{error.message}</div>
    </div>
)

export default Error

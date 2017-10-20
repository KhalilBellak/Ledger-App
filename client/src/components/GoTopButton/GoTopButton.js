//React
import React from 'react'
import Proptypes from 'prop-types'
//Styles
import './GoTopButton.css'

/*
  GoToButton Component : when hit scroll to top Transaction component
  onGoTop : triggered when button clicked
*/
const GoTopButton = ({onGoTop})=>(
  <button className="topBtn" title="Go to top" onClick={onGoTop}>
          <i className="arrow up"></i>
  </button>
)

export default GoTopButton

GoTopButton.propTypes = {
  onGoTop : Proptypes.func
}
GoTopButton.defaultProps = {
  onGoTop : e=>e
}

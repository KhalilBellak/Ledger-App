import React from 'react'
import './GoTopButton.css'

/*
  GoToButton Component : when hit scroll to top Transaction component
  onGoTop : triggered when clicked 
*/
const GoTopButton = ({onGoTop})=>(
  <button className="topBtn" title="Go to top" onClick={onGoTop}>
          <i className="arrow up"></i>
  </button>
)

export default GoTopButton

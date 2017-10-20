import React from 'react'
import './GoTopButton.css'

const GoTopButton = ({show, onGoTop})=>(
  <button className="topBtn" title="Go to top" onClick={onGoTop}>
          <i className="arrow up"></i>
  </button>
)

export default GoTopButton

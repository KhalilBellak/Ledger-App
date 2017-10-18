import C from '../constants'

/*
  Dialog Error's actions
*/
export const showError = (error) =>(
  {
    type : C.actions.SHOW_ERROR,
    error
  }
)
export const hideError = () =>({type : C.actions.HIDE_ERROR})

import C from '../constants'

export const selectAddressWithMode = ({address,mode})=>(
  {
    type : C.actions.SELECT_ADDRESS,
    address,
    mode
  }
)
export const changeMode = ({mode,loading})=>(
  {
    type : C.actions.CHANGE_MODE,
    mode,
    loading
  }
)
export const setTransactions = txs=>(
  {
    type : C.actions.SET_TRANSACTIONS,
    txs
  }
)
export const setBalance = balance=>(
  {
    type : C.actions.SET_BALANCE,
    balance
  }
)
/*
  Dialog Error's actions
*/
export const showError = error=>(
  {
    type : C.actions.SHOW_ERROR,
    error
  }
)
export const hideError = () =>({type : C.actions.HIDE_ERROR})

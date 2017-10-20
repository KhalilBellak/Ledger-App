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

/*
  Go Top Button's actions
*/
export const showGoTopButton = error=>({type : C.actions.SHOW_GOTOP})
export const hideGoTopButton = () =>({type : C.actions.HIDE_GOTOP})
export const goTop = intervalId=>(
  {
    type : C.actions.GOTOP,
    intervalId
  }
)

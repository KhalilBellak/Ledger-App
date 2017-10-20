import C from '../constants'

/*
  Selection of new address
*/
export const selectAddressWithMode = ({address,mode})=>(
  {
    type : C.actions.SELECT_ADDRESS,
    address,
    mode
  }
)
/*
  Switch of mode
*/
export const changeMode = ({mode,loading})=>(
  {
    type : C.actions.CHANGE_MODE,
    mode,
    loading
  }
)
/*
  New transactions received
*/
export const setTransactions = txs=>(
  {
    type : C.actions.SET_TRANSACTIONS,
    txs
  }
)
/*
  New balance received
*/
export const setBalance = balance=>(
  {
    type : C.actions.SET_BALANCE,
    balance
  }
)
/*
  Error occurs
*/
export const showError = error=>(
  {
    type : C.actions.SHOW_ERROR,
    error
  }
)
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

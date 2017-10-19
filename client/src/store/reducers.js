import C from '../constants'
import initialStateData from './initialState'

/*
  Reducer used by store
*/
export const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case C.actions.SELECT_ADDRESS:
      return  {
          ...state,
          address : action.address,
          loading : true,
          txs : [],
          balanceInitialized : (action.mode === "balance"),
          txsInitialized : (action.mode === "transactions"),
          error : null
        }
    case C.actions.SET_TRANSACTIONS:
      return {
        ...state,
        mode : "transactions",
        txs : action.txs,
        loading : false
      }
    case C.actions.SET_BALANCE:
        return {
          ...state,
          mode : "balance",
          balance : action.balance,
          loading : false
        }
    case C.actions.CHANGE_MODE:
      return {
        ...state,
        mode : action.mode,
        loading : action.loading,
        balanceInitialized : true,
        txsInitialized : true
      }
    case C.actions.SHOW_ERROR:
      return {
        ...initialStateData,
        error : action.error,
      }
    case C.actions.HIDE_ERROR:
      return {
        ...state,
        error : {}
      }
    default:
      return state
  }
}

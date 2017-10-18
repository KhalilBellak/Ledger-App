import C from '../constants'
import initialStateData from './initialState'

/*
  Reducer used by store
*/
export const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case C.actions.SHOW_ERROR:
      return {
        ...initialStateData,
        error: action.error,
      }
    case C.actions.HIDE_ERROR:
      return {
        ...state,
        error: {}
      }
    default:
      return state
  }
}

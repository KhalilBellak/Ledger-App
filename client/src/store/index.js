import { createStore, applyMiddleware } from 'redux'
import { dataReducer } from './reducers'

var dumpLogs = false

/*
  Useful middleware to log action, state before and after action dispatch
  store : state's container
  next : next function called in applyMiddleware (here applyMiddleware has only one function)
  action : action to dispatch
*/
const logger = store => next => action => {

    let result

    if(dumpLogs === true){
      console.groupCollapsed("dispatching", action.type)
      console.log("previous state", store.getState())
      console.log("action", action)
    }

    result = next(action)

    if(dumpLogs === true){
      console.log("next state", store.getState())
      console.groupEnd()
    }
    return result
}

/*
  Store factory composed with a middleware
  initialState : Initial State of app (object)
*/
const storeFactory = (initialState) =>
  applyMiddleware(logger)(createStore)(
      dataReducer,initialState)

export default storeFactory

const constants = {
  actions : {
    SELECT_ADDRESS : "SELECT_ADDRESS",
    SET_TRANSACTIONS : "SET_TRANSACTIONS",
    SET_BALANCE : "SET_BALANCE",
    CHANGE_MODE : "CHANGE_MODE",
    SHOW_ERROR : "SHOW_ERROR",
    SHOW_GOTOP : "SHOW_GOTOP",
    HIDE_GOTOP : "HIDE_GOTOP",
    GOTOP : "GOTOP"
  },
  scrollTopTick : 20,
  scrollTopDuration : 50,
  error : new Error("Check your Bitcoin's address and that server is running!")
}
export default constants

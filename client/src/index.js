//React
import React from 'react';
import ReactDOM from 'react-dom';
//Component
import App from './components/App/App';
//Services
import registerServiceWorker from './registerServiceWorker';
//Style
import './index.css';
//Store
import storeFactory from './store'
import initialStateData from './store/initialState'

/*
  Create store
*/
const store = storeFactory(initialStateData)


/*
  Reander root component
*/
ReactDOM.render(<App store={store}/>,document.getElementById('root'));
registerServiceWorker();

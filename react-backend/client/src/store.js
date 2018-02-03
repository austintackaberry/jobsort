import { createStore, compose } from 'redux';

import rootReducer from './reducers/index';

const defaultState = {
  userData: [],
  loaderActive: false,
  loaderText: "",
  receivedListingData: [],
  showFullDescriptionsButtonVisible: false,
  showShortDescriptionsButtonVisible: false,
  userInputData: {},
  listings: []
}

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;

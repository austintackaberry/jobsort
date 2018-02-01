import { createStore, compose } from 'redux';

import rootReducer from './reducers/index';

const defaultState = {
  userData: [],
  loaderActive: false,
  loaderText: "",
  receivedListingData: [],
  updateListings: {
    unhideAll: true,
    showFullDescriptions: true,
    showShortDescriptions: true
  },
  userInputData: {}
}

const store = createStore(rootReducer, defaultState);

export default store;

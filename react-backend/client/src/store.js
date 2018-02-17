import { createStore } from 'redux';

import rootReducer from './reducers/index';

const defaultState = {
  showFullDescriptionsButtonVisible: false,
  showShortDescriptionsButtonVisible: false,
  unhideAllButtonVisible: false,
  listings: [],
  userTechnologies: [],
  userLocation: '',
  loaderActive: false,
  currentLoaderText: '',
};

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

export default store;

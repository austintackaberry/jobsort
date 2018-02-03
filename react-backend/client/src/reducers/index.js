import { combineReducers } from 'redux';
import showFullDescriptionsButtonVisible from './showFullDescriptionsButtonVisible';
import showShortDescriptionsButtonVisible from './showShortDescriptionsButtonVisible';
import listings from './listings';
import unhideAllButtonVisible from './unhideAllButtonVisible';
import userTechnologies from './userTechnologies';
import userLocation from './userLocation';
import loaderActive from './loaderActive';
import currentLoaderText from './currentLoaderText';

const rootReducer = combineReducers({currentLoaderText, loaderActive, userLocation, userTechnologies, showFullDescriptionsButtonVisible, showShortDescriptionsButtonVisible, unhideAllButtonVisible, listings});

export default rootReducer;

import { combineReducers } from 'redux';
import showFullDescriptionsButtonVisible from './showFullDescriptionsButtonVisible';
import showShortDescriptionsButtonVisible from './showShortDescriptionsButtonVisible';
import listings from './listings';
import unhideAllButtonVisible from './unhideAllButtonVisible';
import userTechnologies from './userTechnologies';
import userLocation from './userLocation';

const rootReducer = combineReducers({userLocation, userTechnologies, showFullDescriptionsButtonVisible, showShortDescriptionsButtonVisible, unhideAllButtonVisible, listings});

export default rootReducer;

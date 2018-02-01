import { combineReducers } from 'redux';
import showFullDescriptionsButtonVisible from './showFullDescriptionsButtonVisible';
import showShortDescriptionsButtonVisible from './showShortDescriptionsButtonVisible';
import unhideAll from './unhideAll';

const rootReducer = combineReducers({showFullDescriptionsButtonVisible, showShortDescriptionsButtonVisible, unhideAll});

export default rootReducer;

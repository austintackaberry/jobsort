import { combineReducers } from 'redux';
import showFullDescriptionsButtonVisible from './showFullDescriptionsButtonVisible';
import showShortDescriptionsButtonVisible from './showShortDescriptionsButtonVisible';
import listings from './listings';
import unhideAll from './unhideAll';

const rootReducer = combineReducers({showFullDescriptionsButtonVisible, showShortDescriptionsButtonVisible, unhideAll, listings});

export default rootReducer;

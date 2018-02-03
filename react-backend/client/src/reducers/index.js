import { combineReducers } from 'redux';
import showFullDescriptionsButtonVisible from './showFullDescriptionsButtonVisible';
import showShortDescriptionsButtonVisible from './showShortDescriptionsButtonVisible';
import listings from './listings';
import unhideAllButtonVisible from './unhideAllButtonVisible';

const rootReducer = combineReducers({showFullDescriptionsButtonVisible, showShortDescriptionsButtonVisible, unhideAllButtonVisible, listings});

export default rootReducer;

function showShortDescriptionsButtonVisible(state = [], action) {
  switch (action.type) {
    case 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED':
      return false;
    case 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED':
      return true;
    case 'READ_MORE_CLICKED':
      return true;
    case 'READ_LESS_CLICKED': {
      const listings = action.listings.slice();
      listings.splice(action.index, 1);
      return listings.some(listing => listing.readMoreOrLess === 'read less');
    }
    default:
      return state;
  }
}

export default showShortDescriptionsButtonVisible;

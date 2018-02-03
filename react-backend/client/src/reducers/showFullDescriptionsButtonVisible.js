
function showFullDescriptionsButtonVisible(state = [], action) {
  console.log(state, action);
  switch (action.type) {
    case 'RECEIVED_JOB_LISTING_RESULTS' :
      return true;
    case 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED' :
      return false;
    case 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED' :
      return true;
    case 'READ_LESS_CLICKED' :
      return true;
    case 'READ_MORE_CLICKED' :
      let listings = action.listings.slice();
      listings.splice(action.index,1);
      return listings.some((listing) => {
        return listing.readMoreOrLess === "read more";
      });
    default:
      return state;
  }
}

export default showFullDescriptionsButtonVisible;


function listings(state = [], action) {
  console.log(state, action);
  switch (action.type) {
    case 'RECEIVED_JOB_LISTING_RESULTS' : {
      let listings = action.listings.slice();
      listings.map((listing) => {
        let text = listing.descriptionText.slice(0,200);
        text = text.slice(0,text.lastIndexOf(" "));
        text = text.concat('...');
        listing.descriptionShown = text;
        listing.readMoreOrLess = 'read more';
        return listing;
      })
      return listings;
    }
    case 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED' : {
      let listings = action.listings.slice();
      listings.map((listing) => {
        listing.descriptionShown = listing.descriptionHTML;
        listing.readMoreOrLess = 'read less';
        return listing;
      })
      return listings;
    }
    case 'READ_MORE_CLICKED' : {
      let listings = action.listings.slice();
      let listing = listings[action.index];
      listing.descriptionShown = listing.descriptionHTML;
      listing.readMoreOrLess = 'read less';
      return listings;
    }
    case 'READ_LESS_CLICKED' : {
      let listings = action.listings.slice();
      let listing = listings[action.index];
      let text = listing.descriptionText.slice(0,200);
      text = text.slice(0,text.lastIndexOf(" "));
      text = text.concat('...');
      listing.descriptionShown = text;
      listing.readMoreOrLess = 'read more';
      return listings;
    }
    default:
      return state;
  }
}

export default listings;

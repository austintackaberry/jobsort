function listings(state = [], action) {
  switch (action.type) {
    case 'RECEIVED_JOB_LISTING_RESULTS': {
      let stateListings = action.stateListings.slice();
      stateListings = stateListings.map((element) => {
        const listing = element;
        let text = listing.descriptionText.slice(0, 200);
        text = text.slice(0, text.lastIndexOf(' '));
        text = text.concat('...');
        listing.descriptionShown = text;
        listing.readMoreOrLess = 'read more';
        return listing;
      });
      return stateListings;
    }
    case 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED': {
      let stateListings = state.slice();
      stateListings = stateListings.map((element) => {
        const listing = element;
        listing.descriptionShown = listing.descriptionHTML;
        listing.readMoreOrLess = 'read less';
        return listing;
      });
      return stateListings;
    }
    case 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED': {
      let stateListings = state.slice();
      stateListings = stateListings.map((element) => {
        const listing = element;
        let text = listing.descriptionText.slice(0, 200);
        text = text.slice(0, text.lastIndexOf(' '));
        text = text.concat('...');
        listing.descriptionShown = text;
        listing.readMoreOrLess = 'read more';
        return listing;
      });
      return stateListings;
    }
    case 'UNHIDE_ALL_BUTTON_CLICKED': {
      let stateListings = state.slice();
      stateListings = stateListings.map((element) => {
        const listing = element;
        listing.hidden = false;
        return listing;
      });
      return stateListings;
    }
    case 'READ_MORE_CLICKED': {
      const stateListings = state.slice();
      const listing = stateListings[action.index];
      listing.descriptionShown = listing.descriptionHTML;
      listing.readMoreOrLess = 'read less';
      return stateListings;
    }
    case 'READ_LESS_CLICKED': {
      const stateListings = state.slice();
      const listing = stateListings[action.index];
      let text = listing.descriptionText.slice(0, 200);
      text = text.slice(0, text.lastIndexOf(' '));
      text = text.concat('...');
      listing.descriptionShown = text;
      listing.readMoreOrLess = 'read more';
      return stateListings;
    }
    case 'HIDE_LISTING': {
      const stateListings = state.slice();
      const listing = stateListings[action.index];
      listing.hidden = true;
      return stateListings;
    }
    default:
      return state;
  }
}

export default listings;

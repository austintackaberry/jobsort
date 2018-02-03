
export function receivedJobListingResults(listings) {
  return {
      type: 'RECEIVED_JOB_LISTING_RESULTS',
      listings
  }
}

export function showFullDescriptionsButtonClicked(listings) {
  return {
    type: 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED',
    listings
  }
}

export function showShortDescriptionsButtonClicked(listings) {
  return {
    type: 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED',
    listings
  }
}

export function unhideAllButtonClicked(listings) {
  return {
    type: 'UNHIDE_ALL_BUTTON_CLICKED',
    listings
  }
}

export function readLessClicked(index, listings) {
  return {
    type: 'READ_LESS_CLICKED',
    index,
    listings
  }
}

export function readMoreClicked(index, listings) {
  return {
    type: 'READ_MORE_CLICKED',
    index,
    listings
  }
}

export function hideListing(index, listings) {
  return {
    type: 'HIDE_LISTING',
    index,
    listings
  }
}

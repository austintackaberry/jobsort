
export function receivedJobListingResults(listings) {
  return {
      type: 'RECEIVED_JOB_LISTING_RESULTS',
      listings
  }
}

export function showFullDescriptionsButtonClicked() {
  return {
    type: 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED'
  }
}

export function showShortDescriptionsButtonClicked() {
  return {
    type: 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED'
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

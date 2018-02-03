
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

export function unhideAllButtonClicked() {
  return {
    type: 'UNHIDE_ALL_BUTTON_CLICKED'
  }
}

export function readLessClicked(index) {
  return {
    type: 'READ_LESS_CLICKED',
    index
  }
}

export function readMoreClicked(index) {
  return {
    type: 'READ_MORE_CLICKED',
    index
  }
}

export function hideListing(index) {
  return {
    type: 'HIDE_LISTING',
    index
  }
}

export function addTechnology(technologyToAdd) {
  return {
    type: 'ADD_TECHNOLOGY',
    technologyToAdd
  }
}

export function removeTechnology(index) {
  return {
    type: 'REMOVE_TECHNOLOGY',
    index
  }
}

export function changeUserTechnologyWeight(index, event) {
  return {
    type: 'CHANGE_USER_TECHNOLOGY_WEIGHT',
    weight: event.target.value,
    index,
  }
}

export function changeUserLocation(userLocation) {
  return {
    type: 'CHANGE_USER_LOCATION',
    userLocation,
  }
}

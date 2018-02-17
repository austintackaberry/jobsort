export function receivedJobListingResults(listings) {
  return {
    type: 'RECEIVED_JOB_LISTING_RESULTS',
    listings,
  };
}

export function showFullDescriptionsButtonClicked(listings) {
  return {
    type: 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED',
    listings,
  };
}

export function showShortDescriptionsButtonClicked(listings) {
  return {
    type: 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED',
    listings,
  };
}

export function unhideAllButtonClicked() {
  return {
    type: 'UNHIDE_ALL_BUTTON_CLICKED',
  };
}

export function readLessClicked(index, listings) {
  return {
    type: 'READ_LESS_CLICKED',
    index,
    listings,
  };
}

export function readMoreClicked(index, listings) {
  return {
    type: 'READ_MORE_CLICKED',
    index,
    listings,
  };
}

export function hideListing(index) {
  return {
    type: 'HIDE_LISTING',
    index,
  };
}

export function addTechnology(technologyToAdd) {
  return {
    type: 'ADD_TECHNOLOGY',
    technologyToAdd,
  };
}

export function removeTechnology(index) {
  return {
    type: 'REMOVE_TECHNOLOGY',
    index,
  };
}

export function changeUserTechnologyWeight(index, event) {
  return {
    type: 'CHANGE_USER_TECHNOLOGY_WEIGHT',
    weight: event.target.value,
    index,
  };
}

export function changeUserLocation(userLocation) {
  return {
    type: 'CHANGE_USER_LOCATION',
    userLocation,
  };
}

export function setCurrentLoaderText(currentLoaderText) {
  return {
    type: 'SET_CURRENT_LOADER_TEXT',
    currentLoaderText,
  };
}

export function activateLoader() {
  return {
    type: 'ACTIVATE_LOADER',
  };
}

export function deactivateLoader() {
  return {
    type: 'DEACTIVATE_LOADER',
  };
}

function unhideAllButtonVisible(state = [], action) {
  switch (action.type) {
    case 'HIDE_LISTING': {
      return true;
    }
    case 'UNHIDE_ALL_BUTTON_CLICKED': {
      return false;
    }
    default:
      return state;
  }
}

export default unhideAllButtonVisible;

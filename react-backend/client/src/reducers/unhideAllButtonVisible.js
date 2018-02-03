
function unhideAllButtonVisible(state = [], action) {
  console.log(state, action);
  switch (action.type) {
    case 'HIDE_LISTING': {
      return true;
    }
    case 'UNHIDE_ALL_BUTTON_CLICKED': {
      return false;
    }
  }
  return state;
}

export default unhideAllButtonVisible;

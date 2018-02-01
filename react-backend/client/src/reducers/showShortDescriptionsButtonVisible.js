
function showShortDescriptionsButtonVisible(state = [], action) {
  console.log(state, action);
  switch (action.type) {
    case 'SHOW_SHORT_DESCRIPTIONS_BUTTON_CLICKED' :
      return false;
    case 'SHOW_FULL_DESCRIPTIONS_BUTTON_CLICKED' :
      return true;
    case 'READ_MORE_CLICKED' :
      return true;
    default:
      return state;
  }
}

export default showShortDescriptionsButtonVisible;

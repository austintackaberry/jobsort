
function loaderActive(state = [], action) {
  switch (action.type) {
    case 'DEACTIVATE_LOADER': {
      return false;
    }
    case 'ACTIVATE_LOADER': {
      return true;
    }
    default:
      return state;
  }
}

export default loaderActive;

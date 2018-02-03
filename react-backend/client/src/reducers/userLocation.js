
function userLocation(state = [], action) {
  switch (action.type) {
    case 'CHANGE_USER_LOCATION': {
      return action.userLocation;
    }
    default:
      return state;
  }
}

export default userLocation;

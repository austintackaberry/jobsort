function userTechnologies(state = [], action) {
  switch (action.type) {
    case 'ADD_TECHNOLOGY': {
      return [...state, { language: action.technologyToAdd, weight: '0' }];
    }
    case 'REMOVE_TECHNOLOGY': {
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1),
      ];
    }
    case 'CHANGE_USER_TECHNOLOGY_WEIGHT': {
      let { weight } = action;
      if (weight === '') {
        weight = 0;
      }
      return [
        ...state.slice(0, action.index),
        { language: state[action.index].language, weight },
        ...state.slice(action.index + 1),
      ];
    }
    default:
      return state;
  }
}

export default userTechnologies;

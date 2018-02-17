function userTechnologies(state = [], action) {
  switch (action.type) {
    case 'ADD_TECHNOLOGY': {
      let id = 1;
      if (state.length !== 0) {
        id = state[state.length - 1].id + 1;
      }
      return [...state, { language: action.technologyToAdd, weight: '0', id }];
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
        {
          language: state[action.index].language,
          weight,
          id: state[action.index].id,
        },
        ...state.slice(action.index + 1),
      ];
    }
    default:
      return state;
  }
}

export default userTechnologies;

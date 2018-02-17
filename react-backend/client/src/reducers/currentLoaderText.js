function currentLoaderText(state = [], action) {
  switch (action.type) {
    case 'SET_CURRENT_LOADER_TEXT': {
      return action.currentLoaderText;
    }
    default:
      return state;
  }
}

export default currentLoaderText;

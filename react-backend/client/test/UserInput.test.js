import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import ConnectedUserInput, { UserInput } from '../src/components/UserInput'
import * as actionCreators from '../src/actions/actionCreators.js';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = []
const mockStore = configureStore(middlewares)
const initialState = {
  showFullDescriptionsButtonVisible: false,
  showShortDescriptionsButtonVisible: false,
  unhideAllButtonVisible: false,
  listings: [],
  userTechnologies: [{language:"css", weight: "1"}, {language:"html", weight: "2"}],
  userLocation: '',
  loaderActive: false,
  currentLoaderText: ''
}
const store = mockStore(initialState);

const onSubmit = sinon.spy();
const changeUserLocationSpy = sinon.spy();
const removeTechnologySpy = sinon.spy();
const addTechnologySpy = sinon.spy();

const wrapper = mount(
  <Provider store={store}>
    <ConnectedUserInput
      allTechs={['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort()}
      onSubmit={onSubmit}
      changeUserLocation={changeUserLocationSpy}
      removeTechnology={removeTechnologySpy}
      addTechnology={addTechnologySpy}
    />
  </Provider>
);

const testTechInputInAllTechs = "css";

describe('(Component) UserInput', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should return type, weight, index when changeUserTechnologyWeight is dispatched', () => {
    const index = 0;
    const event = {target:{value:1}}
    store.dispatch(actionCreators.changeUserTechnologyWeight(index, event));
    const actions = store.getActions()
    const expectedPayload = { type: 'CHANGE_USER_TECHNOLOGY_WEIGHT', weight:1, index:0 }
    expect(actions).to.deep.equal([expectedPayload]);
  });

  it('should execute changeUserLocation onChange of UserLocation', () => {
    const userLocationValue = "san francisco";
    wrapper.find('UserLocation').prop('onUserLocationChange')(userLocationValue);
    expect(changeUserLocationSpy.calledOnce);
  });

  it('should execute removeTechnology when InputTechnologies removeTechnology is called', () => {
    const userLocationValue = "san francisco";
    wrapper.find('InputTechnologies').prop('removeTechnology')(0);
    expect(removeTechnologySpy.calledOnce);
  });

  it('should execute addTechnology when InputTechnologies addTechnology is called', () => {
    const userLocationValue = "san francisco";
    wrapper.find('InputTechnologies').prop('addTechnology')("css");
    expect(addTechnologySpy.calledOnce);
  });

  it('should have table with 2 rows when userTechnologies has length of 2', () => {
    expect(wrapper.find('.table-col-lang')).to.have.length(2);
  });

});

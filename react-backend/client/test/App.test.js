import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import ConnectedApp, { App } from '../src/App'
import {asyncFetchData} from '../src/App'
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
  userTechnologies: [],
  userLocation: '',
  loaderActive: false,
  currentLoaderText: ''
}
const store = mockStore(initialState);

const allTechs = ['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort();
const userInputData = {
  userLocation: 'san francisco',
  userTechnologies: ['css', 'html', 'c++'],
  allTechs: allTechs
};
const wrapper = mount(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>
);

const changeState = (stateChangeObj) => {
  const initialState = stateChangeObj.initialState;
  const changeType =  stateChangeObj.changeType;
  const changeValue =  stateChangeObj.changeValue;
  initialState[changeType] = changeValue;
  return initialState;
}

const mountWrapper = (store) => {
  return mount(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  );
}

const receivedJobListingResultsSpy = sinon.spy();
const activateLoaderPropsSpy = sinon.spy();
const deactivateLoaderPropsSpy = sinon.spy();
const setCurrentLoaderTextSpy = sinon.spy();
let jobListings = [{descriptionText:"Hey", descriptionHasTech:["css","html"]}, {descriptionText:"Ho", descriptionHasTech:["c", "c++"]}];

const shallowWrapper = shallow(
  <App
    userLocation={"berkeley"}
    userTechnologies={[{language:"css", weight: "1"}, {language:"html", weight: "2"}]}
    receivedJobListingResults={receivedJobListingResultsSpy}
    activateLoader={activateLoaderPropsSpy}
    deactivateLoader={deactivateLoaderPropsSpy}
    setCurrentLoaderText={setCurrentLoaderTextSpy}
  />
);

const getJobListingsSpy = sinon.spy(App.prototype, "getJobListings");
const activateLoaderSpy = sinon.spy(App.prototype, "activateLoader");
const deactivateLoaderSpy = sinon.spy(App.prototype, "deactivateLoader");
const generateLoaderTextSpy = sinon.spy(App.prototype, "generateLoaderText");

function mockFetch(status, body) {
  const mockResponse = new global.Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-type': 'application/json'
    }
  });

  if (status === 200) {
    return Promise.resolve(mockResponse);
  }
  return Promise.reject(mockResponse);
}

const getEvent = (value) => {
  let event = {target:{value}};
  event.preventDefault = () => {return true}
  return event;
}

describe('(Component) App', () => {

  beforeEach(() => {
    sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    global.fetch.restore();
  });

  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  });

  it('should return currentLoaderText when setCurrentLoaderText is dispatched', () => {
    store.dispatch(actionCreators.setCurrentLoaderText("Hey"));
    const actions = store.getActions()
    const expectedPayload = { type: 'SET_CURRENT_LOADER_TEXT', currentLoaderText:"Hey" }
    expect(actions).to.deep.equal([expectedPayload]);
  });

  it('should have light gray background for larger screens', () => {
    expect(wrapper.find('.App').props().style.background).to.equal("rgb(232, 236, 237)");
  });

  it('should have gray background in mobile', () => {
    window.innerWidth = 700;
    const smallWindowWrapper = mountWrapper(store);
    expect(smallWindowWrapper.find('.App').props().style.background).to.equal("#a4a4a4");
  });

    it('setCurrentLoaderText should be called when loader is activated and run', () => {
      let clock = sinon.useFakeTimers();
      // wrapper.setProps({loaderActive:true, currentLoaderText:currentLoaderText});
      shallowWrapper.instance().activateLoader(userInputData);
      clock.tick(10000);
      expect(setCurrentLoaderTextSpy.calledOnce);
      clock.restore();
    });

  describe('test when results were received from /getresults', () => {
    beforeEach(() => {
      global.fetch.returns(mockFetch(200, jobListings));
    });

    it('should execute getJobListings onSubmit of UserInput', async function() {
      await wrapper.find('UserInput').prop('onSubmit')(getEvent(true));
      expect(getJobListingsSpy.calledOnce);
    });

    it('should call receivedJobListingResults when valid userInputData sent to getJobListings', async function() {
      await shallowWrapper.instance().getJobListings(getEvent(true));
      expect(receivedJobListingResultsSpy.calledOnce);
    });

    it('should call deactivateLoader when valid userInputData sent to asyncFetchData', async function() {
      await asyncFetchData(userInputData);
      expect(deactivateLoaderSpy.calledOnce);
    });
  });
})

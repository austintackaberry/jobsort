import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import ConnectedSearchResults, { SearchResults } from '../src/components/SearchResults'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as actionCreators from '../src/actions/actionCreators.js';

const listing = {
  companyName: "BitMEX: Bitcoin Mercantile Exchange ",
  compensation: null,
  descriptionHTML: "<div>Wow, what a great job posting</div>",
  descriptionHasTech: ['css', 'html', 'c++'],
  descriptionText: "A really fantastic opportunity",
  distance: 11.044484195418875,
  fullPostText: "This is the full text post",
  hidden: false,
  id: 587,
  latitude: 37.7749295,
  location: " San Francisco, CA ",
  longitude: -122.4194155,
  month: "(January 2018)",
  postTimeInMs: "1514961083829",
  postTimeStr: "3w ago",
  rankScore: 3,
  readMore: false,
  source: "hackerNews",
  title: null,
  type: " Full-Time, Onsite ",
  url: "https://bitmex.com"
};

const middlewares = []
const mockStore = configureStore(middlewares)
const initialState = {
  showFullDescriptionsButtonVisible: false,
  showShortDescriptionsButtonVisible: false,
  unhideAllButtonVisible: false,
  listings: [listing],
  userTechnologies: [],
  userLocation: '',
  loaderActive: false,
  currentLoaderText: ''
}
const unhideAllState = {
  showFullDescriptionsButtonVisible: false,
  showShortDescriptionsButtonVisible: false,
  unhideAllButtonVisible: true,
  listings: [listing],
  userTechnologies: [],
  userLocation: '',
  loaderActive: false,
  currentLoaderText: ''
}
let store = mockStore(initialState);

const readLessClickedSpy = sinon.spy();
const readMoreClickedSpy = sinon.spy();

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
      <ConnectedSearchResults
        readLessClicked={readLessClickedSpy}
        readMoreClicked={readMoreClickedSpy}
      />
    </Provider>
  );
}

let wrapper = mountWrapper(store);

function createMockDiv (top) {
  const div = document.createElement("div");
  Object.assign(div.style, {
    width: "10px",
    height: "10px",
  });
  // we have to mock this for jsdom.
  div.getBoundingClientRect = () => ({
    width:10,
    height: 10,
    top: top,
    left: 0,
    right: 10,
    bottom: 10,
  });

  div.scrollIntoView = (scrollObj) => {scrollObj};
  return div;
}

const eventPositiveTop = {target:{parentElement:{parentElement:createMockDiv(10)}}};
const eventNegativeTop = {target:{parentElement:{parentElement:createMockDiv(-10)}}};

describe('(Component) SearchResults', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should display results if jobListings.length is not zero', () => {
    let jobListings = [{descriptionText:"Hey", descriptionHasTech:["css","html"]}, {descriptionText:"Ho", descriptionHasTech:["c", "c++"]}];
    wrapper.setProps({jobListings:jobListings});
    expect(wrapper.find('#no-results')).to.have.length(0);
    expect(wrapper.find('#search-results-container')).to.have.length(1);
  });

  it('should execute readMoreClicked when JobListing handleReadMoreClick is called', () => {
    wrapper.find('JobListing').prop('handleReadMoreClick')(0);
    expect(readMoreClickedSpy.calledOnce);
  });

  it('should execute readLessClicked when JobListing handleReadLessClick is called with positive event top', () => {
    wrapper.find('JobListing').prop('handleReadLessClick')(0, eventPositiveTop);
    expect(readLessClickedSpy.calledOnce);
  });

  it('should execute readLessClicked when JobListing handleReadLessClick is called with negative event top', () => {
    wrapper.find('JobListing').prop('handleReadLessClick')(0, eventNegativeTop);
    expect(readLessClickedSpy.calledOnce);
  });

  it('should show unhideAll button when unhideAllButtonVisible is true', () => {
    let store = mockStore(changeState({initialState, changeType:"unhideAllButtonVisible", changeValue:true}));
    wrapper = mountWrapper(store);
    expect(wrapper.find('.unhide-all')).to.have.length(1);
  });

  it('should show showShortDescriptions button when showShortDescriptionsButtonVisible is true', () => {
    let store = mockStore(changeState({initialState, changeType:"showShortDescriptionsButtonVisible", changeValue:true}));
    wrapper = mountWrapper(store);
    expect(wrapper.find('.show-short-descriptions')).to.have.length(1);
  });

  it('should show showFullDescriptions button when showFullDescriptionsButtonVisible is true', () => {
    let store = mockStore(changeState({initialState, changeType:"showFullDescriptionsButtonVisible", changeValue:true}));
    wrapper = mountWrapper(store);
    expect(wrapper.find('.show-full-descriptions')).to.have.length(1);
  });
});

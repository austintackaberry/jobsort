import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import ConnectedSearchResults, { SearchResults } from '../src/components/SearchResults'
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

const showShortDescriptionsSpy = sinon.spy();
const showFullDescriptionsSpy = sinon.spy();
const unhideAllSpy = sinon.spy();
const onHideClickSpy = sinon.spy();
const handleDescriptionClickSpy = sinon.spy();
const updateListingsAllTrue = {
  unhideAll: true,
  showFullDescriptions: true,
  showShortDescriptions: true
};
let updateListingsAllFalse = {
  unhideAll: false,
  showFullDescriptions: false,
  showShortDescriptions: false
};
let jobListingsNoResults = ["no results found"]

const wrapper = mount(
  <Provider store={store}>
    <ConnectedSearchResults
      onShortDescriptionClick={showShortDescriptionsSpy}
      onFullDescriptionClick={showFullDescriptionsSpy}
      onUnhideAllClick={unhideAllSpy}
      updateListings={updateListingsAllFalse}
      jobListings={jobListingsNoResults}
      onHideClick={onHideClickSpy}
      descriptionClicked={handleDescriptionClickSpy}
    />
  </Provider>
);

describe('(Component) SearchResults', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should display no results found if jobListings[0] === "no results found"', () => {
    expect(wrapper.find('p').text()).to.equal("no results found");
  });

  it('should display results if jobListings.length is not zero', () => {
    let jobListings = [{descriptionText:"Hey", descriptionHasTech:["css","html"]}, {descriptionText:"Ho", descriptionHasTech:["c", "c++"]}];
    wrapper.setProps({jobListings:jobListings});
    expect(wrapper.find('#no-results')).to.have.length(0);
    expect(wrapper.find('#search-results-container')).to.have.length(1);
  });

  it('should call handleDescriptionClick with arg "read more" when read more clicked', () => {
    wrapper.setState({fullDescriptionVisible: false, hidden: false});
    wrapper.find('.read-more').first().simulate('click');
    expect(handleDescriptionClickSpy.args[0][0]).to.equal('read more');
  })

  it('should call onHideClick when X clicked', () => {
    wrapper.find('.exit').first().simulate('click');
    expect(onHideClickSpy.calledOnce);
  })

  it('should show full description button if this.props.updateListings.showFullDescriptions is false, not show if true', () => {
    expect(wrapper.find('.show-full-descriptions')).to.have.length(1);
    wrapper.setProps({updateListings:updateListingsAllTrue});
    expect(wrapper.find('.show-full-descriptions')).to.have.length(0);
  })

  it('should call showFullDescriptions method when full description button clicked', () => {
    wrapper.setProps({updateListings:updateListingsAllFalse});
    wrapper.find('.show-full-descriptions').simulate('click');
    expect(showFullDescriptionsSpy.calledOnce);
  })

  it('should call showShortDescriptions method when short description button clicked', () => {
    wrapper.setProps({updateListings:updateListingsAllFalse});
    wrapper.find('.show-short-descriptions').simulate('click');
    expect(showShortDescriptionsSpy.calledOnce);
  })

  it('should call unhideAll method when unhide all button clicked', () => {
    wrapper.setProps({updateListings:updateListingsAllFalse});
    wrapper.find('.unhide-all').simulate('click');
    expect(unhideAllSpy.calledOnce);
  })

});

import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import App from '../src/App'

const allTechs = ['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort();
const userInputData = {
  jobTitle: 'web developer',
  userLocation: 'san francisco',
  userTechnologies: ['css', 'html', 'c++'],
  allTechs: allTechs,
  checked: {
    github:true,
    stackOverflow:false,
    hackerNews:true
  }
};
const wrapper = shallow(<App />);
const mountWrapper = mount(<App />);
const getJobListingsSpy = sinon.spy(App.prototype, "getJobListings");
const handleDescriptionClickSpy = sinon.spy(App.prototype, "handleDescriptionClick");
const showShortDescriptionsSpy = sinon.spy(App.prototype, "showShortDescriptions");
const showFullDescriptionsSpy = sinon.spy(App.prototype, "showFullDescriptions");
const onHideClickSpy = sinon.spy(App.prototype, "onHideClick");
let jobListings = [{descriptionText:"Hey", descriptionHasTech:["css","html"]}, {descriptionText:"Ho", descriptionHasTech:["c", "c++"]}];

function mockFetch(status, body) {
  const mockResponse = new global.Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-type': 'application/json'
    }
  });

  if (status === 200) {
    console.log('resolve');
    return Promise.resolve(mockResponse);
  }
  return Promise.reject(mockResponse);
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

  it('calls handleDescriptionClick when SearchResults.props.descriptionClicked is called', () => {
    wrapper.find('SearchResults').prop('descriptionClicked')();
    expect(handleDescriptionClickSpy.calledOnce);
  });

  it('calls showFullDescriptions when SearchResults.props.fullDescriptionClick is called', () => {
    wrapper.find('SearchResults').prop('onFullDescriptionClick')();
    expect(showFullDescriptionsSpy.calledOnce);
  });

  it('calls showShortDescriptions when SearchResults.props.shortDescriptionClick is called', () => {
    wrapper.find('SearchResults').prop('onShortDescriptionClick')();
    expect(showShortDescriptionsSpy.calledOnce);
  });

  it('calls onHideClick when SearchResults.props.onHideClick is called', () => {
    wrapper.find('SearchResults').prop('onHideClick')();
    expect(onHideClickSpy.calledOnce);
  });

  it('should update state.updateListings.showShortDescriptions to false when "read more" is arg to handleDescriptionClick', () => {
    wrapper.instance().handleDescriptionClick('read more');
    expect(wrapper.state('updateListings').showShortDescriptions).to.equal(false);
  })

  it('should update state.updateListings.showFullDescriptions to false when "read less" is arg to handleDescriptionClick', () => {
    wrapper.instance().handleDescriptionClick('read less');
    expect(wrapper.state('updateListings').showFullDescriptions).to.equal(false);
  })

  it('should update state.updateListings.unhideAll to true when unhideAll is called', () => {
    wrapper.instance().unhideAll();
    expect(wrapper.state('updateListings').unhideAll).to.equal(true);
  })

  describe('test when results were received from /getresults', () => {
    beforeEach(() => {
      global.fetch.returns(mockFetch(200, jobListings));
    });

    it('calls getJobListings when user input is submitted', () => {
      wrapper.find('UserInput').simulate('submit', userInputData);
      expect(getJobListingsSpy.calledOnce);
    });

    // it('should have state.receivedListingData.length > 1 when valid userInputData sent to getJobListings', () => {
    //   wrapper.instance().getJobListings(userInputData);
    //   console.log('state is ' + wrapper.state('receivedListingData'));
    //   expect(wrapper.state('receivedListingData')).to.have.length.above(1);
    // });
  });

  describe('test no results received from /getresults', () => {

    beforeEach(() => {
      global.fetch.returns(mockFetch(200, []));
    });

    it('should show no results if received data is []', async function() {
      await wrapper.instance().getJobListings(userInputData);
      console.log('state is');
      console.log(wrapper.state('receivedListingData'));
      expect(wrapper.state('receivedListingData')[0]).to.equal("no results found");
    })
  })
})

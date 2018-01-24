import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import JobListing from '../src/components/JobListing'

const index = 0;
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
let updateListings = {
  unhideAll: true,
  showFullDescriptions: false,
  showShortDescriptions: true
};
const onHideClickSpy = sinon.spy();
const descriptionClickedSpy = sinon.spy();

const wrapper = mount(
  <JobListing
    updateListings={updateListings}
    listing={listing}
    index={index}
    onHideClick={onHideClickSpy}
    descriptionClicked={descriptionClickedSpy}
  />
);

describe('(Component) JobListing', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should have hackerNews class if the source is hackerNews', () => {
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.hacker-news')).to.have.length(1);
  });

  it('should have stackOverflow class if the source is stackOverflow', () => {
    listing.source = "stackOverflow";
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.stack-overflow')).to.have.length(1);
  });

  it('should have github class if the source is github', () => {
    listing.source = "github";
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.github')).to.have.length(1);
  });

  it('should have bad source class if the source is else', () => {
    listing.source = "cat";
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.bad-source')).to.have.length(1);
  });

  it('should show full descriptions when showFullDescriptions is true', () => {
    updateListings = {
      unhideAll: true,
      showFullDescriptions: true,
      showShortDescriptions: false
    };
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.full-description')).to.have.length(1);
  })

  it('should show short descriptions when showFullDescriptions is true', () => {
    updateListings = {
      unhideAll: true,
      showFullDescriptions: false,
      showShortDescriptions: true
    };
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.short-description')).to.have.length(1);
  })

  it('should unhide listing if unhideAll is true', () => {
    updateListings = {
      unhideAll: true,
      showFullDescriptions: false,
      showShortDescriptions: true
    };
    wrapper.setState({hidden:true});
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.job-listing')).to.have.length(1);
  })

  it('should hide listing when X is clicked', () => {
    wrapper.find('#hide').simulate('click');
    expect(wrapper.find('.job-listing')).to.have.length(0);
  })

  it('should call descriptionClicked with arg read more when read more clicked', () => {
    wrapper.setState({fullDescriptionVisible: false, hidden: false});
    wrapper.find('.read-more').simulate('click');
    expect(descriptionClickedSpy.args[0][0]).to.equal('read more');
  })

  it('should call descriptionClicked with arg read less when read less clicked', () => {
    wrapper.setState({fullDescriptionVisible: true, hidden: false});
    wrapper.find('.read-less').simulate('click', {target: {parentElement: {parentElement:{scrollIntoView:sinon.spy()}}}});
    expect(descriptionClickedSpy.args[1][0]).to.equal('read less');
  })

});

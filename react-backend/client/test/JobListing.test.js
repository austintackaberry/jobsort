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

const handleHideListingSpy = sinon.spy();
const descriptionClickedSpy = sinon.spy();
const handleReadMoreClickSpy = sinon.spy();
const handleReadLessClickSpy = sinon.spy();

const wrapper = mount(
  <JobListing
    listing={listing}
    index={index}
    handleHideListing={handleHideListingSpy}
    descriptionClicked={descriptionClickedSpy}
    handleReadLessClick={handleReadLessClickSpy}
    handleReadMoreClick={handleReadMoreClickSpy}
  />
);

describe('(Component) JobListing', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should show short description when read more is visible', () => {
    listing.readMoreOrLess = "read more";
    wrapper.setProps({listing:listing});
    expect(wrapper.find('.short-description')).to.have.length(1);
  })

  it('should call handleReadMoreClick when read more is clicked', () => {
    listing.readMoreOrLess = "read more";
    wrapper.setProps({listing:listing});
    wrapper.find('.read-more').simulate('click')
    expect(handleReadMoreClickSpy.calledOnce);
  })

  it('should call handleReadLessClick when read less is clicked', () => {
    listing.readMoreOrLess = "read less";
    wrapper.setProps({listing:listing});
    wrapper.find('.read-less').simulate('click')
    expect(handleReadLessClickSpy.calledOnce);
  })

  it('should show full description when read less is visible', () => {
    listing.readMoreOrLess = "read less";
    wrapper.setProps({listing:listing});
    expect(wrapper.find('.full-description')).to.have.length(1);
  })

  it('should not show job listing when listing.hidden', () => {
    listing.hidden = true;
    wrapper.setProps({listing:listing});
    expect(wrapper.find('.job-listing')).to.have.length(0);
  })

  it('should render listing title with an anchor tag if the listing has url', () => {
    listing.hidden = false;
    wrapper.setProps({listing:listing, index:index});
    expect(wrapper.find('.listing-url')).to.have.length(1);
  })

  it('should not render listing title with an anchor tag if the listing has no url', () => {
    let listingNoUrl = listing;
    delete listingNoUrl.url;
    wrapper.setProps({listing:listingNoUrl, index:index});
    expect(wrapper.find('.listing-url')).to.have.length(0);
  })

});

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

const wrapper = mount(
  <JobListing
    updateListings={updateListings}
    listing={listing}
    index={index}
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

  it('should have stackOverflow class if the source is hackerNews', () => {
    listing.source = "stackOverflow";
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.stack-overflow')).to.have.length(1);
  });

  it('should have stackOverflow class if the source is hackerNews', () => {
    listing.source = "github";
    wrapper.setProps({updateListings:updateListings, listing:listing, index:index});
    expect(wrapper.find('.github')).to.have.length(1);
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

});

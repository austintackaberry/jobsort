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
const updateListings = {
  unhideAll: true,
  showFullDescriptions: false,
  showShortDescriptions: false
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
  //
  // it('should display results if jobListings.length is not zero', () => {
  //   const wrapper = shallow(
  //     <SearchResults
  //       updateListings={{
  //         unhideAll: false,
  //         showFullDescriptions: false,
  //         showShortDescriptions: false
  //       }}
  //       jobListings={[1,2]}
  //     />
  //   );
  //   console.log(wrapper.find('p'));
  //   expect(wrapper.find('p')).to.have.length(0);
  //   expect(wrapper.find('div')).to.have.length(1);
  // });

});

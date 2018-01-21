import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import SearchResults from '../src/components/SearchResults'

const filteredListingData = [
  {
    companyName: "Facebook",
    compensation: "$50k",
    descriptionHTML: "<div>This is a position for react, html, css, and whoopie</div>",
    descriptionHasTech: ["react", "css", "html"],
    distance: 11,
    fullPostText: "This is a text of the full post",
    hidden: false,
    id: 587,
    latitude: 37,
    location: "San Francisco",
    longitude: -122,
    month: "(January 2018)",
    postTimeInMs: "1514928677618",
    postTimeStr: "3w ago",
    rankScore: 3,
    readMore: false,
    source: "hackerNews",
    title: null,
    type: " Full-Time, Onsite ",
    url: "https://facebook.com"
  },
  {
    companyName: "Google",
    compensation: "$60k",
    descriptionHTML: "<div>This is a position for c, python, html, css, and whoopie</div>",
    descriptionHasTech: ["c", "python", "html", "css"],
    distance: 12,
    fullPostText: "This is a text of the full post",
    hidden: false,
    id: 588,
    latitude: 37,
    location: "San Francisco",
    longitude: -122,
    month: "(January 2018)",
    postTimeInMs: "1514923679618",
    postTimeStr: "3w ago",
    rankScore: 3,
    readMore: false,
    source: "stackOverflow",
    title: "Software Engineer",
    type: " Full-Time ",
    url: "https://google.com"
  },
  {
    companyName: "Amazon",
    compensation: "$80k",
    descriptionHTML: "<div>This is a position for AWS and c++</div>",
    descriptionHasTech: ["aws", "c++"],
    distance: 13,
    fullPostText: "This is a text of the full post",
    hidden: false,
    id: 587,
    latitude: 34,
    location: "Chicago",
    longitude: -142,
    month: "(January 2018)",
    postTimeInMs: "1514924677648",
    postTimeStr: "3w ago",
    rankScore: 2,
    readMore: false,
    source: "github",
    title: "Web Developer",
    type: " Full-Time, Onsite ",
    url: "https://amazon.com"
  }
];

const wrapper = shallow(
  <SearchResults
    noResults={false}
    updateListings={{
      unhideAll: false,
      showFullDescriptions: false,
      showShortDescriptions: false
    }}
    jobListings={filteredListingData}
  />
);

describe('(Component) SearchResults', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  // it('should execute handleUserLocationChange callback on input change', () => {
  //   wrapper.find('input').simulate('change', {target: {value: inputValue}})
  //   expect(handleChangeSpy.calledOnce);
  // });
  //
  // it('should execute onChange prop method on input change', () => {
  //   wrapper.find('input').simulate('change', {target: {value: inputValue}})
  //   expect(onChange.calledOnce);
  // });
  //
  // it('should have first arg of onChange be value of input', () => {
  //   wrapper.find('input').simulate('change', {target: {value: inputValue}})
  //   expect(onChange.args[0][0]).to.equal(inputValue);
  // });
  //
  // it('should send one arg to onChange function', () => {
  //   wrapper.find('input').simulate('change', {target: {value: inputValue}})
  //   expect(onChange.args[0].length).to.equal(1);
  // });
});

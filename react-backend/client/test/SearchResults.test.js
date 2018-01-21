import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import SearchResults from '../src/components/SearchResults'

const wrapper = shallow(
  <SearchResults
    updateListings={{
      unhideAll: false,
      showFullDescriptions: false,
      showShortDescriptions: false
    }}
    jobListings={[]}
  />
);

describe('(Component) SearchResults', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should display no results found if jobListings.length is zero', () => {
    expect(wrapper.find('p').text()).to.equal("no results found");
  });

  it('should display results if jobListings.length is not zero', () => {
    const wrapper = shallow(
      <SearchResults
        updateListings={{
          unhideAll: false,
          showFullDescriptions: false,
          showShortDescriptions: false
        }}
        jobListings={[1,2]}
      />
    );
    console.log(wrapper.find('p'));
    expect(wrapper.find('p')).to.have.length(0);
    expect(wrapper.find('div')).to.have.length(1);
  });

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

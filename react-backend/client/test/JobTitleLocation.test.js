import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import JobTitleLocation from '../src/components/JobTitleLocation'
import UserLocation from '../src/components/UserLocation'

const onUserLocationChange = sinon.spy();
const wrapper = shallow(
  <JobTitleLocation
    onUserLocationChange={onUserLocationChange}
  />
);

describe('(Component) JobTitleLocation', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })
  const userLocationValue = "san francisco";
  const handleUserLocationChangeSpy = sinon.spy(JobTitleLocation.prototype, "handleUserLocationChange");

  it('should execute handleUserLocationChange onChange of UserLocation', () => {
    wrapper.find(UserLocation).simulate('change', userLocationValue);
    expect(handleUserLocationChangeSpy.calledOnce);
  });

  it('should have first arg of onJobLocationChange be value of input', () => {
    wrapper.find(UserLocation).simulate('change', userLocationValue);
    expect(onUserLocationChange.args[0][0]).to.equal(userLocationValue);
  });

  it('should send one arg to onJobLocationChange method', () => {
    wrapper.find(UserLocation).simulate('change', userLocationValue);
    expect(onUserLocationChange.args[0].length).to.equal(1);
  });

});

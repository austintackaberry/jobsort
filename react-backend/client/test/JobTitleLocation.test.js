import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import JobTitleLocation from '../src/components/JobTitleLocation'
import JobTitle from '../src/components/JobTitle'
import UserLocation from '../src/components/UserLocation'

const onJobTitleChange = sinon.spy();
const onUserLocationChange = sinon.spy();
const wrapper = shallow(
  <JobTitleLocation
    onJobTitleChange={onJobTitleChange}
    onUserLocationChange={onUserLocationChange}
  />
);

describe('(Component) JobTitleLocation', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })
  const jobTitleValue = "web developer";
  const userLocationValue = "san francisco";
  const handleJobTitleChangeSpy = sinon.spy(JobTitleLocation.prototype, "handleJobTitleChange");
  const handleUserLocationChangeSpy = sinon.spy(JobTitleLocation.prototype, "handleUserLocationChange");

  it('should execute handleJobTitleChange onChange of JobTitle', () => {
    wrapper.find(JobTitle).simulate('change', jobTitleValue);
    expect(handleJobTitleChangeSpy.calledOnce);
  });

  it('should have first arg of onJobTitleChange be value of input', () => {
    wrapper.find(JobTitle).simulate('change', jobTitleValue);
    expect(onJobTitleChange.args[0][0]).to.equal(jobTitleValue);
  });

  it('should send one arg to onJobTitleChange method', () => {
    wrapper.find(JobTitle).simulate('change', jobTitleValue);
    expect(onJobTitleChange.args[0].length).to.equal(1);
  });

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

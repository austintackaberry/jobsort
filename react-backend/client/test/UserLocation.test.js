import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import UserLocation from '../src/components/UserLocation'

const onUserLocationChangeSpy = sinon.spy();
const wrapper = shallow(<UserLocation onUserLocationChange={onUserLocationChangeSpy} />);

describe('(Component) UserLocation', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })
  const inputValue = "berkeley";
  const handleUserLocationChangeSpy = sinon.spy(UserLocation.prototype, "handleUserLocationChange");

  it('should execute handleUserLocationChange callback on input change', () => {
    wrapper.find('input').simulate('change', {target: {value: inputValue}})
    expect(handleUserLocationChangeSpy.calledOnce);
  });
});

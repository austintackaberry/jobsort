import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import UserLocation from '../src/components/UserLocation'

const onChange = sinon.spy();
const wrapper = shallow(<UserLocation onChange={onChange} />);

describe('(Component) UserLocation', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })
  const inputValue = "web developer";
  const handleChangeSpy = sinon.spy(UserLocation.prototype, "handleUserLocationChange");

  it('should execute handleUserLocationChange callback on input change', () => {
    wrapper.find('input').simulate('change', {target: {value: inputValue}})
    expect(handleChangeSpy.calledOnce);
  });

  it('should execute onChange prop method on input change', () => {
    wrapper.find('input').simulate('change', {target: {value: inputValue}})
    expect(onChange.calledOnce);
  });

  it('should have first arg of onChange be value of input', () => {
    wrapper.find('input').simulate('change', {target: {value: inputValue}})
    expect(onChange.args[0][0]).to.equal(inputValue);
  });

  it('should send one arg to onChange function', () => {
    wrapper.find('input').simulate('change', {target: {value: inputValue}})
    expect(onChange.args[0].length).to.equal(1);
  });
});

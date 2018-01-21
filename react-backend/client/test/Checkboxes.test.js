import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import Checkboxes from '../src/components/Checkboxes'

const onChange = sinon.spy();
const wrapper = shallow(<Checkboxes onChange={onChange} />);

describe('(Component) Checkboxes', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })
  const handleCheckboxChangeSpy = sinon.spy(Checkboxes.prototype, "handleCheckboxChange");

  it('should execute handleCheckboxChange callback on hacker news checkbox change', () => {
    wrapper.find('#hn-checkbox').simulate('change', {target: {checked: false, id: "hn-checkbox"}});
    expect(handleCheckboxChangeSpy.calledOnce);
  });

  it('should trigger onChange callback on hacker news checkbox change', () => {
    wrapper.find('#hn-checkbox').simulate('change', {target: {checked: false, id: "hn-checkbox"}});
    expect(onChange.calledOnce);
  });

  it('should update this.state.checked.hackerNews on hacker news checkbox change', () => {
    wrapper.find('#hn-checkbox').simulate('change', {target: {checked: false, id: "hn-checkbox"}});
    expect(wrapper.state('checked').hackerNews).to.equal(false);
    wrapper.find('#hn-checkbox').simulate('change', {target: {checked: true, id: "hn-checkbox"}});
    expect(wrapper.state('checked').hackerNews).to.equal(true);
  });

  it('should execute handleCheckboxChange callback on stack overflow checkbox change', () => {
    wrapper.find('#so-checkbox').simulate('change', {target: {checked: false, id: "so-checkbox"}});
    expect(handleCheckboxChangeSpy.calledOnce);
  });

  it('should trigger onChange callback on stack overflow checkbox change', () => {
    wrapper.find('#so-checkbox').simulate('change', {target: {checked: false, id: "so-checkbox"}});
    expect(onChange.calledOnce);
  });

  it('should update this.state.checked.stackOverflow on stack overflow checkbox change', () => {
    wrapper.find('#so-checkbox').simulate('change', {target: {checked: false, id: "so-checkbox"}});
    expect(wrapper.state('checked').stackOverflow).to.equal(false);
    wrapper.find('#so-checkbox').simulate('change', {target: {checked: true, id: "so-checkbox"}});
    expect(wrapper.state('checked').stackOverflow).to.equal(true);
  });

  it('should execute handleCheckboxChange callback on github checkbox change', () => {
    wrapper.find('#gh-checkbox').simulate('change', {target: {checked: false, id: "gh-checkbox"}});
    expect(handleCheckboxChangeSpy.calledOnce);
  });

  it('should trigger onChange callback on github checkbox change', () => {
    wrapper.find('#gh-checkbox').simulate('change', {target: {checked: false, id: "gh-checkbox"}});
    expect(onChange.calledOnce);
  });

  it('should update this.state.checked.github on github checkbox change', () => {
    wrapper.find('#gh-checkbox').simulate('change', {target: {checked: false, id: "gh-checkbox"}});
    expect(wrapper.state('checked').github).to.equal(false);
    wrapper.find('#gh-checkbox').simulate('change', {target: {checked: true, id: "gh-checkbox"}});
    expect(wrapper.state('checked').github).to.equal(true);
  });

});

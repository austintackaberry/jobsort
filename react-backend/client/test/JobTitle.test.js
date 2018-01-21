import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme';
import { expect } from 'chai'
import sinon from 'sinon'
import JobTitle from '../src/components/JobTitle'

const wrapper = shallow(<JobTitle />);
const handleChangeSpy = sinon.spy(JobTitle.prototype, "handleJobTitleChange");

describe('(Component) JobTitle', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should execute handleJobTitleChange callback on input change', () => {
    const onChange = sinon.spy();
    const wrap = mount(<JobTitle onChange={onChange} />);
    wrap.find('input').simulate('change', {target: {value: 'web developer'}})
    expect(handleChangeSpy.calledOnce);
  });

  it('should execute onChange prop method on input change', () => {
    const onChange = sinon.spy();
    const wrap = mount(<JobTitle onChange={onChange} />);
    wrap.find('input').simulate('change', {target: {value: 'web developer'}})
    expect(onChange.calledOnce);
  });
});

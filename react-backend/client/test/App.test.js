import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import App from '../src/App'

const wrapper = shallow(<App />);

describe('(Component) App', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  });
})

import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import Loader from '../src/components/Loader'

const currentLoaderText = "This is the current loader text";
const loaderActive = true;
const wrapper = mount(
  <Loader
    currentLoaderText={currentLoaderText}
    loaderActive={loaderActive}
  />
);

describe('(Component) Loader', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should have input element if loader is active', () => {
    wrapper.setProps({loaderActive:true, currentLoaderText:currentLoaderText});
    expect(wrapper.find('input')).to.have.length(1);
    wrapper.setProps({loaderActive:false, currentLoaderText:currentLoaderText});
  });

  it('should not have input element if loader is not active', () => {
    wrapper.setProps({loaderActive:false, currentLoaderText:currentLoaderText});
    expect(wrapper.find('input')).to.have.length(0);
  });

  it('should do nothing if loader already active when it is called', () => {
    wrapper.setProps({loaderActive:true, currentLoaderText:currentLoaderText});
    wrapper.setProps({loaderActive:true, currentLoaderText:currentLoaderText});
    expect(wrapper.find('input')).to.have.length(1);
    wrapper.setProps({loaderActive:false, currentLoaderText:currentLoaderText});
  });

});

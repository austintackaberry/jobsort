import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import Loader from '../src/components/Loader'

const loaderText = "This is loader text";
const loaderActive = true;
const wrapper = mount(
  <Loader
    loaderActive={loaderActive}
    loaderText={loaderText}
  />
);

describe('(Component) Loader', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should have input element if loader is active', () => {
    wrapper.setProps({loaderActive:true, loaderText:loaderText});
    expect(wrapper.find('input')).to.have.length(1);
    wrapper.setProps({loaderActive:false, loaderText:loaderText});
  });

  it('should not have input element if loader is not active', () => {
    wrapper.setProps({loaderActive:false, loaderText:loaderText});
    expect(wrapper.find('input')).to.have.length(0);
  });

  it('currentLoaderText should not be empty if loader interval fn has been executed multiple times', () => {
    var clock = sinon.useFakeTimers();
    wrapper.setProps({loaderActive:true, loaderText:loaderText});
    clock.tick(5000);
    expect(wrapper.state('currentLoaderText')).to.not.equal('');
    clock.restore();
    wrapper.setProps({loaderActive:false, loaderText:loaderText});
  });

  it('should do nothing if loader already active when it is called', () => {
    wrapper.setProps({loaderActive:true, loaderText:loaderText});
    wrapper.setProps({loaderActive:true, loaderText:loaderText});
    expect(wrapper.find('input')).to.have.length(1);
    wrapper.setProps({loaderActive:false, loaderText:loaderText});
  });

});

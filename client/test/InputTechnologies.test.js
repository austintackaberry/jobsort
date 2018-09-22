import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import InputTechnologies from '../src/components/InputTechnologies'

const onChange = sinon.spy();
const testTechInputInAllTechs = "html";
const testTechInputNotInAllTechs = "hockey";
const userTechnologies = [{language:"css", weight: "1", id:1}];
const allTechs = ["javascript", testTechInputInAllTechs, "css", "react", "python"];

const removeTechnologySpy = sinon.spy();
const addTechnologySpy = sinon.spy();

const wrapper = shallow(
  <InputTechnologies
    allTechs={allTechs.sort()}
    userTechnologies={userTechnologies}
    removeTechnology={removeTechnologySpy}
    addTechnology={addTechnologySpy}
  />
);

const mountWrapper = mount(
  <InputTechnologies
    allTechs={allTechs.sort()}
    userTechnologies={userTechnologies}
    removeTechnology={removeTechnologySpy}
    addTechnology={addTechnologySpy}
  />
);

describe('(Component) InputTechnologies', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  const addTechnologyMethodSpy = sinon.spy(InputTechnologies.prototype, "addTechnology");
  const removeTechnologyMethodSpy = sinon.spy(InputTechnologies.prototype, "removeTechnology");

  it('should make a new button with the correct label when user submits form with tech in allTechs but not in userTechnologies', () => {
    mountWrapper.instance().lastUserAddedTechnology.value = testTechInputInAllTechs;
    const form = mountWrapper.find('#addTechnologyForm');
    mountWrapper.find('#addTechnologyForm').simulate('submit', form);
    console.log(mountWrapper.debug());
    expect(addTechnologySpy.calledOnce);
  });

  it('should do nothing when user submits form with tech not in allTechs', () => {
    const numButtonsBefore = mountWrapper.find('button').length;
    mountWrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputNotInAllTechs}});
    const form = wrapper.find('form');
    mountWrapper.find('form').simulate('submit', form);
    const numButtonsAfter = mountWrapper.find('button').length;
    expect(numButtonsAfter - numButtonsBefore).to.equal(0);
  });

  it('should trigger onChange to be called once when adding tech', () => {
    mountWrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    const form = mountWrapper.find('form');
    mountWrapper.find('form').simulate('submit', form);
    expect(onChange.calledOnce);
  });

  it('should remove technology when user clicks x', () => {
    const numButtonsBefore = mountWrapper.find('button').length;
    mountWrapper.find('#langButt0').simulate('click', {target:{id:"langButt0"}});
    const numButtonsAfter = wrapper.find('button').length;
    expect(numButtonsAfter - numButtonsBefore).to.equal(0);
  });

  it('should trigger onChange to be called once when adding tech', () => {
    mountWrapper.instance().lastUserAddedTechnology.value = testTechInputInAllTechs;
    const form = wrapper.find('form');
    mountWrapper.find('form').simulate('submit', form);
    mountWrapper.find('#langButt0').simulate('click', {target:{id:"langButt0"}});
    expect(onChange.calledOnce);
  });

});

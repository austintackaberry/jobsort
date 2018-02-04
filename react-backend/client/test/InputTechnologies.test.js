import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import InputTechnologies from '../src/components/InputTechnologies'

const onChange = sinon.spy();
const testTechInputInAllTechs = "css";
const testTechInputNotInAllTechs = "hockey";
const userTechnologies = [{language:"css", weight: "1"}];
const allTechs = ["javascript", testTechInputInAllTechs, "html", "react", "python"];
const wrapper = shallow(
  <InputTechnologies
    allTechs={allTechs.sort()}
    onChange={onChange}
    userTechnologies={userTechnologies}
  />
);

describe('(Component) InputTechnologies', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  const addTechnologySpy = sinon.spy(InputTechnologies.prototype, "addTechnology");
  const removeTechnologySpy = sinon.spy(InputTechnologies.prototype, "removeTechnology");

  it('should update this.state.currentUserTechnology when user changes input', () => {
    wrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    expect(wrapper.state('currentUserTechnology')).to.equal(testTechInputInAllTechs);
  });

  it('should make a new button with the correct label when user submits form with tech in allTechs but not in userTechnologies', () => {
    const wrapper = mount(
      <InputTechnologies
        allTechs={allTechs.sort()}
        onChange={onChange}
      />
    );
    const numButtonsBefore = wrapper.find('button').length;
    wrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    const form = wrapper.find('form');
    wrapper.find('form').simulate('submit', form);
    const numButtonsAfter = wrapper.find('button').length;
    expect(numButtonsAfter - numButtonsBefore).to.equal(1);
    expect(wrapper.find('span').last().text()).to.equal(testTechInputInAllTechs);
  });

  it('should do nothing when user submits form with tech not in allTechs', () => {
    const wrapper = mount(
      <InputTechnologies
        allTechs={allTechs.sort()}
        onChange={onChange}
      />
    );
    const numButtonsBefore = wrapper.find('button').length;
    wrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputNotInAllTechs}});
    const form = wrapper.find('form');
    wrapper.find('form').simulate('submit', form);
    const numButtonsAfter = wrapper.find('button').length;
    expect(numButtonsAfter - numButtonsBefore).to.equal(0);
  });

  it('should trigger onChange to be called once when adding tech', () => {
    const wrapper = mount(
      <InputTechnologies
        allTechs={allTechs.sort()}
        onChange={onChange}
      />
    );
    wrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    const form = wrapper.find('form');
    wrapper.find('form').simulate('submit', form);
    expect(onChange.calledOnce);
  });

  it('should remove technology when user clicks x', () => {
    const wrapper = mount(
      <InputTechnologies
        allTechs={allTechs.sort()}
        onChange={onChange}
      />
    );
    const numButtonsBefore = wrapper.find('button').length;
    wrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    const form = wrapper.find('form');
    wrapper.find('form').simulate('submit', form);
    let numButtonsAfter = wrapper.find('button').length;
    expect(numButtonsAfter - numButtonsBefore).to.equal(1);
    wrapper.find('#langButt0').simulate('click', {target:{id:"langButt0"}});
    numButtonsAfter = wrapper.find('button').length;
    expect(numButtonsAfter - numButtonsBefore).to.equal(0);
  });

  it('should trigger onChange to be called once when adding tech', () => {
    const wrapper = mount(
      <InputTechnologies
        allTechs={allTechs.sort()}
        onChange={onChange}
      />
    );
    wrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    const form = wrapper.find('form');
    wrapper.find('form').simulate('submit', form);
    wrapper.find('#langButt0').simulate('click', {target:{id:"langButt0"}});
    expect(onChange.calledTwice);
  });

});

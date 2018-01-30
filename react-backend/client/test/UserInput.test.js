import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import UserInput from '../src/components/UserInput'
import JobTitle from '../src/components/JobTitle'
import UserLocation from '../src/components/UserLocation'

const onSubmit = sinon.spy();
const wrapper = shallow(
  <UserInput
    allTechs={['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort()}
    onSubmit={onSubmit}
  />
);
const mountWrapper = mount(
  <UserInput
    allTechs={['javascript', 'git', 'jquery', 'sass', 'rails', 'kafka', 'aws', 'graphql', 'bootstrap', 'rust', 'docker', 'redux', 'react native', 'express', 'react', 'vue', 'd3', 'ember', 'django', 'flask', 'sql', 'java', 'c#', 'python', 'php', 'c++', 'c', 'clojure', 'typescript', 'ruby', 'swift', 'objective-c', '.net', 'assembly', 'r', 'perl', 'vba', 'matlab', 'golang', 'scala', 'haskell', 'node', 'angular', '.net core', 'cordova', 'mysql', 'sqlite', 'postgresql', 'mongodb', 'oracle', 'redis', 'html', 'css'].sort()}
    onSubmit={onSubmit}
  />
);
const testTechInputInAllTechs = "css";

describe('(Component) UserInput', () => {
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  })

  it('should trigger onSubmit when form is submitted', () => {
    mountWrapper.setState({userTechnologies:[{language:testTechInputInAllTechs}]});
    const form = mountWrapper.find('#weightsForm');
    mountWrapper.find('#weightsForm').simulate('submit', form);
    expect(onSubmit.calledOnce);
  });

  it('should trigger handleTechnologyChange to be called once when adding tech', () => {
    const handleTechnologyChangeSpy = sinon.spy(UserInput.prototype, 'handleTechnologyChange');
    mountWrapper.find('#userLangInput').simulate('change', {target: {value: testTechInputInAllTechs}});
    const form = mountWrapper.find('#addTechnologyForm');
    mountWrapper.find('#addTechnologyForm').simulate('submit', form);
    expect(handleTechnologyChangeSpy.calledOnce);
  });

  it('should execute handleJobTitleChange onChange of JobTitle', () => {
    const handleJobTitleChangeSpy = sinon.spy(UserInput.prototype, 'handleJobTitleChange');
    const jobTitleValue = "web developer";
    mountWrapper.find(JobTitle).simulate('change', jobTitleValue);
    expect(handleJobTitleChangeSpy.calledOnce);
  });

  it('should execute handleUserLocationChange onChange of UserLocation', () => {
    const handleUserLocationChangeSpy = sinon.spy(UserInput.prototype, 'handleUserLocationChange');
    const userLocationValue = "san francisco";
    mountWrapper.find(UserLocation).simulate('change', userLocationValue);
    expect(handleUserLocationChangeSpy.calledOnce);
  });

});

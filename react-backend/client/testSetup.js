'use strict';

import { configure } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

Enzyme.configure({ adapter: new Adapter() });

// npm install jsdom
const jsdom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

function noop() {
  return {};
}

// prevent mocha tests from breaking when trying to require a css file
require.extensions['.css'] = noop;
require.extensions['.svg'] = noop;

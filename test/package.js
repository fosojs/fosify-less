'use strict';

const expect = require('chai').expect;
const fless = require('../');

describe('fosify-less', function() {
  it('exports a function', function() {
    expect(fless).to.be.a('function');
  });
});

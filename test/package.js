'use strict';

var expect = require('chai').expect;
var fless = require('../');

describe('fosify-less', function() {
  it('exports a function', function() {
    expect(fless).to.be.a('function');
  });

  it('returns the correct set of extensions', function() {
    expect(fless.extensions).to.be.instanceof(Array);
    expect(fless.extensions.length).to.equal(1);
    expect(fless.extensions[0]).to.equal('css');
  });
});

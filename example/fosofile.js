'use strict';

var Foso = require('foso');
var less = require('../');

var foso = new Foso();
foso
  .register(less, {
    src: './styles',
    minify: true
  })
  .then(() => foso.bundle());

'use strict';

var foso = require('foso');
var less = require('../');

foso
  .please({
    src: './styles',
    minify: true
  })
  .fosify(less)
  .now();

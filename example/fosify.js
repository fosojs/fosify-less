'use strict';

var fosify = require('fosify');
var less = require('../');

fosify({
  src: './styles',
  minify: true
})
  .plugin(less)
  .bundle();

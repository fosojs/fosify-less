'use strict';

var glob = require('glob');
var less = require('less');
var path = require('path');
var fs = require('fs');
var async = require('async');
var gaze = require('gaze');
var futil = require('fosify-util');
var CleanCSS = require('clean-css');

function rebundle(opts, cb) {
  cb = cb || futil.noop;

  var src = opts.src;
  var dest = opts.dest || './build';
  var createPath = futil.bundleNamer({
    src: src,
    extension: 'css'
  });

  var pattern = src + '{/*/**/bundle,/**/*.bundle}.less';
  glob(pattern, { ignore: opts.ignore }, function(err, files) {
    async.eachSeries(files, function(filePath, cb) {
      var str = fs.readFileSync(filePath, {
        encoding: 'utf8'
      });
      var lessOpts = {
        filename: filePath
      };

      less.render(str, lessOpts, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        var bundleName = createPath(filePath);
        var dest = path.join(opts.dest, bundleName);
        var css;
        if (opts.minify) {
          css = new CleanCSS().minify(result.css).styles;
        } else {
          css = result.css;
        }

        futil.saveFile(dest, css);
        futil.log.bundled(bundleName);
        cb();
      });
    }, cb);
  });
}

function bundle(opts, cb) {
  rebundle(opts, function() {
    if (opts.watch) {
      gaze(opts.src + '/**/*.less', function(err, watcher) {
        watcher.on('all', function() {
          rebundle(opts);
        });
      });
    }

    cb();
  });
}

module.exports = bundle;
module.exports.extensions = ['css'];

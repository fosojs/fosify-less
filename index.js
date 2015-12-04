'use strict';

var glob = require('glob');
var less = require('less');
var path = require('path');
var fs = require('fs');
var async = require('async');
var gaze = require('gaze');
var futil = require('fosify');
var pkg = require('./package.json');
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

module.exports = function(plugin, opts, next) {
  futil.notifyUpdate(pkg);

  plugin.expose('bundle', function(cb) {
    cb = cb || function() {};
    rebundle(opts, function() {
      cb();
      if (!opts.watch) {
        return;
      }
      gaze(opts.src + '/**/*.less', function(err, watcher) {
        watcher.on('all', () => rebundle(opts));
      });
    });
  });

  plugin.root.extensions.push('css');

  next();
};

module.exports.attributes = {
  pkg: pkg
};

var slug = require('slug');
var minimatch = require('minimatch');
var join = require('path').join;
var isMatch = false;

module.exports = plugin;

function matchGlobArray (file, patterns) {
  return patterns.some(function (pattern) {
    return minimatch(file, pattern, { matchBase: true});
  });
}

function plugin (opts) {
  opts = opts || {};
  opts.property = opts.property || 'title';

  var slugOpts = {};
  Object.keys(slug.defaults).forEach(function (slugOpt) {
    slugOpts[slugOpt] = opts[slugOpt] || slug.defaults[slugOpt];
  });

  return function (files, metalsmith, done) {
    var dest = metalsmith.destination();
    var src = metalsmith.source();
    var matchedFiles = Object.keys(files).filter(function (file) {
      return matchGlobArray(file, opts.patterns);
    });

    matchedFiles.forEach(function (file) {
      var currFile = files[file];
      currFile.slug = slug(currFile[opts.property], slugOpts);
    });

    done();
  };
}

function absPath (relative) {
  return join(process.cwd(), relative);
}

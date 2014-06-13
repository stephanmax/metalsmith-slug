var slug = require('slug');
var minimatch = require('minimatch');
var join = require('path').join;
var isMatch = false;

module.exports = plugin;

function matchFile (file, patterns) {
  patterns.some(function (pattern) {
    isMatch = minimatch(file, pattern, { matchBase: true});
  });
  return isMatch;
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
      return matchFile(file, opts.patterns);
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

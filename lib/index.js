var path      = require('path');
var slug      = require('slug');
var minimatch = require('minimatch');

module.exports = plugin;

function matchGlobArray (file, patterns) {
  return patterns.some(function (pattern) {
    return minimatch(file, pattern, { matchBase: true});
  });
}

function saveSlug (files, file, opts, slugOpts) {
  var currFile = files[file];
  if (currFile[opts.property] === undefined) return;

  var newSlug = slug(currFile[opts.property], slugOpts);

  if (opts.lowercase) {
    newSlug = newSlug.toLowerCase();
  }

  if (opts.renameFiles) {
    var currPath = path.dirname(file);
    var currExt = path.extname(file);
    var slugFilename = path.join(currPath, currFile.slug + currExt);

    if (slugFilename === file) return;

    files[slugFilename] = currFile;
    delete files[file];
  }

  currFile.slug = newSlug;
}

function plugin (opts) {
  opts = opts || {};
  opts.property = opts.property || 'title';
  opts.renameFiles = opts.renameFiles || false;
  opts.lowercase = opts.lowercase || false;

  var slugOpts = {};

  Object.keys(slug.defaults).forEach(function (slugOpt) {
    slugOpts[slugOpt] = opts[slugOpt] || slug.defaults[slugOpt];
  });

  return function (files, metalsmith, done) {
    var src = metalsmith.source();
    opts.patterns = opts.patterns || [src + '/**'];

    var matchedFiles = Object.keys(files).filter(function (file) {
      return matchGlobArray(file, opts.patterns);
    });

    matchedFiles.forEach(function (file) {
      saveSlug(files, file, opts, slugOpts);
    });

    done();
  };
}

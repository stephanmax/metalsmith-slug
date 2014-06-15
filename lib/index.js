var path      = require('path');
var slug      = require('slug');
var minimatch = require('minimatch');

module.exports = plugin;

function matchGlobArray (file, patterns) {
  return patterns.some(function (pattern) {
    return minimatch(file, pattern, { matchBase: true});
  });
}

function saveSlug (files, file, property, slugOpts) {
  var currFile = files[file];
  currFile.slug = slug(currFile[property], slugOpts);
}

function renameKey (files, file) {
  var currFile = files[file];
  var currPath = path.dirname(file);
  var currExt = path.extname(file);
  var slugFilename = path.join(currPath, currFile.slug + currExt);

  files[slugFilename] = currFile;
  delete files[file];
}

function plugin (opts) {
  opts = opts || {};
  opts.property = opts.property || 'title';
  opts.renameFiles = opts.renameFiles || false;

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

    if (opts.renameFiles) {
      matchedFiles.forEach(function (file) {
        saveSlug(files, file, opts.property, slugOpts);
        renameKey(files, file);
      });
    } else {
      matchedFiles.forEach(function (file) {
        saveSlug(files, file, opts.property, slugOpts);
      });
    }

    done();
  };
}


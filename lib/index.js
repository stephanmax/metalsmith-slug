var path      = require('path');
var slug      = require('slug');
var minimatch = require('minimatch');

module.exports = plugin;

function matchGlobArray (file, patterns) {
  return patterns.some(function (pattern) {
    return minimatch(file, pattern, { matchBase: true});
  });
}

function save(files, file, property, slugOpts, rename, lowercase) {
  var rename = rename || false;
  var currFile = files[file];

  if (currFile[property] === undefined) return;

  if (rename) {
    saveSlug(files, file, property, slugOpts, lowercase);
    renameKey(files, file);
  } else {
    saveSlug(files, file, property, slugOpts, lowercase);
  }
}

function saveSlug (files, file, property, slugOpts, lowercase) {
  var currFile = files[file];
  var newSlug = slug(currFile[property], slugOpts);

  if (lowercase) {
    newSlug = newSlug.toLowerCase();
  }

  currFile.slug = newSlug;
}

function renameKey (files, file) {
  var currFile = files[file];
  var currPath = path.dirname(file);
  var currExt = path.extname(file);
  var slugFilename = path.join(currPath, currFile.slug + currExt);

  if (slugFilename === file) return;

  files[slugFilename] = currFile;

  delete files[file];
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
      save(files, file, opts.property, slugOpts, opts.renameFiles, opts.lowercase);
    });

    done();
  };
}

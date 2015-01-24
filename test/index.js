var test           = require('tap').test;
var Metalsmith     = require('metalsmith');
var metalsmithSlug = require('..');
var slug           = require('slug');

var testProperty = 'title';

test('it should specified property of metalsmith files to a slug', function (t) {
  t.plan(4);

  var metalsmith = Metalsmith('test/fixtures/basic');

  metalsmith
    .use(metalsmithSlug({
      patterns: ['*.md'],
      property: testProperty
    }))
    .build(function (err, files) {
      if (err) {
        console.error(err); t.end();
      }

      Object.keys(files).forEach(function (file) {
        console.log(file);
        var currFile = files[file];
        if (currFile[testProperty]) {
          t.equal(currFile.slug, slug(currFile.title), currFile.testName);
        } else {
          t.equal(currFile.slug, undefined, currFile.testName);
        }
      });

      t.end();
    });
});


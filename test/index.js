var test           = require('tap').test;
var Metalsmith     = require('metalsmith');
var metalsmithSlug = require('..');
var slug           = require('slug');

test('it should specified property of metalsmith files to a slug', function (t) {
  t.plan(3);

  var metalsmith = Metalsmith('test/fixtures/basic');

  metalsmith
    .use(metalsmithSlug({
      patterns: ['*.md'],
      property: 'title'
    }))
    .build(function (err, files) {
      if (err) {
        console.error(err); t.end();
      }

      Object.keys(files).forEach(function (file) {
        var currFile = files[file];
        t.equal(currFile.slug, slug(currFile.title), currFile.testName);
      });

      t.end();
    });
});


var test           = require('tap').test;
var Metalsmith     = require('metalsmith');
var metalsmithSlug = require('..');
var slug           = require('slug');

test('it should work with default options', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(metalsmithSlug())
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'test-simple.md':     'A-simple-string-of-characters',
      'test-symbols.md':    'ccoeOEsumrdftmooadeltainfinityloveandorlessgreater',
      'test-unicode.md':    'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist',
    }))
    .build(testDone(t));
});

test('it should sluggify the specified property', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(function (files, ms, done) {
      for (var file in files) {
        files[file].name = files[file].title;
      }

      done();
    })
    .use(metalsmithSlug({
      property: 'name'
    }))
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'test-simple.md':     'A-simple-string-of-characters',
      'test-symbols.md':    'ccoeOEsumrdftmooadeltainfinityloveandorlessgreater',
      'test-unicode.md':    'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist',
    }))
    .build(testDone(t));
});

test('it should match the given patterns', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(metalsmithSlug({
      patterns: ['test-s*.md']
    }))
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'test-simple.md':     'A-simple-string-of-characters',
      'test-symbols.md':    'ccoeOEsumrdftmooadeltainfinityloveandorlessgreater',
      'test-unicode.md':    undefined,
    }))
    .build(testDone(t));
});

test('it should rename the files', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(metalsmithSlug({ renameFiles: true }))
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'A-simple-string-of-characters.md': 'A-simple-string-of-characters',
      'ccoeOEsumrdftmooadeltainfinityloveandorlessgreater.md': 'ccoeOEsumrdftmooadeltainfinityloveandorlessgreater',
      'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist.md': 'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist',
    }))
    .build(testDone(t));
});

test('it should work with "lowercase" option (backward compatibility)', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(metalsmithSlug({ lowercase: true }))
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'test-simple.md':     'a-simple-string-of-characters',
      'test-symbols.md':    'ccoeoesumrdftmooadeltainfinityloveandorlessgreater',
      'test-unicode.md':    'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist',
    }))
    .build(testDone(t));
});

test('it should take slug options', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(metalsmithSlug({ lower: true }))
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'test-simple.md':     'a-simple-string-of-characters',
      'test-symbols.md':    'ccoeoesumrdftmooadeltainfinityloveandorlessgreater',
      'test-unicode.md':    'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist',
    }))
    .build(testDone(t));
});

test('it should change the slug mode', function (t) {
  t.plan(4);

  Metalsmith('test/fixtures/basic')
    .use(metalsmithSlug({ mode: 'rfc3986' }))
    .use(testFiles(t, {
      'test-noproperty.md': undefined,
      'test-simple.md':     'a-simple-string-of-characters',
      'test-symbols.md':    'ccoeoesumrdftm...ooadeltainfinityloveandorlessgreater',
      'test-unicode.md':    'radioactiveskull-and-bonescaduceusbiohazardhammer-and-sickleyin-yangpeacetelephoneumbrella-with-rain-dropstelephone-sun-with-raysstarumbrellasnowmanairplaneenveloperaised-fist',
    }))
    .build(testDone(t));
});

function testFiles(t, tests) {
  return function (files, ms, done) {
    Object.keys(files).forEach(function (file) {
      var currFile = files[file];

      if (file in tests) {
        t.equal(currFile.slug, tests[file], currFile.testName);
      }
    });

    done();
  };
}

function testDone(t) {
  return function (err) {
    if (err) { console.error(err); }
    t.end();
  };
}

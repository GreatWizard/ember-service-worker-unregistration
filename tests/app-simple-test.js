/* eslint-env node */
'use strict';

const path = require('path');
const Helper = require('./helpers/acceptance.js');
const emberCLIPath = path.resolve(
  __dirname,
  './fixtures/app-simple/node_modules/ember-cli/bin/ember'
);

describe('Acceptance Tests', function() {
  this.timeout(120000);

  context('Simple App', function() {
    let fixturePath = path.resolve(__dirname, './fixtures/app-simple');

    function dist(file) {
      return path.join(fixturePath, 'dist', file);
    }

    before(function() {
      Helper.runEmberCommand(emberCLIPath, fixturePath, ['build']);
    });

    after(function() {
      Helper.cleanup(fixturePath);
    });

    it('produces a index.html that does not contain the unregistration script when sw option does not exist', function() {
      Helper.exists(dist('index.html'));
      Helper.notContains(dist('index.html'), `registration.unregister();`);
    });
  });
});

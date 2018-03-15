/* eslint-env node */
'use strict';

const path = require('path');
const Helper = require('./helpers/acceptance.js');
const emberCLIPath = path.resolve(
  __dirname,
  './fixtures/app-sw-enabled-inline/node_modules/ember-cli/bin/ember'
);

describe('Acceptance Tests', function() {
  this.timeout(120000);

  context('App with service worker options "enabled inline"', function() {
    let fixturePath = path.resolve(
      __dirname,
      './fixtures/app-sw-enabled-inline'
    );

    function dist(file) {
      return path.join(fixturePath, 'dist', file);
    }

    before(function() {
      Helper.runEmberCommand(emberCLIPath, fixturePath, ['build']);
    });

    after(function() {
      Helper.cleanup(fixturePath);
    });

    it('produces a index.html that does not contain the unregistration inline script when sw option true', function() {
      Helper.exists(dist('index.html'));
      Helper.notExists(dist('sw-unregistration.js'));
      Helper.notContains(dist('index.html'), `registration.unregister();`);
    });
  });
});

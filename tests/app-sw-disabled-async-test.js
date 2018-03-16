/* eslint-env node */
'use strict';

const path = require('path');
const Helper = require('./helpers/acceptance.js');
const emberCLIPath = path.resolve(
  __dirname,
  './fixtures/app-sw-disabled-async/node_modules/ember-cli/bin/ember'
);

describe('Acceptance Tests', function() {
  this.timeout(120000);

  context('App with service worker options "disabled async"', function() {
    let fixturePath = path.resolve(
      __dirname,
      './fixtures/app-sw-disabled-async'
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

    it('produces a index.html that contains the async unregistration async script when sw option false', function() {
      Helper.exists(dist('index.html'));
      Helper.exists(dist('sw-unregistration.js'));
      Helper.contains(
        dist('index.html'),
        `<script async src="/sw-unregistration.js"></script>`
      );
    });
  });
});

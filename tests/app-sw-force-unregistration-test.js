/* eslint-env node */
'use strict';

const path = require('path');
const Helper = require('./helpers/acceptance.js');
const emberCLIPath = path.resolve(
  __dirname,
  './fixtures/app-sw-force-unregistration/node_modules/ember-cli/bin/ember'
);

describe('Acceptance Tests', function() {
  this.timeout(120000);

  context(
    'App with service worker options "unregistrationEnabled"',
    function() {
      let fixturePath = path.resolve(
        __dirname,
        './fixtures/app-sw-force-unregistration'
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

      it('produces sw-unregistration.js', function() {
        Helper.exists(dist('sw-unregistration.js'));
      });
    }
  );
});

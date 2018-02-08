var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf').sync;
var spawnSync = require('child_process').spawnSync;
var emberCLIPath = path.resolve(__dirname, './fixtures/app-sw-disabled/node_modules/ember-cli/bin/ember');

describe('Acceptance Tests', function() {
  this.timeout(120000);

  context('App with service worker option disabled', function() {
    var fixturePath = path.resolve(__dirname, './fixtures/app-sw-disabled');

    function dist(file) {
      return path.join(fixturePath, 'dist', file);
    }

    before(function() {
      runEmberCommand(fixturePath, ['build']);
    });

    after(function() {
      cleanup(fixturePath);
    });

    it('produces a index.html that contains the unregistration script when sw option false', function() {
      exists(dist('index.html'));
      contains(dist('index.html'), `registration.unregister();`);
    });
  });
});

function runEmberCommand(packagePath, command) {
  var result = spawnSync(emberCLIPath, command, {
    cwd: packagePath
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.toString());
  }
}

function cleanup(packagePath) {
  rimraf(path.join(packagePath, 'dist'));
  rimraf(path.join(packagePath, 'tmp'));
}

function exists(path) {
  assert.ok(fs.existsSync(path), path + ' exists');
}

function contains(path, content) {
  assert.ok(fs.readFileSync(path).toString().indexOf(content) > -1, path + ' contains ' + content);
}

function notContains(path, content) {
  assert.ok(fs.readFileSync(path).toString().indexOf(content) === -1, path + ' contains ' + content);
}
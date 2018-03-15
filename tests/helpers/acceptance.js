/* eslint-env node */
'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const rimraf = require('rimraf').sync;

function runEmberCommand(emberCLIPath, packagePath, command) {
  let result = spawnSync(emberCLIPath, command, {
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
  assert.ok(fs.existsSync(path), `${path} exists`);
}

function notExists(path) {
  assert.notOk(fs.existsSync(path), `${path} don't exists`);
}

function contains(path, content) {
  assert.ok(
    fs
      .readFileSync(path)
      .toString()
      .indexOf(content) > -1,
    `${path} contains ${content}`
  );
}

function notContains(path, content) {
  assert.ok(
    fs
      .readFileSync(path)
      .toString()
      .indexOf(content) === -1,
    `${path} don't contains ${content}`
  );
}

module.exports = {
  runEmberCommand,
  cleanup,
  exists,
  notExists,
  contains,
  notContains
};

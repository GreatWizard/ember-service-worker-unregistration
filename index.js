/* eslint-env node */
'use strict';

const Babel = require('broccoli-babel-transpiler');
const Funnel = require('broccoli-funnel');
const getBabelOptions = require('./lib/get-babel-options');
const InlineRegistration = require('./lib/inline-registration');
const mergeTrees = require('broccoli-merge-trees');
const path = require('path');

module.exports = {
  name: 'ember-service-worker-unregistration',

  included(app) {
    this._super.included && this._super.included.apply(this, arguments);
    this.app = app;
    this.app.options = this.app.options || {};
    let options = (this.app.options['ember-service-worker'] =
      this.app.options['ember-service-worker'] || {});

    if (process.env.SW_DISABLED) {
      options.enabled = false;
    }
  },

  postprocessTree(type, appTree) {
    let options = this._getOptions();

    if (type !== 'all' || this.app.env === 'test' || options.enabled === true) {
      return appTree;
    }

    let serviceWorkerUnregistrationTree = new Funnel(
      path.join(this.root, 'lib'),
      {
        include: ['sw-unregistration.js']
      }
    );

    serviceWorkerUnregistrationTree = new Babel(
      serviceWorkerUnregistrationTree,
      getBabelOptions(this.app.project)
    );

    serviceWorkerUnregistrationTree = new InlineRegistration(
      [appTree, serviceWorkerUnregistrationTree],
      options
    );

    return mergeTrees([appTree, serviceWorkerUnregistrationTree], {
      overwrite: true
    });
  },

  contentFor(type) {
    let options = this._getOptions();

    if (this.app.env === 'test' || options.enabled === true) {
      return;
    }

    if (type === 'body-footer') {
      return '<script>ESW_UNREGISTRATION_INLINE_PLACEHOLDER</script>';
    }
  },

  _getOptions() {
    return this.app.options['ember-service-worker'];
  }
};

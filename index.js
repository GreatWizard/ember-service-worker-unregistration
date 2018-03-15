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

    options.registrationStrategy = options.registrationStrategy || 'default';
    options.unregistrationEnabled = options.unregistrationEnabled || false;

    if (options.enabled === undefined) {
      options.enabled = true;
    }

    if (process.env.SW_DISABLED) {
      options.enabled = false;
    }
  },

  postprocessTree(type, appTree) {
    let options = this._getOptions();

    if (
      type !== 'all' ||
      this.app.env === 'test' ||
      (options.enabled === true && options.unregistrationEnabled === false)
    ) {
      return appTree;
    }

    let trees = [appTree];

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

    if (
      options.enabled === false &&
      options.registrationStrategy === 'inline'
    ) {
      trees.push(
        new InlineRegistration(
          [appTree, serviceWorkerUnregistrationTree],
          options
        )
      );
    }

    if (
      options.unregistrationEnabled === true ||
      (options.enabled === false && options.registrationStrategy !== 'inline')
    ) {
      trees.push(serviceWorkerUnregistrationTree);
    }

    return mergeTrees(trees, {
      overwrite: true
    });
  },

  contentFor(type) {
    let options = this._getOptions();

    if (this.app.env === 'test' || options.enabled === true) {
      return;
    }

    if (type === 'head-footer' && options.registrationStrategy === 'async') {
      return `<script async src="${this._getRootURL()}sw-unregistration.js"></script>`;
    }

    if (type === 'body-footer') {
      if (options.registrationStrategy === 'default') {
        return `<script src="${this._getRootURL()}sw-unregistration.js"></script>`;
      }

      if (options.registrationStrategy === 'inline') {
        return '<script>ESW_UNREGISTRATION_INLINE_PLACEHOLDER</script>';
      }
    }
  },

  _getOptions() {
    return this.app.options['ember-service-worker'];
  },

  _getRootURL() {
    if (this._projectRootURL) {
      return this._projectRootURL;
    }

    let customOptions = this.app.options['ember-service-worker'] || {};
    let config = this.project.config(this.app.env);
    let rootURL =
      customOptions.rootUrl || config.rootURL || config.baseURL || '/';

    return (this._projectRootURL = rootURL);
  }
};

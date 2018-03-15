# Ember Service Worker Unregistration

[![Build Status](https://travis-ci.org/GreatWizard/ember-service-worker-unregistration.svg?branch=master)](https://travis-ci.org/GreatWizard/ember-service-worker-unregistration) [![Ember Observer Score](https://emberobserver.com/badges/ember-service-worker-unregistration.svg)](https://emberobserver.com/addons/ember-service-worker-unregistration)

_An Ember plugin that unregister service workers when ember-service-worker is disabled._

## Installation

```
ember install ember-service-worker-unregistration
```

## Configuration

This plugin inject unregistration loop code at the bottom of your `index.html` file.

To unregister all your service workers you just need to disable ember-service-worker.
The configuration is done in the `ember-cli-build.js` file:

```js
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-service-worker': {
      // Disable the Service Worker
      enabled: false,
      // There are various ways to inject the service worker registration script.
      // By default, the unregistration file is loaded using a simple script tag in the bottom of the body tag
      // async: the unregistration file is loaded using a async script tag in the bottom of the head tag
      // inline: write the contents of the registration script into the index.html file
      registrationStrategy: 'inline'
      // Force to create the unregistration file
      unregistrationEnabled: true
    }
  });

  return app.toTree();
};
```

## Authors

* [Guillaume Gérard](http://twitter.com/ggerard88)

## Versioning

This library follows [Semantic Versioning](http://semver.org)

## Want to help?

Please do! We are always looking to improve this library. Please see our
[Contribution Guidelines](https://github.com/greatwizard/ember-service-worker-unregistration/blob/master/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

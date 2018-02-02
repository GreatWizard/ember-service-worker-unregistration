# Ember Service Worker Unregistration

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
      enabled: false
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

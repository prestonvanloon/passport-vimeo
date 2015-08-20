/**
 * Module dependencies.
 */
var Strategy = require('./strategy');


/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.OAuth2Strategy = Strategy;

/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Vimeo authentication strategy authenticates requests by delegating to
 * Vimeo using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts a `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`        your Vimeo application's client id
 *   - `clientSecret`    your Google application's client secret
 *   - `callbackURL`     URL to which Vimeo will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new VimeoStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/vimeo/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.vimeo.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.vimeo.com/oauth/access_token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'vimeo';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Vimeo.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`     always set to `vimeo`
 *   - `id`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, done) {
  this._oauth2.get('https://api.vimeo.com/me', token, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'vimeo' };
      profile.id = json.person.uri.substring(7);
      profile.displayName = json.person.name;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

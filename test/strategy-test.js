var vows = require('vows');
var assert = require('assert');
var util = require('util');
var VimeoStrategy = require('passport-vimeo/strategy');


vows.describe('VimeoStrategy').addBatch({

  'strategy': {
    topic: function() {
      return new VimeoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },

    'should be named meetup': function (strategy) {
      assert.equal(strategy.name, 'vimeo');
    },
  },

  'strategy when loading user profile': {
    topic: function() {
      var strategy = new VimeoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});

      // mock
      strategy._oauth2.get = function(url, token, tokenSecret, callback) {
        var body = '{ \
            "uri": "/users/0123456789", \
            "name": "Brad Dougherty", \
            "link": "https://vimeo.com/user0123456789", \
            "location": "Rochester, NY", \
            "bio": null, \
            "created_time": "2015-08-18T14:27:16+00:00", \
            "account": "basic", \
            "pictures": null, \
            "websites": [], \
            "metadata": {}, \
            "preferences": { \
                "videos": { \
                    "privacy": "anybody" \
                } \
            }, \
            "content_filter": [ \
                "language", \
                "drugs", \
                "violence", \
                "nudity", \
                "safe", \
                "unrated" \
            ] \
        }';

        callback(null, body, undefined);
      }

      return strategy;
    },

    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('token', done);
        });
      },

      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'vimeo');
        assert.equal(profile.id, '0123456789');
        assert.equal(profile.displayName, 'Brad Dougherty');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },

  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new VimeoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});

      // mock
      strategy._oauth2.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }

      return strategy;
    },

    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('token', done);
        });
      },

      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);

/**
 * cp.js - Copy Directory (recursive)
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

var _        = require('underscore'),
    colorize = require('../colorize.js'),
    path     = require('path'),
    wrench   = require('wrench');

var dir_copy = function(options, callback) {
	var operation = function() {
		wrench.copyDirSyncRecursive(options.from, options.to, {
			preserve: options.preserve
		});
	};

	try {
		operation();
	} catch (e) {
		if (e.code === 'ENOENT') {
			try {
				wrench.mkdirSyncRecursive(path.dirname(options.to));
				operation();
			} catch (e) {
				return callback(e.message);
			}
			return callback();
		}
		return callback(e.message);
	}

	callback();
};

var dir_remove = function(options, callback) {
	try {
		wrench.rmdirSyncRecursive(options.path);
	} catch (e) {
		return callback(e.message);
	}

	callback();
};

var dir_move = function(options, callback) {
	dir_copy(options, function(err) {
		if (err) return callback(err);
		dir_remove({path: options.from}, callback);
	});
};


module.exports = function(roto) {

	// task: dir-copy
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	roto.defineTask('dir-copy', function(callback, options, target, globalOptions) {
		var err;

		_.defaults(options, {
			from     : null,
			to       : null,
			preserve : true
		});

		// validate options
		if (!options.from) err = 'No source "from" provided.';
		if (!options.to) err = 'No destination "to" provided.';
		if (err) {
			roto.error(colorize('ERROR:', 'red') + ' ' + err + '\n');
			return callback(false);
		}

		// perform copy
		roto.notice(colorize('cp: ', 'gray') + options.from + colorize(' -> ', 'gray') + options.to + '\n');
		dir_copy(options, function(err) {
			if (err) {
				roto.error(colorize('ERROR:', 'red') + ' ' + err + '\n');
				return callback(false);
			}
			callback();
		});
	});

	// task: dir-move
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	roto.defineTask('dir-move', function(callback, options, target, globalOptions) {
		var err;

		_.defaults(options, {
			from     : null,
			to       : null,
			preserve : true
		});

		// validate options
		if (!options.from) err = 'No source "from" provided.';
		if (!options.to) err = 'No destination "to" provided.';
		if (err) {
			roto.error(colorize('ERROR:', 'red') + ' ' + err + '\n');
			return callback(false);
		}

		// perform move
		roto.notice(colorize('mv: ', 'gray') + options.from + colorize(' -> ', 'gray') + options.to + '\n');
		dir_move(options, function(err) {
			if (err) {
				roto.error(colorize('ERROR:', 'red') + ' ' + err + '\n');
				return callback(false);
			}
			callback();
		});
	});

	// task: dir-remove
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	roto.defineTask('dir-remove', function(callback, options, target, globalOptions) {

		// validate options
		if (!options.path) {
			roto.error(colorize('ERROR:', 'red') + ' No "path" provided.\n');
			return callback(false);
		}

		// perform remove
		roto.notice(colorize('rm: ', 'gray') + options.path + '\n');
		dir_remove(options, function(err) {
			if (err) {
				roto.error(colorize('ERROR:', 'red') + ' ' + err + '\n');
				return callback(false);
			}
			callback();
		});

	});

};

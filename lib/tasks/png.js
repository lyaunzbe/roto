/**
 * png.js - The catch-all PNG optimizer task
 * 
 * Copyright (c) 2012 DIY Co
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
 * @author Zachary Bruggeman <zbruggeman@me.com>
 */

 var _       = require('underscore'),
    exec     = require('child_process').exec,
    colorize = require('../colorize'),
    async    = require('async');

module.exports = function(roto) {

	roto.defineTask('png', function(callback, options, target, globalOptions) {

		var files;
		var binary;
		var queue;
		var args = [];
		var finalArgs;

		_.defaults(options, {
			compressor : 'none',
			binaries   : {'optipng' : './bin/optipng', 'pngquant' : './bin/pngquant', 'pngcrush' : './bin/pngcrush'},
			customArgs : '',
			workers    : 1
		});

		// find files
		var files = roto.findFiles(options.files, options.ignore);
		if (!files.length) {
			roto.error(colorize('Error: ', 'red') + 'No valid files were provided. \n');
			return callback(false);
		};

		// get compressor
		if (options.compressor === 'none') {
			roto.error(colorize('Error: ', 'red') + 'You need to specify a compressor! \n');
			return callback(false);
		}
		var binary = options.binaries[options.compressor];

		// push and format args
		args.push(options.customArgs);
		if (options.compressor === 'pngcrush') {
			finalArgs = ' -ow ' + args.join(' ');
		} else if (options.compressor === 'optipng' || options.compressor === 'pngquant') {
			finalArgs = args.join(' ') + ' -- ';
		};

		// queue files (thanks Brian!)
		var queue = async.queue(function(filename, callback) {
			var proc = exec(binary +  finalArgs + filename, function(err, stdout, stderr) {
				if (err) {
					roto.error(colorize('Error: ', 'red') + err +  '\n');
					callback();
				} else {
					roto.notice(stderr + '\n');
					callback();
				};
			});
		}, options.workers);

		queue.push(files);
		callback();

	});
};
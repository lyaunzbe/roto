/**
 * pngquant.js - PNG optimization via pngquant
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

var _        = require('underscore'),
	spawn    = require('child_process').spawn,
	colorize = require('../colorize');

module.exports = function(roto) {

	roto.defineTask('pngquant', function(callback, options, target, globalOptions) {

		var files;
		var args = [];

		_.defaults(options, {
			binary    : './bin/pngquant',
			force     : true,
			suffix    : '.png'
		});

		// read files
		// TODO - figure out pngquant batch stuff and see how we need to pass it
		var files = roto.findFiles(options.files, options.ignore);

		if (!files.length) {
			roto.error(colorize('Error: ', 'red') + 'No valid files were provided. \n');
			return callback(false);
		};

		// push args

		if (options.force) {
			args.push('--force');
		};

		// BROKEN (for no apparent reason)
		//args.push('--ext ' + options.suffix);

		args.push('--');
		args.push(files);
		console.log(args.join(' '));


		// start up pngquant
		var proc = spawn(options.binary, args, {
			cwd: process.cwd()
		});

		proc.stderr.on('data', function(data) {
			roto.error(colorize('Error: ', 'red') + data + '\n');
			return callback(false);
		});

		proc.on('exit', function() {
			callback();
		})

	})
}
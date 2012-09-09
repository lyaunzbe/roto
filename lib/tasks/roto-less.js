/**
 * roto-less.js - LESS compiler for roto
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


var fs = require('fs'),
	less = require('less'),
	colorize = require('../colorize');

// ---------------------------------------------------

module.exports = function(roto) {

	roto.defineTask('less', function(callback, options, target, globalOptions) {

		var parser = new less.Parser();
		var data = [];

		roto.notice('Pre-compiling LESS files... \n\n');

		// get matching LESS files
		if (!Array.isArray(options.ignore)) {
			options.ignore = (typeof options.ignore === 'string') ? [options.ignore] : [];
		}
		options.ignore.push(options.output);
		var paths = roto.findFiles(options.files, options.ignore)

		// check that we have at least one file
		if (!paths.length) {
			roto.error(colorize('Error: ', 'red') + 'No valid files were provided. \n');
			return callback();
		}

		// for each file, push its contents to data
		for (var i = 0; i < paths.length; i++){

			roto.notice('   + ' + paths[i] + '\n')

			try {
				data.push(fs.readFileSync((paths[i]).toString(), 'utf8'));
			} catch(err) {
				roto.error(colorize('Error: ', 'red') + 'File reading error: ' + err + '\n');
				return callback();
			}
		}

		// check what compression is used, if is specified
		var compressOptions = {};

		if (options.compress === 'normal') {
			compressOptions = {compress: true};
		} else if (options.compress === 'yui') {
			compressOptions = {yuicompress: true};
		}

		// parse everything in data, and write it to options.output
		parser.parse((data).join(' '), function(err, tree) {
				try {
					css = tree.toCSS(compressOptions);
				} catch(err) {
					roto.error(colorize('Error: ', 'red') + 'LESS parsing error: ' + err + '\n');
					return callback();
				}

				try {
					fs.writeFileSync(options.output, css, 'utf8')
				} catch (err) {
					roto.error(colorize('Error: ', 'red') + 'File writing error: ' + err + '\n');
					return callback();
				}

				roto.notice('   = ' + colorize(options.output, 'white') + '\n')

			});

		roto.notice('\n')
		callback();


	}); 

};
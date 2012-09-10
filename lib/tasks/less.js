/**
 * less.js - LESS Compiler
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
    path = require('path'),
    async = require('async'),
    less = require('less'),
    colorize = require('../colorize');

// ---------------------------------------------------

module.exports = function(roto) {

	roto.defineTask('less', function(callback, options, target, globalOptions) {

		var files;
		var parser = new less.Parser();
		var data = [];
		var compressOptions = {};
		var cwd = process.cwd();

		roto.notice(colorize(options.output, 'white') + '\n');

		// get matching LESS files
		if (!Array.isArray(options.ignore)) {
			options.ignore = (typeof options.ignore === 'string') ? [options.ignore] : [];
		}
		options.ignore.push(options.output);
		files = roto.findFiles(options.files, options.ignore);

		// check that we have at least one file
		if (!files.length) {
			roto.error(colorize('Error: ', 'red') + 'No valid files were provided. \n');
			return callback(false);
		}

		// check what compression is used, if is specified
		if (options.compress === 'normal') {
			compressOptions = {compress: true};
		} else if (options.compress === 'yui') {
			compressOptions = {yuicompress: true};
		}

		// translate less to css
		async.reduce(files, [], function(css, file, callback) {
			roto.notice('   + ' + file + '\n')
			var less = fs.readFileSync(path.resolve(cwd, file), 'utf8');
			process.chdir(path.dirname(file));
			parser.parse(less, function(err, tree) {
				if (err) return callback(err, null);
				css.push(tree.toCSS(compressOptions));
				callback(null, css);
			});
		}, function(err, css) {

			// return to old working directory
			process.chdir(cwd);

			// error handling
			if (err) {
				roto.error(colorize('Error: ', 'red') + err + '\n');
				return callback(false);
			}

			// write output
			try {
				fs.writeFileSync(options.output, css.join(' '), 'utf8')
			} catch (err) {
				roto.error(colorize('Error: ', 'red') + 'Could not write to ' + options.output + '\n');
				return callback(false);
			}

			callback();

		});

	}); 
};
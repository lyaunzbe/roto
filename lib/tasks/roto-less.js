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
	path = require('path')
	less = require('less');

// ---------------------------------------------------

module.exports = function(roto) {

	roto.defineTask('less', function(callback, options, target, globalOptions) {

		roto.notice('Compiling LESS files: ' + options.files + '\n');

		// get matching LESS files
		if (!Array.isArray(options.ignore)) {
			options.ignore = (typeof options.ignore === 'string') ? [options.ignore] : [];
		}
		options.ignore.push(options.output);
		var paths = (roto.findFiles(options.files, options.ignore)).toString();
		
		var parser = new (less.Parser)({
			paths: paths
		});

		try {
		fs.readFile(paths, 'utf8', function(err, data) {
			goParse(data);
		})
		} catch(err) {
			roto.error('read file error: ' + err + '\n');
			callback();
		}


		function goParse(data) {
			parser.parse(data, function(err, tree) {
				try {
					css = tree.toCSS();
				} catch(e) {
					roto.error(e);
					callback();
				}

				try {
					fs.writeFileSync(options.output, css, 'utf8')
				} catch (err) {
					roto.error(err);
					callback();
				}

				roto.notice("Compiled to " + options.output + "\n")

			});
		}

		callback();


	}); 

};

/* 			if (err) {
				roto.error(err);
				callback();
			}

			parser.parse(data, function(err, tree) {
			
				try {
					css = tree.toCSS();
				} catch(e) {
					roto.error(e);
					callback();
				}

				fs.writeFile(options.output, css, 'utf8', function(err){ 
					if (err) {
						roto.error(err);
						callback();
					}
					roto.notice("Compiled to " + options.output + "\n")
				})

			}) */
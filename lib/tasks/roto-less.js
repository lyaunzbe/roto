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
		var paths = roto.findFiles(options.files, options.ignore)
		
		var parser = new (less.Parser)();
		var data = [];

		for (var i = 0; i < paths.length; i++){

			try {
				data.push(fs.readFileSync((paths[i]).toString(), 'utf8'));
			} catch(err) {
				roto.error('File reading error: ' + err + '\n');
				callback();
			}
		}

		parser.parse((data).join(' '), function(err, tree) {
				try {
					css = tree.toCSS();
				} catch(e) {
					roto.error('LESS parsing error: ' + e + '\n');
					callback();
				}

				try {
					fs.writeFileSync(options.output, css, 'utf8')
				} catch (err) {
					roto.error('File writing error: ' + err + '\n');
					callback();
				}

				roto.notice("Compiled to " + options.output + "\n")

			});


		callback();


	}); 

};
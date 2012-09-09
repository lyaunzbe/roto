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

		roto.notice('Compiling LESS files:\n');

		fs.readFile(options.files, function(e,data){

			if (e) throw e

			data = data.toString();
			less.render(data, function (e, css){

				if (e) throw e

				fs.writeFile(options.output, css, function(err){

					if (err) throw err;

					roto.notice('LESS compiled!\n');

				});

			});

		});

		callback();


	}); 

};
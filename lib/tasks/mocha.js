/**
 * mocha.js - Unit Testing
 * 
 * Copyright (c) 2012 DIY Co.
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
 * @author Brian Reavis <brian@diy.org>
 */

var _     = require('underscore'),
    spawn = require('child_process').spawn,
    mocha = require('mocha');

// ---------------------------------------------------------------------------------

module.exports = function(roto) {

	roto.defineTask('mocha', function(callback, options, target, globalOptions) {
		_.defaults(options, {
			reporter: 'list',
			colors: true,
			growl: false,
			timeout: false
		});
		
		// assemble command line arguments
		var args = [];
		
		args.push('--reporter ' + options.reporter);
		
		if (options.timeout)  args.push('--timeout ' + options.timeout); 
		if (!options.colors)  args.push('--no-colors');
		if (options.growl)    args.push('--growl');
		
		// start mocha
		var proc = spawn('./node_modules/.bin/mocha', args, {
			customFds: [0, 1, 2]
		});
		
		proc.on('exit', function() {
			callback();
		});
	});

}
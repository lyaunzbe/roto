/**
 * roto - A no-nonsense build tool for Node.js projects.
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
 * @author Brian Reavis <brian@thirdroute.com>
 */

var _        = require('underscore'),
    fs       = require('fs'),
    path     = require('path'),
    glob     = require('glob'),
    wrench   = require('wrench'),
    colorize = require('./colorize.js');

var roto = module.exports = (function() {
	var roto = {};

	var currentTarget = null;
	var taskTemplates = {};
	var isNewline     = true;

	var project = {
		name: 'Untitled Project',
		targets: {}
	};

	roto._project = project;
	roto.defaultTarget = 'all';
	roto.dirname = __dirname.replace(/\/lib\/?$/, '');

	/**
	 * Colorizes a string.
	 *
	 * @param  string  String to colorize.
	 * @param  color   Color name to use.
	 */
	roto.colorize = colorize;

	/**
	 * Profile targets.
	 *
	 * If option is present `endProfile` will output the profile time.
	 */
	roto.startTime = 0;
	roto.endTime   = 0;
	roto.startProfile = function () {
		roto.startTime = new Date().getTime();
	};

	roto.endProfile = function () {
		roto.endTime = new Date().getTime();
		var total = ((roto.endTime - roto.startTime) / 1000).toFixed(2);

		if (roto.options.hasOwnProperty('profile')) {
			roto.notice('\n');
			roto.notice('Finished in ' + total + 's\n');
		}
	};

	/**
	 * Performs a glob search for files relative to the project root.
	 *
	 * @param  search  A path, or array of paths, to search for. Supports glob syntax.
	 * @param  ignore  A path, or array of paths, to ignore. Supports glob syntax.
	 */
	roto.findFiles = function(search, ignore) {
		var globbed;
		var ignorePaths = [];
		var paths = [];

		// search for ignore paths
		if (typeof ignore !== 'undefined') {
			if (typeof ignore === 'string') { ignore = [ignore]; }
			for (i = 0; i < ignore.length; i++) {
				globbed = glob.sync(ignore[i]);
				for (j = 0; j < globbed.length; j++) {
					ignorePaths[globbed[j]] = true;
				}
			}
		}

		// search for matching paths
		if (typeof search === 'string') { search = [search]; }
		for (i = 0; i < search.length; i++) {
			globbed = glob.sync(search[i]);
			for (j = 0; j < globbed.length; j++) {
				if (ignorePaths.hasOwnProperty(globbed[j])) {
					continue;
				}
				paths.push(globbed[j]);
			}
		}

		// filter out duplicates
		paths = _.uniq(paths);

		return paths;
	};

	/**
	 * Writes a file. If the parent directory doesn't
	 * exist, it will be created.
	 *
	 * @param {string} destination
	 * @param {mixed} content
	 * @param {string} encoding
	 */
	roto.writeFile = function(destination, content, encoding) {
		try {
			fs.writeFileSync(destination, content, encoding);
		} catch (e) {
			var dirname = path.dirname(destination);
			if (!fs.existsSync(dirname)) {
				wrench.mkdirSyncRecursive(dirname);
				fs.writeFileSync(destination, content, encoding);
			} else {
				throw e;
			}
		}
	};

	/**
	 * Writes a notice to the console (stdout).

	 * @param  str    Message to write to the console.
	 * @param  color  [optional] Color name for string colorization.
	 */
	roto.notice = function(str, color) {
		if (!str) return;

		process.stdout.write((isNewline ? '  ' : '') + (typeof color === 'string' ? colorize(str, color) : str));
		isNewline = str[str.length - 1] === '\n';
	};

	/**
	 * Writes an error to the console (stderr).
	 *
	 * @param  str    Message to write to the console.
	 * @param  color  [optional] Color name for string colorization.
	 */
	roto.error = function(str, color) {
		if (!str) return;

		if (typeof color === 'string') {
			str = colorize(str, color);
		}
 		process.stderr.write((isNewline ? '  ' : '') + str);
		isNewline = str[str.length - 1] === '\n';
	};

	/**
	 * Sets up a target for the current project.
	 *
	 * @param  name  Target name.
	 * @param  run   Target execution function.
	 */
	roto.addTarget = function(name, setup) {
		var target = project.targets[name] = {
			name  : name,
			tasks : [],
			run   : function(options, callback) {
				// setup target
				var oldTarget = currentTarget;
				currentTarget = target;
				target.tasks  = [];
				setup(options);

				// execute target
				var i = 0;
				var iterator = function() {
					if (i === target.tasks.length) {
						callback();
						return;
					}
					target.tasks[i++](options, function(result) {
						if (result === false) callback(false);
						else iterator();
					});
				};
				iterator();

				currentTarget = oldTarget;
			}
		};
	};

	/**
	 * Adds a task to the current target.
	 * Call this from a target setup method.
	 *
	 * Usage:
	 *     roto.addTask('lint', {
	 *        files: 'something.js'});
	 *     });
	 *     roto.addTask(function(callback) {
	 *         console.log('Do something');
	 *         callback();
	 *     });
	 *
	 * @param  method       Callback, or name of the predefined task.
	 * @param  taskOptions  An object containing configuration info
	 *                      for the task when it executes.
	 */
	roto.addTask = function() {
		var target = currentTarget;
		var taskOptions = arguments.length > 1 ? arguments[1] : null;

		if (!target) {
			roto.error(colorize('ERROR:', 'red') + ' roto.addTask() can only be called within the roto.addTarget() callback.\n');
			return false;
		}

		if (typeof arguments[0] === 'function') {
			var fn = arguments[0];
			target.tasks.push(function(options, callback) {
				fn(callback, taskOptions, target, options);
			});
		} else {
			if (arguments[0].indexOf('target:') === 0) {
				var targetName = arguments[0].substring(7).replace(/^\s\s*/,'');
				target.tasks.push(function(options, callback) {
					roto.executeTarget(targetName, taskOptions, callback);
				});
			} else {
				var taskName = arguments[0];
				target.tasks.push(function(options, callback) {
					if (typeof taskTemplates[taskName] !== 'function') {
						roto.error(colorize('ERROR:', 'red') + ' "' + taskName + '" task not defined.\n');
						callback(false);
					} else {
						taskTemplates[taskName](callback, taskOptions, target, options);
					}
				});
			}
		}
	};

	/**
	 * Defines a task so that it can be invoked later,
	 * one or more times.
	 *
	 * @param  taskName  Name of the task.
	 * @param  callback  Function that performs the task.
	 */
	roto.defineTask = function(taskName, callback) {
		taskTemplates[taskName] = callback;
	};

	/**
	 * Executes a single target.
	 *
	 * @param  targetName  The name of the target.
	 * @param  options     Configuration options to pass to the target.
	 * @param  callback    Invoked upon completion.
	 */
	roto.executeTarget = function(targetName, options, callback) {
		var target = project.targets[targetName];

		roto.notice(colorize('Running "' + target.name + '" target...', 'blue') + '\n');
		target.run(options, callback);
	};

	/**
	 * Build it!
	 *
	 * @param  targetName  The name of the target you want to build.
	 *                     Use an array of target names to build multiple
	 *                     targets at once. To build all targets, use "all".
	 * @param  options     An object containing global options, provided
	 *                     to all tasks.
	 * @param  callback    Callback. Invoked upon build completion.
	 */
	roto.run = function(targetName, options, callback) {
		var i, oldGlobals;

		// setup
		targetName = targetName || roto.defaultTarget;
		options = options || {};
		roto.options = options;

		// determine selected targets
		var selectedTargets = [];
		if (typeof targetName === 'string') {
			targetName = targetName.toLowerCase();
			if (targetName === 'all') {
				for (var key in project.targets) {
					if (project.targets.hasOwnProperty(key)) {
						selectedTargets.push(key);
					}
				}
			} else {
				selectedTargets.push(targetName);
			}
		} else if (Array.isArray(targetName)) {
			for (i = 0; i < targetName.length; i++) {
				selectedTargets.push(targetName[i]);
			}
		}

		// check that all targets exist
		if (!selectedTargets.length) {
			roto.error(colorize('ERROR:', 'red') + ' No matching build targets were found.\n');
			roto.notice('       Run with ' + colorize('--help', 'white') + ' to see available targets.\n');
			return false;
		}

		for (i = 0; i < selectedTargets.length; i++) {
			if (!project.targets.hasOwnProperty(selectedTargets[i])) {
				roto.error(colorize('ERROR:', 'red') + ' "' + selectedTargets[i] + '" target not found.\n');
				return false;
			}
		}

		// build selected targets
		var executeTargets = (function() {
			var i = 0;
			var iterator = function() {
				if (i === selectedTargets.length) {
					roto.endProfile();
					if (typeof callback === 'function') {
						callback();
					}
					return;
				}

				roto.executeTarget(selectedTargets[i++], options, iterator);
			};
			roto.startProfile();
			iterator();
		})();
	};

	return roto;
})();

require(__dirname + '/tasks/concat.js')(roto);
require(__dirname + '/tasks/handlebars.js')(roto);
require(__dirname + '/tasks/lint.js')(roto);
require(__dirname + '/tasks/s3.js')(roto);
require(__dirname + '/tasks/uglify.js')(roto);
require(__dirname + '/tasks/mocha.js')(roto);
require(__dirname + '/tasks/less.js')(roto);
require(__dirname + '/tasks/png.js')(roto);
require(__dirname + '/tasks/dir.js')(roto);
/**
 * roto-less.js - LESS compiler for roto
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
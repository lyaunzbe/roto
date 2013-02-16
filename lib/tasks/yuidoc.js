/**
 * yuidoc.js - YUIDocs generator
 * 
 * Copyright (c) 2013 DIY Co
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
 * @author Ben Lyaunzon <lyaunzon.b@gmail.com>
 */


var fs = require('fs');
var path = require('path');
var colorize = require('../colorize');

var Y = require('yuidocjs');


module.exports = function(roto) {

	roto.defineTask('yuidoc', function(callback, options, target, globalOptions) {
    
    // Ensure dir paths have been provided to scan.
    if(!options.path){
      console.error(colorize('Error: ', 'red') + 'No paths provided for YUIDoc to scan.');
      return callback(false);
    }
    
    // Ensure output dir has been specified.
    if(!options.outdir){
      console.error(colorize('Error: ', 'red') + 'You must specify a directory for YUIDoc output.');
      return callback(false);
    }
    
    // Generate data.json
    json = (new Y.YUIDoc(options)).run();

    options = Y.Project.mix(json, options);
    
    //Create DocBuilder
    var builder = new Y.DocBuilder(options, json);

    builder.compile(function(){
      callback();
    });

	});
};


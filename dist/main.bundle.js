(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(1));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname, process) {"use strict";
	var express = __webpack_require__(3);
	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var md5 = __webpack_require__(4);
	var path = __webpack_require__(5);
	var methodOverride = __webpack_require__(6);
	var EasyZip = __webpack_require__(7).EasyZip;
	var cors = __webpack_require__(8);
	var bodyParser = __webpack_require__(9);
	var chalk = __webpack_require__(10);
	var docs_1 = __webpack_require__(11);
	var helpers_1 = __webpack_require__(25);
	var websitePath = __dirname + "/../website/dist";
	var docsPath = process.cwd() + "/docs";
	var jsonsPath = docsPath + "/json";
	var requestListPath = jsonsPath + "/requests.json";
	var msgPath = jsonsPath + "/msg.txt";
	var contractsPath = jsonsPath + "/contracts";
	var contractsZipPath = jsonsPath + "/contracts/zip";
	var groupListPath = jsonsPath + "/groups.json";
	var groupPath = function (group) {
	    var groupFileName = group.name
	        .trim()
	        .replace(/\s/g, '')
	        .toUpperCase();
	    return jsonsPath + "/group-" + groupFileName + ".json";
	};
	exports.filePrefix = 'url';
	var localGroup = [];
	var localRequests = [];
	function recreate(msg) {
	    if (msg === void 0) { msg = ''; }
	    helpers_1.Helpers.deleteFolderRecursive(docsPath);
	    fs.mkdirSync(docsPath);
	    fs.mkdirSync(jsonsPath);
	    fs.mkdirSync(contractsPath);
	    fs.mkdirSync(contractsZipPath);
	    fs.writeFileSync(msgPath, msg, 'utf8');
	    helpers_1.Helpers.copyFolderRecursiveSync(websitePath, docsPath);
	    localGroup.length = 0;
	    localRequests.length = 0;
	    console.log(chalk.yellow("Docs folder recreated (" + docsPath + ")"));
	}
	function run(port, mainURL, clean) {
	    if (port === void 0) { port = 3333; }
	    if (mainURL === void 0) { mainURL = 'http://localhost:3000'; }
	    if (clean === void 0) { clean = false; }
	    if (mainURL) {
	        console.log(chalk.green("Base URL form angular2 app: " + mainURL));
	    }
	    if (!fs.existsSync(docsPath) || clean)
	        recreate();
	    try {
	        localRequests = JSON.parse(fs.readFileSync(requestListPath, 'utf8').toString());
	    }
	    catch (error) {
	        localRequests.length = 0;
	    }
	    var app = express();
	    app.use(methodOverride());
	    app.use(cors());
	    app.use(bodyParser.urlencoded({ extended: true }));
	    app.use(bodyParser.json());
	    app.use('/', express.static(docsPath));
	    app.get('/api/start', function (req, res) {
	        recreate();
	        console.log('started');
	        res.status(200).send();
	    });
	    app.get('/api/start/:msg', function (req, res) {
	        recreate(req.params['msg']);
	        console.log('started, with message');
	        res.status(200).send();
	    });
	    app.post('/api/downloadall', function (req, res) {
	        console.log('req.body', req.body);
	        if (req.body && req.body instanceof Array && req.body.length > 0) {
	            var zip_1 = new EasyZip();
	            var time_1 = (new Date()).getTime();
	            var p_1 = contractsZipPath + "/contracts-" + time_1;
	            fs.mkdirSync(p_1);
	            req.body.forEach(function (f) {
	                console.log('file', f);
	                fs.writeFileSync(p_1 + "/" + path.basename(f), fs.readFileSync(f, 'utf8'), 'utf8');
	            });
	            zip_1.zipFolder(p_1, function () {
	                zip_1.writeToFile(p_1 + ".zip");
	                helpers_1.Helpers.deleteFolderRecursive(p_1);
	                res.status(200).send("json/contracts/zip/contracts-" + time_1 + ".zip");
	            });
	        }
	        else {
	            res.status(400);
	        }
	    });
	    app.post('/api/save', function (req, res) {
	        var body = req.body;
	        if (!body) {
	            console.log(chalk.gray('no body in request'));
	            res.status(400).send();
	            return;
	        }
	        prepare(body, mainURL);
	        if (existInLocalRequests(body)) {
	            res.status(400).send();
	        }
	        else {
	            // requests            
	            var filename = jsonsPath + "/" + exports.filePrefix + localRequests.length + ".json";
	            body.fileName = filename;
	            fs.writeFileSync(filename, JSON.stringify(body), 'utf8');
	            localRequests.push(body);
	            // groups
	            // TODO optymalization to only read selected group
	            localGroup = docs_1.genereateDocsGroups(localRequests);
	            var names_1 = [];
	            localGroup.forEach(function (g) {
	                g.files.forEach(function (f) {
	                    var counter = 0;
	                    f.examples.forEach(function (c) {
	                        var p = contractsPath + "/" + f.name + "-" + md5(c.usecase) + counter++ + ".groovy";
	                        c.contractPath = p;
	                        fs.writeFileSync(p, c.contract, 'utf8');
	                    });
	                });
	                fs.writeFileSync(groupPath(g), JSON.stringify(g), 'utf8');
	                names_1.push(g.name);
	            });
	            fs.writeFileSync(groupListPath, JSON.stringify(names_1), 'utf8');
	            res.status(200).send(JSON.stringify(body));
	        }
	    });
	    app.listen(port, function () {
	        console.log(chalk.green("Server is working on http://localhost:" + port));
	    });
	}
	exports.run = run;
	function existInLocalRequests(body) {
	    var filterd = localRequests.filter(function (r) {
	        return (r.urlFull === body.urlFull &&
	            r.method === body.method &&
	            r.usecase === body.usecase &&
	            r.bodyRecieve === body.bodyRecieve &&
	            r.bodySend === body.bodySend &&
	            r.group === body.group);
	    });
	    return filterd.length > 0;
	}
	function prepare(body, baseUrl) {
	    if (!body.url || body.url.trim() === '') {
	        body.url = '<< undefined url >>';
	    }
	    if (!body.usecase || body.usecase.trim() === '') {
	        body.usecase = '<< undefined usecase >>';
	    }
	    if (!body.description || body.description.trim() === '') {
	        body.description = '<< undefined description >>';
	    }
	    if (!body.group || body.group.trim() === '') {
	        body.group = '<< undefined group >>';
	    }
	    if (!body.name || body.name.trim() === '') {
	        body.name = '<< undefined name >>';
	    }
	    if (!body.baseURLDocsServer || body.baseURLDocsServer.trim() === '') {
	        body.baseURLDocsServer = baseUrl;
	    }
	    // if (body.bodyRecieve && typeof body.bodyRecieve === 'string') {
	    //     try {
	    //         body.bodyRecieve = JSON.parse(body.bodyRecieve)
	    //     } catch (error) {
	    //         console.log('bad body.bodyRecieve');
	    //     }
	    // }
	    // if (body.bodySend && typeof body.bodySend === 'string') {
	    //     try {
	    //         body.bodySend = JSON.parse(body.bodySend)
	    //     } catch (error) {
	    //         console.log('bad body.bodyRecieve');
	    //     }
	    // }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "/", __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("md5");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("method-override");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("easy-zip");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("cors");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(12));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var group_files_1 = __webpack_require__(13);
	var merge_examples_1 = __webpack_require__(14);
	var contracts_1 = __webpack_require__(15);
	function genereateDocsGroups(files) {
	    console.log('files', files);
	    var groups = group_files_1.groupFiles(files);
	    groups.forEach(function (g) { return g.files = merge_examples_1.mergeExamples(g.files); });
	    groups.forEach(function (g) {
	        g.files.forEach(function (f) {
	            f.examples.forEach(function (ex) {
	                ex.contract = contracts_1.getContract(ex);
	            });
	        });
	    });
	    return groups;
	}
	exports.genereateDocsGroups = genereateDocsGroups;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	function groupFiles(files) {
	    var groups = [];
	    files.forEach(function (f) {
	        if (f.group === undefined)
	            f.group = '-- undefined --';
	        console.log(f.group);
	        var a = groups.filter(function (g) { return g.name === f.group; });
	        if (a.length === 0) {
	            groups.push({
	                name: f.group,
	                files: JSON.parse(JSON.stringify(files.filter(function (ff) { return ff.group === f.group; })))
	            });
	        }
	    });
	    return groups;
	}
	exports.groupFiles = groupFiles;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	function mergeExamples(files) {
	    var tmpFiles = [];
	    files.forEach(function (f) {
	        var a = tmpFiles.filter(function (d) { return d.url === f.url; });
	        if (a.length === 0) {
	            var docM = JSON.parse(JSON.stringify(f));
	            docM.examples = [];
	            docM.examples.push(JSON.parse(JSON.stringify(f)));
	            // TODO remove some shit from docM
	            tmpFiles.push(docM);
	        }
	        else {
	            console.log('aaa', a);
	            a[0].examples.push(JSON.parse(JSON.stringify(f)));
	        }
	    });
	    return tmpFiles;
	}
	exports.mergeExamples = mergeExamples;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(16));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var transform_1 = __webpack_require__(17);
	function getContract(ex) {
	    var c = {};
	    c.requestBody = transform_1.bodyTransform(ex.bodySend, ex.form);
	    c.responseBody = transform_1.bodyTransform(ex.bodyRecieve);
	    c.headers = transform_1.transformHeaders(ex.headers);
	    // console.log('ex.headers', ex.headers);
	    // console.log('c.headers', c.headers);
	    c.queryParams = transform_1.transformQueryPrams(ex.urlParams);
	    c.method = ex.method;
	    c.status = ex.status;
	    c.url = ex.url.replace(ex.baseURLDocsServer, '');
	    var res = contractGenerator(c);
	    // console.log('------------------------------------------------')
	    // console.log(res);
	    return res;
	}
	exports.getContract = getContract;
	function contractGenerator(contract) {
	    return "\n    package contracts\n\n    org.springframework.cloud.contract.spec.Contract.make {\n        request {\n            urlPath('" + contract.url + "') {\n                " + contract.queryParams + "                \n            }\n            method " + contract.method + "\n            " + contract.requestBody + "\n        }\n        response {\n            status: '" + contract.status + "'\n            " + contract.responseBody + "\n        }\n        " + contract.headers + "\n    }\n    \n    ";
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(18));
	__export(__webpack_require__(21));
	__export(__webpack_require__(24));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var transform_helper_1 = __webpack_require__(19);
	var consts_1 = __webpack_require__(20);
	function transformQueryPrams(queryParams) {
	    // console.log('queryParams', queryParams)
	    if (queryParams === undefined)
	        return '';
	    var rows = [];
	    if (typeof queryParams === 'string') {
	        try {
	            queryParams = JSON.parse(queryParams);
	        }
	        catch (error) {
	            console.error('string withou object in transformQueryPrams');
	            return '';
	        }
	    }
	    // console.log('queryParams after', queryParams)
	    // when instance of urlParams[]
	    if ((queryParams instanceof Array) && queryParams.length > 0) {
	        var arr = queryParams;
	        arr.forEach(function (urlp) {
	            for (var p in urlp) {
	                if (p !== 'regex') {
	                    var value = urlp[p];
	                    if (typeof value === 'object')
	                        value = JSON.stringify(value);
	                    // console.log('value after', value)
	                    var reg = (urlp.regex !== undefined) ? urlp.regex.source : transform_helper_1.regexForAllCharacters();
	                    rows.push("\t\t\tparameter '" + p + "' : \n\t\t\tvalue(" + consts_1.CONSUMER + "(matching('" + reg + "')),\n\t\t\tproducer('" + value + "')\n\t\t)\n");
	                    break;
	                }
	            }
	        });
	    }
	    else {
	        // when instance of old object
	        for (var p in queryParams) {
	            var value = queryParams[p];
	            if (typeof value === 'object')
	                value = JSON.stringify(value);
	            rows.push("\t\t\tparameter '" + p + "' : \n\t\t\tvalue(" + consts_1.CONSUMER + "(matching('" + transform_helper_1.regexForAllCharacters() + "')),\n\t\t\tproducer('" + value + "')\n\t\t)\n");
	        }
	    }
	    if (rows.length === 0)
	        return "";
	    if (rows.length === 1)
	        return "queryParameters {\n" + rows[0] + "}";
	    if (rows.length === 2)
	        return "queryParameters {\n" + rows[0] + "\n" + rows[1] + "}";
	    var res = rows.join('');
	    return "queryParameters {\n" + res + "\n\t\t}";
	}
	exports.transformQueryPrams = transformQueryPrams;


/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	function clean(s) {
	    return s.trim().replace(/\s/g, '');
	}
	exports.clean = clean;
	function change(s) {
	    var t = s.trim().replace(/ /g, '$$$');
	    var res = t.replace(/(\t|\n)/g, '');
	    console.log('RES', res);
	    return res.replace(/\$/g, ' ');
	}
	exports.change = change;
	function regexFromLength(length) {
	    return ".{" + length + "}";
	}
	exports.regexFromLength = regexFromLength;
	function regexForAllCharacters() {
	    return ".+";
	}
	exports.regexForAllCharacters = regexForAllCharacters;


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	exports.WITHOUT_FORM_LENGTH_INDICATOR = 255;
	exports.PRODUCER = 'producer';
	exports.CONSUMER = 'consumer';


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var path_object_1 = __webpack_require__(22);
	var transform_helper_1 = __webpack_require__(19);
	var consts_1 = __webpack_require__(20);
	/**
	 * Transform object to groovy syntax
	 *
	 * @export
	 * @param {Object} data
	 * @param {FormInputBind[]} bindings
	 * @returns {string}
	 */
	function bodyTransform(data, bindings) {
	    console.log('bindings', bindings);
	    // console.log('data', data);
	    try {
	        data = JSON.parse(data);
	    }
	    catch (error) {
	        console.error('string withou object in bodyTransform');
	        return '';
	    }
	    if (data instanceof Array) {
	        var arr = data;
	        if (arr.length === 0)
	            return "[[ ]]";
	        data = arr[0];
	    }
	    if (bindings && bindings.length > 0) {
	        bindings.forEach(function (binding) {
	            binding.temp = path_object_1.PathObject.get(binding.path, data);
	        });
	    }
	    prepareSimpleTypes(data);
	    if (bindings && bindings.length > 0) {
	        bindings.forEach(function (binding) {
	            if (binding.length !== null) {
	                var path = binding.path;
	                var consumer = binding.temp;
	                var consumerString = consumer ? consts_1.CONSUMER + "('" + consumer + "')," : '';
	                var value = "\t\t\t\t" + path_object_1.PathObject.fieldName(path) + ":  \n                    \t\t\t$(\n                        \t\t\t\t" + consumerString + " " + consts_1.PRODUCER + "(regex('" + transform_helper_1.regexFromLength(binding.length) + "')) \n                    \t\t\t)\n";
	                path_object_1.PathObject.set(path, value, data);
	            }
	        });
	    }
	    prepareArraysAndObjects(data);
	    var s = [];
	    for (var p in data) {
	        s.push(data[p]);
	    }
	    return 'body(\n\t\t' + s.join() + '\n\t\t)\n';
	}
	exports.bodyTransform = bodyTransform;
	/**
	 * Check if object contains object or array
	 *
	 * @export
	 * @param {Object} data
	 * @returns {boolean}
	 */
	function checkIfContainsArrayOrObjecct(data) {
	    for (var p in data) {
	        if (data[p] instanceof Object)
	            return true;
	    }
	    return false;
	}
	exports.checkIfContainsArrayOrObjecct = checkIfContainsArrayOrObjecct;
	/**
	 * We assume that all simple field are alread with groovy syntax
	 *
	 * @param {Object} data
	 * @returns
	 */
	function bodySimpelObjet(data) {
	    var s = [];
	    for (var p in data) {
	        var v = data[p];
	        s.push(v);
	    }
	    if (s.length === 0)
	        return "[]";
	    if (s.length === 1)
	        return s[0];
	    if (s.length === 2)
	        return s[0] + ",\n" + s[1];
	    var res = s.join(',');
	    return res;
	}
	exports.bodySimpelObjet = bodySimpelObjet;
	/**
	 * Change array/object in object to groovy syntax
	 *
	 * @export
	 * @param {Object} data
	 */
	function prepareArraysAndObjects(data) {
	    for (var p in data) {
	        var v = data[p];
	        if (v instanceof Array) {
	            var arr = v;
	            if (arr.length > 0) {
	                var first = arr[0];
	                if (checkIfContainsArrayOrObjecct(first)) {
	                    prepareArraysAndObjects(first);
	                }
	                else
	                    data[p] = p + ": [[\n\n                    \t\t" + bodySimpelObjet(first) + "\n\n                ]]\n";
	            }
	            else {
	                data[p] = p + ": [[]]";
	            }
	        }
	        else if (v instanceof Object) {
	            if (checkIfContainsArrayOrObjecct(v))
	                prepareArraysAndObjects(v);
	            else
	                data[p] = p + ": []";
	        }
	    }
	}
	exports.prepareArraysAndObjects = prepareArraysAndObjects;
	/**
	 * Change simple types values in object for groovy syntax
	 *
	 * @export
	 * @param {Object} data
	 */
	function prepareSimpleTypes(data) {
	    if (typeof data === 'string') {
	        try {
	            data = JSON.parse(data);
	        }
	        catch (error) {
	            console.log('canno prepareSimpleTypes ');
	            return;
	        }
	    }
	    for (var p in data) {
	        var v = data[p];
	        if (v instanceof Array) {
	            var arr = v;
	            if (arr.length > 0) {
	                data[p] = arr.slice(0, 1);
	                prepareSimpleTypes(data[p][0]);
	            }
	        }
	        else if (v instanceof Object) {
	            prepareSimpleTypes(v);
	        }
	        else {
	            data[p] = "\n\t\t" + p + ": $(\n                \t" + consts_1.CONSUMER + "('" + data[p] + "'),\n                \t" + consts_1.PRODUCER + "(regex('" + transform_helper_1.regexForAllCharacters() + "'))\n            \t) ";
	        }
	    }
	    return data;
	}
	exports.prepareSimpleTypes = prepareSimpleTypes;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(23);
	var PathObject = (function () {
	    function PathObject() {
	    }
	    PathObject.get = function (path, obj) {
	        return _.get(obj, path);
	    };
	    PathObject.set = function (path, value, data) {
	        return _.set(data, path, value);
	    };
	    PathObject.parent = function (path) {
	        var d = path.split('.');
	        if (d.length === 1 && d[0] === path)
	            return undefined;
	        d.pop();
	        var res = d.join('.');
	        return res;
	    };
	    /**
	     * field name
	     *
	     * @static
	     * @param {string} path
	     *
	     * @memberOf PathObject
	     */
	    PathObject.fieldName = function (path) {
	        var res = path.split('.');
	        return res[res.length - 1];
	    };
	    return PathObject;
	}());
	exports.PathObject = PathObject;


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	function transformHeaders(headers) {
	    if (!headers)
	        return '';
	    var rows = [];
	    for (var p in headers) {
	        var value = headers[p];
	        rows.push("\t\theader '" + p + "' : '" + value + "'");
	    }
	    if (rows.length === 0)
	        return "";
	    if (rows.length === 1)
	        return "headers {\n" + rows[0] + "}";
	    if (rows.length === 2)
	        return "headers {\n" + rows[0] + ",\n" + rows[1] + "\n\t\t}";
	    var res = rows.join(',\n');
	    return "headers {\n" + res + "\n\t\t}";
	}
	exports.transformHeaders = transformHeaders;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var path = __webpack_require__(5);
	var Helpers = (function () {
	    function Helpers() {
	    }
	    Helpers.deleteFolderRecursive = function (path) {
	        if (fs.existsSync(path)) {
	            fs.readdirSync(path).forEach(function (file, index) {
	                var curPath = path + "/" + file;
	                if (fs.lstatSync(curPath).isDirectory()) {
	                    Helpers.deleteFolderRecursive(curPath);
	                }
	                else {
	                    fs.unlinkSync(curPath);
	                }
	            });
	            fs.rmdirSync(path);
	        }
	    };
	    ;
	    Helpers.copyFileSync = function (source, target) {
	        var targetFile = target;
	        //if target is a directory a new file with the same name will be created
	        if (fs.existsSync(target)) {
	            if (fs.lstatSync(target).isDirectory()) {
	                targetFile = path.join(target, path.basename(source));
	            }
	        }
	        fs.writeFileSync(targetFile, fs.readFileSync(source));
	    };
	    Helpers.copyFolderRecursiveSync = function (source, target) {
	        var files = [];
	        //check if folder needs to be created or integrated
	        var targetFolder = target; // path.join(target, path.basename(source));
	        if (!fs.existsSync(targetFolder)) {
	            fs.mkdirSync(targetFolder);
	        }
	        //copy
	        if (fs.lstatSync(source).isDirectory()) {
	            files = fs.readdirSync(source);
	            files.forEach(function (file) {
	                var curSource = path.join(source, file);
	                if (fs.lstatSync(curSource).isDirectory()) {
	                    Helpers.copyFolderRecursiveSync(curSource, targetFolder);
	                }
	                else {
	                    Helpers.copyFileSync(curSource, targetFolder);
	                }
	            });
	        }
	    };
	    return Helpers;
	}());
	exports.Helpers = Helpers;


/***/ }
/******/ ])));
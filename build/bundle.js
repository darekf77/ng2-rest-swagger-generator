require("source-map-support").install();
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";
	var express = __webpack_require__(1);
	var fs = __webpack_require__(2);
	var md5 = __webpack_require__(3);
	var path = __webpack_require__(4);
	var methodOverride = __webpack_require__(5);
	var EasyZip = __webpack_require__(6).EasyZip;
	var cors = __webpack_require__(7);
	var bodyParser = __webpack_require__(8);
	var chalk = __webpack_require__(9);
	var docs_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./docs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var Helpers = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./helpers\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
	    Helpers.deleteFolderRecursive(docsPath);
	    fs.mkdirSync(docsPath);
	    fs.mkdirSync(jsonsPath);
	    fs.mkdirSync(contractsPath);
	    fs.mkdirSync(contractsZipPath);
	    fs.writeFileSync(msgPath, msg, 'utf8');
	    Helpers.copyFolderRecursiveSync(websitePath, docsPath);
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
	                Helpers.deleteFolderRecursive(p_1);
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("md5");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("method-override");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("easy-zip");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("cors");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ }
/******/ ])));
//# sourceMappingURL=bundle.js.map
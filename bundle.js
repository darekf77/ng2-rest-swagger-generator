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
	var fs = __webpack_require__(1);
	var _ = __webpack_require__(2);
	var request = __webpack_require__(3);
	var templates_1 = __webpack_require__(4);
	var helpers_1 = __webpack_require__(12);
	var apis = [];
	var APIpath = process.cwd() + "/api";
	var mainIndexPath = APIpath + "/index.ts";
	var modulePath = APIpath + "/module.ts";
	var servicesFolderPath = APIpath + "/services";
	var servicesFolderPathIndex = servicesFolderPath + "/index.ts";
	var serviceGroup = function (group) {
	    return servicesFolderPath + "/" + _.camelCase(group);
	};
	var serviceGroupIndex = function (group) {
	    return servicesFolderPath + "/" + _.camelCase(group) + "/index.ts";
	};
	var serviceTsPath = function (group, name) {
	    return servicesFolderPath + "/" + _.camelCase(group) + "/" + name + ".ts";
	};
	function run(pathes, links) {
	    if (links.length > 0) {
	        var link_1 = links.shift();
	        request({
	            method: "GET",
	            "rejectUnauthorized": false,
	            "url": link_1,
	            "headers": { "Content-Type": "application/json" }
	        }, function (error, response, body) {
	            body = JSON.parse(body);
	            // console.log(error)
	            // console.log(typeof body)
	            if (!error && typeof body === "object") {
	                apis.push(body);
	            }
	            else {
	                console.log('Bad link: ' + link_1);
	            }
	            run(pathes, links);
	        });
	        return;
	    }
	    pathes = pathes.map(function (p) {
	        if (p.charAt(0) === '/')
	            p = p.slice(1, p.length);
	        return process.cwd() + "/" + p;
	    });
	    pathes.forEach(function (p) {
	        apis.push(JSON.parse(fs.readFileSync(p, 'utf8')));
	    });
	    // api forlder
	    if (fs.existsSync(APIpath))
	        helpers_1.Helpers.deleteFolderRecursive(APIpath);
	    fs.mkdirSync(APIpath);
	    // api/index.ts
	    fs.writeFileSync(mainIndexPath, templates_1.mainIndex(), 'utf8');
	    //api/services
	    fs.mkdirSync(servicesFolderPath);
	    // api/services/<service folders>
	    // api/services/<service folders>/index.ts
	    var servicesNameCamelCase = [];
	    var exportGroups = [];
	    apis.forEach(function (swg) {
	        var base = swg.basePath.replace('/', '');
	        exportGroups.push(base);
	        fs.mkdirSync(serviceGroup(base));
	        var servicesNames = [];
	        swg.tags.forEach(function (tag) {
	            servicesNames.push(tag.name);
	            servicesNameCamelCase.push(base + helpers_1.Helpers.upperFirst(_.camelCase(tag.name)));
	            var service = templates_1.serviceTemplate(base + helpers_1.Helpers.upperFirst(tag.name), swg);
	            fs.writeFileSync(serviceTsPath(base, tag.name), service, 'utf8');
	        });
	        fs.writeFileSync(serviceGroupIndex(base), templates_1.indexExportsTmpl(servicesNames), 'utf8');
	    });
	    // api/services/index.ts
	    fs.writeFileSync(servicesFolderPathIndex, templates_1.indexExportsTmpl(exportGroups), 'utf8');
	    // api/module.ts
	    fs.writeFileSync(modulePath, templates_1.templateModule(servicesNameCamelCase), 'utf8');
	    console.log('Swagger files quantity: ', apis.length);
	}
	exports.run = run;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(5));
	__export(__webpack_require__(6));
	__export(__webpack_require__(7));
	__export(__webpack_require__(9));


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function indexExportsTmpl(fileNames) {
	    return fileNames.map(function (name) {
	        return "export * from './" + name + "';";
	    }).join('\n');
	}
	exports.indexExportsTmpl = indexExportsTmpl;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	function mainIndex() {
	    return "export * from './module';\nexport * from './services';\n    ";
	}
	exports.mainIndex = mainIndex;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ts_import_from_folder_1 = __webpack_require__(8);
	function templateModule(serviceNames) {
	    var services = serviceNames.map(function (name) {
	        return name.replace(name.charAt(0), name.charAt(0).toUpperCase()) + 'Service' + '\n';
	    }).join();
	    var imports = '\n' + ts_import_from_folder_1.importServicesFromFolder(serviceNames, 'services', "Service") + '\n';
	    return "import { NgModule } from '@angular/core';\n\n    " + imports + "\n\n@NgModule({\n    imports: [],\n    exports: [],\n    declarations: [],\n    providers: [\n        " + services + "\n    ],\n})\nexport class Ng2RestGenModule { }\n";
	}
	exports.templateModule = templateModule;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	function importServicesFromFolder(servicesNames, folderName, surfix) {
	    return servicesNames.map(function (name) {
	        return "import {" + name.replace(name.charAt(0), name.charAt(0).toUpperCase()) + surfix + "} from './" + folderName + "'" + ';\n';
	    }).join('');
	}
	exports.importServicesFromFolder = importServicesFromFolder;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(10));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(2);
	var ng2_rest_obj_1 = __webpack_require__(11);
	function findModelByTag(tag, swg) {
	    var o = swg.paths;
	    console.log('o', o);
	    for (var url in o) {
	        console.log('url', url);
	        for (var method in o[url]) {
	            console.log('method', method);
	            var m = o[url][method];
	            console.log('m', m);
	            if (m.tags.filter(function (t) { return t === tag; }).length > 0) {
	                return url; //.replace(/{/g, ':').replace(/}/g, "");
	            }
	        }
	    }
	}
	function findByTag(tag, swg) {
	    var res = {
	        endpointType: 'string',
	        singleModelType: '{}',
	        queryModelType: 'any[]',
	        endpointSelected: 'onet.pl',
	        model: 'users/:id',
	        restPramsType: '{}',
	        queryPramType: '{}'
	    };
	    res.model = findModelByTag(tag, swg);
	    return res;
	}
	function serviceTemplate(model, swg) {
	    var instances = [];
	    var pathes = swg.paths;
	    var a = findByTag(model, swg);
	    var d = ng2_rest_obj_1.n2RestObject(a);
	    return "import { Injectable } from '@angular/core';\nimport { SimpleResource, Mock, Model } from 'ng2-rest/ng2-rest';\n\n@Injectable()\nexport class " + _.camelCase(model).replace(model.charAt(0), model.charAt(0).toUpperCase()) + "Service  {\n    private instance = new  SimpleResource" + d + ";\n    model: Model< " + a.singleModelType + " , " + a.queryModelType + " , " + a.restPramsType + " , " + a.queryPramType + " >;\n    mock: Mock< " + a.singleModelType + "  >;\n\n    constructor() {\n        this.mock = this.instance.mock;\n        this.model = this.instance.model;\n    }\n}";
	}
	exports.serviceTemplate = serviceTemplate;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	function n2RestObject(instance) {
	    return ("<\n    " + instance.endpointType + ",\n    " + instance.singleModelType + ",\n    " + instance.queryModelType + ",\n    " + instance.restPramsType + ",\n    " + instance.queryPramType + "\n    >( '" + instance.endpointSelected + "' ,  '" + instance.model + "' );") + '\n';
	}
	exports.n2RestObject = n2RestObject;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(1);
	var path = __webpack_require__(13);
	var Helpers = (function () {
	    function Helpers() {
	    }
	    Helpers.upperFirst = function (s) {
	        return s.replace(s.charAt(0), s.charAt(0).toUpperCase());
	    };
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


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ }
/******/ ])));
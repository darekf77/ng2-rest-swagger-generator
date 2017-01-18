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
	var helpers_1 = __webpack_require__(11);
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
	function run(pathes, links, isHttpsEnable) {
	    if (isHttpsEnable === void 0) { isHttpsEnable = false; }
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
	        swg.host = (isHttpsEnable ? 'https' : 'http') + ("://" + swg.host.replace(/:[0-9]*/g, ''));
	        var base = swg.basePath.replace('/', '');
	        exportGroups.push(base);
	        fs.mkdirSync(serviceGroup(base));
	        var servicesNames = [];
	        swg.tags.forEach(function (tag) {
	            servicesNames.push(tag.name);
	            servicesNameCamelCase.push(base + helpers_1.Helpers.upperFirst(_.camelCase(tag.name)));
	            var service = templates_1.serviceTemplate(base, tag.name, swg);
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
	var helpers_1 = __webpack_require__(11);
	var get_pathes_by_tag_1 = __webpack_require__(13);
	var get_pathes_methods_1 = __webpack_require__(15);
	function serviceTemplate(group, model, swg) {
	    return "import { Injectable } from '@angular/core';\nimport { SimpleResource, Mock, Model } from 'ng2-rest/ng2-rest';\n\n@Injectable()\nexport class " + helpers_1.Helpers.upperFirst(group) + _.camelCase(model).replace(model.charAt(0), model.charAt(0).toUpperCase()) + "Service  {\n\n    " + get_pathes_by_tag_1.getPathesByTag(model, swg) + "\n    " + get_pathes_methods_1.getPathesMethods(model, swg) + "\n\n    constructor() {\n        \n    }\n}";
	}
	exports.serviceTemplate = serviceTemplate;
	// function findModelByTag(tag: string, swg: SwaggerModel) {
	//     let o: Object = swg.paths;
	//     // console.log('tag', tag)
	//     // console.log('o', o)
	//     let urls: string[] = [];
	//     for (let url in o) {
	//         // console.log('url', url)
	//         for (let method in o[url]) {
	//             // console.log('method', method)
	//             var m: Method = o[url][method];
	//             // console.log('m', m)
	//             if (m.tags.filter(t => t === tag).length > 0) {
	//                 // console.log('ok tag', tag)
	//                 urls.push(url.replace(/{/g, ':').replace(/}/g, ""));
	//             }
	//         }
	//     }
	//     urls = urls.sort((a, b) => b.length - a.length);
	//     // console.log('url', urls)
	//     let res = urls.shift();
	//     // console.log('res', res);
	//     return res;
	// }
	// function findByTag(tag: string, swg: SwaggerModel): ng2restInstanceTemplate {
	//     let res: ng2restInstanceTemplate = <ng2restInstanceTemplate>{
	//         endpointType: 'string',
	//         singleModelType: '{}',
	//         queryModelType: 'any[]',
	//         endpointSelected: 'onet.pl',
	//         model: 'users/:id',
	//         restPramsType: '{}',
	//         queryPramType: '{}'
	//     };
	//     res.model = findModelByTag(tag, swg);
	//     return res;
	// } 


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(1);
	var path = __webpack_require__(12);
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
/* 12 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(2);
	var clean_path_1 = __webpack_require__(14);
	function getPathesByTag(tag, swg) {
	    var res = [];
	    var pathes = {};
	    _.forOwn(swg.paths, function (v, k) {
	        _.forOwn(v, function (v2, k2) {
	            if (v2.tags.filter(function (f) { return f === tag; }).length > 0) {
	                pathes[k] = '';
	            }
	        });
	    });
	    var pathResources = [];
	    _.forOwn(pathes, function (v, p) {
	        pathResources.push({
	            clean_path: clean_path_1.cleanPath(p),
	            model: clean_path_1.cleanPathModel(p),
	            endpoint: swg.basePath,
	            singleModelType: 'any',
	            queryParamsType: 'any',
	            pathParamsType: 'any'
	        });
	    });
	    pathResources.forEach(function (p) {
	        res.push(p.clean_path + ": new SimpleResource< string, " + p.singleModelType + " , any, " + p.pathParamsType + " , " + p.queryParamsType + " >( '" + swg.host + p.endpoint + "' , '" + p.model + "' )");
	    });
	    // cleanPath()
	    // res = 'aa';
	    return "private pathes = {\n" + res.join(',\n') + "\n};";
	}
	exports.getPathesByTag = getPathesByTag;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * To generate get/books/{id} => get_books__id_
	 */
	function cleanPath(path) {
	    return path.replace(/{/g, "_").replace(/}/g, "_").replace(/\//g, "_").replace(/-/g, "_");
	}
	exports.cleanPath = cleanPath;
	function cleanPathModel(pathModel) {
	    return pathModel.replace(/\/{/g, '/:').replace(/\//g, '');
	}
	exports.cleanPathModel = cleanPathModel;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var clean_path_1 = __webpack_require__(14);
	var get_obj_def_swagger_1 = __webpack_require__(16);
	var type_swagger_to_js_1 = __webpack_require__(17);
	function getServicesMethod(tag, swg) {
	    var methods = [];
	    for (var urlpath in swg.paths) {
	        var _loop_1 = function(methodhttp) {
	            var m = swg.paths[urlpath][methodhttp];
	            if (m.tags.filter(function (t) { return t === tag; }).length === 1) {
	                var sm_1 = {};
	                sm_1.summary = m.summary;
	                sm_1.method = methodhttp;
	                sm_1.path_cleand = clean_path_1.cleanPath(urlpath);
	                // console.log('sm.path_cleand', sm.path_cleand)
	                sm_1.params = {};
	                sm_1.params.query = [];
	                sm_1.params.path = [];
	                sm_1.params.body = [];
	                if (m.parameters)
	                    m.parameters.forEach(function (param) {
	                        if (param.in === 'body') {
	                            sm_1.params.body.push({
	                                name: param.name,
	                                type: "{" + get_obj_def_swagger_1.getObjectDefinition(param.schema.$ref, swg) + "}",
	                                required: param.required
	                            });
	                        }
	                        else {
	                            sm_1.params[param.in].push({
	                                name: param.name,
	                                type: type_swagger_to_js_1.swaggerTypeToJS(param.type),
	                                required: param.required
	                            });
	                        }
	                    });
	                methods.push(sm_1);
	            }
	        };
	        for (var methodhttp in swg.paths[urlpath]) {
	            _loop_1(methodhttp);
	        }
	    }
	    return methods;
	}
	function getPathesMethods(tag, swg) {
	    var res = '';
	    var methods = getServicesMethod(tag, swg);
	    // console.log(methods)
	    methods.forEach(function (m) {
	        var neededParams = {
	            path: (m.params && m.params.path && m.params.path.length > 0),
	            query: (m.params && m.params.query && m.params.query.length > 0),
	            body: (m.params && m.params.body && m.params.body.length > 0)
	        };
	        // console.log(m)
	        var paramsPath = neededParams.path ? m.params.path.map(function (p) { return p.joined = p.name + ':' + p.type; }).join(',') : '';
	        var paramsQuery = neededParams.query ? m.params.query.map(function (p) { return p.joined = p.name + ':' + p.type; }).join(',') : '';
	        var paramsBody = neededParams.body ? m.params.body.map(function (p) { return p.joined = p.name + ':' + p.type; }).join(',') : '';
	        // console.log(paramsPath)
	        // console.log(paramsQuery)
	        // console.log(paramsBody)
	        var paramsPathNames = "{" + (neededParams.path ? m.params.path.map(function (p) { return p.joined = p.name; }).filter(function (d) { return d; }).join(',') : '') + '}';
	        var paramsQueryNames = "{" + (neededParams.query ? m.params.query.map(function (p) { return p.joined = p.name; }).filter(function (d) { return d; }).join(',') : '') + '}';
	        var paramsBodyNames = "{" + (neededParams.body ? m.params.body.map(function (p) { return p.joined = p.name; }).filter(function (d) { return d; }).join(',') : '') + '}';
	        // console.log(paramsPathNames)
	        // console.log(paramsQueryNames)
	        // console.log(paramsBodyNames)
	        var method = m.method;
	        if (m.method === 'post')
	            method = 'save';
	        if (m.method === 'put')
	            method = 'update';
	        if (m.method === 'delete')
	            method = 'remove';
	        var params = [paramsPath, paramsQuery, paramsBody].filter(function (d) { return d && d !== '{}'; }).join(',');
	        var paramsName = [paramsBodyNames, paramsQueryNames].filter(function (d) { return d && d !== '{}'; }).join(',');
	        // console.log('method', method)
	        res += ('public ' + m.summary + '= (' + params + ') => this.pathes.'
	            + m.path_cleand + (".model(" + paramsPathNames + ")." + method + "(" + paramsName + ");") + "\n");
	        // console.log(res)
	    });
	    return res;
	}
	exports.getPathesMethods = getPathesMethods;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(2);
	var type_swagger_to_js_1 = __webpack_require__(17);
	function getObjectDefinition(ref, swg) {
	    if (!ref) {
	        console.log('Bad json $ref inside swagger');
	        return '';
	    }
	    var res = '';
	    ref = ref.replace('#/', '').replace(/\//g, '.');
	    // console.log('ref:', ref)
	    var obj = _.get(swg, ref);
	    // console.log('obj:', obj)
	    // console.log('swg:', swg)
	    _.forOwn(obj.properties, function (v, k) {
	        if (v.schema && v.schema.$ref && typeof v.schema.$ref === "string") {
	            res += "{" + getObjectDefinition(v.schema.$ref, swg) + "};\n";
	        }
	        else {
	            var isRequired = (obj.required && obj.required instanceof Array && obj.required.filter(function (o) { return o === k; }).length > 0);
	            var type = (v.enum && v.enum instanceof Array && v.enum.length > 0)
	                ? v.enum.map(function (e) { return '"' + e + '"'; }).join('|') : type_swagger_to_js_1.swaggerTypeToJS(v.type);
	            res += k + (!isRequired ? '?' : "") + ":" + type + ";\n";
	        }
	    });
	    return res;
	}
	exports.getObjectDefinition = getObjectDefinition;


/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	exports.DataTypesNumber = ["int32", "int64", "double", "float"];
	exports.DataTyesString = ["string", "byte", "binary", "data", "data-time", "password"];
	exports.DataTyesBoolean = ["boolean"];
	// export function swaggerTypeToJS(type: string) {
	//     if (DataTypesNumber.filter(d => d === type).length > 0) return 'number';
	//     if (DataTyesString.filter(d => d === type).length > 0) return 'string';
	// }
	function swaggerTypeToJS(type) {
	    return (type === 'integer') ? 'number'
	        : (type === 'array') ? 'any[]'
	            : (type === 'file') ? 'any' : type;
	}
	exports.swaggerTypeToJS = swaggerTypeToJS;


/***/ }
/******/ ])));
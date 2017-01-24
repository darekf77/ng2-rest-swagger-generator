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
	var exec = __webpack_require__(2);
	var tsfmt = __webpack_require__(3);
	var _ = __webpack_require__(4);
	var request = __webpack_require__(5);
	var JSON5 = __webpack_require__(6);
	var templates_1 = __webpack_require__(7);
	var helpers_1 = __webpack_require__(14);
	var apis = [];
	var APIpath = process.cwd() + "/api";
	var mainIndexPath = APIpath + "/index.ts";
	var modulePath = APIpath + "/module.ts";
	var servicesFolderPath = APIpath + "/services";
	var servicesFolderPathIndex = servicesFolderPath + "/index.ts";
	var formatterFiles = [];
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
	            body = JSON5.parse(body);
	            // console.log(error)
	            // console.log(typeof body)
	            if (!error && typeof body === "object") {
	                apis.push(body);
	            }
	            else {
	                console.log('Bad link: ' + link_1);
	            }
	            run(pathes, links, isHttpsEnable);
	        });
	        return;
	    }
	    pathes = pathes.map(function (p) {
	        if (p.charAt(0) === '/')
	            p = p.slice(1, p.length);
	        return process.cwd() + "/" + p;
	    });
	    pathes.forEach(function (p) {
	        apis.push(JSON5.parse(fs.readFileSync(p, 'utf8')));
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
	            formatterFiles.push(serviceTsPath(base, tag.name));
	            fs.writeFileSync(serviceTsPath(base, tag.name), service, 'utf8');
	        });
	        var resMapString = "\"" + swg.host + swg.basePath + "\"";
	        var indexJSONcontent = ("import { Resource } from \"ng2-rest/ng2-rest\";\nResource.map(" + resMapString + "," + resMapString + ");\n\n") + templates_1.indexExportsTmpl(servicesNames);
	        fs.writeFileSync(serviceGroupIndex(base), indexJSONcontent, 'utf8');
	    });
	    // api/services/index.ts
	    fs.writeFileSync(servicesFolderPathIndex, templates_1.indexExportsTmpl(exportGroups), 'utf8');
	    // api/module.ts
	    formatterFiles.push(modulePath);
	    fs.writeFileSync(modulePath, templates_1.templateModule(servicesNameCamelCase), 'utf8');
	    console.log('Swagger files quantity: ', apis.length);
	    tsfmt.processFiles(formatterFiles, {
	        // dryRun?: boolean;
	        // verbose?: boolean;
	        // baseDir?: string;
	        replace: true,
	        verify: false,
	        tsconfig: true,
	        tslint: true,
	        editorconfig: false,
	        tsfmt: true
	    }).then(function () { });
	    // let command = `${__dirname}/node_modules/typescript-formatter/bin/tsfmt --no-tsconfig  -r --baseDir ${APIpath}`;
	    // console.log('command', command);
	    // exec(command,
	    //     (error, stdout, stderr) => {
	    //         console.log('stdout: ' + stdout);
	    //         console.log('stderr: ' + stderr);
	    //         if (error !== null) {
	    //             console.log('exec error: ' + error);
	    //         }
	    //     });
	}
	exports.run = run;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("exec");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("typescript-formatter");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("json5");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(8));
	__export(__webpack_require__(9));
	__export(__webpack_require__(10));
	__export(__webpack_require__(12));


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	function indexExportsTmpl(fileNames) {
	    return fileNames.map(function (name) {
	        return "export * from './" + name + "';";
	    }).join('\n');
	}
	exports.indexExportsTmpl = indexExportsTmpl;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	function mainIndex() {
	    return "export * from './module';\nexport * from './services';\n    ";
	}
	exports.mainIndex = mainIndex;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ts_import_from_folder_1 = __webpack_require__(11);
	function templateModule(serviceNames) {
	    var services = serviceNames.map(function (name) {
	        return name.replace(name.charAt(0), name.charAt(0).toUpperCase()) + 'Service' + '\n';
	    }).join();
	    var imports = '\n' + ts_import_from_folder_1.importServicesFromFolder(serviceNames, 'services', "Service") + '\n';
	    return "import { NgModule } from '@angular/core';\n\n    " + imports + "\n\n@NgModule({\n    imports: [],\n    exports: [],\n    declarations: [],\n    providers: [\n        " + services + "\n    ],\n})\nexport class Ng2RestGenModule { }\n";
	}
	exports.templateModule = templateModule;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	function importServicesFromFolder(servicesNames, folderName, surfix) {
	    return servicesNames.map(function (name) {
	        return "import {" + name.replace(name.charAt(0), name.charAt(0).toUpperCase()) + surfix + "} from './" + folderName + "'" + ';\n';
	    }).join('');
	}
	exports.importServicesFromFolder = importServicesFromFolder;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(13));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(4);
	var helpers_1 = __webpack_require__(14);
	var angular_1 = __webpack_require__(16);
	function serviceTemplate(group, model, swg) {
	    return "import { Injectable } from '@angular/core';\nimport { SimpleResource, Mock, Model } from 'ng2-rest/ng2-rest';\n\n@Injectable()\nexport class " + helpers_1.Helpers.upperFirst(group) + _.camelCase(model).replace(model.charAt(0), model.charAt(0).toUpperCase()) + "Service  {\n\n    " + angular_1.getAngularPrivatePathesByTag(model, swg) + "\n\n    // public methods\n    " + angular_1.getAngularServicesMethods(model, swg) + "\n\n    public static unsubscribe() {\n        SimpleResource.UnsubscribeEvents();\n    }\n\n    constructor() {\n\n    }\n}";
	}
	exports.serviceTemplate = serviceTemplate;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(1);
	var path = __webpack_require__(15);
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
/* 15 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(17));
	__export(__webpack_require__(19));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(4);
	var swagger_helpers_1 = __webpack_require__(18);
	/**
	 * private pathes = {
	 *      get_all_companies: new SimpleResource<
	 *          string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model),
	 *      get_byid_companies: new SimpleResource<
	 *          string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model)
	 * }
	 */
	function getAngularPrivatePathesByTag(tag, swg) {
	    var res = [];
	    var pathes = {};
	    _.forOwn(swg.paths, function (v, k) {
	        _.forOwn(v, function (v2, k2) {
	            if (v2.tags.filter(function (f) { return f === tag; }).length > 0) {
	                var resp = v2.responses['200'].schema;
	                // TODO response handling 
	                // console.log('resp',resp);
	                if (pathes[k] === undefined)
	                    pathes[k] = {};
	                var type = getResponseType(resp, swg);
	                if (type.length > 3 && type.charAt(type.length - 1) === ']' && type.charAt(type.length - 2) === '['
	                    && !pathes[k]['array']) {
	                    pathes[k]['array'] = type;
	                }
	                else if (k2 !== 'delete' && !pathes[k]['single']) {
	                    pathes[k]['single'] = type;
	                }
	            }
	        });
	    });
	    var pathResources = [];
	    _.forOwn(pathes, function (v, p) {
	        // console.log(`${p} - ${JSON.stringify(v)}`);
	        pathResources.push({
	            clean_path: swagger_helpers_1.SwaggerHelpers.cleanPath(p),
	            model: swagger_helpers_1.SwaggerHelpers.cleanPathModel(p),
	            endpoint: swg.basePath,
	            singleModelType: !v['single'] ? 'any' : v['single'],
	            multipleModelType: !v['array'] ? 'any' : v['array'],
	            queryParamsType: 'any',
	            pathParamsType: 'any'
	        });
	    });
	    pathResources.forEach(function (p) {
	        res.push(p.clean_path + ": new SimpleResource<\n string,\n" + p.singleModelType + ",\n" + p.multipleModelType + ",\n" + p.pathParamsType + ",\n" + p.queryParamsType + "\n>( '" + swg.host + p.endpoint + "' , '" + p.model + "' )");
	    });
	    return "private pathes = {\n" + res.join(',\n') + "\n};";
	}
	exports.getAngularPrivatePathesByTag = getAngularPrivatePathesByTag;
	/*
	 schema": {
	    "type": "array",
	    "items": {
	        "$ref": "#/definitions/CompanyDTO"
	    }
	}

	"schema": {
	    "$ref": "#/definitions/CompanyDTO"
	}
	 */
	function getResponseType(o, swg) {
	    var res = '{} | any';
	    if (o && o.$ref && typeof o.$ref === 'string' && o.$ref.trim() !== '') {
	        res = "{" + swagger_helpers_1.SwaggerHelpers.getObjectDefinition(o.$ref, swg) + "}";
	    }
	    else if (o && o.type === 'array' && o.items && o.items.$ref &&
	        typeof o.items.$ref === 'string' && o.items.$ref.trim() !== '') {
	        res = "{" + swagger_helpers_1.SwaggerHelpers.getObjectDefinition(o.items.$ref, swg) + "}[]";
	    }
	    return res;
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(4);
	var SwaggerHelpers;
	(function (SwaggerHelpers) {
	    /**
	     * To generate get/books/{id} => get_books__id_
	     */
	    function cleanPath(path) {
	        return path.replace(/{/g, "_").replace(/}/g, "_").replace(/\//g, "_").replace(/-/g, "_");
	    }
	    SwaggerHelpers.cleanPath = cleanPath;
	    function cleanPathModel(pathModel) {
	        return pathModel.replace(/\/{/g, '/:').replace(/}/g, '');
	    }
	    SwaggerHelpers.cleanPathModel = cleanPathModel;
	    function swaggerTypeToJS(type, itemsType) {
	        if (itemsType === void 0) { itemsType = 'any'; }
	        return (type === 'integer') ? 'number'
	            : (type === 'array') ? !itemsType ? 'any' : swaggerTypeToJS(itemsType) + "[]"
	                : (type === 'file') ? 'any' : type;
	    }
	    SwaggerHelpers.swaggerTypeToJS = swaggerTypeToJS;
	    function getObjectDefinition(ref, swg) {
	        if (!ref) {
	            console.log('Bad json $ref inside swagger');
	            return '';
	        }
	        var res = '';
	        ref = ref.replace('#/', '').replace(/\//g, '.');
	        var obj = _.get(swg, ref);
	        _.forOwn(obj.properties, function (v, k) {
	            // console.log(obj)
	            if (v.$ref && typeof v.$ref === "string") {
	                res += k + ":{" + getObjectDefinition(v.$ref, swg) + "};\n";
	            }
	            else if (v.schema && v.schema.$ref && typeof v.schema.$ref === "string") {
	                res += k + ":{" + getObjectDefinition(v.schema.$ref, swg) + "};\n";
	            }
	            else if (v.items && v.items.$ref && typeof v.items.$ref === "string") {
	                res += k + ":{" + getObjectDefinition(v.items.$ref, swg) + "};\n";
	            }
	            else {
	                var isRequired = (obj.required && obj.required instanceof Array && obj.required.filter(function (o) { return o === k; }).length > 0);
	                var type = (v.enum && v.enum instanceof Array && v.enum.length > 0)
	                    ? v.enum.map(function (e) { return '"' + e + '"'; }).join('|') : swaggerTypeToJS(v.type, v.items ? v.items.type : 'any');
	                res += k + (!isRequired ? '?' : "") + ":" + type + ";\n";
	            }
	        });
	        return res;
	    }
	    SwaggerHelpers.getObjectDefinition = getObjectDefinition;
	})(SwaggerHelpers = exports.SwaggerHelpers || (exports.SwaggerHelpers = {}));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var swagger_helpers_1 = __webpack_require__(18);
	/**
	 * public getAllCompanies =  ({ params },{ queryparams1 }) => this.pathes.get_all_companies.model(params).get(queryparams),
	 * public getAllCompanies =  ({ params },{ queryparams1 },{body}) => this.pathes.get_all_companies.model(params).put(body,queryparams)
	 */
	function getServicesMethod(tag, swg) {
	    var methods = [];
	    for (var urlpath in swg.paths) {
	        var _loop_1 = function(methodhttp) {
	            var m = swg.paths[urlpath][methodhttp];
	            if (m.tags.filter(function (t) { return t === tag; }).length === 1) {
	                var sm_1 = {};
	                sm_1.summary = m.summary;
	                sm_1.method = methodhttp;
	                sm_1.path_cleand = swagger_helpers_1.SwaggerHelpers.cleanPath(urlpath);
	                // console.log('sm.path_cleand', sm.path_cleand)
	                sm_1.params = {};
	                sm_1.params.query = [];
	                sm_1.params.path = [];
	                sm_1.params.body = [];
	                sm_1.comment = '';
	                // QUICKFIX
	                if (m.responses && m.responses['200'] && m.responses['200'].schema
	                    && m.responses['200'].schema.type && m.responses['200'].schema.type === 'array') {
	                    sm_1.isArray = true;
	                }
	                if (m.parameters)
	                    m.parameters.forEach(function (param) {
	                        var ptypeExitst = (param.type && param.type.length > 0);
	                        sm_1.comment += ('*' + (ptypeExitst ? " {" + param.type + "} " : ' ') + (param.name + " (" + param.description + ")") + "\n");
	                        if (param.in === 'body') {
	                            sm_1.params.body.push({
	                                name: param.name,
	                                type: (param.schema.$ref ? ("{" + swagger_helpers_1.SwaggerHelpers.getObjectDefinition(param.schema.$ref, swg) + "}")
	                                    : swagger_helpers_1.SwaggerHelpers.swaggerTypeToJS(param.type)),
	                                required: param.required,
	                                isObject: true
	                            });
	                        }
	                        else {
	                            sm_1.params[param.in].push({
	                                name: param.name,
	                                type: swagger_helpers_1.SwaggerHelpers.swaggerTypeToJS(param.type),
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
	function getAngularServicesMethods(tag, swg) {
	    var res = '';
	    var methods = getServicesMethod(tag, swg);
	    methods.forEach(function (m) {
	        var neededParams = {
	            path: (m.params && m.params.path && m.params.path.length > 0),
	            query: (m.params && m.params.query && m.params.query.length > 0),
	            body: (m.params && m.params.body && m.params.body.length > 0)
	        };
	        var paramsPath = neededParams.path ? m.params.path.map(function (p) { return p['joined'] = p.name + ':' + p.type; }).join(',') : '';
	        var paramsQuery = neededParams.query ? m.params.query.map(function (p) { return p['joined'] = p.name + ':' + p.type; }).join(',') : '';
	        var paramsBody = neededParams.body ? m.params.body.map(function (p) { return p['joined'] = p.name + ':' + p.type; }).join(',') : '';
	        var paramPathNames = "{" + (neededParams.path ? m.params.path.map(function (p) { return p['joined'] = p.name; }).filter(function (d) { return d; }).join(',') : '') + '}';
	        var paramQueryNames = "{" + (neededParams.query ? m.params.query.map(function (p) { return p['joined'] = p.name; }).filter(function (d) { return d; }).join(',') : '') + '}';
	        var paramBodyNames = "{" + (neededParams.body ? m.params.body.map(function (p) { return p['joined'] = p.name; }).filter(function (d) { return d; }).join(',') : '') + '}';
	        var method = m.method;
	        if (m.method === 'post')
	            method = 'save';
	        if (m.method === 'put')
	            method = 'update';
	        if (m.method === 'delete')
	            method = 'remove';
	        if (m.isArray)
	            method = 'query';
	        var params = [paramsPath, paramsQuery, paramsBody].filter(function (d) { return d && d !== '{}'; }).join(',');
	        // QUICKFIX change {object} to object in method
	        if (neededParams.query && m.params.query.length === 1 && m.params.query[0].isObject) {
	            paramQueryNames = paramQueryNames.match(new RegExp('[a-zA-Z]+', 'g'))[0];
	        }
	        if (neededParams.body && m.params.body.length === 1 && m.params.body[0].isObject) {
	            paramBodyNames = paramBodyNames.match(new RegExp('[a-zA-Z]+', 'g'))[0];
	        }
	        var paramsName = [paramBodyNames, paramQueryNames].filter(function (d) { return d && d !== '{}'; }).join(',');
	        var comment = m.comment ? ("/**" + '\n' +
	            (m.comment.trim() + "\n        */")) : '';
	        res += ((comment + "\npublic ") + m.summary + '= (' + params + ') =>\nthis.pathes.'
	            + m.path_cleand + ("\n.model(" + paramPathNames + ")\n." + method + "(" + paramsName + ");") + "\n");
	    });
	    return res;
	}
	exports.getAngularServicesMethods = getAngularServicesMethods;


/***/ }
/******/ ])));
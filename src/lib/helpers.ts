
import {
  path,
  //#region @backend
  fse,
  //#endregion
  _
} from 'tnp-core';
import { Models } from './models';
import { CoreHelpers as TnpHelpers } from 'tnp-core';
import { Helpers } from 'tnp-helpers';


export class HelpersSwagger extends TnpHelpers {

  static SYMBOL = {
    INDEX_SWG: Symbol(),
    OUTPUT_FOLDER: Symbol()
  }

  private static output: string;
  private static apis: Models.Swagger.SwaggerModel[];
  static preparePaths(apis: Models.Swagger.SwaggerModel[], outputBase: string) {
    this.output = `${process.cwd()}/${outputBase}`
    this.apis = apis;
  }

  static prepareModel(swg: Models.Swagger.SwaggerModel, indexSwg: number, isHttpsEnable: boolean) {
    swg[this.SYMBOL.INDEX_SWG] = indexSwg;

    swg.host = swg.host && (isHttpsEnable ? 'https' : 'http') + `://${swg.host.replace(/:[0-9]*/g, '')}`
    if (!swg.basePath) {
      swg.basePath = ''
    }
  }

  //#region @backend
  static recreateIfNotExist(pathToFileOrFolder: string, content?: string) {

    if (_.isUndefined(content)) {
      if (fse.existsSync(pathToFileOrFolder)) {
        Helpers.remove(pathToFileOrFolder);
      }
      fse.mkdirpSync(pathToFileOrFolder);
    } else {
      if (fse.existsSync(pathToFileOrFolder)) {
        fse.unlinkSync(pathToFileOrFolder)
      }
      const dirName = path.dirname(pathToFileOrFolder)
      if (!fse.existsSync(dirName)) {
        fse.mkdirpSync(dirName);
      }
      fse.writeFileSync(pathToFileOrFolder, content, {
        encoding: 'utf8'
      })
    }

  }
  //#endregion


  static get serviceFromTag() {
    const self = this;


    return {
      allClassNames() {
        const names = []
        self.apis.map(swg => {
          swg.tags.forEach(tag => { // @ts-ignore
            names.push(self.serviceFromTag.className(swg, tag))
          })
        })
        return names;
      },
      className(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag) {
        const groupFolderName = self.groupFromJSON.folderName(swg)
        // console.log('groupFolderName', groupFolderName)
        const className = _.upperFirst(_.camelCase(tag.name)) + 'Service';
        return `${groupFolderName}${className.replace(/\//g, '')}`;
      },
      absoluteFilePath(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag) {

        return `${self.absolutePath.PathFolder_services_groupName(swg)}/${self.serviceFromTag.className(swg, tag)}.ts`;
      }
    }
  }

  static get endpoints() {
    return this.apis.map(swg => {
      return `${this.groupFromJSON.folderName(swg)}:'${swg.host}'`
    })
  }



  static get absolutePath() {
    const self = this;


    return {
      get output() {
        return self.output;
      },

      get PathFile_index_ts() {
        const APIpath = self.output;
        return `${APIpath}/index.ts`;
      },
      get PathFile_module_ts() {
        const APIpath = self.output;
        return `${APIpath}/module.ts`;
      },

      get PathFolder_services() {
        const APIpath = self.output;
        return `${APIpath}/services`;
      },

      get PathFile_services_index_ts() {
        return `${self.absolutePath.PathFolder_services}/index.ts`;
      },

      PathFolder_services_groupName(swg: Models.Swagger.SwaggerModel) {
        const groupFolderName = self.groupFromJSON.folderName(swg)
        // console.log('groupFolderName', groupFolderName)
        return `${self.absolutePath.PathFolder_services}/${groupFolderName}`;
      },

      PathFile_services_groupName_index_ts(swg: Models.Swagger.SwaggerModel) {
        return `${self.absolutePath.PathFolder_services_groupName(swg)}/index.ts`;
      },

      PathFile_services_groupNAme_serviceName_ts(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag) {
        const serviceFileName = self.serviceFromTag.className(swg, tag);
        return `${self.absolutePath.PathFolder_services_groupName(swg)}/${serviceFileName}.ts`;
      }

    }
  }

  static get groupFromJSON() {
    const self = this;
    return {
      get allGroupNames() {
        const names = []
        self.apis.map(swg => {  // @ts-ignore
          names.push(self.groupFromJSON.folderName(swg))
        })
        return names;
      },
      folderName(swg: Models.Swagger.SwaggerModel) {
        const basePath: string = swg.basePath;
        const index: number = swg[self.SYMBOL.INDEX_SWG];
        return _.upperFirst(_.camelCase(basePath.trim() === '' ? `json${index}` : basePath));
      }
    }
  }

  static findTags(swg: Models.Swagger.SwaggerModel) {
    const tags = []
    Object.keys(swg.paths).forEach(p => {
      Object.keys(swg.paths[p]).forEach(m => {
        const a = swg.paths[p][m];
        if (_.isArray(a.tags)) {
          a.tags.forEach(tag => {
            if (tags.filter(({ name }) => name === tag).length === 0) {  // @ts-ignore
              tags.push({ name: tag })
            }
          });
        }
      })
    })
    return tags;
  }






  /**
   * To generate get/books/{id} => get_books__id_
   */
  static cleanPath(path: string) {
    return path.replace(/{/g, "_").replace(/}/g, "_").replace(/\//g, "_").replace(/-/g, "_");
  }


  static cleanPathModel(pathModel: string) {
    return pathModel.replace(/\/{/g, '/:').replace(/}/g, '');
  }


  static swaggerTypeToJS(type: "string" | "number" | "integer" | "boolean" | "array" | "file", itemsType: any = 'any') {
    return (type === 'integer') ? 'number'
      : (type === 'array') ? !itemsType ? 'any' : `${this.swaggerTypeToJS(itemsType)}[]`
        : (type === 'file') ? 'any' : type;
  }



  static getObjectDefinition(ref: string, swg: Models.Swagger.SwaggerModel, deep = 0): string {
    if (deep == 1) return '';
    if (!ref) {
      console.log('Bad json $ref inside swagger')
      return '';
    }
    let res = '';
    ref = ref.replace('#/', '').replace(/\//g, '.');

    let obj: Models.Swagger.SwaggerDef = <Models.Swagger.SwaggerDef>_.get(swg, ref);

    // if (obj.properties.viaAgentViaGroupDTOs && !getObjectDefinition.prototype.once) {
    //     console.log('============================================================')
    //     console.log('obj', obj)
    //     console.log('------------------------------------------------------------')
    //     getObjectDefinition.prototype.once = true;



    _.forOwn(obj.properties, (v, k) => {
      // console.log(obj)
      if (v.$ref && typeof v.$ref === "string") {
        res += k + ":{" + this.getObjectDefinition(v.$ref, swg, deep++) + "};\n";
      } else if (v.schema && v.schema.$ref && typeof v.schema.$ref === "string") {
        res += k + ":{" + this.getObjectDefinition(v.schema.$ref, swg, deep++) + "};\n";

      } else if (v.items && v.items.$ref && typeof v.items.$ref === "string" && v.type && v.type === 'array') {
        res += k + ":{" + this.getObjectDefinition(v.items.$ref, swg, deep++) + "}[];\n";
        // console.log('make love here')

      } else if (v.items && v.items.$ref && typeof v.items.$ref === "string") {
        res += k + ":{" + this.getObjectDefinition(v.items.$ref, swg, deep++) + "};\n";
      } else {
        let isRequired = (obj.required && obj.required instanceof Array && obj.required.filter(o => o === k).length > 0)
        let type = (v.enum && v.enum instanceof Array && v.enum.length > 0)
          ? v.enum.map(e => '"' + e + '"').join('|') : this.swaggerTypeToJS(v.type, v.items ? v.items.type : 'any');

        res += k + (!isRequired ? '?' : "") + ":" + type + ";\n"
      }
    });
    //     console.log('res', res)
    // }

    return res;
  }



  /**
   * private pathes = {
   *      get_all_companies: new SimpleResource<
   *          string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model),
   *      get_byid_companies: new SimpleResource<
   *          string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model)
   * }
   */
  static getAngularPrivatePathesByTag(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag): string {
    let res: string[] = [];
    let base = swg.basePath.replace('/', '');

    let pathes: Object = {};
    _.forOwn(swg.paths, (v, k) => {
      _.forOwn(v, (v2, k2) => {
        if (_.isArray(v2.tags) && v2.tags.filter(f => f === tag.name).length > 0) {
          let resp = v2.responses['200'] && v2.responses['200'].schema;

          // if (resp) {
          // TODO response handling
          // console.log('resp',resp);
          if (pathes[k] === void 0) pathes[k] = {}; // @ts-ignore
          let type = this.getResponseType(resp, swg);

          if (type.length > 3 && type.charAt(type.length - 1) === ']' && type.charAt(type.length - 2) === '['
            && !pathes[k]['array']) {
            pathes[k]['array'] = type;
          } else if (k2 !== 'delete' && !pathes[k]['single']) {
            pathes[k]['single'] = type;
          }
          // }


        }
      })
    })

    let pathResources: Models.PathResource[] = [];

    _.forOwn(pathes, (v, p) => {
      // console.log(`${p} - ${JSON.stringify(v)}`);
      pathResources.push({
        clean_path: this.cleanPath(p),
        model: this.cleanPathModel(p),
        endpoint: swg.basePath,
        singleModelType: !v['single'] ? 'any' : v['single'],
        multipleModelType: !v['array'] ? 'any' : v['array'],
        queryParamsType: 'any',
        pathParamsType: 'any'
      })
    })


    pathResources.forEach(p => {
      res.push(`${p.clean_path}: new SimpleResource<\n${p.singleModelType},\n${p.multipleModelType}\n>( Ng2RestGenModule.enpointUrls.${this.groupFromJSON.folderName(swg)}, '${p.model}' )`);
    })

    return `private pathes = { \n${res.join(',\n')}\n};`
  }


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

  static getResponseType(o: Models.Swagger.ObjSchema, swg: Models.Swagger.SwaggerModel) {
    let res = '{} | any';
    if (o && o.$ref && typeof o.$ref === 'string' && o.$ref.trim() !== '') {
      res = "{" + this.getObjectDefinition(o.$ref, swg) + "}";
      // console.log('I am object', o.$ref)
    } else if (o && o.type === 'array' && o.items && o.items.$ref &&
      typeof o.items.$ref === 'string' && o.items.$ref.trim() !== '') {
      res = "{" + this.getObjectDefinition(o.items.$ref, swg) + "}[]";
      // console.log('I am array ', o.items.$ref)
    }
    // console.log('============================================================')
    // console.log('type', res)
    // console.log('------------------------------------------------------------')
    return res;
  }

  //#region @backend
  /**
 * public getAllCompanies =  ({ params },{ queryparams1 }) => this.pathes.get_all_companies.model(params).get(queryparams),
 * public getAllCompanies =  ({ params },{ queryparams1 },{body}) => this.pathes.get_all_companies.model(params).put(body,queryparams)
 */
  static getServicesMethod(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag): Models.ServiceMethod[] {
    let methods: Models.ServiceMethod[] = [];
    for (let urlpath in swg.paths) {

      for (let methodhttp in swg.paths[urlpath]) {
        let m = swg.paths[urlpath][methodhttp];

        if (_.isArray(m.tags) && m.tags.filter(t => t === tag.name).length === 1) {
          let sm: Models.ServiceMethod = <Models.ServiceMethod>{};
          sm.summary = _.camelCase(m.operationId ? m.operationId : m.summary);
          sm.method = <Models.Morphi.Rest.HttpMethod>methodhttp;
          sm.path_cleand = this.cleanPath(urlpath);
          // console.log('sm.path_cleand', sm.path_cleand)
          sm.params = {};
          sm.params.query = [];
          sm.params.path = [];
          sm.params.body = [];
          sm.comment = '';

          // QUICKFIX
          if (m.responses && m.responses['200'] && m.responses['200'].schema // @ts-ignore
            && m.responses['200'].schema.type && m.responses['200'].schema.type === 'array') {
            sm.isArray = true;
          }

          if (m.parameters) m.parameters.forEach(param => {
            let ptypeExitst = (param.type && param.type.length > 0);
            sm.comment += ('*' + (ptypeExitst ? ` { ${param.type} } ` : ' ') + `${param.name} (${param.description})` + "\n")
            if (param.in === 'body') {

              let type: string;
              if (param.schema.items && param.schema.items.$ref && param.schema.type == 'array') {
                type = "{" + this.getObjectDefinition(param.schema.items.$ref, swg) + "}[]"
              } else {
                type = (param.schema.$ref ? ("{" + this.getObjectDefinition(param.schema.$ref, swg) + "}")
                  : this.swaggerTypeToJS(param.type))
              }

              // @ts-ignore
              sm.params.body.push({
                name: param.name,
                type,
                required: param.required,
                isObject: true
              })
            } else {
              if (!_.isArray(sm.params[param.in])) {
                sm.params[param.in] = []
              }
              sm.params[param.in].push({
                name: param.name,
                type: this.swaggerTypeToJS(param.type),
                required: param.required
              })
            }

          })
          methods.push(sm);

        }
      }

    }
    return methods;
  }
  //#endregion

  //#region @backend
  static getAngularServicesMethods(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag): string {
    let res = '';

    let methods: Models.ServiceMethod[] = this.getServicesMethod(swg, tag);

    methods.forEach(m => {
      let neededParams = {
        path: (m.params && m.params.path && m.params.path.length > 0),
        query: (m.params && m.params.query && m.params.query.length > 0),
        body: (m.params && m.params.body && m.params.body.length > 0)
      }

      let paramsPath = neededParams.path  // @ts-ignore
        ? m.params.path.map(p => p['joined'] = p.name + ':' + p.type).join(',') : '';

      let paramsQuery = neededParams.query // @ts-ignore
        ? m.params.query.map(p => p['joined'] = p.name + ':' + p.type).join(',') : '';

      let paramsBody = neededParams.body // @ts-ignore
        ? m.params.body.map(p => p['joined'] = p.name + ':' + p.type).join(',') : '';

      let paramPathNames = "{" + (neededParams.path // @ts-ignore
        ? m.params.path.map(p => p['joined'] = p.name).filter(d => d).join(',') : '') + '}';

      let paramQueryNames = "{" + (neededParams.query // @ts-ignore
        ? m.params.query.map(p => p['joined'] = p.name).filter(d => d).join(',') : '') + '}';

      let paramBodyNames = "{" + (neededParams.body // @ts-ignore
        ? m.params.body.map(p => p['joined'] = p.name).filter(d => d).join(',') : '') + '}';

      let method: string = m.method;
      if (m.isArray && m.method === 'get') method = 'query'

      let params = [paramsPath, paramsQuery, paramsBody].filter(d => d && d !== '{}').join(',');

      // QUICKFIX change {object} to object in method
      // @ts-ignore
      if (neededParams.query && m.params.query.length === 1 && m.params.query[0].isObject) {  // @ts-ignore
        paramQueryNames = paramQueryNames.match(new RegExp('[a-zA-Z]+', 'g'))[0];
      }
      // @ts-ignore
      if (neededParams.body && m.params.body.length === 1 && m.params.body[0].isObject) {  // @ts-ignore
        paramBodyNames = paramBodyNames.match(new RegExp('[a-zA-Z]+', 'g'))[0];
      }


      let paramsName = [paramBodyNames, paramQueryNames].filter(d => d && d !== '{}').map(d => '<any>' + d).join(',');
      let comment = m.comment ? (`/**` + '\n' +
        `${m.comment.trim()}
        */`) : '';

      res += (
        `${comment}
public` + this.recreateSummary(m.summary) + '= (' + params + ') =>\nthis.pathes.'
        + m.path_cleand + `\n.model(${paramPathNames}) \n.${method} (${paramsName}); ` + "\n");

    });
    return res;
  }
  //#endregion
  private static count1 = 0;

  static recreateSummary(summary: string) {
    // if (!summary) {
    //   return 'SummaryExample' + (count1++)
    // }
    return summary;
  }



  // type Params = { query: any[], path: any[], body: any[] };
  // type ParamsType = { query: string, path: string, body: string };

  // export function getSingleParamsTypeForPath(tag: string, swg: SwaggerModel): ParamsType {
  //     let res: ParamsType = <ParamsType>{};

  //     for (let urlpath in swg.paths) {

  //         for (let methodhttp in swg.paths[urlpath]) {
  //             let m = swg.paths[urlpath][methodhttp];
  //             if (m.tags.filter(t => t === tag).length === 1) {

  //                 let params: Params = <Params>{};
  //                 params.query = [];
  //                 params.path = [];
  //                 params.body = [];

  //                 if (m.parameters) m.parameters.forEach(param => {
  //                     if (param.in === 'body') {
  //                         params.body.push({
  //                             name: param.name,
  //                             type: "{" + SwaggerHelpers.getObjectDefinition(param.schema.$ref, swg) + "}",
  //                             required: param.required
  //                         })
  //                     } else {
  //                         params[param.in].push({
  //                             name: param.name,
  //                             type: SwaggerHelpers.swaggerTypeToJS(param.type),
  //                             required: param.required
  //                         })
  //                     }

  //                 })

  //             }
  //         }
  //     }

  //     return res;
  // }


}

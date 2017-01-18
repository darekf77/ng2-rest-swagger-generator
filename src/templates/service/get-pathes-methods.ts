import * as _ from 'lodash';

import { SwaggerModel, Method } from '../../swagger';
import { cleanPath } from './clean-path';
import { getObjectDefinition } from './get-obj-def-swagger';
export type HttpMethod = 'query' | 'get' | 'post' | 'put' | 'delete';

import { swaggerTypeToJS } from './type-swagger-to-js';

/**
 * public getAllCompanies =  ({ params },{ queryparams1 }) => this.pathes.get_all_companies.model(params).get(queryparams),
 * public getAllCompanies =  ({ params },{ queryparams1 },{body}) => this.pathes.get_all_companies.model(params).put(body,queryparams)
 */

interface Param {
    name: string;
    type: string; // "string" | "number" | "integer" | "boolean" | "array" | "file";
    required: boolean;
    joined?: string;
}

interface ServiceMethod {
    summary: string;
    path_cleand: string;
    params: {
        path?: Param[];
        query?: Param[];
        body?: Param[];
    }
    method: HttpMethod;
}

function getServicesMethod(tag: string, swg: SwaggerModel) {
    let methods: ServiceMethod[] = [];
    for (let urlpath in swg.paths) {

        for (let methodhttp in swg.paths[urlpath]) {
            let m = swg.paths[urlpath][methodhttp];
            if (m.tags.filter(t => t === tag).length === 1) {

                let sm: ServiceMethod = <ServiceMethod>{};
                sm.summary = m.summary;
                sm.method = <HttpMethod>methodhttp;
                sm.path_cleand = cleanPath(urlpath);
                // console.log('sm.path_cleand', sm.path_cleand)
                sm.params = {};
                sm.params.query = [];
                sm.params.path = [];
                sm.params.body = [];

                if (m.parameters) m.parameters.forEach(param => {
                    if (param.in === 'body') {
                        sm.params.body.push({
                            name: param.name,
                            type: "{" + getObjectDefinition(param.schema.$ref, swg) + "}",
                            required: param.required
                        })
                    } else {
                        sm.params[param.in].push({
                            name: param.name,
                            type: swaggerTypeToJS(param.type),
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

export function getPathesMethods(tag: string, swg: SwaggerModel): string {
    let res = '';

    let methods: ServiceMethod[] = getServicesMethod(tag, swg);

    // console.log(methods)

    methods.forEach(m => {
        let neededParams = {
            path: (m.params && m.params.path && m.params.path.length > 0),
            query: (m.params && m.params.query && m.params.query.length > 0),
            body: (m.params && m.params.body && m.params.body.length > 0)
        }

        // console.log(m)

        let paramsPath = neededParams.path ? m.params.path.map(p => p.joined = p.name + ':' + p.type).join(',') : '';
        let paramsQuery = neededParams.query ? m.params.query.map(p => p.joined = p.name + ':' + p.type).join(',') : '';
        let paramsBody = neededParams.body ? m.params.body.map(p => p.joined = p.name + ':' + p.type).join(',') : '';


        // console.log(paramsPath)
        // console.log(paramsQuery)
        // console.log(paramsBody)

        let paramsPathNames = "{" + (neededParams.path ? m.params.path.map(p => p.joined = p.name).filter(d => d).join(',') : '') + '}';
        let paramsQueryNames = "{" + (neededParams.query ? m.params.query.map(p => p.joined = p.name).filter(d => d).join(',') : '') + '}';
        let paramsBodyNames = "{" + (neededParams.body ? m.params.body.map(p => p.joined = p.name).filter(d => d).join(',') : '') + '}';

        // console.log(paramsPathNames)
        // console.log(paramsQueryNames)
        // console.log(paramsBodyNames)
        let method: string = m.method;
        if (m.method === 'post') method = 'save';
        if (m.method === 'put') method = 'update';
        if (m.method === 'delete') method = 'remove';

        let params = [paramsPath, paramsQuery, paramsBody].filter(d => d && d !== '{}').join(',');
        let paramsName = [paramsBodyNames, paramsQueryNames].filter(d => d && d !== '{}').join(',');
        // console.log('method', method)
        res += ('public ' + m.summary + '= (' + params + ') => this.pathes.'
            + m.path_cleand + `.model(${paramsPathNames}).${method}(${paramsName});` + "\n");
        // console.log(res)
    });
    return res;
}
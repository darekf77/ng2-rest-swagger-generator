import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerMethod, SwaggerPath, ObjSchema } from '../../../swagger';
import { SwaggerHelpers } from '../swagger-helpers';
import { PathResource } from './models';

/**
 * private pathes = {
 *      get_all_companies: new SimpleResource<
 *          string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model),
 *      get_byid_companies: new SimpleResource<
 *          string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model)
 * }
 */
export function getAngularPrivatePathesByTag(tag: string, swg: SwaggerModel): string {
    let res: string[] = [];

    let pathes: Object = {};
    _.forOwn(swg.paths, (v, k) => {
        _.forOwn(v, (v2, k2) => {
            if (v2.tags.filter(f => f === tag).length > 0) {
                let resp = v2.responses['200'].schema;

                // TODO response handling 
                // console.log('resp',resp);
                if (pathes[k] === undefined) pathes[k] = {};
                let type = getResponseType(resp, swg);

                if (type.length > 3 && type.charAt(type.length - 1) === ']' && type.charAt(type.length - 2) === '['
                    && !pathes[k]['array']) {
                    pathes[k]['array'] = type;
                } else if (k2 !== 'delete' && !pathes[k]['single']) {
                    pathes[k]['single'] = type;
                }

            }
        })
    })

    let pathResources: PathResource[] = [];

    _.forOwn(pathes, (v, p) => {
        // console.log(`${p} - ${JSON.stringify(v)}`);
        pathResources.push({
            clean_path: SwaggerHelpers.cleanPath(p),
            model: SwaggerHelpers.cleanPathModel(p),
            endpoint: swg.basePath,
            singleModelType: !v['single'] ? 'any' : v['single'],
            multipleModelType: !v['array'] ? 'any' : v['array'],
            queryParamsType: 'any',
            pathParamsType: 'any'
        })
    })


    pathResources.forEach(p => {
        res.push(`${p.clean_path}: new SimpleResource< string, ${p.singleModelType} ,  ${p.multipleModelType}  , ${p.pathParamsType} , ${p.queryParamsType} >( '${swg.host}${p.endpoint}' , '${p.model}' )`);
    })

    return `private pathes = {\n${res.join(',\n')}\n};`
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

function getResponseType(o: ObjSchema, swg: SwaggerModel) {
    let res = '{} | any';
    if (o && o.$ref && typeof o.$ref === 'string' && o.$ref.trim() !== '') {
        res = "{" + SwaggerHelpers.getObjectDefinition(o.$ref, swg) + "}";
        console.log('I am object', o.$ref)
    } else if (o && o.type === 'array' && o.items && o.items.$ref &&
        typeof o.items.$ref === 'string' && o.items.$ref.trim() !== '') {
        res = "{" + SwaggerHelpers.getObjectDefinition(o.items.$ref, swg) + "}[]";
        console.log('I am array ', o.items.$ref)
    }
    return res;
}
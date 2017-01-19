import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerMethod, SwaggerPath } from '../../../swagger';
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
                pathes[k] = '';
            }
        })
    })

    let pathResources: PathResource[] = [];

    _.forOwn(pathes, (v, p) => {
        pathResources.push({
            clean_path: SwaggerHelpers.cleanPath(p),
            model: SwaggerHelpers.cleanPathModel(p),
            endpoint: swg.basePath,
            singleModelType: 'any',
            queryParamsType: 'any',
            pathParamsType: 'any'
        })
    })


    pathResources.forEach(p => {
        res.push(`${p.clean_path}: new SimpleResource< string, ${p.singleModelType} , any, ${p.pathParamsType} , ${p.queryParamsType} >( '${swg.host}${p.endpoint}' , '${p.model}' )`);
    })

    return `private pathes = {\n${res.join(',\n')}\n};`
}

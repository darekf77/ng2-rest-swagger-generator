import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerMethod, SwaggerPath } from '../../swagger';
import { cleanPath, cleanPathModel } from './clean-path';

/**
 * private pathes = {
 *      get_all_companies: new SimpleResource< string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model),
 *      get_byid_companies: new SimpleResource< string, A, TA, RP extends Object, QP extends Rest.UrlParams>(endpoint, model)
 * }
 */

interface PathResource {
    clean_path?: string;
    singleModelType?: string;
    pathParamsType?: string;
    queryParamsType?: string;
    endpoint?: string;
    model?: string;
}

export function getPathesByTag(tag: string, swg: SwaggerModel): string {
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
            clean_path: cleanPath(p),
            model: cleanPathModel(p),
            endpoint: swg.basePath,
            singleModelType: 'any',
            queryParamsType: 'any',
            pathParamsType: 'any'
        })
    })


    pathResources.forEach(p => {
        res.push(`${p.clean_path}: new SimpleResource< string, ${p.singleModelType} , any, ${p.pathParamsType} , ${p.queryParamsType} >( '${swg.host}${p.endpoint}' , '${p.model}' )`);
    })



    // cleanPath()
    // res = 'aa';

    return `private pathes = {\n${res.join(',\n')}\n};`
}
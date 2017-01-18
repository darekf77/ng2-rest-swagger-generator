import * as _ from 'lodash';
import { SwaggerModel, Method, SwaggerMethod, SwaggerDef } from '../../swagger';

import { swaggerTypeToJS } from './type-swagger-to-js';

export function getObjectDefinition(ref: string, swg: SwaggerModel): string {
    let res = '';
    ref = ref.replace('#/', '').replace(/\//g, '.');
    // console.log('ref:', ref)
    let obj: SwaggerDef = <SwaggerDef>_.get(swg, ref);

    // console.log('obj:', obj)
    // console.log('swg:', swg)

    _.forOwn(obj.properties, (v, k) => {
        if (v.schema && v.schema.$ref && typeof v.schema.$ref === "string") {
            res += "{" + getObjectDefinition(v.schema.$ref, swg) + "};\n";
        } else {
            let isRequired = (obj.required && obj.required instanceof Array && obj.required.filter(o => o === k).length > 0)
            let type = (v.enum && v.enum instanceof Array && v.enum.length > 0)
                ? v.enum.map(e => '"' + e + '"').join('|') : swaggerTypeToJS(v.type);

            res += k + (!isRequired ? '?' : "") + ":" + type + ";\n"
        }
    });

    return res;
}
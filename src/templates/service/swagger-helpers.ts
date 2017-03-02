import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerDef } from '../../swagger';


export namespace SwaggerHelpers {

    /**
     * To generate get/books/{id} => get_books__id_
     */
    export function cleanPath(path: string) {
        return path.replace(/{/g, "_").replace(/}/g, "_").replace(/\//g, "_").replace(/-/g, "_");
    }

    export function cleanPathModel(pathModel: string) {
        return pathModel.replace(/\/{/g, '/:').replace(/}/g, '');
    }


    export function swaggerTypeToJS(type: "string" | "number" | "integer" | "boolean" | "array" | "file", itemsType: any = 'any') {
        return (type === 'integer') ? 'number'
            : (type === 'array') ? !itemsType ? 'any' : `${swaggerTypeToJS(itemsType)}[]`
                : (type === 'file') ? 'any' : type;
    }



    export function getObjectDefinition(ref: string, swg: SwaggerModel, deep = 0): string {
        if (deep == 1) return '';
        if (!ref) {
            console.log('Bad json $ref inside swagger')
            return '';
        }
        let res = '';
        ref = ref.replace('#/', '').replace(/\//g, '.');

        let obj: SwaggerDef = <SwaggerDef>_.get(swg, ref);

        _.forOwn(obj.properties, (v, k) => {
            // console.log(obj)
            if (v.$ref && typeof v.$ref === "string") {
                res += k + ":{" + getObjectDefinition(v.$ref, swg, deep++) + "};\n";
            } else if (v.schema && v.schema.$ref && typeof v.schema.$ref === "string") {
                res += k + ":{" + getObjectDefinition(v.schema.$ref, swg, deep++) + "};\n";
            } else if (v.items && v.items.$ref && typeof v.items.$ref === "string") {
                res += k + ":{" + getObjectDefinition(v.items.$ref, swg, deep++) + "};\n";
            } else {
                let isRequired = (obj.required && obj.required instanceof Array && obj.required.filter(o => o === k).length > 0)
                let type = (v.enum && v.enum instanceof Array && v.enum.length > 0)
                    ? v.enum.map(e => '"' + e + '"').join('|') : swaggerTypeToJS(v.type, v.items ? v.items.type : 'any');

                res += k + (!isRequired ? '?' : "") + ":" + type + ";\n"
            }
        });

        return res;
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



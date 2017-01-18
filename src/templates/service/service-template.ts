import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerMethod } from '../../swagger';
import { Helpers } from '../../helpers';
import { getPathesByTag } from './get-pathes-by-tag';
import { getPathesMethods } from './get-pathes-methods';

export function serviceTemplate(group: string, model: string, swg: SwaggerModel): string {
    return `import { Injectable } from '@angular/core';
import { SimpleResource, Mock, Model } from 'ng2-rest/ng2-rest';

@Injectable()
export class ${Helpers.upperFirst(group)}${_.camelCase(model).replace(model.charAt(0), model.charAt(0).toUpperCase())}Service  {

    ${getPathesByTag(model, swg)}
    ${getPathesMethods(model, swg)}

    constructor() {
        
    }
}`
}




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
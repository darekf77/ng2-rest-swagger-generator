import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerMethod } from '../../swagger';
import { ng2restInstanceTemplate, n2RestObject } from './ng2-rest-obj';

function findModelByTag(tag: string, swg: SwaggerModel) {
    let o: Object = swg.paths;
    console.log('o', o)
    for (let url in o) {
        console.log('url', url)
        for (let method in o[url]) {
            console.log('method', method)
            var m: Method = o[url][method];
            console.log('m', m)
            if (m.tags.filter(t => t === tag).length > 0) {
                return url; //.replace(/{/g, ':').replace(/}/g, "");
            }
        }
    }
}


function findByTag(tag: string, swg: SwaggerModel): ng2restInstanceTemplate {
    let res: ng2restInstanceTemplate = <ng2restInstanceTemplate>{
        endpointType: 'string',
        singleModelType: '{}',
        queryModelType: 'any[]',
        endpointSelected: 'onet.pl',
        model: 'users/:id',
        restPramsType: '{}',
        queryPramType: '{}'
    };
    res.model = findModelByTag(tag, swg);
    return res;
}


export function serviceTemplate(model: string, swg: SwaggerModel): string {

    let instances: string[] = [];
    let pathes = <Object>swg.paths;

    let a = findByTag(model, swg);

    let d = n2RestObject(a)



    return `import { Injectable } from '@angular/core';
import { SimpleResource, Mock, Model } from 'ng2-rest/ng2-rest';

@Injectable()
export class ${_.camelCase(model).replace(model.charAt(0), model.charAt(0).toUpperCase())}Service  {
    private instance = new  SimpleResource${d};
    model: Model< ${a.singleModelType} , ${a.queryModelType} , ${a.restPramsType} , ${a.queryPramType} >;
    mock: Mock< ${a.singleModelType}  >;

    constructor() {
        this.mock = this.instance.mock;
        this.model = this.instance.model;
    }
}`
}

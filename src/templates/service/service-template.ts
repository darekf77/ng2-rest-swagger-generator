import * as _ from 'lodash';

import { SwaggerModel } from '../../swagger';


export interface ng2restInstanceTemplate {
    singleModelType: string;
    queryModelType: string;
    restPramsType: string;
    queryPramType: string;
    endpointType: string;
    endpointSelected: string;
    model: string;
}

export function n2RestObject(instance: ng2restInstanceTemplate) {
    return `<
    ${instance.endpointType},
    ${instance.singleModelType},
    ${instance.queryModelType},
    ${instance.restPramsType},
    ${instance.queryPramType}
    >( '${instance.endpointSelected}' ,  '${instance.model}' );` + '\n';
}

export function serviceTemplate(model: string, swg: SwaggerModel): string {

    let instances: string[] = [];
    let pathes = <Object>swg.paths;

    // let counter = 0;
    // for (let path in pathes) {
    //     instances.push()
    // }
    let a = {
        // nameUnderscore: 'rest' + Math.random() + 100,
        endpointType: 'string',
        singleModelType: '{}',
        queryModelType: 'any[]',
        endpointSelected: 'onet.pl',
        model: 'users/:id',
        restPramsType: '{}',
        queryPramType: '{}'
    }

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

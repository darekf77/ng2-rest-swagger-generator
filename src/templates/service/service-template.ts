import * as _ from 'lodash';

import { SwaggerModel, Method, SwaggerMethod } from '../../swagger';
import { Helpers } from '../../helpers';
import { getAngularPrivatePathesByTag, getAngularServicesMethods } from './angular';

export function serviceTemplate(group: string, model: string, swg: SwaggerModel): string {
    return `import { Injectable } from '@angular/core';
import { SimpleResource, Mock, Model } from 'ng2-rest';
import { Ng2RestGenModule } from "../../module";

@Injectable()
export class ${Helpers.upperFirst(group)}${_.camelCase(model).replace(model.charAt(0), model.charAt(0).toUpperCase())}Service  {

    ${getAngularPrivatePathesByTag(model, swg)}

    // public methods
    ${getAngularServicesMethods(model, swg)}

    public static unsubscribe() {
        SimpleResource.__destroy();
    }

    constructor() {

    }
}`
}

import { SwaggerModel, Method, SwaggerMethod, SwaggerPath } from '../../swagger';
import { SwaggerHelpers } from './swagger-helpers';

type Params = { query: any[], path: any[], body: any[] };
type ParamsType = { query: string, path: string, body: string };

export function getSingleParamsTypeForPath(tag: string, swg: SwaggerModel): ParamsType {
    let res: ParamsType = <ParamsType>{};

    for (let urlpath in swg.paths) {

        for (let methodhttp in swg.paths[urlpath]) {
            let m = swg.paths[urlpath][methodhttp];
            if (m.tags.filter(t => t === tag).length === 1) {

                let params: Params = <Params>{};
                params.query = [];
                params.path = [];
                params.body = [];

                if (m.parameters) m.parameters.forEach(param => {
                    if (param.in === 'body') {
                        params.body.push({
                            name: param.name,
                            type: "{" +  SwaggerHelpers.getObjectDefinition(param.schema.$ref, swg) + "}",
                            required: param.required
                        })
                    } else {
                        params[param.in].push({
                            name: param.name,
                            type: SwaggerHelpers.swaggerTypeToJS(param.type),
                            required: param.required
                        })
                    }
                });

            }
        }
    }

    return res;
}

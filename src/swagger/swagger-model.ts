import { SwaggerDefinition } from './swagger-definitions';

// type HttpCode = '200' | '400' | '404' | '403' | '500';

interface Response {
    description: string;
    schema: Object;
}

interface SwaggerResponse {
    [path: string]: Response;
}

interface Parameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    type: string;
    format: string;
}

interface Method {
    tags: string;
    summary: string;
    operationId: string;
    consumes: string[];
    produces: string[];
    parameters: Parameter[];
    responses: SwaggerResponse[];
}

interface SwaggerMethod {
    [path: string]: Method;
}

interface SwaggerPath {
    [path: string]: SwaggerMethod;
}

interface SwaggerTag {
    name: string;
    description: string;
}

export interface SwaggerModel {
    host: string;
    basePath: string;
    tags: SwaggerTag[];
    paths: SwaggerPath;
    definitions: SwaggerDefinition;
}


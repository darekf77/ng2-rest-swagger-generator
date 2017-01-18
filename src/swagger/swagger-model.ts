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

export interface Method {
    tags: string[];
    summary: string;
    operationId: string;
    consumes: string[];
    produces: string[];
    parameters: Parameter[];
    responses: SwaggerResponse[];
}

export interface SwaggerMethod {
    [path: string]: Method;
}

export interface SwaggerPath {
    [path: string]: SwaggerMethod;
}

export interface SwaggerTag {
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


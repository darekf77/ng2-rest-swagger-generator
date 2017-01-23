
export type HttpMethod = 'query' | 'get' | 'post' | 'put' | 'delete';

export interface PathResource {
    clean_path?: string;
    singleModelType?: string;
    multipleModelType?: string;
    pathParamsType?: string;
    queryParamsType?: string;
    endpoint?: string;
    model?: string;
}

export interface Param {
    name: string;
    type: string; // "string" | "number" | "integer" | "boolean" | "array" | "file";
    required: boolean;
    isObject?: boolean;
}

export interface ServiceMethod {
    summary: string;
    path_cleand: string;
    params: {
        path?: Param[];
        query?: Param[];
        body?: Param[];
    }
    method: HttpMethod;
    isArray: boolean;
}



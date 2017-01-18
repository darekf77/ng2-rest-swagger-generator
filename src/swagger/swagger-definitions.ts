export const DataTypesNumber = ["int32", "int64", "double", "float"];
export const DataTyesString = ["string", "byte", "binary", "data", "data-time", "password"];
export const DataTyesBoolean = ["boolean"];

type DataFormat = "int32" | "int64" | "double" | "float"
type DataType = "object" | "array" | "string" | "boolean"

export interface Property {
    type: DataType;
    enum: string[];
    minLength: number;
    maxLenght: number;
    format: DataFormat;
    items: { $ref: string };
    exclusiveMinimum: boolean;
    exclusiveMaximum: boolean;
}
export interface PropertyName {
    [name: string]: Property
}

export interface SwaggerDef {
    type: DataType;
    properties: Property[];
}


export interface SwaggerDefinition {
    [name: string]: SwaggerDef;
}
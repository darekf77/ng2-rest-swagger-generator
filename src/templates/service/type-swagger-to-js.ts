export const DataTypesNumber = ["int32", "int64", "double", "float"];
export const DataTyesString = ["string", "byte", "binary", "data", "data-time", "password"];
export const DataTyesBoolean = ["boolean"];


// export function swaggerTypeToJS(type: string) {
//     if (DataTypesNumber.filter(d => d === type).length > 0) return 'number';
//     if (DataTyesString.filter(d => d === type).length > 0) return 'string';
// }


export function swaggerTypeToJS(type: "string" | "number" | "integer" | "boolean" | "array" | "file") {
    return (type === 'integer') ? 'number'
        : (type === 'array') ? 'any[]'
            : (type === 'file') ? 'any' : type;
}
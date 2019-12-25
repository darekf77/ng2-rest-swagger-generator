import { Models as MorphiModels } from 'morphi';


export namespace Models {
  export import Morphi = MorphiModels;

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
    method: Morphi.Rest.HttpMethod;
    isArray: boolean;
    comment?: string;
  }



  export namespace Swagger {
    export type DataFormat = 'int32' | 'int64' | 'double' | 'float'
    export type DataType = 'object' | 'array' | 'string' | 'boolean'


    export interface PropertyName {
      [name: string]: Parameter
    }

    export interface SwaggerDef {
      required: string[];
      type: DataType;
      properties: PropertyName;
    }


    export interface SwaggerDefinition {
      [name: string]: SwaggerDef;
    }

    export interface ObjSchema {
      $ref: string;
      type: "string" | "number" | "integer" | "boolean" | "array" | "file";
      items: {
        $ref: string;
      }
    }

    export interface Response {
      description: string;
      schema: ObjSchema;
    }

    export interface SwaggerResponse {
      [path: string]: Response;
    }

    export interface Parameter {
      $ref: string;
      /**
       * 	Required. The schema defining the type used for the body parameter.
       */
      schema: {
        $ref: string;
        items: Parameter;
        type: "string" | "number" | "integer" | "boolean" | "array" | "file";
      }
      /**
       * Required. The name of the parameter. Parameter names are case sensitive.
       * If in is "path", the name field MUST correspond to the associated path segment
       * from the path field in the Paths Object. See Path Templating for further information.
       * For all other cases, the name corresponds to the parameter name used based on the in property.
       */
      name: string;
      in: 'query' | 'path' | 'body' | 'formData' | 'header';
      /**
       * A brief description of the parameter. This could contain examples of use.
       *  GFM syntax can be used for rich text representation.
       */
      description: string;
      /**
       * Required if type is "array". Describes the type of items in the array.
       */
      items: Parameter;
      required: boolean;
      /**
       * Sets the ability to pass empty-valued parameters. This is valid only
       * for either query or formData parameters and allows you to send a parameter
       *  with a name only or an empty value. Default value is false.
       */
      allowEmptyValue: boolean;
      /**
       * Required. The type of the parameter. Since the parameter is not located
       * at the request body, it is limited to simple types (that is, not an object).
       *  The value MUST be one of "string", "number", "integer", "boolean", "array"
       * or "file". If type is "file", the consumes MUST be either "multipart/form-data",
       * " application/x-www-form-urlencoded" or both and the parameter MUST be in "formData".
       */
      type: "string" | "number" | "integer" | "boolean" | "array" | "file";
      format: "int32" | "int64" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password";
      /**
       * Determines the format of the array if type array is used. Possible values are:
       * csv - comma separated values foo,bar.
       * ssv - space separated values foo bar.
       * tsv - tab separated values foo\tbar.
       * pipes - pipe separated values foo|bar.
       * Default value is csv.
       */
      collectionFormat: 'csv' | 'ssv' | 'tsv' | 'pipes';
      /**
       * Declares the value of the item that the server will use if none is provided.
       * (Note: "default" has no meaning for required items.)
       * See http://json-schema.org/latest/json-schema-validation.html#anchor101.
       *  Unlike JSON Schema this value MUST conform to the defined type for the data type.
       */
      default: any;
      /**
       * The value of this keyword MUST be an array.
       * This array SHOULD have at least one element.
       * Elements in the array SHOULD be unique.
       * Elements in the array MAY be of any type, including null.
       * An instance validates successfully against this keyword if its value
       * is equal to one of the elements in this keyword's array value.
       */
      enum: any[];
      maxLength: number;
      minLength: number;
      maxItems: number;
      minItems: number;
      uniqueItems: boolean;
      pattern: number;
      maximum: number;
      exclusiveMaximum: boolean;
      minimum: number;
      exclusiveMinimum: number;
      multipleOf: boolean;
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
      // description: string;
    }

    export interface SwaggerModel {
      host: string;
      basePath: string;
      tags: SwaggerTag[];
      paths: SwaggerPath;
      definitions: SwaggerDefinition;
    }


  }

}
import { SwaggerModel, Method } from '../../swagger';

/**
 * To generate get/books/{id} => get_books__id_
 */
export function cleanPath(path: string) {
    return path.replace(/{/g, "_").replace(/}/g, "_").replace(/\//g, "_").replace(/-/g, "_");
}

export function cleanPathModel(pathModel: string) {
    return pathModel.replace(/\/{/g, '/:').replace(/\//g, '');
}
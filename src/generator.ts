import express = require('express');
import fs = require('fs');
import * as _ from 'lodash';

import { SwaggerModel } from './swagger';
import {
    indexExportsTmpl,
    mainIndex,
    templateModule,
    serviceTemplate
} from './templates';
import { Helpers } from './helpers';


let apis: SwaggerModel[] = [];

const APIpath: string = `${process.cwd()}/api`;
const mainIndexPath: string = `${APIpath}/index.ts`;
const modulePath: string = `${APIpath}/module.ts`;
const servicesFolderPath: string = `${APIpath}/services`;
const servicesFolderPathIndex: string = `${servicesFolderPath}/index.ts`;

let serviceGroup = (group: string) => {
    return `${servicesFolderPath}/${_.camelCase(group)}`
}

let serviceGroupIndex = (group: string) => {
    return `${servicesFolderPath}/${_.camelCase(group)}/index.ts`
}

let serviceTsPath = (group: string, name: string) => {
    return `${servicesFolderPath}/${_.camelCase(group)}/${name}.ts`;
}


export function run(pathes: string[]) {

    pathes = pathes.map(p => {
        if (p.charAt(0) === '/') p = p.slice(1, p.length);
        return `${process.cwd()}/${p}`;
    })

    pathes.forEach(p => {
        apis.push(JSON.parse(fs.readFileSync(p, 'utf8')));
    });

    // api forlder
    if (fs.existsSync(APIpath)) Helpers.deleteFolderRecursive(APIpath);
    fs.mkdirSync(APIpath);

    // api/index.ts
    fs.writeFileSync(mainIndexPath, mainIndex(), 'utf8');

    //api/services
    fs.mkdirSync(servicesFolderPath);

    // api/services/<service folders>
    // api/services/<service folders>/index.ts
    let servicesNameCamelCase: string[] = [];
    let exportGroups: string[] = [];
    apis.forEach(swg => {
        let base = swg.basePath.replace('/', '');
        exportGroups.push(base);
        fs.mkdirSync(serviceGroup(base));
        let servicesNames: string[] = [];
        swg.tags.forEach(tag => {
            servicesNames.push(tag.name);
            servicesNameCamelCase.push(_.camelCase(tag.name))
            let service = serviceTemplate(tag.name, swg);
            fs.writeFileSync(serviceTsPath(base, tag.name), service, 'utf8');
        })
        fs.writeFileSync(serviceGroupIndex(base), indexExportsTmpl(servicesNames), 'utf8');
    })

    // api/services/index.ts
    fs.writeFileSync(servicesFolderPathIndex, indexExportsTmpl(exportGroups), 'utf8');


    // api/module.ts
    fs.writeFileSync(modulePath, templateModule(servicesNameCamelCase), 'utf8');

    console.log('Swagger files quantity: ', apis.length);




}
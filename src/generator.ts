import express = require('express');
import fs = require('fs');
var exec = require('exec');
import tsfmt = require('typescript-formatter');
import * as _ from 'lodash';
import request = require("request");
import * as JSON5 from 'json5';

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

let formatterFiles: string[] = [];

let serviceGroup = (group: string) => {
    return `${servicesFolderPath}/${_.camelCase(group)}`
}

let serviceGroupIndex = (group: string) => {
    return `${servicesFolderPath}/${_.camelCase(group)}/index.ts`
}

let serviceTsPath = (group: string, name: string) => {
    return `${servicesFolderPath}/${_.camelCase(group)}/${name}.ts`;
}


export function run(pathes: string[], links: string[], isHttpsEnable: boolean = false) {

    if (links.length > 0) {
        let link = links.shift();
        request(<any>{
            method: "GET",
            "rejectUnauthorized": false,
            "url": link,
            "headers": { "Content-Type": "application/json" }
        }, (error, response, body) => {
            body = JSON5.parse(body);
            // console.log(error)
            // console.log(typeof body)
            if (!error && typeof body === "object") {
                apis.push(body);
            } else {
                console.log('Bad link: ' + link)
            }
            run(pathes, links, isHttpsEnable);
        });
        return;
    }


    pathes = pathes.map(p => {
        if (p.charAt(0) === '/') p = p.slice(1, p.length);
        return `${process.cwd()}/${p}`;
    })

    pathes.forEach(p => {
        apis.push(JSON5.parse(fs.readFileSync(p, 'utf8')));
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
        swg.host = (isHttpsEnable ? 'https' : 'http') + `://${swg.host.replace(/:[0-9]*/g, '')}`
        let base = swg.basePath.replace('/', '');
        exportGroups.push(base);
        fs.mkdirSync(serviceGroup(base));
        let servicesNames: string[] = [];
        swg.tags.forEach(tag => {
            servicesNames.push(tag.name);
            servicesNameCamelCase.push(base + Helpers.upperFirst(_.camelCase(tag.name)));
            let service = serviceTemplate(base, tag.name, swg);
            formatterFiles.push(serviceTsPath(base, tag.name));
            fs.writeFileSync(serviceTsPath(base, tag.name), service, 'utf8');
        })
        let resMapString = `"${swg.host}${swg.basePath}"`;
        let indexJSONcontent =
`import { Resource } from "ng2-rest/ng2-rest";
Resource.map(${resMapString},${resMapString});

` + indexExportsTmpl(servicesNames);
        fs.writeFileSync(serviceGroupIndex(base), indexJSONcontent, 'utf8');
    })

    // api/services/index.ts
    fs.writeFileSync(servicesFolderPathIndex, indexExportsTmpl(exportGroups), 'utf8');


    // api/module.ts
    formatterFiles.push(modulePath);
    fs.writeFileSync(modulePath, templateModule(servicesNameCamelCase), 'utf8');

    console.log('Swagger files quantity: ', apis.length);

    tsfmt.processFiles(formatterFiles, {
        // dryRun?: boolean;
        // verbose?: boolean;
        // baseDir?: string;
        replace: true,
        verify: false,
        tsconfig: true,
        tslint: true,
        editorconfig: false,
        tsfmt: true
    }).then(() => { })

    // let command = `${__dirname}/node_modules/typescript-formatter/bin/tsfmt --no-tsconfig  -r --baseDir ${APIpath}`;
    // console.log('command', command);
    // exec(command,
    //     (error, stdout, stderr) => {
    //         console.log('stdout: ' + stdout);
    //         console.log('stderr: ' + stderr);
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //         }
    //     });

}
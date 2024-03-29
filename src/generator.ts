import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as JSON5 from 'json5';
import chalk from 'chalk';

import * as tsfmt from 'typescript-formatter';
import * as request from 'request';
import { HelpersSwagger } from './lib/helpers';

import { Template } from './template';
import { Models } from './lib/models';


const apis: Models.Swagger.SwaggerModel[] = [];
const formatterFiles: string[] = [];

export function run(pathes: string[], links: string[], isHttpsEnable: boolean = false, outputBase: string = 'api') {

  //#region prepare jsons
  if (links.length > 0) {
    let link = links.shift();
    request(<any>{
      method: "GET",
      "rejectUnauthorized": false,
      "url": link,
      "headers": { "Content-Type": "application/json" }
    }, (error, response, body) => {

      if (error || (_.isString(body) && body.startsWith('404'))) {
        console.log(chalk.red(`Invalid link address: ${chalk.bold(link)}`))
        process.exit(1)
      }

      body = JSON5.parse(body);
      // console.log(error)
      // console.log(typeof body)
      if (!error && typeof body === "object") {
        apis.push(body);
      } else {
        console.log('Bad link: ' + link)
      }
      run(pathes, links, isHttpsEnable, outputBase);
    });
    return;
  }
  //#endregion

  HelpersSwagger.preparePaths(apis, outputBase)

  pathes = pathes.map(p => {
    if (p.charAt(0) === '/') p = p.slice(1, p.length);
    return `${process.cwd()}/${p}`;
  })

  pathes.forEach(p => {
    apis.push(JSON5.parse(fs.readFileSync(p, 'utf8')));
  });

  // api forlder
  HelpersSwagger.recreateIfNotExist(HelpersSwagger.absolutePath.output)

  // api/index.ts
  HelpersSwagger.recreateIfNotExist(HelpersSwagger.absolutePath.PathFile_index_ts, Template.mainIndex)

  //api/services
  HelpersSwagger.recreateIfNotExist(HelpersSwagger.absolutePath.PathFolder_services)

  let exportGroupsFromJSONs: string[] = [];


  apis.forEach((swg, indexSwg) => {

    HelpersSwagger.prepareModel(swg, indexSwg, isHttpsEnable);

    const groupFolderName = HelpersSwagger.groupFromJSON.folderName(swg);

    exportGroupsFromJSONs.push(groupFolderName);

    //api/services/<groupanme>
    HelpersSwagger.recreateIfNotExist(HelpersSwagger.absolutePath.PathFolder_services_groupName(swg))


    let servicesNames: string[] = [];


    if (!_.isArray(swg.tags)) {
      swg.tags = HelpersSwagger.findTags(swg);
    }


    swg.tags.forEach(tag => {
      const serivceFileName = HelpersSwagger.serviceFromTag.className(swg, tag);
      servicesNames.push(serivceFileName);
      const absolutePathToServiceFileInFolderGroup = HelpersSwagger.serviceFromTag.absoluteFilePath(swg, tag);

      formatterFiles.push(absolutePathToServiceFileInFolderGroup);

      // console.log('write type', typeof absolutePathToServiceFileInFolderGroup)
      // console.log(absolutePathToServiceFileInFolderGroup)

      HelpersSwagger.recreateIfNotExist(absolutePathToServiceFileInFolderGroup, Template.serviceTemplate(swg, tag))
    })

    fs.writeFileSync(HelpersSwagger.absolutePath.PathFile_services_groupName_index_ts(swg), Template.indexJSONcontent(swg), 'utf8');
  })

  const allClassesNames = HelpersSwagger.serviceFromTag.allClassNames();
  const allGroupFromTagNames = HelpersSwagger.groupFromJSON.allGroupNames;
  // console.log('allGroupFromTagNames',allGroupFromTagNames)

  // api/services/index.ts
  HelpersSwagger.recreateIfNotExist(HelpersSwagger.absolutePath.PathFile_services_index_ts, Template.indexExportsTmpl(allGroupFromTagNames))


  // api/module.ts
  formatterFiles.push(HelpersSwagger.absolutePath.PathFile_module_ts);

  fs.writeFileSync(HelpersSwagger.absolutePath.PathFile_module_ts,
    Template.templateModule(allClassesNames), 'utf8');

  console.log('Swagger files quantity: ', apis.length);

  // console.log('frmat files', formatterFiles)

  tsfmt.processFiles(formatterFiles, {
    // dryRun?: boolean;
    // verbose: true,
    // baseDir: ['bundle', 'dist'].includes(path.basename(__dirname)) ? path.join(__dirname, '..') : __dirname,
    replace: true,
    verify: false,
    tsconfig: true,
    tslint: true,
    editorconfig: true,
    tsfmt: true
  } as any).then(() => { })


}

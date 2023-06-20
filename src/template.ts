import * as _ from 'lodash';
import { HelpersSwagger } from './lib/helpers';
import { Models } from './lib/models';


export class Template {

  static get mainIndex() {
    return `export * from './module';
export * from './services';
    `
  }

  static indexExportsTmpl(fileNames: string[]) {
    return fileNames.map(name => {
      return `export * from './${name}';`;
    }).join('\n');
  }

  static importServicesFromFolder(serviceClassName: string[], folderName: string = 'services') {
    return serviceClassName.map(classNameService => {
      return `import { ${classNameService} } from './${folderName}'` + '\n';
    }).join('')
  }

  static templateModule(serviceClassName: string[]) {

    const urls = HelpersSwagger.endpoints.join(',\n')
    let imports = '\n' + this.importServicesFromFolder(serviceClassName) + '\n';

    return `import { NgModule } from '@angular/core';
      import { SimpleResource } from 'ng2-rest';
      SimpleResource.doNotSerializeQueryParams = true;
      ${imports}

      @NgModule({
        imports: [],
        exports: [],
        declarations: [],
        providers: [
          ${serviceClassName.join(',\n')}
        ],
      })
      export class Ng2RestGenModule {
        public static enpointUrls = {
          ${urls}
    }

  }
  `

  }

  static indexJSONcontent(swg: Models.Swagger.SwaggerModel) {
    const serviceNames = swg.tags.map(tag => {
      const serivceFileName = HelpersSwagger.serviceFromTag.className(swg, tag);
      return serivceFileName;
    })
    return `import { Resource } from 'ng2-rest';
`
      + this.indexExportsTmpl(serviceNames);
  }


  static serviceTemplate(swg: Models.Swagger.SwaggerModel, tag: Models.Swagger.SwaggerTag): string {
    const className = HelpersSwagger.serviceFromTag.className(swg, tag);

    return `import { Injectable } from '@angular/core';
import { SimpleResource } from 'ng2-rest';
import { Ng2RestGenModule } from '../../module';

@Injectable()
export class ${className} {

  ${ HelpersSwagger.getAngularPrivatePathesByTag(swg, tag)}

  // public methods
  ${ HelpersSwagger.getAngularServicesMethods(swg, tag)}

      public static unsubscribe() {
    SimpleResource.__destroy();
  }

  constructor() {

  }
} `
  }



}

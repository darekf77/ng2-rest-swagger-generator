

import { indexExportsTmpl } from './index-exports';
import { importServicesFromFolder } from './ts-import-from-folder';
import { SwaggerModel } from "../swagger";

export function templateModule(serviceNames: string[], urls: string) {

    let services = serviceNames.map(name => {
        return name.replace(name.charAt(0), name.charAt(0).toUpperCase()) + 'Service' + '\n';
    }).join();

    let imports = '\n' + importServicesFromFolder(serviceNames, 'services', "Service") + '\n';

    return `import { NgModule } from '@angular/core';
import { SimpleResource } from 'ng2-rest';
SimpleResource.doNotSerializeQueryParams = true;
    ${imports}

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        ${services}
    ],
})
export class Ng2RestGenModule {
    public static enpointUrls = {
        ${urls}
    }

}
`

}
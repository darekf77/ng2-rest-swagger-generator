import { NgModule } from '@angular/core';
      import { SimpleResource } from 'ng2-rest';
      SimpleResource.doNotSerializeQueryParams = true;
      
import { Json0UberApiServiceService } from './services'



      @NgModule({
        imports: [],
        exports: [],
        declarations: [],
        providers: [
          Json0UberApiServiceService
        ],
      })
      export class Ng2RestGenModule {
        public static enpointUrls = {
          Json0:'undefined'
    }

  }
  
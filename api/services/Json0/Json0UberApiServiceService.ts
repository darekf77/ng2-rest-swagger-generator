import { Injectable } from '@angular/core';
import { SimpleResource } from 'ng2-rest';
import { Ng2RestGenModule } from '../../module';

@Injectable()
export class Json0UberApiServiceService {

  private pathes = { 
_v1_estimates_price: new SimpleResource<
{items:{currency_code?:string;
display_name?:string;
estimate?:string;
high_estimate?:number;
low_estimate?:number;
product_id?:string;
surge_multiplier?:number;
}[];
},
any
>( Ng2RestGenModule.enpointUrls.Json0, '/v1/estimates/price' ),
_v1_estimates_time: new SimpleResource<
{items:{capacity?:string;
description?:string;
display_name?:string;
image?:string;
product_id?:string;
}[];
},
any
>( Ng2RestGenModule.enpointUrls.Json0, '/v1/estimates/time' ),
_v1_history: new SimpleResource<
{count?:number;
history:{uuid?:string;
}[];
limit?:number;
offset?:number;
},
any
>( Ng2RestGenModule.enpointUrls.Json0, '/v1/history' ),
_v1_me: new SimpleResource<
{email?:string;
first_name?:string;
last_name?:string;
picture?:string;
promo_code?:string;
},
any
>( Ng2RestGenModule.enpointUrls.Json0, '/v1/me' ),
_v1_products: new SimpleResource<
{items:{capacity?:string;
description?:string;
display_name?:string;
image?:string;
product_id?:string;
}[];
},
any
>( Ng2RestGenModule.enpointUrls.Json0, '/v1/products' )
};

  // public methods
  
publicgetEstimatesPrice= () =>
this.pathes._v1_estimates_price
.model({}) 
.get (); 

publicgetEstimatesTime= () =>
this.pathes._v1_estimates_time
.model({}) 
.get (); 

publicgetHistory= () =>
this.pathes._v1_history
.model({}) 
.get (); 

publicgetMe= () =>
this.pathes._v1_me
.model({}) 
.get (); 

publicgetProducts= () =>
this.pathes._v1_products
.model({}) 
.get (); 


      public static unsubscribe() {
    SimpleResource.__destroy();
  }

  constructor() {

  }
} 
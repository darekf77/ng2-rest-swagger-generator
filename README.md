## ng2-rest-swagger-generator ##

---
From version 3.1.0 if you stil wanna use promises, consider to
use them like this: `getMyElements().take(1).toPromies();`.

---

Generate amazing, fulent api and services for Angular2 from your swagger.json files.

Instalation on your server:

    npm install ng2-rest-swagger-generator -g

Usage:

    ng2-rest-swagger-generator --json LINK_OR_PATH_TO_SWAGGER_JSON --base YOUR_OUTPUT_FOLDER_HERE

**Usage ( in folder where you wanna generate  angualr2  modules with services)**

    ng2-rest-swagger-generateor -json  ~/api_swagger.json --base api
or from link

    ng2-rest-swagger-generateor -json http://api.com/swagger.json  --base api

It will generate **api** folder with angular2 module. 


    ng2-rest-swagger-generateor -json ./swagger.json  
    # output will be generated in api folder

Your can alsow ommit **--base** param, default out folder is **api**

Last thing you need to do is import it your **app.module** :
```ts
    import { Ng2RestGenModule } from './api';
    ...
    imports: [ Ng2RestGenModule ],
    ...
```

It you wanna **change your base paths** just use property **enpointUrl** in Ng2RestGenModule module :

```ts
	if(enviroment.production) {
		Ng2RestGenModule.enpointUrls.myresource.myhost = 'https://myproductionhost.com'
	}
```


Don't forget unsubscribe your generated services in component method **onDestroy**:
```ts
    onDestroy(){
		GeneratedServiceName.unsubscribe();
	}
```


| param | description |
| --- | --- |
| --json | online links or local paths for swagger.json files   |
| --base | output module folder  |
| -s | if https protocole enable (one for all json-s) |


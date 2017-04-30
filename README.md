## ng2-rest-swagger-generator ##

---
From version 3.1.0 if you stil wanna use promises, consider to
use them like this: `getMyElements().take(1).toPromies();`.

---

Generate amazing, fulent api and services for Angular2 from your swagger.json files.

Instalation on your server:

    npm install ng2-rest-swagger-generator -g

**Usage ( in folder where you wanna generate  angualr2  modules with services)**

    ng2-rest-swagger-generateor -p  ~/api_swagger.json
or from link

    ng2-rest-swagger-generateor -h http://api.com/swagger.json 

It will generate **api** folder with angular2 module. 

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
| -l | links for swagger.json files  |
| -p | local pathes for swagger json files  |
| -s | if https protocole enable (one for all json-s) |


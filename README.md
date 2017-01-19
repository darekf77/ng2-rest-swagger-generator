## ng2-rest-swagger-generator ##

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
| param | description |
| --- | --- |
| -l | links for swagger.json files  |
| -p | local pathes for swagger json files  |
| -s | if https protocole enable (one for all json-s) |


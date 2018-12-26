## ng2-rest-swagger-generator ##

Generate services for Angular2+ from your swagger.json files. 

## Instalation 

    npm install ng2-rest-swagger-generator -g

## Usage

    ng2-rest-swagger-generateor \
      --json ~/api_swagger.json \           # local swagger json file  or 
      --json http://api.com/swagger.json \  # external link to swagger json
      --base my_api_from_swagger_json

It will generate **my_api_from_swagger_json** folder with angular2_ module. 

Your can alsow ommit **--base** param, default out folder is "**api**".

## Import

To import generated module in **app.module** of you angular app do this:
```ts
    import { Ng2RestGenModule } from './api';
    ...
    imports: [ Ng2RestGenModule ],
    ...
```
## Api url modyfication

It you wanna **change your base paths** just use property **enpointUrl** in Ng2RestGenModule module :

```ts
	if(enviroment.production) {
		Ng2RestGenModule.enpointUrls.myresource.myhost = 'https://myproductionhost.com'
	}
```

## Parameters description

| param | description |
| --- | --- |
| --json | online links or local paths for swagger.json files   |
| --base | output module folder  |
| -s | if https protocole enable (one for all json-s) |


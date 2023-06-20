//#region @notForNpm

//#region @browser
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-ng2-rest-swagger-generator',
  template: 'hello from ng2-rest-swagger-generator'
})
export class Ng2RestSwaggerGeneratorComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}

@NgModule({
  imports: [],
  exports: [Ng2RestSwaggerGeneratorComponent],
  declarations: [Ng2RestSwaggerGeneratorComponent],
  providers: [],
})
export class Ng2RestSwaggerGeneratorModule { }
//#endregion

//#region @backend
async function start(port: number) {
  console.log('hello world from backend');
}

export default start;

//#endregion

//#endregion
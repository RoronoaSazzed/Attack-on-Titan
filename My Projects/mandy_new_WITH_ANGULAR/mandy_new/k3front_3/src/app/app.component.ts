import { Component,  Inject,   ViewContainerRef , ElementRef, OnInit, DoCheck, OnChanges, Renderer} from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { DatafieldGeneratorService} from './k3/services/datafield-generator.service';
// import { DynamicFormComponent } from './k3/components/dynamic-form.component';

import { K3FormComponent  } from './k3/components/k3-form.component';
import{ VerticalLoaderService } from './k3/services/vertical-loader.service';
import{ K3directiveDirective} from './k3/directives/k3directive.directive';


@Component({
   'moduleId': module.id,
    "selector" : 'my-app',
     'templateUrl': './app.component.html',
    //'template': `<div>start</div><ng-content></ng-content><div>end</div>`,
    styleUrls: [ 'app.component.css'],
    providers: [ DatafieldGeneratorService]
})

export class AppComponent implements OnInit, DoCheck, OnChanges{
  name = "k3 frontend";

  forms : any[] =[];
  formConfig: {};
  formgruppe: FormGroup= null;
  allForms: K3FormComponent[] = [];

  private domNode: HTMLElement = null;


  constructor(@Inject(VerticalLoaderService) service,
              datenfelder: DatafieldGeneratorService,
              @Inject(ViewContainerRef) viewContainerRef,
            @Inject(Renderer) renderer, @Inject(ElementRef) elementRef: ElementRef) {
    service.setRootViewContainerRef(viewContainerRef)
    //service.addDynamicComponent()
    this.domNode = elementRef.nativeElement;

    let forms = datenfelder.getDataFieldsAndGroups();
    this.forms = forms;


  }

  ngDoCheck(){

  }

  ngOnInit(){
    // console.log("do init");
    // debugger;
  }

  onStateChange(event){
    console.log(event);
    if(event['form'] < this.allForms.length){
      this.allForms[event['form'] +1 ].activate();
      if(window['jQuery']){
        let $j = window['jQuery'];
        setTimeout(function()
        {
              $j('html,body').animate({
              scrollTop: $j('#ap'+ ( event['form'] + 1) ).offset().top - 50
            },500);
        }, 50);
      }
    }
  }

  ngOnChanges(){
    // console.log("on changes");
    // debugger;
  }
}

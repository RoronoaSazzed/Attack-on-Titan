import {
    Component,
    ViewChild, ViewContainerRef,  Output,DoCheck, ComponentRef, Input, OnInit, ReflectiveInjector, AfterViewInit,
    Compiler, CUSTOM_ELEMENTS_SCHEMA ,EventEmitter, ComponentFactory, NgModule, ModuleWithComponentFactories, ComponentFactoryResolver
} from '@angular/core';
import{ DynamicFormDatafieldComponent} from './dynamic-form-datafield.component';
import {DataFieldBase} from '../models/datafield-base';
import {RuntimeToBeComponent} from './runtime.component';
import {FormGroup} from '@angular/forms';
import {InBetweenModule} from '../../inbetween.module';


import { CommonModule } from '@angular/common';

@Component({
    selector: 'runtime-content',
    template: `<div #container></div>`,
    entryComponents: [DynamicFormDatafieldComponent]
})
export class RuntimeContentComponent implements OnInit, AfterViewInit, DoCheck{

    @Input() template: string = '<div>\nHello, {{name}}\n</div>';
    @Input() form: FormGroup ;
    @Input() datafields:  {} = {};
    @Input() useddatafields: string[]=[];
    @Input() noLabels: boolean=false;
    @Output() action= new EventEmitter<any>();
    @Input() formState: number = 0;

    myDynamicComponent : any;

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef;

    private componentRef: ComponentRef<{}>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private compiler: Compiler) {
    }

    compileTemplate() {
        let metadata = {
            selector: `runtime-component-sample`,
            template: this.template
        };

        let factory = this.createComponentFactorySync(this.compiler, metadata, RuntimeToBeComponent);

        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }

        // let inputProviders = Object.keys(this.context).map((inputName) => {return {provide: inputName, useValue: this.context[inputName]};});
        let inputProviders = [ {provide: 'datafields', useValue: this.datafields},
                               {provide: 'form', useValue: this.form},
                              {provide: 'formState', useValue: this.formState}];
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.container.parentInjector);

        let daComponent = factory.create(injector);
        daComponent.instance.form = this.form;
        daComponent.instance.datafields = this.datafields;
        daComponent.instance.noLabels = this.noLabels;
        daComponent.instance.formState = this.formState;
        this.myDynamicComponent = daComponent;
        this.container.insert(daComponent.hostView);
        // this.componentRef = this.container.createComponent(factory,0, injector);

        // this.componentRef.instance['datafields'] = this.context['datafields'];
        // this.componentRef.instance['form'] = this.context['form'];
    }

    private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
        const newComponent = class RuntimeContentComponent extends RuntimeToBeComponent{};
        const decoratedCmp = Component(metadata)(newComponent);
        @NgModule({ imports: [CommonModule, InBetweenModule], declarations: [newComponent], entryComponents: [],
          schemas: [ ] })
        class RuntimeComponentModule { }

        let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find(f => f.componentType === decoratedCmp);
    }

    ngOnInit(){
      this.compileTemplate();
    }

    ngAfterViewInit(){
      let self = this;
      this.myDynamicComponent.instance.action.subscribe(val => {
        self.action.emit(val);
      })
    }

    ngDoCheck(){
      this.myDynamicComponent.instance.formState = this.formState;
    }

}

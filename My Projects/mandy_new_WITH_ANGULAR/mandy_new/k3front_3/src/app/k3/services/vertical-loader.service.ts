import {  ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector } from '@angular/core'

import { K3Horizontal } from '../components/k3.horizontal.component'

@Injectable()
export class VerticalLoaderService {

  factoryResolver : ComponentFactoryResolver;
  rootViewContainer: any;


  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver
  }

  setRootViewContainerRef(viewContainerRef) {
    console.log("VerticalLoader - setze Referenz auf RootView");
    console.log(viewContainerRef);
    this.rootViewContainer = viewContainerRef;
  }

  addDynamicComponent() {
    console.log("VerticalLoader - setze dynamisches Element");
   const factory = this.factoryResolver
                       .resolveComponentFactory(K3Horizontal);
   const component = factory
     .create(this.rootViewContainer.parentInjector);
   this.rootViewContainer.insert(component.hostView)
 }

}

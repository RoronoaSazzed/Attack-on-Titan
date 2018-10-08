import { Directive, ElementRef , Renderer } from '@angular/core';

@Directive({
  selector: 'k3directive',

})
export class K3directiveDirective {

  constructor(elem: ElementRef, renderer: Renderer ) {
         console.log(elem);
         console.log("HI");
         renderer.setElementStyle(elem.nativeElement,'boxshadow','5px 5px 5px blue');
      }

}

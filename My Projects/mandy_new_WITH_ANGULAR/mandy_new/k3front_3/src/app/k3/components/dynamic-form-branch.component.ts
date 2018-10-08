import { Component, Input, Output, OnInit, OnChanges,DoCheck, ElementRef }  from '@angular/core';
import { FormGroup, FormControl }                 from '@angular/forms';

import { DataFieldBase }              from '../models/datafield-base';
import { FormBranchControlService} from '../services/form-branch-control.service';


@Component({
  selector: 'app-dynamic-form-branch',
  templateUrl: '../html/dynamic-form-branch.component.html',

})
export class DynamicFormBranchComponent implements OnInit , OnChanges, DoCheck{

  private currentBranchingContent: string = '<p>Test branch content</p>';
  @Input() formBranchControlService: FormBranchControlService;

  constructor(private elementRef: ElementRef) {

  }

  ngOnChanges(){
    console.log("sth. changed changes");
  }

  ngDoCheck(){
    console.log("sth. changed check");
    this.setBranchingContent();
  }

  ngOnInit() {

  }

  setBranchingContent(){
    let contentString = this.formBranchControlService.getCurrentContent();
    if( contentString != ''){
      let content = document.createRange().createContextualFragment( this.formBranchControlService.getCurrentContent());
      this.elementRef.nativeElement.innerHTML ='';
      this.elementRef.nativeElement.appendChild(content);
    }
  }



}

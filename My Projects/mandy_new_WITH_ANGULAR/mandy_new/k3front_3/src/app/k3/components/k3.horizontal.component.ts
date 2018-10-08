import { Component , Input, OnInit, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataFieldBase } from '../models/datafield-base';
import { DataFieldGroup } from '../models/datafield-group';
import { DatafieldControlService } from '../services/datafield-control.service';
import { FormBranchControlService} from '../services/form-branch-control.service';
import { DynamicFormDatafieldComponent } from './dynamic-form-datafield.component';
import { DynamicFormBranchComponent} from './dynamic-form-branch.component';
import { DynamicFormDatafieldGroupComponent} from './dynamic-form-group.component';
import { K3FormComponent  } from './k3-form.component';


@Component({
  // moduleId: module.id,
  selector: 'k3horizontal',
  styleUrls: [ '../css/k3.horizontal.component.css'],
  templateUrl: '../html/k3.horizontal.component.html',
  providers: [DatafieldControlService, FormBranchControlService],

})

export class K3Horizontal extends K3FormComponent implements AfterViewInit{


  currentReal = 0;

  datafields: DataFieldBase<any>[] = [];
  groups: {} = {};
  // showgroups: DataFieldGroup[] = [];
  fields2groups: {} = {};
  fields2showgroups: {} = {};
  branches: {} = {};
  title: string = '';
  @Input() formNumber : number = 1;


  next(){
    var group = this.realGroups[this.current];
    if(!group.isValid && ! this.showgroups[this.current].hidden){
      return;
    }
    this.current++;
    if(this.showgroups[this.current].hidden){
      this.next();
    }
  }

  prev(){

    if(this.showHidden){
      this.stopShowHidden();
      return;
    }

    if(this.current > 0 || this.formBranchControlService.isBranching()){
      if(this.formBranchControlService.isBranching()){
        this.formBranchControlService.reset();
      }else{
        this.current--;
        if(this.showgroups[this.current].hidden){
          this.prev();
        }
      }
    }
  }

  getCurrent(){
    return this.current;
  }

  ngOnInit(){
    super.ngOnInit();
    this.form = this.datafieldControlService.toFormGroup(this.formConfig['fields'], this.keys2fields);
    this.datafields = this.formConfig['fields'];
    this.groups = this.formConfig['groups'];
    this.showgroups = this.formConfig['showgroups'];
    this.fields2groups = this.formConfig['fields2groups'];
    this.fields2showgroups = this.formConfig['fields2showgroups'];
    this.branches = this.formConfig['branches'];
    this.title = this.formConfig['title'] || '';

    this.formBranchControlService.setConfig(this.branches, this.form,this.datafields);
    this.initializeHiddenGroups();

    this.form.valueChanges.subscribe( variable => {
      let self = this;
      for(let field of this.datafields){
        let value= field.label.replace(/{{(.*)}}/gi, function (x, p1) {
            if(self.form.value[p1]){
                //self.ref.detectChanges();
                return self.form.value[p1] ;
            }else{
                return p1;
            }
        });
        field.setFinalLabel(value);
      }

      for(let group of this.showgroups){
        let value= group.name.replace(/{{(.*)}}/gi, function (x, p1) {
            if(self.form.value[p1]){
                //self.ref.detectChanges();
                return self.form.value[p1] ;
            }else{
                return p1;
            }
        });
        if(value!= group.finalLabel){
          group.setFinalLabel(value);
        }
      }
    })

  }


  changedLabel(obj:any){
    for( let field of this.datafields){
      if(field.key == obj['key']){
          field.setFinalLabel(obj['newlabel']);
      }
    }
  }

  onAction(obj:any){
    console.log("child action received");
    console.log(obj);
    if(obj && obj.action){
      switch(obj.action){
        case "submit":
          this.onSubmit(obj);
          break;
        case 'nexthidden_1':  /*should be changed to nexthidden_? or something*/
        case 'nexthidden_2':
        case 'nexthidden_3':
        case 'nexthidden_4':
        case 'nexthidden_5':
          this.gotoHidden(obj.action);
          break;
      }
    }
  }

  ngAfterViewInit(){

  }
}

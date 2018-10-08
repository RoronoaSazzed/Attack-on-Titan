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
  selector: 'k3vertical',
  styleUrls: [ '../css/k3.vertical.component.css'],
  templateUrl: '../html/k3.vertical.component.html',
  providers: [DatafieldControlService, FormBranchControlService],

})

export class K3Vertical extends K3FormComponent {


  currentReal = 0;
  datafields: DataFieldBase<any>[] = [];

  groups: {} = {};
  // showgroups: DataFieldGroup[] = [];
  fields2groups: {} = {};
  fields2showgroups: {} = {};
  branches: {} = {};
  title: string = '';
  subTitle: string = '';
  class: string = '';
  @Input() accordionId : string = 'k3vertical';
  @Input() formNumber : number = 1;
  maxReachedGroup = 0;






  next(){
    var group = this.realGroups[this.current];
    if(!group.formarray.valid && !group.hidden){
      return;
    }
    this.current++;
    if(this.realGroups[this.current].hidden){
      this.next();
    }
  }

  prev(){
    if(this.current > 0 || this.formBranchControlService.isBranching()){
      if(this.formBranchControlService.isBranching()){
        this.formBranchControlService.reset();
      }else{
        this.current--;
        if(this.realGroups[this.current].hidden){
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
    this.subTitle = this.formConfig['subTitle'] || '';
    this.class = this.formConfig['class'] || '';
    this.formBranchControlService.setConfig(this.branches, this.form,this.datafields);

    if(this.formState === 1){
      this.current = Object.keys(this.groups).length -1 ;
      this.maxReachedGroup = this.current;
    }

    for(let i = 0; i < this.showgroups.length; i++){
      this.openGroups.push(false);
    }

    if(this.formState === 0){
      this.openGroups[0] = true;
    }



    // this.form.valueChanges.subscribe( variable => {
    //   let self = this;
    //   for(let field of this.datafields){
    //     let value= field.label.replace(/{{(.*)}}/gi, function (x, p1) {
    //         if(self.form.value[p1]){
    //             //self.ref.detectChanges();
    //             return self.form.value[p1] ;
    //         }else{
    //             return p1;
    //         }
    //     });
    //     field.setFinalLabel(value);
    //   }
    //
    //   for(let group of this.showgroups){
    //     let value= group.name.replace(/{{(.*)}}/gi, function (x, p1) {
    //         if(self.form.value[p1]){
    //             //self.ref.detectChanges();
    //             return self.form.value[p1] ;
    //         }else{
    //             return p1;
    //         }
    //     });
    //     if(value!= group.finalLabel){
    //       group.setFinalLabel(value);
    //     }
    //   }
    // })

  }



  changedLabel(obj:any){
    for( let field of this.datafields){
      if(field.key == obj['key']){
          field.setFinalLabel(obj['newlabel']);
      }
    }
  }

  onAction(obj:any){

    if(obj && obj.action){
      switch(obj.action){
        case "submit":
          this.onSubmit(obj);
          break;

        case "goto":
            if(obj.group <= this.maxReachedGroup){
              this.openGroups[obj.group] = ! this.openGroups[obj.group];
            }
          break;

        case "next":
            let next = obj.group;
            let nextForm = false;
            do{
                if( next < this.showgroups.length -1){
                  next++;
                  this.current = next;

                  this.maxReachedGroup = Math.max(this.current, this.maxReachedGroup);
                }else{
                  nextForm = true;
                }
            }while(this.realGroups[this.current].hidden
                      || this.realGroups[this.current].currentlyDisabled
                      && this.current != this.showgroups.length -1);

            for(let i=0;i < this.showgroups.length ;i++){
              if(i !== this.current){
                this.openGroups[i] = false;
              }else{
                this.openGroups[i] = true;
              }
            }

            if(nextForm){
              this.stateChange.emit({form : this.formNumber, state: 3});
            }else{
              if(window['jQuery']){
                let $j = window['jQuery'];
                let self = this;
                setTimeout(function()
                {
                      $j('html,body').animate({
                      scrollTop: $j('#s'+ self.formNumber + '-' + self.current).offset().top - (42 + self.current * 50)
                    },500);
                }, 50);
              }
            }
          break;
      }
    }
  }

  registerGroup(group: DynamicFormDatafieldGroupComponent){
    super.registerGroup(group);

    this.openGroups.push(false);
  }
  groupHeadingClick(event){
    
  }

}

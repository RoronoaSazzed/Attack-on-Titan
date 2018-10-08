import { Component, Input, OnInit , Output,EventEmitter} from '@angular/core';
import { DynamicFormDatafieldGroupComponent} from './dynamic-form-group.component';
import { DataFieldGroup} from '../models/datafield-group';
import { FormGroup, FormArray} from '@angular/forms';
import { DatafieldControlService} from '../services/datafield-control.service';
import { FormBranchControlService} from '../services/form-branch-control.service';

@Component({
  template:''
})
export class K3FormComponent implements OnInit{
    @Input() formConfig: {} = {};
    @Input() formNumber: number =0;
    @Input() allForms : K3FormComponent[] = [];
    @Output() stateChange = new EventEmitter<any>();
    keys2fields: {}={};
    current = 0;
    showCurrent = 0;
    realGroups: DynamicFormDatafieldGroupComponent[] = [];
    form: FormGroup;
    showHidden: boolean = false;
    showHiddenNum: number = 0;
    hiddenGroups: number[]=[];
    lastBeforeHidden: number = 0;
    showGroupNumbers : number[] = [];
    showgroups: DataFieldGroup[] = [];
    formaction= '#';
    payLoad: string = null;
    disabled : boolean =false;
    formState : number = 0; // 0 -> ausfüllbar, 1-> successfully ausgefüllt, 2 -> noch nicht ausfüllbar
    formCount: number = 0;
    checkUrl : string = '/';
    activateError: string= null;
    opened : boolean =false;
    openGroups: boolean[] = [];
    hasSpinner: boolean = false;
    bodyCss : string = '';

    constructor( public datafieldControlService: DatafieldControlService, public formBranchControlService: FormBranchControlService){

    }

    // isCurrentValid(){
    //   var group = this.realGroups[this.current];
    //   return group.formarray.valid || group.hidden;
    //
    // }

    registerGroup(group: DynamicFormDatafieldGroupComponent){
      this.realGroups.push(group);
      this.form.addControl(group.title, group.formarray);
    }

    initializeHiddenGroups(){
      let realIndex = 0;
      for(let i = 0; i < this.showgroups.length; i++){
        if(this.showgroups[i].hidden){
          this.hiddenGroups.push(i);
          this.showGroupNumbers.push(realIndex);
        }else{
          this.showGroupNumbers.push(realIndex++);
        }
      }
    }

    gotoHidden(whichOne){
      console.log(whichOne);
      let i : number =0;
      /* should be changed to "explode" and take number after "_" */
      switch(whichOne){
        case 'nexthidden_2':
          i = 1;
          break;
        case 'nexthidden_3':
          i = 2;
          break;
        case 'nexthidden_4':
          i = 3;
          break;
        case 'nexthidden_5':
          i = 4;
          break;
      }
      this.showHiddenGroup( i < this.hiddenGroups.length ? i : 0);
    }

    showHiddenGroup(number){
      console.log("shwoing group number " + number );
      this.lastBeforeHidden = this.current;
      this.showHidden = true;
      this.showHiddenNum = this.hiddenGroups[number];
      this.current = this.hiddenGroups[number];
      this.showCurrent = this.lastBeforeHidden;
    }

    stopShowHidden(){

      this.current = this.lastBeforeHidden;
      this.showHidden = false;
      this.showHiddenNum = 0;
      this.showCurrent = this.current;
    }

    submitToServer(url:string, data :{}, datafield: any){
      datafield.responseMessage = '';
      datafield.isErrorResponse =false;
      url = url + '?formCount='+ this.formCount;
      let self = this;
      let win=window;
      data[datafield.key]=true;
      if(win['jQuery']){
        let $ = win['jQuery'];
        $.ajax({
          url: url,
          method: 'post',
          data: data,
          dataType:  'json',
          success: function(data, status){
            if(data.status == true){
              datafield.alreadySentSuccessfully = true;
              datafield.responseMessage = data.msg;
              datafield.isErrorResponse = false;
              if(self.bodyCss != ''){
                document.getElementsByTagName('body')[0].classList.remove(self.bodyCss);
              }
              self.doSuccess();
            }else{
              datafield.alreadySentSuccessfully = false;
              datafield.isOnSubmit = false;
              datafield.responseMessage = data.msg;
              datafield.isErrorResponse = true;
            }
          },
          error: function(request,status,error){
            datafield.alreadySentSuccessfully = false;
            datafield.isOnSubmit = false;
            datafield.responseMessage = '<p>Ein unbekannter Fehler ist geschehen, bitte Wiederholen Sie den Vorgang später erneut</p>';
            datafield.isErrorResponse = true;
          }
        })

      }
    }

    onSubmit(obj: any){
      this.submitToServer(obj.id.options['actionUrl'],this.form.value, obj.id);
    }

    ngOnInit(){
      this.keys2fields = this.formConfig['keys2fields'];
      this.bodyCss = this.formConfig['bodyCss'];
      this.disabled = this.formConfig['disabled'] ? true : false;
      this.formState = this.formConfig['formState'] ;
      if(this.formState != 2){
        this.opened = true;
      }else{
        this.opened = false;
      }

      this.formCount = this.formConfig['formCount'];
      this.checkUrl = this.formConfig['checkUrl'];
      this.allForms.push(this);
      if(this.formState ==  0 ){
        if(this.bodyCss != '') {
          document.getElementsByTagName('body')[0].classList.add(this.bodyCss);
        }
      }
    }

    doSuccess(){
      this.formState = 1;
      this.stateChange.emit({form: this.formNumber, newState: this.formState});
    }

    activate(){
      if(this.formState !== 2){
        return;
      }
      this.activateError= null;
      let win=window;
      let self = this;
      this.hasSpinner = true;
      if(window['jQuery']){
        let $ = win['jQuery'];
        $.ajax({
          url: this.checkUrl+"?formCount="+this.formCount,
          method: 'post',
          data: {'check': true},
          dataType:  'json',
          success: function(data, status){
            if(data.status == true){
              console.log(data);
              self.formState = 0;
              self.form.patchValue(data.payload);
              self.opened = true;
              self.openGroups[0] = true;
              self.hasSpinner = false;
              if (self.bodyCss != '') {
                  document.getElementsByTagName('body')[0].classList.add(self.bodyCss);
              }

            }else{
              console.log(data);
              self.activateError = data.msg;
              self.hasSpinner = false;
            }
          },
          error: function(request,status,error){
            self.activateError = "Ein unbekannter technischer Fehler ist aufgetreten";
          }
        })
      }
    }

    toggleOpened(){
      this.opened = !this.opened;
    }
}

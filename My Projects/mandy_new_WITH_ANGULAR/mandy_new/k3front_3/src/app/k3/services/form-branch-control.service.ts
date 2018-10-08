import { Injectable }   from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { FormControl, AbstractControl,FormGroup, Validators } from '@angular/forms';

import { DataFieldBase } from '../models/datafield-base';

@Injectable()
export class FormBranchControlService {

  branching: boolean = false;
  currentContent: string = '';
  form: FormGroup;
  branchings: {} = {};
  datafields: DataFieldBase<any>[] = [];


  constructor() { }

  setConfig( branchings: {}, form: FormGroup, datafields: DataFieldBase<any>[]){
    this.branchings = branchings;
    this.form = form;
    this.datafields = datafields;
  }

  isBranching(){
    return this.branching;
  }

  toggle(){
    this.branching = !this.branching;
  }

  reset(){
    this.branching = false;
  }

 /**
  *  - checks if for key branchings exist
  *  - if they exist, for every branching the condition function will be return
  *    until the first match occures
  *  - if the match occures, then it's content will be taken and the state
  *    will be set to "branching"
  */
  reCalculate(key: string, formctl: AbstractControl ){
    if(this.branchings[key]){
      for( let branchname in  this.branchings[key]){
        let branch = this.branchings[key][branchname];
        if(branch.function){
          if( branch.function(formctl.value,this.form.value)){
            switch(branch.type){
              case 'show_text':                
                this.currentContent = branch.text;
                break;
            }
            this.branching = true;
            return;
          }
        }
      }
    }
  }

  getCurrentContent(){
    return this.currentContent;
  }

}

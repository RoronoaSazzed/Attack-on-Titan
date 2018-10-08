import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators , FormArray} from '@angular/forms';

import { DataFieldBase } from '../models/datafield-base';
import { CheckboxDataField} from '../models/datafield-checkbox';
import { RadioDataField} from '../models/datafield-radio';

@Injectable()
export class DatafieldControlService {
  constructor() { }

  toFormGroup(questions: DataFieldBase<any>[], keys2fields: { [key:string]: DataFieldBase<any>} ) {
    let group: any = {};

    questions.forEach(question => {
      let validators = [];

      if(question.controlType==='file'){
          if(question.value){
            group[question.key] = new FormControl(question.value, null);
          }else{
            group[question.key] = new FormControl(null, validators);
          }
      }else{
        if(question.controlType === 'value'){
            let ctl = new FormControl(question.value || '');
            ctl.disable();
            group[question.key] = ctl;
        }else{
          group[question.key] = new FormControl(question.value || '', validators);
        }
      }
      question.setFormControl(group[question.key]);

      if(question.controlType == 'checkbox'){
        //group[question.key].valueChanges.subscribe(console.log);
      }
    });

    let frmGrp = new FormGroup(group);

    questions.forEach(question =>{
      question.setFormGroup(frmGrp,keys2fields);
    });

    return frmGrp;

  }

  generateCheckboxControls(checkbox: CheckboxDataField){
     // let frmArray : FormControl[] = [];
     // checkbox.options.map( (el,index) => {
     //   frmArray.push(new FormControl(checkbox.value[index] ? checkbox.value[index] : false));
     // })
     // return new FormGroup({ checkbox.key : frmArray});
  }
}

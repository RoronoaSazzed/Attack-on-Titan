import { DataFieldBase } from './datafield-base';
import { FormControl} from '@angular/forms';

export class TimeDataField extends DataFieldBase<string> {
  controlType = 'time';
  type: string = 'text';
  options = {};
  model : Date = new Date();
  viewControl: FormControl = null;

  constructor(options: {} = {}) {
    super(options);
    this.class="timepicker";
    this.options = options['options'] || {};
    this.model.setHours(8);
    this.model.setMinutes(0);
    this.viewControl = new FormControl(this.model);
  }

  setFormControl(frmctl : FormControl){
    super.setFormControl(frmctl);
    let self = this;
    this.formControl.valueChanges.subscribe( val => {
      if(typeof val === "string" ){
          let split = val.split(':');
          self.model.setHours(Number.parseInt(split[0]));
          self.model.setMinutes(Number.parseInt(split[1]));
      }
    });

    this.viewControl.valueChanges.subscribe( val => {
      if(val instanceof Date ){
          let timestring = '';
          timestring += ( val.getHours() < 10 ? '0' : '') + val.getHours().toString() +":";
          timestring += ( val.getMinutes() < 10 ? '0' : '') + val.getMinutes().toString();
          this.formControl.setValue(timestring,{ emitEvent: false, onlySelf:true});
      }
    });

  }

  getValueForSummary(){
    return this.formControl.value + " Uhr";
  }
}

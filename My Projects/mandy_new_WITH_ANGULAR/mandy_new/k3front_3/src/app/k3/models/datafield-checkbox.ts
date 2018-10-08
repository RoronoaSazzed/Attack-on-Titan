import { DataFieldBase } from './datafield-base';
import{FormControl} from '@angular/forms';

export class CheckboxDataField extends DataFieldBase<boolean> {
  controlType = 'checkbox';
  boxValue : string = 'true';
  boxLabel: string = 'Ja';
  default: string = '';

  constructor(options: {} = {}) {
    super(options);
    this.placeholder = false;
    this.boxValue = options['boxValue'] || 'true';
    this.boxLabel = options['boxLabel'] || 'true';
    this.options = options['options'] || [];
    this.value = options['value'] === "1" || options['value'] === 1 || options['value'] === true ? true : false  ;
  }

  getValueForSummary(val){
    if(val === "1" || val === 1 || val === true){
      // return this.boxLabel.replace(/(<([^>]+)>)/ig,"");
      return 'Ja';
    }
    return 'keine Angabe';
  }

  getLabelForSummary(){
    return this.boxLabel.replace(/(<([^>]+)>)/ig,"")
  }

}

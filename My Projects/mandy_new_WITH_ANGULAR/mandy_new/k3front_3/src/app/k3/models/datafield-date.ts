import { DataFieldBase } from './datafield-base';

export class DateDataField extends DataFieldBase<string> {
  controlType = 'textbox';
  type: string = 'text';
  options = {};

  constructor(options: {} = {}) {
    super(options);
    this.class="datepicker";
    this.options = options['options'] || {};
    if(this.placeholder){
      console.log(this.key + " uses placeholder");
    }
  }
}

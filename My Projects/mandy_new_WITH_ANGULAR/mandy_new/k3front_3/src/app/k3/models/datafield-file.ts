import { DataFieldBase } from './datafield-base';

export class FileDataField extends DataFieldBase<string> {
  controlType = 'file';
  default: string = '';
  actionUrl: string = '';

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.actionUrl = this.options['actionUrl'] || '';
    if(this.value){
      this.required = true;
      // this.currentlyDisabled = true;
    }
  }
  
}

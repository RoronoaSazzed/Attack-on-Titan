import { DataFieldBase } from './datafield-base';

export class TextboxDataField extends DataFieldBase<string> {
  controlType = 'textbox';

  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';

    if(this.key =='password' || this.key =='password_confirm'){
      this.type = 'password';
    }
  }
}

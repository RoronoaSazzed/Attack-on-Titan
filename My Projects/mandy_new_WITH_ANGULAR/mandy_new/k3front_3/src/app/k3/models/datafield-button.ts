import { DataFieldBase } from './datafield-base';

export class ButtonDataField extends DataFieldBase<string> {
  controlType = 'button';
  options = {};
  type : string;
  alreadySentSuccessfully: boolean = false;
  isOnSubmit : boolean = false;
  responseMessage: string = '';
  isErrorResponse : boolean = false;

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.type = options['type'] || 'submit';
  }
}

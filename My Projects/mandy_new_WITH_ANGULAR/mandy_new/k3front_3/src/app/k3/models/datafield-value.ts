import { DataFieldBase } from './datafield-base';

export class ValueDataField extends DataFieldBase<any> {
  controlType = 'value';

  type: any;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';  
  }
}

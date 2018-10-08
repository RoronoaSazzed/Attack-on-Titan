import { DataFieldBase } from './datafield-base';

export class DependentDataField extends DataFieldBase<string> {
  controlType = 'showText';
  content: string = '';

  constructor(options: {} = {}) {
    super(options);
    this.content = options['content'] || '';
    this.label = '';
    this.finalLabel = '';
  }
}

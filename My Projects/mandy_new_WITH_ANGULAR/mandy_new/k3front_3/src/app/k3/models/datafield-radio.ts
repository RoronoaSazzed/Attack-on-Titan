import { DataFieldBase } from './datafield-base';

export class RadioDataField extends DataFieldBase<string> {
  controlType = 'radio';
  options: {key: string, value: string}[] = [];
  keyValueMap: { } = {};
  keyIndexMap: {} = {};
  default: string = '';

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    let index = 0;
    for(let choice of this.options){
      this.keyValueMap[choice.key] = choice.value;
      this.keyIndexMap[choice.key] = index;
      index++;
    }
  }

  getValueForSummary(val): string{
    if(this.options[val]){
      return this.keyValueMap[val];
    }
    else{
      return 'keine Angabe';
    }
  }
}

import { DataFieldBase } from './datafield-base';

export class DropdownDataField extends DataFieldBase<string> {
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];
    keyValueMap: { } = {};

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    for(let choice of this.options){
      this.keyValueMap[choice.key] = choice.value;
    }
  }

  getValueForSummary(val){
    if(this.options[val]){
      return this.keyValueMap[val];
    }
    else{
      return 'keine Angabe';
    }
  }
}

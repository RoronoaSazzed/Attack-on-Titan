import { OnInit , Component, Input, EventEmitter, Output, DoCheck} from '@angular/core';
import { DataFieldBase} from '../models/datafield-base';
import { FormGroup} from '@angular/forms';
import { DynamicFormDatafieldComponent} from './dynamic-form-datafield.component';

export class RuntimeToBeComponent implements OnInit, DoCheck{
  @Input() public datafields: {} = {};
  @Input() public form: FormGroup;
  @Input() noLabels : boolean= false;
  @Input() formState: number = 0;
  @Output() public action = new EventEmitter<any>();


  public name : string = "Meier mÜLLER Schulze";
  ngOnInit(){
    //console.log(this);
  }

  ngDoCheck(){
    //console.log(this);
  }
  onAction(event){
    //console.log(event);
    this.action.emit(event);
  }
} ;

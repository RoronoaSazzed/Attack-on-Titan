import { FormControl, FormGroup, Validators , AbstractControl, ValidatorFn} from '@angular/forms';

export class DataFieldBase<T>{
  value: T;

  options: {};

  key: string;
  label: string;
  finalLabel: string;

  order: number;
  controlType: string;
  class: string;
  group: any;
  showgroup: any;
  tooltip : string;

  placeholder: boolean = false;

  hideLabel: boolean = false;

  formControl: FormControl = null;
  formGroup : FormGroup = null;

  rules : any[] = []; //the validation rules
  conditions: any[]= []; //show conditions
  conditionStats: any[] = [];
  currentlyDisabled : boolean = false;
  generallyDisabled : boolean = false;
  required: boolean;
  errors: any[] = [];
  dataFields: {}= {};
  showRequired = false;

  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      class?: string,
      placeholder?: boolean;
      rules?: [any],
      conditions?: any,
      group? : any,
      hideLabel?: boolean,
      showgroup? : any,
      tooltip?: string,
      condition?: any,
      options?: {},
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.finalLabel = this.label;
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.class = options.class || '';
    this.group = options.group || '';
    this.showgroup = options.showgroup || '';
    this.hideLabel = options.hideLabel ? true : false;
    this.tooltip = options.tooltip || null;
    this.options = options.options || {};
    this.conditions = options.conditions || [];
    this.placeholder = options.placeholder ? true : false;
    this.rules = options.rules || [];

  }

  setFinalLabel(finalLabel: string){
    this.finalLabel = finalLabel;
  }

  setFormControl(frmctl : FormControl){
    this.formControl = frmctl;
  }

  setFormGroup(frmgrp: FormGroup, datafields: {}){
    this.formGroup = frmgrp;
    this.dataFields = datafields;
    let index = 0;
    let self = this;

    for(let condition of this.conditions){
      this.conditionStats[index] = true;
      switch(condition['type']){
        case 'equals':
        case 'notEquals':
        case 'notEmpty':
        case 'notNull':

          if(condition['field'] != undefined && this.formGroup.controls[condition['field']]){
              let x = function(num) {
                self.formGroup.controls[condition['field']].valueChanges.subscribe( val => {
                self.onOtherChangeValue(val, condition['field'], num,true);
              });

            }(index);

            //init
            this.onOtherChangeValue(this.formGroup.controls[condition['field']].value, condition['field'], index, false);
          }
          break;

        case 'fn':
          if(condition['fields']){
            let allFieldsThere = true;
            for(let fieldlists of condition['fields']){
              for(let field of fieldlists){
                  allFieldsThere = allFieldsThere && this.formGroup.controls[field] !== undefined;
                }
            }
            if(allFieldsThere){
              for(let fieldlist of condition['fields']){
                for(let field of fieldlist){
                  let y = function(num, feld) {
                    self.formGroup.controls[feld].valueChanges.subscribe( val => {
                    self.onOtherChangeValue(val, feld, num,true);});
                  }(index, field);
                  this.onOtherChangeValue(this.formGroup.controls[field].value, field, index, false);
                }
              }
            }
          }
          break;
        }

      index++;
    }

    this.checkConditionStats();
    this.setValidators();

  }

  onOtherChangeValue(val, field, ruleNumber, checkStats){
    switch(this.conditions[ruleNumber].type){
      case 'equals':
        if(Array.isArray(this.conditions[ruleNumber]['value'])){
          this.conditionStats[ruleNumber] = true;
          for(let value of this.conditions[ruleNumber]['value']){
            this.conditionStats[ruleNumber] = this.conditionStats[ruleNumber] && val == value;
          }
        }else{
          this.conditionStats[ruleNumber] = val == this.conditions[ruleNumber]['value'];
        }
        break;
      case 'notEquals':
        if(Array.isArray(this.conditions[ruleNumber]['value'])){
          this.conditionStats[ruleNumber] = true;
          for(let value of this.conditions[ruleNumber]['value']){
            this.conditionStats[ruleNumber] = this.conditionStats[ruleNumber] && val != value;
          }
        }else{
          this.conditionStats[ruleNumber] = val != this.conditions[ruleNumber]['value'];
        }
        break;
      case 'notEmpty':
        this.conditionStats[ruleNumber] = val !== null && val !== '' && val != 0;
        break;
      case 'notNull':
        this.conditionStats[ruleNumber] = val !== null && val !== '';
        break;
      case 'fn':
        switch(this.conditions[ruleNumber]['function']){
          case 'notequalfields':
            let result = false;
            for(let fields of this.conditions[ruleNumber]['fields']){
                result = result ||  this.fn_notEqualFields(fields[0],fields[1]);
            }
            this.conditionStats[ruleNumber] = result;
          break;

          default:
              this.conditionStats[ruleNumber] = false;
        }
    }

    this.checkConditionStats();

  }

  checkConditionStats(){
    let result = true;
    if(this.conditions.length === 0){
      return true;
    }
    let i=0;
    do{
      result = this.conditionStats[i] && result;
      i++;
    }
    while(i < this.conditions.length);
    if(this.currentlyDisabled == result){
      this.currentlyDisabled = ! result;
      this.setValidators();
      if(this.currentlyDisabled){
        this.formControl.disable();
      }else{
        this.formControl.enable();
      }
    }


    return result;
  }

  fn_notEqualFields(field1,field2){
    return this.formGroup.controls[field1].value !== this.formGroup.controls[field2].value;
  }

  setValidators(){

    if(this.currentlyDisabled){
      this.formControl.clearValidators();
      this.showRequired = false;
    }else{
      let validators = [];
      for(let rule of this.rules){
        switch(rule['type']){
          case 'plz':
            validators.push(this.plzValidator('Keine gültige Postleitzahl'));
            break;
          case 'confirm':
            validators.push(this.confirmValidator(
                              this.formGroup.controls[rule['otherField']],
                              'Muss mit "' + this.dataFields[rule['otherField']].finalLabel + '" übereinstimmen' ));
            let self0= this;
            this.formGroup.controls[rule['otherField']].valueChanges.subscribe(val=>{
                self0.formControl.updateValueAndValidity({ emitEvent:false, onlySelf:true});
            })
            break;
          case 'requiredAny':
            validators.push(this.requiredAnyValidator('Bitte angeben'));
              this.showRequired = true;
            break;
          case 'email':
          validators.push(this.emailValidator('Bitte eine gültige E-Mail-Adresse angeben'));
            break;
          case 'requiredTrue':
            validators.push(this.requiredTrue('Muss "Ja" sein'));
            this.showRequired = true;
            break;
          case 'requiredFalse':
            validators.push(this.requiredFalse('Darf nicht "Ja" sein'));
            this.showRequired = true;
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(rule['max']));
            break;
          case 'minLength':
            validators.push(Validators.minLength(rule['min']));
            break;
          case 'specialNumber':
            validators.push(this.specialNumberValidator(rule['from'],rule['to']));
            break;
          case 'requiredOn':
            // this.showRequired = true;
            let self = this;
            validators.push(this.requiredOnValidator(
                              this.formGroup.controls[rule['otherField']],
                              'Wird wegen "' + this.dataFields[rule['otherField']].finalLabel + '" benötigt'));
            this.formGroup.controls[rule['otherField']].valueChanges.subscribe(val=>{
                if(val === '' || val === null){
                  this.showRequired = false;
                }else{
                  this.showRequired = true;
                }
                self.formControl.updateValueAndValidity();
            })
            break;

            case 'beforeDate':
              let self2 = this;
              validators.push(this.requiredBeforeFieldOrDateValidator(
                      rule['otherField'] ? this.formGroup.controls[rule['otherField']]: null,
                      rule['altDate'] ? rule['altDate']: null,
                      rule['offset'] ? Number.parseInt(rule['offset']) : 0
                ));
                if(rule['otherField']){
                  this.formGroup.controls[rule['otherField']].valueChanges.subscribe(val=>{
                      self2.formControl.updateValueAndValidity({ emitEvent:false, onlySelf:true});
                  })
                }
                break;
            case 'afterDate':
              let self3 = this;
              validators.push(this.requiredAfterFieldOrDateValidator(
                      rule['otherField'] ? this.formGroup.controls[rule['otherField']]: null,
                      rule['altDate'] ? rule['altDate']: null,
                      rule['offset'] ? Number.parseInt(rule['offset']) : 0,
                ));
                if(rule['otherField']){
                  this.formGroup.controls[rule['otherField']].valueChanges.subscribe(val=>{
                      self3.formControl.updateValueAndValidity({ emitEvent:false, onlySelf:true});
                  })
                }
                break;


        }

      }

      if(this.class === 'datepicker'){
        validators.push(Validators.pattern(/\d\d\.\d\d.\d\d\d\d/));
      }

      if(this.required){
        validators.push(Validators.required);
      }
      this.formControl.setValidators(validators);
      this.formControl.updateValueAndValidity({onlySelf:true,emitEvent:false});
      // for(let i =0; i < this.rules.length; i++){
      //
      // }
    }
  }

  plzValidator( msg: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(control.value ==  ''){
        return null;
      }
      const plzMatch = /^[0-9]{5}/.test(control.value);
      return plzMatch ? null : {'plz': {"msg": msg, "value": control.value}};
    }
  }

  emailValidator( msg: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(control.value == '') {
        return null;
      }

      const emailMatch = /.+@.{3,}\..{2,}/.test(control.value);
      return emailMatch ? null : {'email': {"msg": msg, "value": control.value}};
    }
  }


  confirmValidator( ctl: AbstractControl, msg: string): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      const confirm = ctl.value === control.value;
      return confirm ? null : {'confirm': {"msg": msg, "value": control.value}};
    }
  }

  requiredAnyValidator( msg: string): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      const   requiredAny = control.value !== '' && control.value !== undefined && control.value !== null;
      return   requiredAny ? null : {'requiredAny': {"msg": msg, "value": control.value}};
    }
  }

  requiredFalse(msg: string): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      const   requiredFalse = (control.value === false
                            || control.value === "0"
                            || control.value === 0 )
                            && control.value !== undefined && control.value !== null;
      return   requiredFalse ? null : {'requiredFalse': {"msg": msg, "value": control.value}};
    }
  }

  requiredTrue(msg: string): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      const   requiredTrue = (control.value === true
                            || control.value === "1"
                            || control.value > 1
                            || Number.parseInt(control.value) > 1
                            || control.value === 1 )
                            && control.value !== undefined && control.value !== null;
      return   requiredTrue ? null : {'requiredTrue': {"msg": msg, "value": control.value}};
    }
  }

  specialNumberValidator( from: number, to: number): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      const intval = Number.parseInt(control.value);
      const   specialNumber = intval !== NaN && intval >= from && intval <= to;
      return   specialNumber ? null : {'specialNumber': {"msg": "Zahl von " + from + " bis " + to}};
    }
  }

  requiredOnValidator(  ctl: AbstractControl, msg): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      const requiredOn = ( ! ctl.value || ctl.value === undefined || ctl.value ==="") ||
                        ( control.value != '' && control.value != null && control.value !== undefined);
      return   requiredOn ? null : {'requiredOn': {"msg": msg, 'value': control.value}};
    }
  }

  requiredBeforeFieldOrDateValidator( ctl: AbstractControl, altDate: string, days:number = 0): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      let requiredBeforeFieldOrDate = false;
      let now = new Date();
      let cmpDate = ctl ? ctl.value : altDate || now.toLocaleDateString('de-DE');
      let ourDate = control.value ? control.value : null;
      cmpDate = cmpDate.replace(/[^0-9\.]*/g,''); //for IE setting direction markers
      let parts = cmpDate.split('.');

      cmpDate = new Date(parts[2],Number.parseInt(parts[1]) -1,days +  Number.parseInt(parts[0]));


      if(ourDate){
        parts = ourDate.split('.');
        ourDate = ourDate.replace(/[^0-9\.]*/g,''); //for IE setting direction markers
        ourDate = new Date(parts[2],Number.parseInt(parts[1])-1,parts[0]);
        requiredBeforeFieldOrDate = ourDate < cmpDate;
      }
      return   requiredBeforeFieldOrDate ? null : {'requiredBeforeFieldOrDate': {"msg": "Das Datum muss vor dem " + this.formatDate(cmpDate) + ' liegen', 'value': control.value}};
    }
  }

  requiredAfterFieldOrDateValidator( ctl: AbstractControl, altDate: string, days:number = 0): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
      let requiredAfterFieldOrDate = false;
      let now = new Date();
      let cmpDate = ctl ? ctl.value : altDate || now.toLocaleDateString('de-DE');
      let ourDate = control.value ? control.value : null;
      cmpDate = cmpDate.replace(/[^0-9\.]*/g,''); //for IE setting direction markers
      let parts = cmpDate.split('.');
      cmpDate = new Date(parts[2],Number.parseInt(parts[1])-1,days +  Number.parseInt(parts[0]));


      if(ourDate){
        parts = ourDate.split('.');
        ourDate = ourDate.replace(/[^0-9\.]*/g,''); //for IE setting direction markers
        ourDate = new Date(parts[2],Number.parseInt(parts[1])-1,parts[0]);
        requiredAfterFieldOrDate = ourDate > cmpDate;
      }
      return   requiredAfterFieldOrDate ? null : {'requiredAfterFieldOrDate': {"msg": "Das Datum muss nach dem " + this.formatDate(cmpDate) + ' liegen', 'value': control.value}};
    }
  }

  getValueForSummary(val){
    return val;
  }

  getLabelForSummary(){
    return this.finalLabel;
  }

  formatDate(date: Date){
    var options = {
      year: "numeric", month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString('de-DE', options);
  }

}

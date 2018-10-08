import { FormArray, FormControl, FormGroup, AbstractControl} from '@angular/forms';
import { Input, Component, Output, AfterViewInit, EventEmitter, OnInit, DoCheck,ElementRef, OnChanges} from '@angular/core';
import { DataFieldBase} from '../models/datafield-base';
import { DataFieldGroup} from '../models/datafield-group';
import { K3FormComponent} from './k3-form.component';
import {RuntimeContentComponent} from './runtime-content.component';
// import {DynamicFormDatafieldComponent} from './dynamic-form-datafield.component';

@Component({

  selector: 'app-formgroup',
  templateUrl: '../html/dynamic-form-group.component.html',

})

export class DynamicFormDatafieldGroupComponent implements DoCheck, OnInit, AfterViewInit{
  @Input() datafieldgroup: DataFieldGroup;
  @Input() form: FormGroup;
  @Input() style: string = '';
  @Input() groupNumber: number = 0;
  @Input() accordionId: string = 'k3-only-accordion';
  @Input() datafields: {} = {};
  @Output() onAction = new EventEmitter<any>();
  @Input() parentRealGroups : DynamicFormDatafieldGroupComponent[];
  @Input() current : number = 0;
  @Input() noLabels: boolean= false;
  @Input() maxGroups : number = 100;
  @Input() formNumber: number = 0;
  @Input() formState: number = 0;
  @Input() openGroup: boolean[] = [];

  hideable: boolean = false;
  template: string = ''
  subtemplate: string = '<p>to be calculated</p>';
  context: {} = { datafields: this.datafields, form: this.form}
  fieldCounter: number = 0;
  formarray: FormArray;
  public hidden: boolean = false;
  content = [];
  title = '';
  finalLabel = '';
  showGroup : boolean = true;
  levels : any[] = [];
  levelHeadings: any[] = [];
  @Input() nolabels: boolean = false;
  currentlyDisabled: boolean = false;
  levelFields: any[][] = [];
  levelCurrentlyDisabled: any[] = [];
  levelErrors: any[] = [];
  levelValid: boolean[]= [];
  currentLevel: number =0;
  maxLevels : number = 0;
  isValid: boolean = true;
  maxReachedLevel = 0;


  constructor(private elementRef: ElementRef) {

  }

  calcIsValid(){
    let valid = true;

    for(let i=0; i < this.levelFields.length; i++){
        let level = this.levelFields[i];
        let validLevel = true;
        for(let field of level){
          validLevel = validLevel && ( field.formControl.valid || field.currentlyDisabled) ;
          if(!validLevel){
            // console.log("form: " + this.formNumber + " gruppe: "+  this.groupNumber + " level " + i + " fieldkey: " + field.key + " INvalid" );
            break;
          }
        }
        // console.log("form: " + this.formNumber +" gruppe: "+  this.groupNumber + " level " + i + " !Valid!" );
        valid = valid && ( this.levelValid[i] = validLevel);
    }
    if(this.formState === 1){
      return true;
    }
    return valid;
  }

  ngDoCheck(){
    this.parseTitle();
    this.currentlyDisabled = !this.hasGroupShowableInputs();
    this.isValid = this.calcIsValid();
  }

  doAction(event){
    if(event.action === 'instantTocuh'){
      this.instantTouch();
      return;
    }
    this.onAction.emit(event);
    return false;
  }

  ngOnInit(){

      let controls = [];
      this.title = this.datafieldgroup.name;
      this.finalLabel = this.title;
      this.hidden = this.datafieldgroup.hidden;
      this.hideable = this.datafieldgroup.hideable;
      for(let el of this.datafieldgroup.elements){
         var {n , t} = el;
        if(t === 'field'){
          controls.push(this.form.controls[n]);
          // this.content.push({type: 'field', content: n});
          this.content.push(n); //pushing the fieldnames in the list
        }else{
          this.content.push({type: 'plain', content: t});
        }
      }
      // this.formarray = new FormArray(controls);
           // this.parent.registerGroup(this);
      this.parentRealGroups.push(this);
      // this.form.addControl(this.title, this.formarray);
      this.template = this.datafieldgroup.template;
      let count = 0;
      let self = this;

      this.template = this.template.replace(/###Level#(.*)####/gi, function (x, p1) {
          count++;
          self.levelHeadings.push(p1);
          return '###LEVEL###';
        });


      //check for LEVEL Fields
      let countForFields = this.template.split('###LEVEL###');
      this.maxLevels = countForFields.length;
      count = 0;

      for(var i =0; i < countForFields.length; i++){
        this.levelFields[i] || this.levelFields.push([]);
        this.levelCurrentlyDisabled[i] || this.levelCurrentlyDisabled.push(false);
        this.levelValid[i] || this.levelValid.push(true);
        countForFields[i].replace(/(###FIELD###)/gi, function (x, p1) {
            self.levelFields[i].push(self.datafields[self.content[count]]);
            count++;
            return '###LEVEL###';
          });
      }

      count =0;
      this.subtemplate = this.template.replace(/(###FIELD###)/gi, function (x, p1) {
          count++;
          return '<app-datafield [formState]="formState" [datafield]="datafields[\'' + self.content[count-1] +'\']" [form]="form" [nolabel]="noLabels" (onAction)="onAction($event)"></app-datafield>';
        });


      this.levels = this.subtemplate.split('###LEVEL###');
      this.levelHeadings.unshift(null);

      if(this.levels[0] === ''){

        this.currentLevel = 1;
      }

      this.currentlyDisabled = !this.hasGroupShowableInputs();
      if(this.groupNumber == 0){
        this.hideable = false;
      }

        //console.log(this.subtemplate);
    }

  ngAfterViewInit(){

    let i=0;
    for(let el of this.content){
      let {type,content} = el;
      if(type==="plain"){
        if( content != ''){
          let domContent = document.createRange().createContextualFragment( content);
          let collection = this.elementRef.nativeElement.getElementsByClassName('content-'+i);
        }
      }
      i++;
    }
  }

  //#TODO put label-replacement into a service
  parseTitle(){
      let self = this;
      let value= this.title.replace(/{{(.*)}}/gi, function (x, p1) {
          if(self.form.value[p1]){
              //self.ref.detectChanges();
              return self.form.value[p1];
          }else{
              return p1;
          }
      });
      this.finalLabel = value;
  }

  sectionHeaderClick(obj:any){

    if(this.levels[0] === ''){

      this.setCurrentLevel(null,1);
    } else{
      this.setCurrentLevel(null,0);
    }
    this.onAction.emit({action: 'goto', group: this.groupNumber});
    obj.stopPropagation();
    obj.preventDefault();
  }

  gotoNext(){
    if(this.currentLevel === this.maxLevels -1){
      if(this.isValid){
        this.onAction.emit({action: 'next', group: this.groupNumber})
      }
    }else{
      this.currentLevel++;
      this.maxReachedLevel = Math.max(this.maxReachedLevel,this.currentLevel);
      if(this.levelCurrentlyDisabled[this.currentLevel]){
        this.gotoNext();
      }else{
        if(window['jQuery']){
          let $j = window['jQuery'];
          let self = this;
          setTimeout(function()
          {
                $j('html,body').animate({
                scrollTop: $j('a[href="#s'+ self.formNumber + '-' + self.groupNumber + '-' + self.currentLevel+ '"]' ).offset().top - 90
              },500);
          }, 50);
        }
      }
    }
  }

  hasGroupShowableInputs(){

    let show = false;
    for(let field of this.datafieldgroup.elements){
      show = show || ! this.datafields[field.n].currentlyDisabled;
    }

    for(let i = 0; i < this.levelFields.length; i++){
      let levelshow = false;

      for(let field of this.levelFields[i]){
        levelshow = levelshow || ! field.currentlyDisabled;
      }
      this.levelCurrentlyDisabled[i] = !levelshow;
    }

    this.showGroup = show;
    return show;
  }

  setCurrentLevel(obj, number:number){
    if(this.currentLevel === number){
      return true;
    }

    if(this.currentLevel !== number
      && (this.levelValid[this.currentLevel] || number < this.currentLevel)
      && ( number <= this.maxReachedLevel || this.currentLevel === this.maxReachedLevel && number === this.maxReachedLevel +1) ){
      if(obj){
        obj.preventDefault();
        obj.stopPropagation();
      }
      if(this.maxReachedLevel === this.currentLevel && number === this.maxReachedLevel + 1){
        this.gotoNext();
      }else{
        this.currentLevel = number;
      }
    }else{
      this.instantTouch();
      if(obj){
        obj.preventDefault();
        obj.stopPropagation();
      }
    }

  }

  countField(i){
    //console.log(i);
  }

  instantTouch(){

    if(  !this.levelValid[this.currentLevel]  && this.formState === 0){
      
      for(let el of this.levelFields[this.currentLevel]){
        el.formControl.markAsTouched();
        el.formControl.markAsDirty();
      }
    }
  }
}

import { DataFieldBase} from './datafield-base';
import { FormGroup, AbstractControl} from '@angular/forms';

export class DataFieldGroup{
  public elements: {n: string, t: string}[] = [];
  public name: string = '';
  public finalLabel: string = '';
  public datafields : DataFieldBase<any> [] = [];
  public groupNumber : number = 0;
  public hidden: boolean= false;
  public template: string  ='<p>keine Einträge</p>';
  public hideable: boolean = false;
  public hasDataReview : boolean =false;

  constructor(options: {
    elements : {n: string,t: string}[],
    groupNumber: number,
    template : string,
    name?:  string,
    hidden?: boolean,
    hideable?: boolean,
    hasDataReview?: boolean


  }){

    this.elements = options.elements || [];
    this.groupNumber = options.groupNumber || 0;
    this.name = options.name || '';
    this.finalLabel = this.name.replace(/{{(.*)}}/gi,function(x,p1){ return p1});
    this.hidden = options.hidden === undefined ? false : options.hidden;
    this.template = options.template ;
    this.hideable = options.hideable || false;
    this.hasDataReview = options.hasDataReview || false;

  }

  setFinalLabel(label:string){
    this.finalLabel = label;
  }


}

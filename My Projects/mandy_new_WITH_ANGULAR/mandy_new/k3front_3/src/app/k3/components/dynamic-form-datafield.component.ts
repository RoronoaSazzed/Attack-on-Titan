import { Component, Input, EventEmitter,ApplicationRef , ElementRef, Output, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod} from '@angular/http';
import { FormGroup , FormControl, Validator, Validators}        from '@angular/forms';
import { Observable} from  'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import { DataFieldBase }     from '../models/datafield-base';

@Component({
  selector: 'app-datafield',
  templateUrl: '../html/dynamic-form-datafield.component.html',
})
export class DynamicFormDatafieldComponent implements OnInit, AfterViewInit,DoCheck {
  @Input() datafield: DataFieldBase<any>;
  @Input() form: FormGroup;
  @Input() nolabel: false;
  @Output() onAction = new EventEmitter<any>();
  @Input() formState : number = 0;
  // @Output() labelChanged = new EventEmitter<any>();
   daLabel : string = '';
   datepickeractive:boolean =false;
   oldEndDate: string = null;
   oldStartDate: string = null;
   fileNameAfterSubmit = '';
   hasSpinner : boolean = false;
   infoPressed : boolean = false;
   radioTouched: boolean = false;


  constructor(public ref: ApplicationRef, public http: Http, public nativeElement: ElementRef) {

  }

  markRadioTouched(){
    this.radioTouched = true;
  }

  markRadioUnTouched(){
    this.radioTouched = false;
  }

  get isValid() { return this.form.controls[this.datafield.key].valid; }
  get isTouched() {
    if(this.datafield.class === 'datepicker'){
      return this.form.controls[this.datafield.key].dirty;
    }
    return this.form.controls[this.datafield.key].touched || this.radioTouched;
  }

  ngOnInit(){
    this.daLabel= this.parseLabel();
    if(this.datafield.controlType==='file'){
      if(this.datafield.value){
        this.fileNameAfterSubmit = this.datafield.value;
        // this.form.controls[this.datafield.key].disable();
      }
    //console.log(this);
    }

  }

  onChange(obj:any){
    //console.log("onchange");
  }

  ngDoCheck(){

    let oldLabel = this.daLabel;
    this.daLabel = this.parseLabel();

    if(this.datafield.class == "datepicker" && this.datepickeractive){
      this.handleDatepicker();
    }
    if(this.datafield.controlType == 'checkbox'){
      let content = document.createRange().createContextualFragment( this.datafield['boxLabel'] );
      let el = document.getElementById(this.datafield.key + '-html-box-label');
      if(el){
        el.innerHTML='';
        el.appendChild(content);
        if(this.datafield.required || this.datafield.showRequired ) {
          el.lastElementChild.innerHTML += ' *';
        }
      }
    }

    if(this.datafield.controlType == 'button'){
      let content = document.createRange().createContextualFragment( this.datafield['responseMessage']);
      let el = document.getElementById(this.datafield.key + '-response');
      if(el){
        el.innerHTML='';
        el.appendChild(content);
      }
    }
  }

  onSubmit(){
    //console.log("dynamicFormdatafieldcomponent submit was pressed");
    this.onAction.emit({action: "submit", id: this.datafield});
    return false;
  }

  doAnyaction(action: any){

    if(this.datafield.controlType=='button' && action == "submit"){
      this.datafield['isOnSubmit'] = true;
    }
    this.onAction.emit({action: action, id : this.datafield});
    return false;
  }

  doInstantTouch(){
    if(this.datafield.controlType==='button' && this.datafield.options['action'] === 'submit'){
      this.onAction.emit({action: 'instantTocuh', id: this.datafield});
    }
  }

  onDateChanged(e: any){
    this.form.controls[this.datafield.key].setValue(e.target.value);
  }

  parseLabel(){
    let self = this;
    let value= this.datafield.label.replace(/{{(.*)}}/gi, function (x, p1) {
        if(self.form.value[p1]){
            //self.ref.detectChanges();
            return self.form.value[p1];
        }else{
            return p1;
        }
    });
    return value;

  }

  submitButtonDisabled(){
    if(this.formState !== 0){
      return true;
    }
    if(this.datafield['alreadySentSuccessfully'] || this.datafield['isOnSubmit']){
      return true;
    }
    // debugger
    if(this.datafield.controlType=='button' && this.datafield.options['action'] =='submit'){
      if(this.datafield.options['fields'] == undefined){
        return null;
      }

      for(let fieldname of this.datafield.options['fields']){
        let valid = true;
        if(this.form.controls[fieldname]){
          valid = ( this.form.controls[fieldname].valid || this.form.controls[fieldname].disabled) && valid;
        }
        if(! valid){
          return true;
        }
      }
    }
    return null;
  }

ngAfterViewInit(){

  if(this.datafield.controlType == 'showText'){
    let content = document.createRange().createContextualFragment(this.datafield['content']);
    document.getElementById(this.datafield.key+ '-showText').appendChild(content);
  }

  if(this.datafield.class == "datepicker"){
    this.handleDatepicker();
  }

  if(this.datafield.tooltip !== ""){
    let content = document.createRange().createContextualFragment(this.datafield.tooltip);
    document.getElementById(this.datafield.key+'-tooltip').appendChild(content);
  }

  if(this.datafield.controlType==='checkbox'){
    let self= this;
    this.form.controls[this.datafield.key].valueChanges.subscribe(val=>{
      let field = document.getElementById(self.datafield.key);
      if(field != null){
        field['checked'] = val? true:false;
      }
    })

    this.form.controls[this.datafield.key].patchValue(this.datafield.value);
  }

  if(this.datafield.controlType === 'radio'){    
    if(this.datafield.options[this.datafield.value] !== undefined){
      let field2 = document.getElementById(this.datafield.key+"-"+this.datafield['keyIndexMap'][this.datafield.value]);
      if(field2){
        document.getElementById(this.datafield.key+"-"+this.datafield['keyIndexMap'][this.datafield.value])['checked'] =true;
      }
    }

  }

}

fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, 'application_proof');
        let headers = new Headers();
        this.hasSpinner = true;
        /** In Angular 5, including the header Content-Type can invalidate your request */
        // headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        this.http.post(this.datafield['actionUrl'], formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                data => {
                  if(data.status === true){
                    this.fileNameAfterSubmit=file.name;
                    this.form.controls[this.datafield.key].patchValue(file.name);
                    this.datafield.value = file.name;

                  }else{
                      this.fileNameAfterSubmit = data.msg;
                  }
                  this.hasSpinner = false;
                },
                error =>{
                  this.fileNameAfterSubmit = 'Ein unbekannter Fehler ist aufgetreten';
                  this.hasSpinner = false;
              }
            )
    }
}

handleCheckBox( event){
  this.form.controls[event.target.id].setValue(event.target.checked);
}

  handleDatepicker(){
    let win = window;
    let self = this;
    let endDate;
    let startDate;
    let x;

    switch(this.datafield.options['maxDate']){
        case undefined:
        case 'NONE':
          endDate='';
          break;
        case "NOW":
          x = new Date();
          endDate= x.getTime();
          break;
        default:
          x = this.getDateFromFormattedField(this.form.controls[this.datafield.options['maxDate']].value);
          endDate = x.getTime();
          break;
    }

    switch(this.datafield.options['minDate']){
        case undefined:
        case 'NONE':
          startDate='';
          break;
        case "NOW":
          x = new Date();
          startDate= x.getTime();
          break;
        default:
          x = this.getDateFromFormattedField(this.form.controls[this.datafield.options['minDate']].value);
          startDate = x.getTime();
          break;
    }

    if(endDate !== ''){

      if(this.datafield.options['additionMax']){
        endDate = new Date(endDate + this.datafield.options['additionMax'] * 3600 * 24  * 1000);
        // debugger;
      }else{
        endDate = new Date(endDate );
      }
      endDate = endDate.getDate() + '.' +( endDate.getMonth() +1) + '.'+ endDate.getFullYear();
    }

    if(startDate !== ''){

      if(this.datafield.options['additionMin']){
        startDate = new Date(startDate + Number.parseInt(this.datafield.options['additionMin']) * 3600 * 24  * 1000);
        // debugger;
      }else{
        startDate = new Date(startDate );
      }
      startDate = startDate.getDate() + '.' +( startDate.getMonth() +1) + '.'+ startDate.getFullYear();
    }

    if(win["jQuery"]){
      if(this.datepickeractive && ( endDate != this.oldEndDate || startDate != this.oldStartDate)){
        win["jQuery"]('#'+this.datafield.key+'.datepicker').datepicker('destroy');
        this.datepickeractive = false;
      }

      if(! this.datepickeractive){
        win["jQuery"]('#'+this.datafield.key+'.datepicker').datepicker({
          "language": "de",
          "endDate": endDate,
          "startDate": startDate,
          "autoclose": true,
        })
        .on('changeDate',function(e){
          self.onDateChanged(e);
        });
        this.datepickeractive=true;
        this.oldEndDate = endDate;
        this.oldStartDate = startDate;
       }
     }
  }

  getDateFromFormattedField(fieldValue){
    if(fieldValue){
      var parts = fieldValue.match(/(\d+)/g);
  // note parts[1]-1
      return new Date(parts[2], Number.parseInt(parts[1])-1, parts[0]);
    }else{
      return new Date();
    }
  }

  toggleInfoPressed(){
    this.infoPressed = ! this.infoPressed;
  }

  evaluateOptionCondition(expression: string){
    if(expression === "true"){
      return true;
    }
    let condition = expression.split(',');
    let value = this.form.controls[condition[0]].value;
    switch(condition[1]){
      case '==':
        return value == condition[2];
      case '!=' :
        return value != condition[2];
    }
    return false;
  }

  radioButtonClick($event,data){

    if(this.formState !== 0){
      return;
    }
    // this.datafield.formControl.patchValue(data);
    for(let i = 0; i < this.datafield.options;i++){
      document.getElementById(this.datafield.key + "-" + i)['checked']=false;
    }
    document.getElementById(this.datafield.key + "-" + data)['checked']=true;
    this.datafield.formControl.setValue(this.datafield.options[data].key);
    this.markRadioTouched();
    $event.stopPropagation();
    $event.preventDefault();

  }

}

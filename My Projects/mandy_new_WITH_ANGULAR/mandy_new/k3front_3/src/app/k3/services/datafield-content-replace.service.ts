import { Injectable} from '@angular/core';
import { FormControl, FormGroup, AbstractControl} from '@angular/forms';
import {DataFieldBase} from '../models/datafield-base';

@Injectable()
export class DataFieldContentReplaceService {
  form: FormGroup;
  datafields: DataFieldBase<any>[] = [];
 //ToDO -> fill me

}

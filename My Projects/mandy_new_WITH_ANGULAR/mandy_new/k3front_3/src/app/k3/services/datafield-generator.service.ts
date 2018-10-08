import { Injectable }       from '@angular/core';

import { DropdownDataField } from '../models/datafield-dropdown';
import { DataFieldBase }     from '../models/datafield-base';
import { DataFieldGroup }   from '../models/datafield-group';
import { TextboxDataField }  from '../models/datafield-textbox';
import { ButtonDataField}   from '../models/datafield-button';
import { RadioDataField}   from '../models/datafield-radio';
import { DateDataField} from '../models/datafield-date';
import { CheckboxDataField } from '../models/datafield-checkbox';
import { FileDataField} from '../models/datafield-file';
import { ValueDataField} from '../models/datafield-value';
import { DependentDataField} from '../models/datafield-dependent';
import { TimeDataField} from '../models/datafield-time';

@Injectable()
export class DatafieldGeneratorService {

  public disableAllFields : boolean = false;

  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
getDataFieldsAndGroups(){
    let forms: any[]=[];
    let dataFields: DataFieldBase<any>[] = [];
    let keys2fields: {}={};
    let groups: {} = { none: []};
    let field2groups: {} = { };
    let field2showgroups: {} = { };
    let tmpField : DataFieldBase<any>= null;
    let branchings: {} = {};

    if(window['formPayload'] && window['formPayload']['forms']){
      for(let formconfig of window['formPayload']['forms']){
        dataFields= [];
        groups = { none: []};
        field2groups = {};
        field2showgroups = {};
        branchings = {}
        keys2fields = {};

        if(formconfig['fields']){
          for(let i of formconfig['fields'] ){

            switch(i.ctlType){

              case 'date':
                i['ctlType'] = 'textbox';
                i['type']   = 'date';
                i['class'] = 'datepicker';
                tmpField = new DateDataField(i);
                break;
              case 'textbox':
                i['ctlType'] = 'textbox';
                tmpField = new TextboxDataField(i);
                break;
              case 'dropdown':
                tmpField = new DropdownDataField(i);
                break;
              case 'button':
                tmpField = new ButtonDataField(i);
                break;
              case 'radio':
                tmpField = new RadioDataField(i);
                break;
              case 'checkbox':
                tmpField = new CheckboxDataField(i);
                break;
              case 'file':
                tmpField = new FileDataField(i);
                break;
              case 'value':
                tmpField = new ValueDataField(i);
                break;
              case 'showText':
                tmpField = new DependentDataField(i);
                break;
              case 'time':
                tmpField = new TimeDataField(i);
                break;
            }

            dataFields.push(tmpField);
            keys2fields[tmpField.key]=tmpField;
            //add to groups-list - semantic groups data belonging to eachother, should
            //actually be shown in same optical group
            if(tmpField.group){
              if(! groups[tmpField.group]){
                 groups[tmpField.group] = []
               }
               groups[tmpField.group].push(tmpField.key);
            }else{
              groups['none'].push(tmpField);
            }

            //add to fields2groups list
            field2groups[tmpField.key] = tmpField.group || 'none';

          }
        }

        if(formconfig['branches']){
          branchings = formconfig['branches'];
        }

        let showGroups = this.manageGroups(formconfig['groups']);
        let form = { fields: dataFields,
                 type: formconfig['type'],
                 formCount: formconfig['formCount'] ,
                 checkUrl: formconfig['checkUrl'],
                 formState: formconfig['formState'] !== undefined ? formconfig['formState'] : 0,
                 groups: groups,
                 bodyCss: formconfig['bodyCss'],
                 fields2groups: field2groups,
                 showgroups: showGroups,
                 keys2fields: keys2fields,
                 fields2showgroups: field2showgroups,
                 title: formconfig['title'],
                 subTitle: ( formconfig['subTitle'] || ''),
                 class: (formconfig['class'] || 'kitaklage'),
                 branches: branchings}
       forms.push(form);
     }
   }

    return forms;
  }

  manageGroups(groupsconfig){
    let groups: DataFieldGroup[]= [];
      if(groupsconfig){
        let i = 0;
        for(let group of groupsconfig){
          let title: string= group['title'] || '';

          groups.push(new DataFieldGroup({
            name:  title,
            elements: group['elements'],
            hasDataReview: group['hasDataReview'] || false,
            template: group['text'],
            hidden: group['hidden'] || false,
            hideable: group['hideable'] || false,
            groupNumber: i
          }));
          i++;
      }
    }
    return groups;
  }

}

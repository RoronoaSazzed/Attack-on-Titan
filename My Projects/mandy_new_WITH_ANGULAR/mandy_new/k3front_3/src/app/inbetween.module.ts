import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { BrowserModule} from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { JsonpModule, HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { K3Horizontal } from './k3/components/k3.horizontal.component';
import { K3Vertical } from  './k3/components/k3.vertical.component';
import { DynamicFormDatafieldComponent} from './k3/components/dynamic-form-datafield.component';
import { DynamicFormDatafieldGroupComponent } from './k3/components/dynamic-form-group.component';
import { DynamicFormBranchComponent } from './k3/components/dynamic-form-branch.component';
import { RuntimeContentComponent} from './k3/components/runtime-content.component';

import { VerticalLoaderService } from './k3/services/vertical-loader.service';
// import { DynamicLoaderService } from './k3/services/dynamic-loader.service';
import { K3directiveDirective } from './k3/directives/k3directive.directive';
import { RuntimeToBeComponent} from './k3/components/runtime.component';
import { TimepickerModule} from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [CommonModule, FormsModule,ReactiveFormsModule, TimepickerModule.forRoot()],
  declarations: [DynamicFormDatafieldComponent],
  exports: [DynamicFormDatafieldComponent]
})
export class InBetweenModule{};

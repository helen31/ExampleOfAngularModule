import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipboardModule } from 'ngx-clipboard';

import { AdmRoutingModule } from './adm-routing.module';

import { AdmComponent } from './adm.component';
import { CorporationListComponent } from './corporation-list/corporation-list.component';
import { PharmacyListComponent } from './pharmacy-list/pharmacy-list.component';
import { AddCorporationComponent } from './actions/add-corporation/add-corporation.component';
import { EditCorporationComponent } from './actions/edit-corporation/edit-corporation.component';
import { DeleteCorporationComponent } from './actions/delete-corporation/delete-corporation.component';
import { DeleteCorporationDirective } from './directives/delete-corporation.directive';
import { AddPharmacyComponent } from './actions/add-pharmacy/add-pharmacy.component';
import { EditPharmacyComponent } from './actions/edit-pharmacy/edit-pharmacy.component';
import { DeletePharmacyComponent } from './actions/delete-pharmacy/delete-pharmacy.component';
import { DeletePharmacyDirective } from './directives/delete-pharmacy.directive';
import { SubheaderCorpComponent } from '../shared/subheader/subheader-corp/subheader-corp.component';
import { SubheaderPharmComponent } from '../shared/subheader/subheader-pharm/subheader-pharm.component';
import { ToolbarCorpComponent } from '../shared/toolbar/toolbar-corp/toolbar-corp.component';
import { ToolbarPharmacyComponent } from '../shared/toolbar/toolbar-pharmacy/toolbar-pharmacy.component';
import { DeleteInputValueComponent } from './delete-input-value/delete-input-value.component';
import { FilterCorpComponent } from '../shared/filter/filter-corp/filter-corp.component';
import { FilterPharmComponent } from '../shared/filter/filter-pharm/filter-pharm.component';

import { AdmService } from './adm.service';
import { ActionsService } from './actions/actions.service';
import { SharedModule } from '../shared/shared.module';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { InformServiceComponent } from './inform-service/inform-service.component';
import { InformService } from './inform-service/inform-service.service';
import { ShowDynamicFormComponent } from './dynamic-form/show-dynamic-form.component';
import { DynamicFormService } from './dynamic-form/dynamic-form.service';
import { FormInputComponent } from './dynamic-form/components/form-input/form-input.component';
import { FormCheckboxComponent } from './dynamic-form/components/form-checkbox/form-checkbox.component';
import { DynamicFieldDirective } from './dynamic-form/components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FormTitleComponent } from './dynamic-form/components/form-title/form-title.component';

@NgModule({
  declarations: [
    AdmComponent,
    CorporationListComponent,
    PharmacyListComponent,
    AddCorporationComponent,
    EditCorporationComponent,
    DeleteCorporationComponent,
    DeleteCorporationDirective,
    AddPharmacyComponent,
    EditPharmacyComponent,
    DeletePharmacyComponent,
    DeletePharmacyDirective,
    SubheaderCorpComponent,
    SubheaderPharmComponent,
    ToolbarPharmacyComponent,
    ToolbarCorpComponent,
    DeleteInputValueComponent,
    FilterCorpComponent,
    FilterPharmComponent,
    CopyToClipboardDirective,
    InformServiceComponent,
    ShowDynamicFormComponent,
    DynamicFormComponent,
    FormInputComponent,
    DynamicFieldDirective,
    FormTitleComponent,
    FormCheckboxComponent
  ],
  entryComponents: [
    DeleteCorporationComponent,
    DeletePharmacyComponent,
    FormInputComponent,
    FormTitleComponent,
    FormCheckboxComponent
  ],
  imports: [
    CommonModule,
    AdmRoutingModule,
    ClipboardModule,
    SharedModule
  ],
  providers: [
    ActionsService,
    AdmService,
    InformService,
    DynamicFormService
  ]
})
export class AdmModule {}

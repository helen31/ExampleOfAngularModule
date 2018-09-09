import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddCorporationComponent } from './actions/add-corporation/add-corporation.component';
import { EditCorporationComponent } from './actions/edit-corporation/edit-corporation.component';
import { CorporationListComponent } from './corporation-list/corporation-list.component';
import { EditPharmacyComponent } from './actions/edit-pharmacy/edit-pharmacy.component';
import { AddPharmacyComponent } from './actions/add-pharmacy/add-pharmacy.component';
import { PharmacyListComponent } from './pharmacy-list/pharmacy-list.component';
import { AdmComponent } from './adm.component';
import { InformServiceComponent } from './inform-service/inform-service.component';
import { ShowDynamicFormComponent } from './dynamic-form/show-dynamic-form.component';
import { DynamicCorpFormResolver } from './dynamic-form/dynamic-corp-form-resolver.service';
import { DynamicPharmFormResolver } from './dynamic-form/dynamic-pharm-form-resolver.service';
import { UsersComponent } from '../shared/users/users.component';
import { AddUserComponent } from '../shared/users/actions-user/add-user/add-user.component';
import { ActionsUserComponent } from '../shared/users/actions-user/actions-user.component';

const admRoutes: Routes = [
  {
    path: '', component: AdmComponent, children: [
      { path: '', redirectTo: 'corporations', pathMatch: 'prefix' },
      { path: 'corporations', component: CorporationListComponent },
      { path: 'corporations/search/:idValue', component: CorporationListComponent},
      { path: 'corporations/:id/pharmacies', component: PharmacyListComponent },
      { path: 'corporations/:id/pharmacies/search/:idValue', component: PharmacyListComponent},
      { path: 'add-corporation', component: AddCorporationComponent },
      { path: 'corporations/:id/add-pharmacy', component: AddPharmacyComponent },
      { path: 'edit-corporation/:id', component: EditCorporationComponent },
      { path: 'corporations/:id/edit-pharmacy/:idPharm', component: EditPharmacyComponent },
      { path: 'corporations/:id/inform-service', component: InformServiceComponent },
      { path: 'corporations/:id/dynamic-form/:idSub', component: ShowDynamicFormComponent,
        resolve: {
          config: DynamicCorpFormResolver
        }
      },
      { path: 'corporations/:id/pharmacies/dynamic-form/:idSub', component: ShowDynamicFormComponent,
        resolve: {
          config: DynamicPharmFormResolver
        }
      },
      { path: 'corporations/:id/user-management', component: UsersComponent },
      { path: 'corporations/:id/user-management/search/:idValue', component: UsersComponent },
      { path: 'corporations/:id/user-management', component: ActionsUserComponent, children: [
          { path: 'add-user', component: AddUserComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(admRoutes)
  ],
  providers: [DynamicCorpFormResolver, DynamicPharmFormResolver],
  exports: [RouterModule]
})
export class AdmRoutingModule{}

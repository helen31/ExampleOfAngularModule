import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { LoginLayoutComponent } from './core/layouts/login-layout/login-layout.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard'
import { BiComponent } from './bi/bi.component';
import { UserPermissionGuard } from './auth/user-permission.guard';
import { ModulesResolver } from './auth/modules-resolver.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '',
        loadChildren: './auth/auth.module#AuthModule'
      }
    ]
  },
  {
    path: '', component: MainLayoutComponent,
    canActivateChild: [AuthGuard],
    resolve: {
      userData: ModulesResolver
    },
    children: [
      { path: 'adm',
        loadChildren: './adm/adm.module#AdmModule',
        canActivate: [UserPermissionGuard],
        data: {
          id: '3'
        }
      },
      { path: 'bi', component: BiComponent,
        canActivate: [UserPermissionGuard],
        data: {
          id: '1'
        }
      },
      { path: 'vault',
        loadChildren: 'app/vault/vault.module#VaultModule',
        canActivate: [UserPermissionGuard],
        data: {
          id: '2'
        }
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard, ModulesResolver, UserPermissionGuard],
  exports: [RouterModule]
})
export class AppRoutingModule{}

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { map, take } from 'rxjs/internal/operators';

import { DynamicFormService } from './dynamic-form.service';
import { AuthService } from '../../auth/auth.service';
import { FieldConfig } from './models/field-config.interface';

@Injectable()
export class DynamicCorpFormResolver implements Resolve<FieldConfig>{
  idSubject: number = null;

  constructor(
    private dynamicFormService: DynamicFormService,
    private authService: AuthService
  ) {}

  resolve(): Observable<FieldConfig> {
    this.idSubject = this.dynamicFormService.getCorpIdSubject();

    /** if someone remove  idPharmSubject from localStorage**/
    if(!this.idSubject) {
      console.error('idCorpSubject is null in localStorage!');
      this.authService.logout();
      return null;
    }

    return this.dynamicFormService.getOptions(10, this.idSubject).pipe(
      take(1),
      map(options => {
        if(options) {
          return options;
        } else{
          this.authService.logout();
          console.error('options are not found!');
          return null;
        }
      })
    );
  }
}

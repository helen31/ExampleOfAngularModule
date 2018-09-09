import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldConfig } from './models/field-config.interface';
import { SetOptions } from './models/set-options.interface';

@Injectable()
export class DynamicFormService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getOptions(id_unit: number, id_subject: number) {
    const body = {
      id_unit,
      id_subject
    };

    /** use if we need a dynamic title of the form **/
    //.unshift({type: 'title', name: 'Це назва динамічної форми'});

    return this.httpClient.post<FieldConfig>(location.origin + '/admin/get-options', body);
  }

  setOptions(body: Object[]) {
    return this.httpClient.post<SetOptions>( location.origin + '/admin/set-options', body);
  }

  setCorpIdSubject(idSubject: number):void {
    localStorage.setItem('idCorpSubject', JSON.stringify(idSubject));
  }

  setPharmIdSubject(idSubject: number): void {
    localStorage.setItem('idPharmSubject', JSON.stringify(idSubject));
  }

  clearPharmIdSubject() {
    localStorage.removeItem('idPharmSubject');
  }

  getCorpIdSubject():number {
    if(!localStorage.getItem('idCorpSubject')) {
      return null;
    }
    return JSON.parse(localStorage.getItem('idCorpSubject')) || null;
  }

  getPharmIdSubject():number {
    if(!localStorage.getItem('idPharmSubject')) {
      return null;
    }
    return JSON.parse(localStorage.getItem('idPharmSubject'));
  }
}

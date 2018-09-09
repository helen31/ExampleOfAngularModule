import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { Corporation } from './corporation-list/corporation.model';
import { PharmacyInterface } from './pharmacy-list/pharmacy.interface';

//set Token in TokenInterceptor
@Injectable()
export class AdmService {
  columnCaptionsCorp = ['ID', 'Назва', 'ID Моріон', 'Назва Моріон', 'Організації'];
  @Output() selectedRow = new EventEmitter<number>(null);
  @Output() copyToClipboard:  EventEmitter<any> = new EventEmitter();

  // Observable sources
  private corporationsSource = new Subject<Corporation[]>();
  private pharmaciesSource = new Subject<PharmacyInterface[]>();

  // Observable streams
  corporations$ = this.corporationsSource.asObservable();
  pharmacies$ = this.pharmaciesSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  // Service commands
  setNextCorporations(corporations: Corporation[]) {
    this.corporationsSource.next(corporations);
  }

  setNextPharmacies(pharmacies: PharmacyInterface[]) {
    this.pharmaciesSource.next(pharmacies);
  }

  getCorporation(id: number) {
    const body = {'id':id };

    return this.httpClient.post<Corporation[]>(location.origin + '/spho/admin/get-corp-list',
      body);
  }

  getCorporations(){
    const body = {'id_morion':0 };

    return this.httpClient.post<Corporation[]>(location.origin + '/spho/admin/get-corp-list',
      body);
  }

  getPharmacies(id: number){
    const body = {'id_corp':id};

    return this.httpClient.post(location.origin + '/spho/admin/get-org-list',
      body).pipe(
      map(
        (pharmaciesArray: PharmacyInterface[]) => {
          for (let i = 0; i < pharmaciesArray.length; i++) {
            if(pharmaciesArray[i]['customers']) {
              pharmaciesArray[i]['isCustomers'] = true;
            }
          }
          return pharmaciesArray;
        }
      )
    );
  }

  setSelectedCorpId(corpId: string): void {
    localStorage.setItem('corpId', corpId);
  }

  setSelectedIdOrg(idOrg: number): void {
    localStorage.setItem('idOrg', JSON.stringify(idOrg));
  }

  getSelectedCorpId(): string {
    return localStorage.getItem('corpId') || 'null';
  }

  getSelectedIdOrg(): number {
    if(!localStorage.getItem('idOrg')) {
      return null;
    }
    return Number(localStorage.getItem('idOrg'));
  }

  removeSelectedIdOrg() {
    localStorage.removeItem('idOrg');
  }

  removeSelectedIdCorp() {
    localStorage.removeItem('corpId');
  }

  scrollToIdCorp(idCorp: number) {
    setTimeout(() => {
      const corpItem = document.getElementById(idCorp.toString());
      if(corpItem) {
        const elementRect = corpItem.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const toId = absoluteElementTop - 175;//116+56 total height of header-container + mat-header-row
        window.scrollTo(0, toId);
      }
    }, 1000);
  }
}

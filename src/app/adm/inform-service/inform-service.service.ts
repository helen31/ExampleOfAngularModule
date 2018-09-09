import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Rx';
import { EntityModel } from './entity.model';

@Injectable()
export class InformService {
  // Observable sources
  private entitiesSource = new Subject<any>();

  // Observable streams
  entities$ = this.entitiesSource.asObservable();

  constructor(
    private httpClient: HttpClient
  ) { }

  // Service commands
  setNextEntities(entities: any) {
    this.entitiesSource.next(entities);
  }

  getEntitiesFields(idCorp: number) {
    const body = {
      'id_corp': idCorp
    };

    return this.httpClient.post<EntityModel[]>(location.origin + '/morion/get-entities-fields-acl',
      body);
  }

  setEntitiesFields(array_elements: Object[]) {
    const body = array_elements;

    return this.httpClient.post<null>(location.origin + '/morion/set-entities-fields-acl',
      body);
  }
}

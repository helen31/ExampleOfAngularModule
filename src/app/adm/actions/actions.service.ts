import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Corporation } from '../corporation-list/corporation.model';
import { OrgMorionBdModel } from './org-morion-bd.model';
import { CorporationMorion } from './corporation-morion.model';
import { PharmacyInterface } from '../pharmacy-list/pharmacy.interface';

@Injectable()
export class ActionsService {
  // Observable sources
  private selectedCorporationSource = new Subject<Corporation>();
  private selectedPharmacySource = new Subject<PharmacyInterface>();

  // Observable streams
  selectedCorporation$ = this.selectedCorporationSource.asObservable();
  selectedPharmacy$ = this.selectedPharmacySource.asObservable();

  constructor(private httpClient: HttpClient) { }

  // Service commands
  selectCorporation(corporation: Corporation) {
    this.selectedCorporationSource.next(corporation);
  }
  selectPharmacyRow(prarmacy: PharmacyInterface) {
    this.selectedPharmacySource.next(prarmacy);
  }

  getOrgMorionDB(id: number) {
    const body = {
      'id_morion' :id
    };

    return this.httpClient.post<OrgMorionBdModel>(location.origin + '/dbmorion/get-org',
      body);
  }

  getCorporation(id: number){
    const body = {'id':id};

    return this.httpClient.post<Corporation[]>(location.origin + '/spho/admin/get-corp-list',
      body);
  }

  getPharmacy(id: number){
    const body = {'id_org':id};

    return this.httpClient.post<PharmacyInterface>(location.origin + '/spho/admin/get-org-list',
      body);
  }

  getCorpMorionByLsKey(licenseKey: string) {
    const body = {
      'license_key': licenseKey
    };

    return this.httpClient.post<CorporationMorion>(location.origin + '/dbmorion/get-org',
      body);
  }

  setCorporation(newCorpName: string, nameMorion: string, idMorion: number) {
    const corporation: Corporation = {
      id_corp: 0,
      corp_name: newCorpName,
      morion_name: nameMorion,
      id_morion: idMorion
    };

    return this.httpClient.post<{ id_corp: number }>(location.origin + '/spho/admin/set-corp',
      corporation);
  }

  setPharmacy(
    newPharmName: string,
    accessKey: string,
    lsKey: string,
    idCorp: number,
    idMorion: number,
    brNick: string,
    morionName: string
  ) {
    const body: PharmacyInterface = {
      id_org: 0,
      id_corp: idCorp,
      id_morion: idMorion,
      br_nick: brNick,
      license_key: lsKey,
      morion_name: morionName,
      org_name: newPharmName,
      access_key: accessKey
    };

    return this.httpClient.post<{ id_org: number }>(location.origin + '/spho/admin/set-org',
      body);
  }

  editPharmacy(
    idOrg: number,
    newPharmName: string,
    accessKey: string,
    lsKey: string,
    idCorp: number,
    idMorion: number,
    brNick: string,
    morionName: string
  ) {
    const body: PharmacyInterface = {
      id_org: idOrg,
      id_corp: idCorp,
      id_morion: idMorion,
      br_nick: brNick,
      license_key: lsKey,
      morion_name: morionName,
      org_name: newPharmName,
      access_key: accessKey
    };

    return this.httpClient.post<{ id_org: number }>(location.origin + '/spho/admin/set-org',
      body);
  }

  editCorporation(idCorp: number, newCorpName: string, nameMorion: string, idMorion: number) {
    const corporation: Corporation = {
      id_corp: idCorp,
      corp_name: newCorpName,
      morion_name: nameMorion,
      id_morion: idMorion
    };

    return this.httpClient.post<{ id_corp: number }>(location.origin + '/spho/admin/set-corp',
      corporation);
  }

  deleteCorporation(id_corp: number){
    const body = {
      'id_corp': id_corp,
      'deleted': 1
    };

    return this.httpClient.post<null>(location.origin + '/spho/admin/set-corp',
      body);
  }

  deletePharmacy(id_org: number){
    const body = {
      'id_org': id_org,
      'deleted': 1
    };

    return this.httpClient.post<null>(location.origin + '/spho/admin/set-org',
      body);
  }
}

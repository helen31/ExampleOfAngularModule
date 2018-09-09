import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ActionsService } from '../actions.service';
import { PharmacyInterface } from '../../pharmacy-list/pharmacy.interface';
import { AdmService } from '../../adm.service';

@Component({
  selector: 'app-delete-pharmacy',
  templateUrl: './delete-pharmacy.component.html',
  styleUrls: ['./delete-pharmacy.component.scss']
})
export class DeletePharmacyComponent implements OnInit {
  pharmacy: PharmacyInterface;
  corpId: number = null;

  constructor(
    private actionsService: ActionsService,
    private admService: AdmService,
    @Inject(MAT_DIALOG_DATA) public data: {idPharm: number, idCorp: number},
    public dialogRef: MatDialogRef<DeletePharmacyComponent>
  ) {
    this.pharmacy = {
      id_org: null,
      id_corp: null,
      id_morion: null,
      br_nick: '',
      license_key: '',
      morion_name: '',
      org_name: '',
      access_key: ''
    };
  }

  ngOnInit() {
    this.getPharmacy(this.data.idPharm);
    this.corpId = this.data.idCorp;
  }

  deletePharmacyHandler() {
    this.actionsService.deletePharmacy(this.data.idPharm).subscribe(
      (response: null) => {
        this.admService.getPharmacies(this.corpId).subscribe(
          (pharmacies: PharmacyInterface[]) => {
            this.admService.setNextPharmacies(pharmacies);
            this.admService.removeSelectedIdOrg();
            this.admService.selectedRow.emit(null);
            this.dialogRef.close();
          },
          (error) => {
            console.log('subscribe on pharmacies',error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPharmacy(id:number) {
    this.actionsService.getPharmacy(id).subscribe(
      (pharmacy) => {
        this.pharmacy = pharmacy;
      },
      (error) => { }
    );
  }
}

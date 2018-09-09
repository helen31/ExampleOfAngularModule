import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ActionsService } from '../actions.service';
import { Corporation } from '../../corporation-list/corporation.model';
import { AdmService } from '../../adm.service';

@Component({
  selector: 'app-delete-corporation',
  templateUrl: './delete-corporation.component.html',
  styleUrls: ['./delete-corporation.component.scss']
})
export class DeleteCorporationComponent implements OnInit {
  corporation: Corporation;

  constructor(
    private actionsService: ActionsService,
    private corporationService: AdmService,
    private admService: AdmService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteCorporationComponent>
  ) {
    this.corporation =
      {
        id_corp: null,
        id_morion: null,
        corp_name: '',
        morion_name: ''
      };
  }

  ngOnInit() {
    this.getCorporation(this.data);
  }

  deleteCorporationHandler() {
    this.actionsService.deleteCorporation(this.data).subscribe(
      (response: null) => {
        this.corporationService.getCorporations().subscribe(
          (corporations: Corporation[]) => {
            this.corporationService.setNextCorporations(corporations);
            this.corporationService.selectedRow.emit(null);
            this.admService.removeSelectedIdCorp();
            this.admService.setSelectedCorpId('null');
            this.dialogRef.close();
          },
          (error) => {
            console.log('subscribe on corporations',error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCorporation(id_corp: number) {
    this.actionsService.getCorporation(id_corp).subscribe(
      (corporation: Corporation[]) => {
        this.corporation = corporation[0];
      },
      (error) => {}
    );
  }
}

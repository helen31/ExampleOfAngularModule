import { Directive, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DeleteCorporationComponent } from '../actions/delete-corporation/delete-corporation.component';
import { ActionsService } from '../actions/actions.service';
import { Corporation } from '../corporation-list/corporation.model';
import { AdmService } from '../adm.service';

@Directive({
  selector: '[deleteCorporationDirective]'
})
export class DeleteCorporationDirective implements OnInit, OnDestroy{
  idCorporation: number = null;
  idCorpFromLocSt;
  subscriptionSelectedCorp: Subscription;

  constructor(
    public dialog: MatDialog,
    private actionsService: ActionsService,
    private admService: AdmService

    ) {
    this.subscriptionSelectedCorp = actionsService.selectedCorporation$.subscribe(
      (corporation: Corporation) => {
        this.idCorporation = corporation.id_corp;
      }
    );
  }

  @HostListener('click') onClick() {
    this.idCorpFromLocSt = this.admService.getSelectedCorpId();
    if(!isNaN(this.idCorpFromLocSt) || this.idCorporation) {
      let dialogRef = this.dialog
        .open(
          DeleteCorporationComponent,
          { data: this.idCorporation || this.idCorpFromLocSt }
          );

      dialogRef.afterClosed().subscribe(result => {
        (result) => {
          console.log('resalt', result);//todo: left or delete?
        }

      });
    } else{
      alert('Choose corporation!');
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptionSelectedCorp.unsubscribe();
  }
}

import { Directive, HostListener, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

import { ActionsService } from '../actions/actions.service';
import { PharmacyInterface } from '../pharmacy-list/pharmacy.interface';
import { DeletePharmacyComponent } from '../actions/delete-pharmacy/delete-pharmacy.component';
import { AdmService } from '../adm.service';

@Directive({
  selector: '[deletePharmacyDirective]'
})
export class DeletePharmacyDirective implements OnDestroy{
  subscriptionselectedPharmacy: Subscription;
  idPharmacy: number = null;
  idCorporation: number = null;
  idPharmFromLocSt: number = null;

  constructor(
    public dialog: MatDialog,
    private actionsService: ActionsService,
    private route: ActivatedRoute,
    private admService: AdmService
  ) {
    this.subscriptionselectedPharmacy = actionsService.selectedPharmacy$.subscribe(
      (selectedPharmacy: PharmacyInterface) => {
        this.idPharmacy = selectedPharmacy.id_org;
      }
    );
    this.route.params.subscribe(
      (params: Params) => {
        this.idCorporation = +params['id'];
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionselectedPharmacy.unsubscribe();
  }

  @HostListener('click') onClick() {
    this.idPharmFromLocSt = this.admService.getSelectedIdOrg();
    if(this.idPharmFromLocSt || this.idPharmacy) {
      let dialogRef = this.dialog
        .open(
          DeletePharmacyComponent,
          {data:{idPharm: this.idPharmacy || this.idPharmFromLocSt, idCorp: this.idCorporation}}
          );

      dialogRef.afterClosed().subscribe(result => {
        (result) => {
          console.log('resalt', result);//todo: left or delete?
        }
      });
    } else{
      alert('Choose organization!');
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ActionsService } from '../actions.service';
import { PharmacyInterface } from '../../pharmacy-list/pharmacy.interface';
import { PharmacyMorionInterface } from '../pharmacy-morion.interface';
import { SpinnerService } from '../../../core/spinner.service';

@Component({
  selector: 'app-edit-pharmacy',
  templateUrl: './edit-pharmacy.component.html',
  styleUrls: ['./edit-pharmacy.component.scss']
})
export class EditPharmacyComponent implements OnInit, OnDestroy {
  editPharmFormGroup: FormGroup;
  editIdMorionFormGroup: FormGroup;

  idCorporation: number = null;
  idPharmacy: number = null;
  pharmacy: PharmacyInterface;
  pharmacyMorionChangedData: PharmacyMorionInterface;
  hiddenIdMorionInput: boolean = true;
  isIdMorionError: boolean = false;
  subscriptionIdMorion: Subscription;
  subscriptionActiveSpinner: Subscription;
  activeSpinner: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actionsService: ActionsService,
    private spinnerService: SpinnerService
  ) {
    this.subscriptionActiveSpinner = this.spinnerService.spinnerActive.subscribe(
      active => {
        this.toggleSpinner(active);
      }
    );
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
    this.pharmacyMorionChangedData = {
      id: null,
      name: '',
      br_nick: ''
    };
    this.createForms();
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.idCorporation = +params.id;
        this.idPharmacy = +params.idPharm;
        this.getPharmacy(this.idPharmacy);
      }
    );
    this.subscriptionIdMorion = this.editIdMorionFormGroup.controls['idMorion'].valueChanges.subscribe(
      (id: string) => {
        if(!id) {
          this.isIdMorionError = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionIdMorion.unsubscribe();
    this.subscriptionActiveSpinner.unsubscribe();
  }

  toggleSpinner(active){
    this.activeSpinner = active;
  }

  /** change ID Morion**/

  changeIdMorionHandler() {
    const idMorion = this.editIdMorionFormGroup.get('idMorion').value;
    this.spinnerService.activate();

    this.getMorionOrg(idMorion);
  }

  /** edit pharmacy**/

  editPrarmacyHandler() {
    const newPharmacyName = this.editPharmFormGroup.get('pharmName').value.trim();

    this.actionsService.editPharmacy(
      this.pharmacy.id_org,
      newPharmacyName,
      this.pharmacy.access_key,
      this.pharmacy.license_key,
      this.pharmacy.id_corp,
      this.pharmacyMorionChangedData.id,
      this.pharmacyMorionChangedData.br_nick,
      this.pharmacyMorionChangedData.name
    ).subscribe(
      (response: { id_org: number }) => {
        this.navigateToPreviousPage();
      },
      (error) => { }
    );
  }

  getPharmacy(id: number) {
    this.actionsService.getPharmacy(id).subscribe(
      (pharmacy: PharmacyInterface) => {
        this.pharmacy = pharmacy;
        this.pharmacyMorionChangedData.id = pharmacy.id_morion;
        this.pharmacyMorionChangedData.name = pharmacy.morion_name;
        this.pharmacyMorionChangedData.br_nick = pharmacy.br_nick;

        this.editPharmFormGroup.setValue({
          pharmName: pharmacy.org_name
        });
        this.editIdMorionFormGroup.setValue({
          idMorion: pharmacy.id_morion
        });
      },
      (error) => { }
    );
  }

  getMorionOrg(id:number) {
    this.actionsService.getOrgMorionDB(id).subscribe(
      (organizationMorion: PharmacyMorionInterface) => {
        if(organizationMorion && organizationMorion.id == -1) {
          this.spinnerService.deactivate();
          this.isIdMorionError = true;
        } else {
          this.spinnerService.deactivate();
          this.pharmacyMorionChangedData.id = organizationMorion.id;
          this.pharmacyMorionChangedData.name = organizationMorion.name;
          this.pharmacyMorionChangedData.br_nick = organizationMorion.br_nick;
          this.editPharmFormGroup.setValue({
            pharmName: organizationMorion.name
          });
          this.isIdMorionError = false;
          this.hiddenIdMorionInput = true;
        }
      },
      (error) => {
        this.spinnerService.deactivate();
      }
    );
  }

  /** others **/

  createForms() {
    this.editPharmFormGroup = this.formBuilder.group({
      pharmName: ['', [Validators.maxLength(150), Validators.required]]
    });
    this.editIdMorionFormGroup = this.formBuilder.group({
      idMorion: [null, Validators.required]
    });
  }

  resetFormGroupHandler() {
    this.editPharmFormGroup.reset();
    this.navigateToPreviousPage();
  }

  navigateToPreviousPage() {
    this.router.navigate(['/adm/' + this.idCorporation + '/pharmacies']);
  }

  editIdHandler() {
    this.hiddenIdMorionInput = !this.hiddenIdMorionInput;

    if(this.isIdMorionError) {
      this.isIdMorionError = false;
    }
  }
}

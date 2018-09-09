import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { Md5 } from 'ts-md5';
import { Subscription } from 'rxjs';

import { ActionsService } from '../actions.service';
import { CorporationMorion } from '../corporation-morion.model';
import { SpinnerService } from '../../../core/spinner.service';

@Component({
  selector: 'app-add-pharmacy',
  templateUrl: './add-pharmacy.component.html',
  styleUrls: ['./add-pharmacy.component.scss']
})
export class AddPharmacyComponent implements OnInit, OnDestroy {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isLicenseResponse: boolean;
  isHiddenInputField: boolean = true;
  corpId: number = null;
  lsKeyExist: boolean = true;
  corporationMorion: CorporationMorion;
  lsKey: string = '';
  licenseKeyValueChanged: string = '';
  accessKey: string | Int32Array = '';
  subscriptionLsKeyValue: Subscription;
  @ViewChild('firstFormGroupDirective') firstFormGroupDirective: FormGroupDirective;
  @ViewChild('secondFormGroupDirective') secondFormGroupDirective: FormGroupDirective;
  activeSpinner: boolean;
  subscriptionActiveSpinner: Subscription;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private actionsService: ActionsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService
  ) {
    route.params.subscribe(
    (idCorp: Params) => {
      this.corpId = +idCorp['id'];
      }
    );
    this.subscriptionActiveSpinner = this.spinnerService.spinnerActive.subscribe(
      active => {
        this.toggleSpinner(active);
      }
    );
    this.createForms();
  }

  ngOnInit() {
    this.setMorionData();
    this.subscriptionLsKeyValue = this.firstFormGroup.controls['licenseKey'].valueChanges.subscribe(
      (licenseKey: string) => {
        this.licenseKeyValueChanged = licenseKey;
        if(!this.isLicenseResponse) {
          this.lsKeyExist = true;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionLsKeyValue.unsubscribe();
    this.subscriptionActiveSpinner.unsubscribe();
  }

  toggleSpinner(active){
    this.activeSpinner = active;
  }

  /**step #1**/

  getLisenceHandler():void {
    const licenseKey = this.firstFormGroup.get('licenseKey').value.trim();
    this.lsKeyExist = true;
    this.spinnerService.activate();

    this.actionsService.getCorpMorionByLsKey(licenseKey).subscribe(
      (response: CorporationMorion) => {
        if (response && response.corp_id == -1) {
          this.spinnerService.deactivate();
          this.lsKeyExist = false;
        } else{
          this.corporationMorion = response;
          this.spinnerService.deactivate();
          this.isLicenseResponse = true;
          this.lsKey = licenseKey;
          this.firstFormGroup.setValue({
            'licenseKey': licenseKey,
            'isResponse': this.isLicenseResponse,
          });
          this.secondFormGroup.setValue({
            'pharmacyName' : response.org_name,
            'accessKey': ''
          });
        }
      },
      (error) => {}
    );
  }

  /**step #2**/

  setPharmacyHandler(): void{
    const pharmacyName = this.secondFormGroup.get('pharmacyName').value.trim();
    const accessKey = this.secondFormGroup.get('accessKey').value.trim();

    this.actionsService.setPharmacy(
      pharmacyName,
      accessKey,
      this.lsKey,
      this.corpId,
      this.corporationMorion.corp_id,
      this.corporationMorion.br_nick,
      this.corporationMorion.org_name
    ).subscribe(
      (idPharmacy) => {
        this.goToPreviousPage();
      },
      (error) => {}
    );
  }

  /** others **/

  editLsKeyHandler() {
    this.isLicenseResponse = false;
    this.accessKey = '';
    this.rebuildFirstFormGroup(this.firstFormGroupDirective);
    this.rebuildSecondFormGroup(this.secondFormGroupDirective);
  }

  setMorionData() {
    this.isLicenseResponse = false;
    this.corporationMorion = {
      corp_id: null,
      corp_name: '',
      org_id: null,
      org_name: '',
      br_nick: ''
    };
  }

  createForms() {
    this.firstFormGroup = this.formBuilder.group({
      licenseKey: ['', Validators.required],
      isResponse: ['', Validators.required] //its hidden input field to prevent move to 2 step before we get response
    });
    this.secondFormGroup = this.formBuilder.group({
      pharmacyName: ['', Validators.required],
      accessKey: ['', Validators.required]
    });
  }

  rebuildFirstFormGroup(formGroupDirective: FormGroupDirective) {
    this.firstFormGroup.reset();
    formGroupDirective.resetForm();
  }

  rebuildSecondFormGroup(formGroupDirective: FormGroupDirective) {
    this.secondFormGroup.reset();
    formGroupDirective.resetForm();
  }

  resetFirstFormGroup() {
    this.rebuildFirstFormGroup(this.firstFormGroupDirective);
    this.goToPreviousPage();
  }

  resetSecondFormGroup() {
    this.rebuildFirstFormGroup(this.secondFormGroupDirective);
    this.goToPreviousPage();
  }

  resetFormsHandler() {
    this.resetFirstFormGroup();
    this.resetSecondFormGroup();
  }

  generateAccessKeyHandler() {
    let uuid = UUID.UUID();
    uuid.toString();
    const uuidMd5 = Md5.hashStr(uuid);
    if(uuidMd5) {
      this.accessKey = uuidMd5;
      this.secondFormGroup.get('accessKey').setValue(uuidMd5);
    }
  }

  goToPreviousPage() {
    this.router.navigate(['/adm/corporations/' + this.corpId +  '/pharmacies']);
  }
}

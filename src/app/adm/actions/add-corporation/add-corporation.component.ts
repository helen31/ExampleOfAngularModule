import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OrgMorionBdModel } from '../org-morion-bd.model';
import { ActionsService } from '../actions.service';
import { SpinnerService } from '../../../core/spinner.service';

@Component({
  selector: 'app-add-corporation',
  templateUrl: './add-corporation.component.html',
  styleUrls: ['./add-corporation.component.scss']
})
export class AddCorporationComponent implements OnInit, OnDestroy{
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  corpMorion: OrgMorionBdModel;
  isCorpMirionResponse: boolean;
  idMorion: number = null;
  idMorionValueChanged: number = null;
  subscriptionCorpMorionValue: Subscription;
  isHiddenInputField: boolean = true;
  isIdMorionError: boolean = false;
  @ViewChild('firstFormGroupDirective') firstFormGroupDirective: FormGroupDirective;
  @ViewChild('secondFormGroupDirective') secondFormGroupDirective: FormGroupDirective;
  activeSpinner: boolean;
  subscriptionActiveSpinner: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private actionsService: ActionsService,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.subscriptionActiveSpinner = this.spinnerService.spinnerActive.subscribe(
      active => {
        this.toggleSpinner(active);
      }
    );
    this.createForms();
    this.setCorpMorionData();
  }

  ngOnInit() {
    this.subscriptionCorpMorionValue = this.firstFormGroup.controls['id'].valueChanges.subscribe(
      (idValue: number) => {
        this.idMorionValueChanged = idValue;
        if(this.isCorpMirionResponse) {
          if(this.idMorionValueChanged !== this.idMorion) {
            this.setCorpMorionData();
            this.rebuildSecondFormGroup(this.secondFormGroupDirective);
          }
        } else{
          this.isIdMorionError = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionCorpMorionValue.unsubscribe();
    this.subscriptionActiveSpinner.unsubscribe();
  }

  toggleSpinner(active){
    this.activeSpinner = active;
  }

  /**step #1**/

  getCorpMorionHandler():void {
    const id = this.firstFormGroup.get('id').value;
    this.idMorion = id;
    this.spinnerService.activate();

    this.actionsService.getOrgMorionDB(id).subscribe(
      (corpMorion: OrgMorionBdModel) => {
        if(corpMorion && corpMorion.id == -1) {
          this.spinnerService.deactivate();
          this.isIdMorionError = true;
        } else {
          this.spinnerService.deactivate();
          this.isIdMorionError = false;
          this.isCorpMirionResponse = true;
          this.corpMorion = corpMorion;
          this.firstFormGroup.setValue({
            'id': id,
            'isResponse': this.isCorpMirionResponse,
          });
          this.secondFormGroup.setValue({'corpName' :this.corpMorion.name});
        }
      },
      (error) => {
        this.spinnerService.deactivate();
      }
    );
  }

  /**step #2**/

  submitCorpHandler(): void {
    const corpName = this.secondFormGroup.get('corpName').value.trim();

    if(this.corpMorion.name && corpName && this.isCorpMirionResponse) {
      this.actionsService.setCorporation(corpName, this.corpMorion.name, this.corpMorion.id ).subscribe(
        (newIdObj) => {
          this.router.navigate(['/adm/edit-corporation', newIdObj.id_corp]);
          this.rebuildForms();
          //this.actionsService.scrollCorpId(newIdObj.id_corp);
        },
        (error) => {}
      );
    }
  }

  /** others **/

  createForms() {
    this.firstFormGroup = this.formBuilder.group({
      id: [null, Validators.required],
      isResponse: ['', Validators.required] //its hidden input field to prevent moving to 2 step before we get response
    });
    this.secondFormGroup = this.formBuilder.group({
      corpName: ['', [Validators.maxLength(150), Validators.required]]
    });
  }

  rebuildFirstFormGroup(formGroupDirective: FormGroupDirective) {
    this.firstFormGroup.reset();
    formGroupDirective.resetForm();//to remove the red errors when reset form, because using Angular Material..
  }

  rebuildSecondFormGroup(formGroupDirective: FormGroupDirective) {
    this.secondFormGroup.reset();
    formGroupDirective.resetForm();//to remove the red errors when reset form, because using Angular Material..
  }

  rebuildForms() {
    this.rebuildFirstFormGroup(this.firstFormGroupDirective);
    this.rebuildSecondFormGroup(this.secondFormGroupDirective);
    this.setCorpMorionData();
  }

  setCorpMorionData() {
    this.isCorpMirionResponse = false;
    this.corpMorion = {
      id: null,
      name: '',
      br_nick: ''
    };
  }

  editCorpMorionHandler() {
    this.isCorpMirionResponse = false;
    this.rebuildFirstFormGroup(this.firstFormGroupDirective);
  }

  resetFirstFormGroupHandler() {
    this.goToPreviousPage();
    this.rebuildFirstFormGroup(this.firstFormGroupDirective);
  }

  resetSecondFormGroupHandler() {
    this.goToPreviousPage();
    this.rebuildSecondFormGroup(this.secondFormGroupDirective);
  }

  goToPreviousPage() {
    this.router.navigate(['/adm/corporations']);
  }
}

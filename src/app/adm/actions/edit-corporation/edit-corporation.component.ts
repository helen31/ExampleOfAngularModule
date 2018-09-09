import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ActionsService } from '../actions.service';
import { Corporation } from '../../corporation-list/corporation.model';

@Component({
  selector: 'app-edit-corporation',
  templateUrl: './edit-corporation.component.html',
  styleUrls: ['./edit-corporation.component.scss']
})
export class EditCorporationComponent implements OnInit{
  editCorpFormGroup: FormGroup;
  corpId: number = null;
  corporation: Corporation;

  constructor(
    private actionsService: ActionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.corporation =
      {
        id_corp: null,
        id_morion: null,
        corp_name: '',
        morion_name: ''
      };
    this.route.params.subscribe(
      (params: Params) => {
        this.corpId = +params['id'];
        this.actionsService.getCorporation(this.corpId).subscribe(
          (corporation: Corporation[]) => {
            this.corporation = corporation[0];
            this.editCorpFormGroup.setValue({
              corpName: this.corporation.corp_name,
            });
          },
          (error) => { }
        );
      }
    );
  }

  ngOnInit() {
    this.createForm();
  }

  editCorporationHandler() {
    const newCorpName: string = this.editCorpFormGroup.get('corpName').value.trim();
    if(newCorpName) {
      this.editCorporation(newCorpName);
    }
  }

  editCorporation(corpName: string) {
    this.actionsService.editCorporation(this.corporation.id_corp, corpName, this.corporation.morion_name, this.corporation.id_morion).subscribe(
      (idCorp: {'id_corp':number}) => {
        //console.log(idCorp); //this comment needed to wait for corpsDataSource of the table
        this.rebuildForm();
        this.router.navigate(['/adm/corporations']);
      },
      (error) => {}
    );
  }

  createForm() {
    this.editCorpFormGroup = this.formBuilder.group({
      corpName: ['', [Validators.maxLength(150), Validators.required]]
    });
  }

  resetFormGroupHandler() {
    this.rebuildForm();
  }

  rebuildForm() {
    this.router.navigate(['/adm/corporations']);
    this.editCorpFormGroup.reset();
  }
}
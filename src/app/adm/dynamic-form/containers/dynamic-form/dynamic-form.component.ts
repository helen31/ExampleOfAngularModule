import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DynamicFormService } from '../../dynamic-form.service';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'app-dynamic-form',
  styleUrls: ['./dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit{
  @Input() config: FieldConfig[] = [];
  form: FormGroup;
  filteredConfig: Object[] = [];
  corpId: number = null;
  idSubject: number;

  constructor(
    private formBuilder: FormBuilder,
    private dynamicFormService: DynamicFormService,
    private router : Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    route.params.subscribe(
      params => {
        this.corpId = params.id;
        /**
         * Getting idSubject
         * from params because it changes in
         * Corporation and Pharmacy components
         * **/
        this.idSubject = params.idSub;
      }
    );
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  /**
   * MEANINGS of properties IN RESPONSE
   * code - formControlName
   * option_type - attr.type
   * input_type - type of component (input, select, checkbox...)
   */
  createGroup() {
    const group = this.formBuilder.group({});
    this.filteredConfig = this.filterConfig(this.config);
    this.filteredConfig.forEach(control => {
      if(control['required']) {
        group.addControl(control['code'], this.formBuilder.control(control['value'], Validators.required));
      } else {
        group.addControl(control['code'], this.formBuilder.control(control['value']));
      }
    });
    return group;
  }

  submitDynamicFormHandler() {
    let submittedConfig: Object[] = [];//todo set a type here

    for(let i = 0; i < this.filteredConfig.length; i++) {
      submittedConfig.push({
        id_subject : this.idSubject,
        code:  this.filteredConfig[i]['code'],
        value: this.form.value[this.filteredConfig[i]['code']]
      });
    }
   this.dynamicFormService.setOptions(submittedConfig).subscribe(
     (response) => {
       this.cancelHandler();
     },
     (error) => {}
   );
  }

  filterConfig(config: Object[]) : Object[]{//todo Set a type there
    return config.filter((elem) => {
       return elem['input_type'] !== 'title';
    });
  }

  cancelHandler() {
    this.goToPreviousPage();
    this.form.reset();
  }

  goToPreviousPage() {
    this.location.back();
  }
}

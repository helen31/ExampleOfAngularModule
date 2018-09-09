import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss']
})
export class FormCheckboxComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  @ViewChild('myEntityCheckbox') private myEntityCheckbox: MatCheckbox;

  constructor() {}

  ngOnInit() {}

  changeEntityAccessHandler():void {
    let myCheckbox: MatCheckbox = this.myEntityCheckbox;

    myCheckbox.checked = !myCheckbox.checked;
    this.config.value === 'true' ? this.config.value = 'false' : this.config.value = 'true';
    this.group.value[this.config.code] = this.config.value;
  }
}

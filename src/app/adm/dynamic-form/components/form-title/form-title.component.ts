import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-title',
  templateUrl: './form-title.component.html',
  styleUrls: ['./form-title.component.scss']
})
export class FormTitleComponent implements OnInit {
  config;
  group: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-delete-input-value',
  templateUrl: './delete-input-value.component.html',
  styleUrls: ['./delete-input-value.component.scss']
})
export class DeleteInputValueComponent implements OnInit {
  @Input('inputValue') inputValue: FormControl;

  constructor() { }

  ngOnInit() {}

  deleteValueHandler() {
    if(this.inputValue.value || this.inputValue.value === 0) {
      this.inputValue.setValue('');
    }
    return;
  }
}

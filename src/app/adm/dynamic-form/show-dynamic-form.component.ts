import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-dynamic-form',
  templateUrl: './show-dynamic-form.component.html',
  styleUrls: ['./show-dynamic-form.component.scss']
})
export class ShowDynamicFormComponent implements OnInit {
  config: any; //todo set type instead of any

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.config = this.route.snapshot.data.config;
  }
}

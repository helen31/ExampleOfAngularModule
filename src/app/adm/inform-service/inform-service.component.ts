import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckbox, MatTableDataSource } from '@angular/material';

import { InformService } from './inform-service.service';
import { EntityModel } from './entity.model';
import { FieldModel } from './field.model';

@Component({
  selector: 'app-inform-service',
  templateUrl: './inform-service.component.html',
  styleUrls: ['./inform-service.component.scss']
})
export class InformServiceComponent implements OnInit {
  idCorp: number = null;
  entitiesDataSource: MatTableDataSource<{}>;
  fieldsDataSource: MatTableDataSource<{}>;
  displayedColumns = ['access', 'name'];
  displayedFieldsColumns = ['access', 'name'];
  selectedRow: number = null;
  @ViewChildren('myEntityCheckbox') private myEntityCheckboxes : QueryList<any>;
  @ViewChildren('myFieldCheckbox') private myFieldCheckbox : QueryList<any>;

  constructor(
    private informService: InformService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    route.params.subscribe(
      (params) => {
        this.idCorp = +params['id'];
        this.getEntitiesFields(this.idCorp);
      }
    );
    this.informService.entities$.subscribe(
      (entities) => {
        this.entitiesDataSource = new MatTableDataSource(entities);
      }
    );
  }

  ngOnInit() { }

  changeEntityAccessHandler(row, i):void {
    let myCheckboxes: MatCheckbox[] = this.myEntityCheckboxes.toArray();

    myCheckboxes[i].checked = !myCheckboxes[i].checked;
    row.access == 1 ? row.access = 0 : row.access = 1;
    this.entitiesDataSource.data[i] = row;
    this.setNextEntityDataSource();
  }

  changeFieldAccessHandler(data, row, i):void {
    let myCheckboxes: MatCheckbox[] = this.myFieldCheckbox.toArray();
    let indexOfParent: number = data['indexOfParent'];

    myCheckboxes[i].checked = !myCheckboxes[i].checked;
    row.access == 1 ? row.access = 0 : row.access = 1;
    if(this.entitiesDataSource.data[indexOfParent]['id_subject'] === row.id_subject) {
      this.entitiesDataSource.data[indexOfParent]['items'][i] = row;
      this.setNextEntityDataSource();
    } else {
      console.log('another id_subject');
    }

  }

  getEntitiesFields(idCorp: number):void {
    this.informService.getEntitiesFields(idCorp).subscribe(
      (entities: EntityModel[]) => {
        this.informService.setNextEntities(entities);
      }
    );
  }

  selectItemHandler(row, index: number) {
    this.selectedRow = index;
    this.fieldsDataSource = new MatTableDataSource(row.items) ;
    this.fieldsDataSource['indexOfParent'] = index;
  }

  setNextEntityDataSource() {
    this.informService.setNextEntities(this.entitiesDataSource.data);
  }

  saveDataChangesHandler() {
    this.informService.setEntitiesFields(this.entitiesDataSource.data).subscribe(
      (response: null) => {
        this.navigateToPrevPage();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancelDataChangesHandler() {
    this.selectedRow = null;
    this.navigateToPrevPage();
  }

  checkAllHandler(fieldDataSource: FieldModel[]) {
    let myCheckboxes: MatCheckbox[] = this.myFieldCheckbox.toArray();
    let indexOfParent: number = fieldDataSource['indexOfParent'];
    for(let i = 0; i < myCheckboxes.length; i++ ) {
      if(myCheckboxes[i].checked === false) {
        myCheckboxes[i].checked = true;
        fieldDataSource['data'][i].access = 1;
      }
    }
    this.entitiesDataSource['data'][indexOfParent]['items'] = fieldDataSource['data'];
    this.setNextEntityDataSource();
  }

  removeAllHandler(fieldDataSource: FieldModel[]) {
    let myCheckboxes: MatCheckbox[] = this.myFieldCheckbox.toArray();
    let indexOfParent: number = fieldDataSource['indexOfParent'];
    for(let i = 0; i < myCheckboxes.length; i++ ) {
      if(myCheckboxes[i].checked === true) {
        myCheckboxes[i].checked = false;
        fieldDataSource['data'][i].access = 0;
      }
    }
    this.entitiesDataSource['data'][indexOfParent]['items'] = fieldDataSource['data'];
    this.setNextEntityDataSource();
  }

  navigateToPrevPage() {
    this.router.navigate(['adm/corporations']);
  }
}

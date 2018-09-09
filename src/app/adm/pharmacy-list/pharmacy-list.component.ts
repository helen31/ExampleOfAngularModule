import {
  Component, OnDestroy, OnInit,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material';

import { PharmacyInterface } from './pharmacy.interface';
import { AdmService } from '../adm.service';
import { ActionsService } from '../actions/actions.service';
import { SpinnerService } from '../../core/spinner.service';
import { CopyToClipboardDirective } from '../directives/copy-to-clipboard.directive';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';

@Component({
  selector: 'app-pharmacy-list',
  templateUrl: './pharmacy-list.component.html',
  styleUrls: ['./pharmacy-list.component.scss']
})
export class PharmacyListComponent implements OnInit, OnDestroy {
  filterValue: string ='';
  pharmacies: MyDataSource<{}>;
  @ViewChildren(CopyToClipboardDirective) dirs;
  corpId: number = null;
  selectedRow: number = null;
  activeSpinner: boolean;
  subscriptionActiveSpinner: Subscription;
  subscriptionPharmacies: Subscription;
  subscriptionSelectedRow: Subscription;
  subscriptionCopyToClipboard: Subscription;
  paramsId: string = '';
  isExtendedRow = (index, item) => item.customers;
  selectedIdOrg: number;
  selectedIdSubject: number = null;

  constructor(
    private admService: AdmService,
    private actionsService: ActionsService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private dynamicFormService: DynamicFormService
  ) {
    this.selectedIdOrg = this.admService.getSelectedIdOrg();
    this.selectedIdSubject = this.dynamicFormService.getPharmIdSubject();
    this.subscriptionActiveSpinner = spinnerService.spinnerActive.subscribe(
      active => {
        this.toggleSpinner(active);
      }
    );
    this.subscriptionSelectedRow = this.admService.selectedRow.subscribe(
      (selectedIndex) => {
        this.selectedRow = selectedIndex;
      }
    );
    this.subscriptionCopyToClipboard = this.admService.copyToClipboard.subscribe(
      res => {
        this.dirs.first.copyToClipboard();
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.corpId = +params['id'];
        this.paramsId = params['idValue'];
        this.getPharmacies(this.corpId);
      }
    );
    this.subscriptionPharmacies = this.admService.pharmacies$.subscribe(
      (pharmacies: PharmacyInterface[]) => {
        this.pharmacies = new MyDataSource(pharmacies);

        /**
         * leave a row selection after reloading or returning
         * to this component
         * **/
        if(this.selectedIdSubject) {
          setTimeout(() => {
            const rowDomElem = document.getElementById(this.selectedIdSubject.toString());
            if(rowDomElem && rowDomElem.hasAttribute('data-id-parent')) {
              rowDomElem.classList.remove('isShown');
              this.selectedRow = this.selectedIdSubject
            } else {
              this.selectedRow = this.selectedIdSubject;
            }
          },0);
        }

        /**
         * if we have params 'search-value' than filter
         * corpsDataSource according this 'search-value'
         * **/
        if(this.paramsId) {
          this.removeSelectedRowData();
          this.pharmacies.filter = this.paramsId;
        }
        this.spinnerService.deactivate();
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionActiveSpinner.unsubscribe();
    this.subscriptionPharmacies.unsubscribe();
    this.subscriptionSelectedRow.unsubscribe();
    this.subscriptionCopyToClipboard.unsubscribe();
  }

  toggleSpinner(active){
    this.activeSpinner = active;
  }

  getPharmacies(corpId: number) {
    this.spinnerService.activate();
    this.admService.getPharmacies(corpId).subscribe(
      (pharmacies:PharmacyInterface[]) => {
        this.admService.setNextPharmacies(pharmacies);
        /** replaced Getting Data Corporations to Subscriptions **/
        //todo Make resolver - get corporations data before view tepmlate of Corporations component
      },
      /** error are caught by TokenInterceptor **/
      (error)  => {
        this.spinnerService.deactivate();
      }
    )
  }

  selectItemHandler(item: PharmacyInterface) {
    this.selectedRow = item['id_subject'];
    this.actionsService.selectPharmacyRow(item);
    this.setIdOrgToLocalStorage(item);
    this.setIdSubjectToLocalStorage(item);
  }

  selectCustomersHandler(rowCustomer) {
    this.actionsService.selectPharmacyRow({});
    this.selectedRow = rowCustomer['customers'][0]['id_subject'];
    this.setIdSubjectToLocalStorage(rowCustomer['customers'][0]);
    this.setIdOrgToLocalStorage(rowCustomer);
  }

  showCustomersDetailHandler(e: MouseEvent) {
    let customersDomElem = (<HTMLElement>(<HTMLElement>e.currentTarget ).parentElement.parentElement.nextSibling);

    /**close customer detail
     * of the opened item-row
     * if we click another item-row
     * **/
    if(customersDomElem.classList.contains('isShown')) {
      this.closeCustomersDetail();
    }
    if(customersDomElem) {
      customersDomElem.classList.toggle('isShown');
      (<HTMLElement>e.currentTarget )
        .getElementsByClassName('mat-icon')[0]
        .classList.toggle('active-customer-list');
    }
  }

  setIdSubjectToLocalStorage(selectedItem) {
    this.dynamicFormService.setPharmIdSubject(selectedItem['id_subject']);
  }

  setIdOrgToLocalStorage(selectedItem) {
    this.admService.setSelectedIdOrg(selectedItem['id_org']);
  }

  closeCustomersDetail() {
    const rowList : HTMLCollection = document.getElementsByClassName('mat-row');
    const rowListIconMore : HTMLCollection = document.getElementsByClassName('icon-more');

    for (let i = 0; i < rowList.length; i++) {
      if(rowList[i].classList.contains('row-customers')) {
        rowList[i].classList.add('isShown');
      }
    }
    for(let j = 0; j < rowListIconMore.length; j++) {
      if(rowListIconMore[j].classList.contains('active-customer-list')) {
        rowListIconMore[j].classList.remove('active-customer-list');
      }
    }
  }

  removeSelectedRowData() {
    this.admService.removeSelectedIdOrg();
    this.dynamicFormService.clearPharmIdSubject();
    this.selectedRow = null;
  }
}

class MyDataSource<T> extends MatTableDataSource<any> {
  constructor( _data: any[]){
    super();
    this.setData(_data);
  }

  setData(vals: any[]) {
    vals.forEach(v => {
      this.data.push(
        {
          is_customers: v.isCustomers,
          id_org : v.id_org,
          org_name: v.org_name,
          id_morion: v.id_morion,
          name_morion: v.morion_name,
          ls_key: v.license_key,
          access_key: v.access_key,
          id_subject: v.id_subject
        }
      );
      if(v.customers !== null) {
        this.data.push(
          {
            customers: v.customers,
            parent_id_subject: v.id_subject
          }
        );
      }
    });
  }

  /** Noop */
  disconnect() { }
}

import {
  Component, OnInit, ViewChild, OnDestroy, ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatTableDataSource, MatSort } from '@angular/material';

import { Corporation } from './corporation.model';
import { AdmService } from '../adm.service';
import { ActionsService } from '../actions/actions.service';
import { SpinnerService } from '../../core/spinner.service';
import { CopyToClipboardDirective } from '../directives/copy-to-clipboard.directive';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';

@Component({
  selector: 'app-corporation-list',
  templateUrl: './corporation-list.component.html',
  styleUrls: ['./corporation-list.component.scss'],
})
export class CorporationListComponent implements OnInit, OnDestroy {
  columnCaptions: string[] = [];
  corpsDataSource: MatTableDataSource<{}>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(CopyToClipboardDirective) dirs;
  selectedCorpId: number = Number(this.admService.getSelectedCorpId());
  selectedRow: number = null;
  activeSpinner: boolean;
  subscriptionActiveSpinner: Subscription;
  subscriptionCorporations: Subscription;
  subscriptionSelectedRow: Subscription;
  subscriptionCopyToClipboard: Subscription;
  paramsId: string = '';

  constructor(
    private admService: AdmService,
    private actionsService: ActionsService,
    public router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private dynamicFormService: DynamicFormService)
  {
    this.subscriptionActiveSpinner = this.spinnerService.spinnerActive.subscribe(
      active => {
        this.toggleSpinner(active);
      }
    );
    this.route.params.subscribe(
      (params) => {
        this.paramsId = params['idValue'];
      }
    );
    this.subscriptionCorporations = this.admService.corporations$.subscribe(
      (corporations: Corporation[]) => {
        this.corpsDataSource = new MatTableDataSource(corporations);
        this.spinnerService.deactivate();
        this.corpsDataSource.sort = this.sort;
        /** if we have params 'search-value' than filter corpsDataSource according this 'search-value' **/
       if(this.paramsId) {
         this.removeSelectedRowData();
          this.corpsDataSource.filter = this.paramsId;
        }
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
    this.columnCaptions = this.admService.columnCaptionsCorp;
    this.getCorporations();
    if(this.selectedCorpId) {
      this.admService.scrollToIdCorp(this.selectedCorpId);
      setTimeout(() => {
        this.selectedRow = this.selectedCorpId;
      },3);
    }

    /**when we come back to corp list,
     * we should remove selected
     * Pharmacy in pharmacy list
     * **/
    this.dynamicFormService.clearPharmIdSubject();
  }

  ngOnDestroy() {
    this.subscriptionActiveSpinner.unsubscribe();
    this.subscriptionCorporations.unsubscribe();
    this.subscriptionSelectedRow.unsubscribe();
    this.subscriptionCopyToClipboard.unsubscribe();
  }

  toggleSpinner(active){
    this.activeSpinner = active;
  }

  getCorporations() {
    this.spinnerService.activate();
    this.admService.getCorporations().subscribe(
      (response:Corporation[]) => {
        this.admService.setNextCorporations(response);
        //replaced Getting Data Corporations to Subscriptions
        //todo Make resolver - get corporations data before view tepmlate of Corporations component
      },
      /** catches by TokinInterceptor **/
      (error)  => {
        console.log(error);
        this.spinnerService.deactivate();
      }
    );
  }

  selectItemHandler(item: Corporation) {
    /** set id_subject to localStorage every time when we select item **/
    this.dynamicFormService.setCorpIdSubject(item['id_subject']);
    this.selectedRow = item.id_corp;
    this.admService.setSelectedCorpId(item.id_corp.toString());
    this.actionsService.selectCorporation(item);
  }

  scrollToTopHandler(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  removeSelectedRowData() {
    this.admService.removeSelectedIdCorp();
    this.selectedRow = null;
  }
}

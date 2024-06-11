import { Component, OnInit, ViewChild, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ModalPurchaseViewComponent } from '../../Modals/modal-purchase-view/modal-purchase-view.component';
import { ModalAlertComponent } from '../../Modals/modal-alert/modal-alert.component';
import { ModalApprovedComponent } from '../../Modals/modal-approved/modal-approved.component';
import { VilfreshBasketService } from '../../../services/vilfresh-basket/vilfresh-basket.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
@Component({
  selector: 'app-purchase-records',
  templateUrl: './purchase-records.component.html',
  styleUrls: ['./purchase-records.component.css']
})


export class PurchaseRecordsComponent implements OnInit {
   @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
   @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
   @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

   UserInfo: any;
   CustomerPurchaseHitory: any[] = [];
   PageLoader = true;
   CurrentIndex = 1;
   SkipCount = 0;
   SerialNoAddOn = 0;
   LimitCount = 5;
   ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
   PagesArray = [];
   TotalRows = 0;
   LastCreation: Date = new Date();
   PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
   PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
   SubLoader = false;
   GoToPage = null;
   onClose: Subject<any>;
   THeaders: any[] = [
   { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Purchase Date', If_Short: false, Condition: '' },
   { Key: 'Config_Date', ShortKey: 'Config_Date', Name: 'Delivered Date', If_Short: false, Condition: '' },
   { Key: 'TotalItems', ShortKey: 'TotalItems', Name: 'Total Items', If_Short: false, Condition: '' },
   // { Key: 'TotalQuantity', ShortKey: 'TotalQuantity', Name: 'Total Quantity', If_Short: false, Condition: '' },
   { Key: 'TotalAmount', ShortKey: 'TotalAmount', Name: 'Total Amount', If_Short: false, Condition: '' }
   ];

   FiltersArray: any[] = [
      {Active: false, Key: 'FromDate', Value: '', DisplayName: 'From Date', DBName: 'createdAt', Type: 'Date', Option: 'GTE'},
      {Active: false, Key: 'ToDate', Value: '', DisplayName: 'To Date', DBName: 'createdAt', Type: 'Date', Option: 'LTE'},
      {Active: false, Key: 'DeliverFromDate', Value: '', DisplayName: 'From Date', DBName: 'Config_Date', Type: 'Date', Option: 'GTE'},
      {Active: false, Key: 'DeliverToDate', Value: '', DisplayName: 'To Date', DBName: 'Config_Date', Type: 'Date', Option: 'LTE'}
   ];

   FilterFGroupStatus = false;
   FilterFGroup: FormGroup;
   modalReference: BsModalRef;

   DeliveryList: any[] = [];
   subscribe: any;
   constructor(   private OrderService: VilfreshBasketService,
                  private renderer: Renderer2,
                  private LoginService: LoginManageService,
                  private Toastr: ToastrService,
                  public ModalService: BsModalService) {
                  this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info()); }

   ngOnInit() {
      this.Service_Loader();
      this.FilterFGroup = new FormGroup({
         FromDate: new FormControl(''),
         ToDate: new FormControl(''),
         DeliverFromDate: new FormControl(''),
         DeliverToDate: new FormControl('')
      });

      const FilterControls = this.FilterFGroup.controls;
      Object.keys(FilterControls).map(obj => {
         this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
         this.FilterFormChanges();
         });
      });

   }
   NotAllow(): boolean {return false; }

   StartDateFilter = (d: Date): boolean => {
      const day = d.getDay();
      return day === 1;
   }
   EndDateFilter = (d: Date): boolean => {
      const day = d.getDay();
      return day === 6;
   }


   FilterFormChanges() {
      const FilteredValues = this.FilterFGroup.value;
      this.FilterFGroupStatus = false;
      Object.keys(FilteredValues).map(obj => {
         const value = this.FilterFGroup.controls[obj].value;
         if (value !== undefined && value !== null && value !== '') {
         this.FilterFGroupStatus = true;
         }
      });
   }

   Service_Loader() {
      let ShortOrderKey = '';
      let ShortOrderCondition = '';
      this.THeaders.map(obj => {
         if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
      });
      const Filters = this.FiltersArray.filter(obj => obj.Active === true);
      const Data = {
         User: this.UserInfo._id,
         Skip_Count: this.SkipCount,
         Limit_Count: this.LimitCount,
         ShortKey: ShortOrderKey,
         ShortCondition: ShortOrderCondition,
         FilterQuery: Filters
      };
      this.TableLoader();
      this.OrderService.PurchaseOrder_History(Data).subscribe(response => {
         this.PageLoader = false;
         this.SerialNoAddOn = this.SkipCount;
         if (response.Status && response.Status === true) {
         this.CustomerPurchaseHitory = response.Response;
         setTimeout(() => {
            this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
         }, 10);
         this.TotalRows = response.SubResponse;
         this.Pagination_Affect();
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
         if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
         }
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
         }
      });
   }

   Short_Change(index: any) {
      if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
         this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Ascending';
         this.Pagination_Action(1);
      } else if (this.THeaders[index].If_Short !== undefined &&
         this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Descending';
         this.Pagination_Action(1);
      } else if (this.THeaders[index].If_Short !== undefined &&
         this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Ascending';
         this.Pagination_Action(1);
      } else {
         this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
         this.Pagination_Action(1);
      }
   }

   Pagination_Action(index: any) {
      const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
      if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
         this.CurrentIndex = index;
         this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
         this.Service_Loader();
      }
   }

   Pagination_Affect() {
      const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
      const PrevClass = (this.CurrentIndex > 1 ? '' : 'PageAction_Disabled');
      this.PagePrevious = { Disabled: !(this.CurrentIndex > 1), Value: (this.CurrentIndex - 1), Class: PrevClass };
      const NextClass = (this.CurrentIndex < NoOfArrays ? '' : 'PageAction_Disabled');
      this.PageNext = { Disabled: !(this.CurrentIndex < NoOfArrays), Value: (this.CurrentIndex + 1), Class: NextClass };
      this.PagesArray = [];
      for (let index = 1; index <= NoOfArrays; index++) {
         if (index === 1) {
         this.PagesArray.push({ Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.CurrentIndex === index) });
         }
         if (index > 1 && NoOfArrays > 2 && index < NoOfArrays) {
         if (index === (this.CurrentIndex - 2)) {
            this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
         }
         if (index === (this.CurrentIndex - 1)) {
            this.PagesArray.push({ Text: (this.CurrentIndex - 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
         }
         if (index === this.CurrentIndex) {
            this.PagesArray.push({ Text: this.CurrentIndex.toString(), Class: 'Number', Value: index, Show: true, Active: true });
         }
         if (index === (this.CurrentIndex + 1)) {
            this.PagesArray.push({ Text: (this.CurrentIndex + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
         }
         if (index === (this.CurrentIndex + 2)) {
            this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
         }
         }
         if (index === NoOfArrays && NoOfArrays > 1) {
         this.PagesArray.push({
            Text: NoOfArrays.toString(), Class: 'Number',
            Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index)
         });
         }
      }
      let ToCount = this.SkipCount + this.LimitCount;
      if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
      const AddCount =  this.TotalRows > 0 ? 1 : 0;
      this.ShowingText = 'Showing <span>' + (this.SkipCount + AddCount) + '</span> to <span>' +
        ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
   }


   TableLoader() {
      setTimeout(() => {
         const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
         const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
         this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'flex');
         this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'height', Height + 'px');
         this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'line-height', Height + 'px');
         this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'top', Top + 'px');
      }, 10);
   }

   CommonInputReset(control: any, value: any) {

   }


   CommonValidatorsSet(control: any) {
   const FormControlValidation = null;
   this.FilterFGroup.controls[control].setValidators(FormControlValidation);
   }


   SubmitFilters() {
      const FilteredValues = this.FilterFGroup.value;
      this.FiltersArray.map(obj => {
         obj.Active = false;
         obj.Value = obj.Type === 'String' ? '' : null;
         obj.Value = obj.Type === 'Object' ? '' : null;
      });
      Object.keys(FilteredValues).map(obj => {
         const value = this.FilterFGroup.controls[obj].value;
         if (value !== undefined && value !== null && value !== '') {
         const index = this.FiltersArray.findIndex(objNew => objNew.Key === obj);
         this.FiltersArray[index].Active = true;
         this.FiltersArray[index].Value = value;
         }
      });
      this.Pagination_Action(1);
      this.modalReference.hide();
   }

   AutocompleteBlur(key: any) {
      const value =  this.FilterFGroup.controls[key].value;
      if (!value || value === null || value === '' || typeof value !== 'object') {
         this.FilterFGroup.controls[key].setValue(null);
      }
   }

   ResetFilters() {
      this.FiltersArray.map(obj => {
         obj.Active = false;
         obj.Value = obj.Type === 'String' ? '' : null;
         this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
      });
      this.FilterFGroupStatus = false;
      this.Pagination_Action(1);
      this.modalReference.hide();
   }


   RemoveFilter(index: any) {
      const KeyName = this.FiltersArray[index].Key;
      const EmptyValue = this.FiltersArray[index].Type === 'String' ? '' : null;
      this.FilterFGroup.controls[KeyName].setValue(EmptyValue);
      this.SubmitFilters();
   }

   openFilterModal(template: TemplateRef<any>) {
      this.FiltersArray.map(obj => {
         this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
      });
      this.modalReference = this.ModalService.show(template,
         { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
   }

   ViewUpcomingOrders(index: any) {
      const initialState = {
         Info: this.CustomerPurchaseHitory[index]
      };
      this.modalReference = this.ModalService.show(ModalPurchaseViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
   }

}

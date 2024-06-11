import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { CustomerDetailsService } from 'src/app/services/customer-management/customer-details/customer-details.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalApprovedComponent } from '../../Modals/modal-approved/modal-approved.component';
import { ModalCustomerViewComponent } from '../../Modals/modal-customer-view/modal-customer-view.component';

import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { ModalCustomerManagementComponent } from '../../Modals/modal-customer-management/modal-customer-management.component';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { DatePipe } from '@angular/common';

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as XLSX from 'xlsx';


export interface Customers { _id: string; Customer_Name: string; }
export interface Delivery_Line {  _id: string;  Deliveryline_Name: string; }

@Component({
  selector: 'app-customer-records',
  templateUrl: './customer-records.component.html',
  styleUrls: ['./customer-records.component.css']
})
export class CustomerRecordsComponent implements OnInit {

  @ViewChild('TableHeaderSection', {static: false}) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', {static: false}) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', {static: false}) TableLoaderSection: ElementRef;

  UserInfo: any;
  CustomerDetails: any[] = [];
  PageLoader = true;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value : 0, Class: 'PageAction_Disabled'};
  PageNext: object = { Disabled: true, value : 0, Class: 'PageAction_Disabled'};
  SubLoader = false;
  GoToPage = null;

  modalReference: BsModalRef;
  UserList: any[] = [];
  minDate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0));

  // tslint:disable-next-line:variable-name
  Customer_Status: any[] = [ {Name: 'WaitingFor Approval', Key: 'Registration_completed'},
                             {Name: 'Sample Pending', Key: 'Sample_Pending'},
                             {Name: 'Sample Rejected', Key: 'Sample_Rejected'},
                             {Name: 'Sample OnHold', Key: 'Sample_OnHold'},
                             {Name: 'Sample Approved', Key: 'Sample_Approved'},
                             {Name: 'Sample Delivered', Key: 'Sample_Delivered'},
                             {Name: 'Sample Delivery Canceled', Key: 'Sample_Delivery_Canceled'},
                             {Name: 'Subscription Activated', Key: 'Subscription_Activated'},
                             {Name: 'Customer InActivated', Key: 'InActivated'},
                             {Name: 'Customer Activated', Key: 'Approved'},
                             {Name: 'WaitingFor Subscription', Key: 'WaitingFor_Subscription'}];


  THeaders: any[] = [{ Key: 'Customer_Name', ShortKey: 'Customer_Name', Name: 'Customer Name', If_Short: false, Condition: '' },
                     { Key: 'Mobile_Number', ShortKey: 'Mobile_Number', Name: 'Mobile Number', If_Short: false, Condition: '' },
                     { Key: 'Pincode', ShortKey: 'Pincode', Name: 'Pin Code', If_Short: false, Condition: '' },
                     { Key: 'Delivery_Line', ShortKey: 'Delivery_LineSort', Name: 'Delivery Line', If_Short: false, Condition: '' },
                     { Key: 'Customer_Status', ShortKey: 'Customer_Status', Name: 'Customer Status', If_Short: false, Condition: '' },
                     { Key: 'VilfreshMoney_Limit', ShortKey: 'Wallet_Amount', Name: 'Vilfresh Money', If_Short: false, Condition: '' },
                     { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Date', If_Short: false, Condition: '' }];


   FilterFGroup: FormGroup;
   FiltersArray: any[] = [ {Active: false, Key: 'Customer_Name', Value: '', DisplayName: 'Customer Name', DBName: 'Customer_Name', Type: 'String', Option: '' },
                           {Active: false, Key: 'Delivery_Line', Value: '', DisplayName: 'Delivery Line', DBName: 'Delivery_Line', Type: 'Object', Option: ''},
                           {Active: false, Key: 'Mobile_Number', Value: null, DisplayName: 'Mobile Number', DBName: 'Mobile_Number', Type: 'String', Option: '' },
                           {Active: false, Key: 'Pincode', Value: null, DisplayName: 'Pin Code', DBName: 'Pincode', Type: 'String', Option: '' },
                           {Active: false, Key: 'Added_From', Value: null, DisplayName: 'From Date', DBName: 'createdAt', Type: 'Date', Option: 'GTE' },
                           {Active: false, Key: 'Added_To', Value: null, DisplayName: 'To Date', DBName: 'createdAt', Type: 'Date', Option: 'LTE' },
                           {Active: false, Key: 'Customer_Status', Value: null, DisplayName: 'Customer Status', DBName: 'Customer_Status', Type: 'String', Option: '' }];
   FilterFGroupStatus = false;

   ExportFilterFGroup: FormGroup;
   ExportFiltersArray: any[] = [
                           {Active: false, Key: 'Delivery_Line', Value: '', DisplayName: 'Delivery Line', DBName: 'Delivery_Line', Type: 'Object', Option: ''},
                           {Active: false, Key: 'Pincode', Value: null, DisplayName: 'Pin Code', DBName: 'Pincode', Type: 'String', Option: '' },
                           {Active: false, Key: 'Added_From', Value: null, DisplayName: 'Register From', DBName: 'createdAt', Type: 'Date', Option: 'GTE' },
                           {Active: false, Key: 'Added_To', Value: null, DisplayName: 'Register To', DBName: 'createdAt', Type: 'Date', Option: 'LTE' },
									{Active: false, Key: 'Money_Limit_From', Value: null, DisplayName: 'Vilfresh Money From', DBName: 'VilfreshMoney_Limit', Type: 'Number', Option: 'GTE' },
                           {Active: false, Key: 'Money_Limit_To', Value: null, DisplayName: 'Vilfresh Money To', DBName: 'VilfreshMoney_Limit', Type: 'Number', Option: 'LTE' },
									{Active: false, Key: 'Used_Credit_From', Value: null, DisplayName: 'Used Credit From', DBName: 'usedCredit', Type: 'Number', Option: 'GTE' },
                           {Active: false, Key: 'Used_Credit_To', Value: null, DisplayName: 'Used Credit To', DBName: 'usedCredit', Type: 'Number', Option: 'LTE' },
									{Active: false, Key: 'Customer_Status', Value: null, DisplayName: 'Customer Status', DBName: 'Customer_Status', Type: 'String', Option: '' }];
   ExportFilterFGroupStatus = false;

   DeliveryList: any[] = [];
   CustomerList: any[] = [];
   // tslint:disable-next-line:variable-name
   filteredCustomer_List: Observable<Customers[]>;
   LastSelectedCustomer = null;
   CustomerApprove: FormGroup;
   CustomerDeactivate: FormGroup;
   filteredDeliveryList: Observable<Delivery_Line[]>;
   LastSelectedDeliveryline = null;
   Export_filteredDeliveryList: Observable<Delivery_Line[]>;
   Export_LastSelectedDeliveryline = null;

   // Filter Input Validation
   AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
   AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
   Alphabets = new RegExp('^[A-Za-z]+$');
   AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
   AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
   Numerics = new RegExp('^[0-9]+$');
   NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
   MobileNumeric = new RegExp('^[0-9 +]+$');

   ExportRunning = false;

  constructor( private CustomerService: CustomerDetailsService,
               private renderer: Renderer2,
               private Toastr: ToastrService,
               private LoginService: LoginManageService,
               private DeliveryService: DeliveryService,
               public ModalService: BsModalService) {
         this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
         // this.UserInfo = localStorage.getItem('User');
         this.Service_Loader();
         this.DeliveryService.AllDeliveryLine_List({User: this.UserInfo._id}).subscribe(response => {
         this.DeliveryList = response.Response;
         if (response.Status && response.Status === true) {
            this.DeliveryList = response.Response;
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            // this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
            // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'DeliveryLine Records Getting Error!, But not Identify!' });
         }
      });
   }

  ngOnInit() {

   this.FilterFGroup = new FormGroup({
      Delivery_Line: new FormControl(''),
      Customer_Name: new FormControl(''),
      Mobile_Number: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10)]),
      Pincode: new FormControl('', [Validators.minLength(6), Validators.maxLength(6)]),
      Customer_Status: new FormControl(''),
      Added_From: new FormControl(''),
      Added_To: new FormControl('')
   });

   this.ExportFilterFGroup = new FormGroup({
      Delivery_Line: new FormControl(''),
      Pincode: new FormControl('', [Validators.minLength(6), Validators.maxLength(6)]),
      Customer_Status: new FormControl(''),
      Added_From: new FormControl(''),
      Added_To: new FormControl(''),
		Money_Limit_From: new FormControl('', [this.CustomValidation('NumericDecimal')]),
      Money_Limit_To: new FormControl('', [this.CustomValidation('NumericDecimal')]),
		Used_Credit_From: new FormControl('', [this.CustomValidation('NumericDecimal')]),
      Used_Credit_To: new FormControl('', [this.CustomValidation('NumericDecimal')])
   });

   this.CustomerApprove = new FormGroup({
      Delivery_Line: new FormControl('', Validators.required),
      CustomerId: new FormControl('', Validators.required),
      Customer_Status: new FormControl('Approved'),
      User: new FormControl(this.UserInfo._id, Validators.required),
   });


   this.CustomerDeactivate = new FormGroup({
      Deactivation_Reason: new FormControl('', Validators.required),
      CustomerId: new FormControl('', Validators.required),
      User: new FormControl(this.UserInfo._id, Validators.required),
   });


   const FilterControls = this.FilterFGroup.controls;
   Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
         this.FilterFormChanges();
      });
   });

   const ExportFilterControls = this.ExportFilterFGroup.controls;
   Object.keys(ExportFilterControls).map(obj => {      
      this.ExportFilterFGroup.controls[obj].valueChanges.subscribe(value => {
         this.ExportFilterFormChanges();
      });
   });

     // Deliveryline list auto complete
     this.Export_filteredDeliveryList = this.ExportFilterFGroup.controls.Delivery_Line.valueChanges.pipe(
      startWith(''), map(value => {
         if (value && value !== null && value !== '') {
            if ( typeof value === 'object') {
               if (this.Export_LastSelectedDeliveryline === null || this.Export_LastSelectedDeliveryline !== value._id) {
                  this.Export_LastSelectedDeliveryline = value._id;
               }
               value = value.Deliveryline_Name;
            }
            return this.DeliveryList.filter(option => option.Deliveryline_Name.toLowerCase().includes(value.toLowerCase()));
         } else {
            this.Export_LastSelectedDeliveryline = null;
            return this.DeliveryList;
         }
      })
   );

   // Deliveryline list auto complete
   this.filteredDeliveryList = this.FilterFGroup.controls.Delivery_Line.valueChanges.pipe(
      startWith(''), map(value => {
         if (value && value !== null && value !== '') {
            if ( typeof value === 'object') {
               if (this.LastSelectedDeliveryline === null || this.LastSelectedDeliveryline !== value._id) {
                  this.LastSelectedDeliveryline = value._id;
               }
               value = value.Deliveryline_Name;
            }
            return this.DeliveryList.filter(option => option.Deliveryline_Name.toLowerCase().includes(value.toLowerCase()));
         } else {
            this.LastSelectedCustomer = null;
            return this.DeliveryList;
         }
      })
   );
   }

   DeliverylineDisplayName(Delivery_Line: any) {
      return (Delivery_Line && Delivery_Line !== null && Delivery_Line !== '') ? Delivery_Line.Deliveryline_Name : null;
   }

   NotAllow() {

   }



   Short_Change(index: any) {
      if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
         this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Ascending';
         this.Pagination_Action(1);
      } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Descending';
         this.Pagination_Action(1);
      } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Ascending';
         this.Pagination_Action(1);
      } else {
         this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
         this.Pagination_Action(1);
      }
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

   
   ExportFilterFormChanges() {
      const FilteredValues = this.ExportFilterFGroup.value;
      this.ExportFilterFGroupStatus = false;
      Object.keys(FilteredValues).map(obj => {
         const value = this.ExportFilterFGroup.controls[obj].value;
         if (value !== undefined && value !== null && value !== '') {
            this.ExportFilterFGroupStatus = true;
         }
      });
   }

  Service_Loader() {
   let ShortOrderKey = '';
   let ShortOrderCondition = '';
   this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition;  }
   });
   const Filters = this.FiltersArray.filter(obj => obj.Active === true);
   const Data = { Skip_Count: this.SkipCount,
                  Limit_Count: this.LimitCount,
                  User: this.UserInfo._id,
                  ShortKey: ShortOrderKey,
                  ShortCondition: ShortOrderCondition,
                  FilterQuery: Filters };
   this.TableLoader();
   this.CustomerService.All_Customers_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true ) {
         this.CustomerDetails = response.Response;
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

 Pagination_Affect() {
   const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
   const PrevClass = (this.CurrentIndex > 1 ? '' : 'PageAction_Disabled');
   this.PagePrevious = { Disabled: !(this.CurrentIndex > 1), Value : (this.CurrentIndex - 1), Class: PrevClass};
   const NextClass = (this.CurrentIndex < NoOfArrays ? '' : 'PageAction_Disabled');
   this.PageNext = { Disabled: !(this.CurrentIndex < NoOfArrays), Value : (this.CurrentIndex + 1), Class: NextClass};
   this.PagesArray = [];
   for (let index = 1; index <= NoOfArrays ; index++) {
      if (index === 1) {
         this.PagesArray.push({Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.CurrentIndex === index ) });
      }
      if (index > 1 && NoOfArrays > 2 && index < NoOfArrays ) {
         if (index === (this.CurrentIndex - 2)) {
            this.PagesArray.push({Text: '...', Class: 'Dots', Show: true, Active: false });
         }
         if (index === (this.CurrentIndex - 1) ) {
            this.PagesArray.push({Text: (this.CurrentIndex - 1).toString(), Class: 'Number',  Value: index, Show: true, Active: false });
         }
         if (index === this.CurrentIndex) {
            this.PagesArray.push({Text: this.CurrentIndex.toString(), Class: 'Number', Value: index, Show: true, Active: true });
         }
         if (index === (this.CurrentIndex + 1) ) {
            this.PagesArray.push({Text: (this.CurrentIndex + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
         }
         if (index === (this.CurrentIndex + 2)) {
            this.PagesArray.push({Text: '...', Class: 'Dots', Show: true, Active: false });
         }
      }
      if (index === NoOfArrays && NoOfArrays > 1) {
         this.PagesArray.push({Text: NoOfArrays.toString(), Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index ) });
      }
   }
   let ToCount = this.SkipCount + this.LimitCount;
   if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
   const AddCount =  this.TotalRows > 0 ? 1 : 0;
   this.ShowingText = 'Showing <span>' + (this.SkipCount + AddCount) + '</span> to <span>' + ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
   }

   CreateCustomer() {
      const initialState = { Type: 'Create' };
      this.modalReference = this.ModalService.show(ModalCustomerManagementComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.Pagination_Action(1);
         }
      });
   }

   EditCustomer(index: any) {
      const initialState = {
         Type: 'Edit',
         Info: this.CustomerDetails[index]
      };
      this.modalReference = this.ModalService.show(ModalCustomerManagementComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.CustomerDetails[index] = response.Response;
         }
      });
   }

   ViewCustomer(index: any) {
      const initialState = {
         Info: this.CustomerDetails[index]
      };
      this.modalReference = this.ModalService.show(ModalCustomerViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.CustomerDetails[index] = response.Response;
         }
      });
   }

   DeleteCustomer(index: any) {
      const initialState = {
         Icon : 'delete_forever',
         ColorCode : 'danger',
         TextOne : 'You Want to',
         TextTwo : 'Delete',
         TextThree : 'this User ?',
      };
      this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with'} ));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            const UserId = this.CustomerDetails[index]._id;
            this.CustomerService.Customer_Delete({_id: UserId}).subscribe(newResponse => {
               this.Pagination_Action(1);
            });
         }
      });
   }


   Pagination_Action(index: any) {
      const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
      if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
         this.CurrentIndex = index;
         this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
         this.Service_Loader();
      }
   }


   CustomerSample_Approve(index: any, template: TemplateRef<any>) {
      const CustomerId = this.CustomerDetails[index]._id;
      this.CustomerApprove.get('CustomerId').setValue(CustomerId);
      if (this.CustomerDetails[index].Delivery_Line === null || this.CustomerDetails[index].Delivery_Line === undefined || this.CustomerDetails[index].Delivery_Line === '' || typeof this.CustomerDetails[index].Delivery_Line !== 'object'  ) {
         this.CustomerApprove.get('Delivery_Line').setValue(null);
         this.modalReference = this.ModalService.show(template, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'} );
      } else {
         const initialState = {
            Icon : 'verified_user',
            ColorCode : 'success',
            TextOne : 'You Want to',
            TextTwo : 'Sample Approved',
            TextThree : 'for this Customer ?',
         };
         const DeliveryLine = this.CustomerDetails[index].Delivery_Line._id;
         this.CustomerApprove.get('Delivery_Line').setValue(DeliveryLine);
         this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated bounceInRight modal-small-with'} ));
         this.modalReference.content.onClose.subscribe(response => {
            if (response.Status) {
               this.CustomerSampleApproveWithLine();
            }
         });
      }
   }


   CustomerActivate(index: any, template: TemplateRef<any>) {
      const CustomerId = this.CustomerDetails[index]._id;
      this.CustomerApprove.get('CustomerId').setValue(CustomerId);
      if (this.CustomerDetails[index].Delivery_Line === null || this.CustomerDetails[index].Delivery_Line === undefined || this.CustomerDetails[index].Delivery_Line === '' || typeof this.CustomerDetails[index].Delivery_Line !== 'object'  ) {
         this.CustomerApprove.get('Delivery_Line').setValue(null);
         this.modalReference = this.ModalService.show(template, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'} );
      } else {
         const initialState = {
            Icon : 'verified_user',
            ColorCode : 'success',
            TextOne : 'You Want to',
            TextTwo : 'Activated',
            TextThree : 'for this Customer ?',
         };
         const DeliveryLine = this.CustomerDetails[index].Delivery_Line._id;
         this.CustomerApprove.get('Delivery_Line').setValue(DeliveryLine);
         this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated bounceInRight modal-small-with'} ));
         this.modalReference.content.onClose.subscribe(response => {
            if (response.Status) {
               this.CustomerApproveWithLine();
            }
         });
      }
   }

      CustomerApproveWithLine() {
         if (this.CustomerApprove.valid) {
            this.CustomerService.Customer_Approve_WithLine(this.CustomerApprove.getRawValue()).subscribe(response => {
               if (response.Status) {
                  this.modalReference.hide();
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully Activated for this Customer' });
                  this.Service_Loader();
               } else {
                  if (response.Message === undefined || response.Message === '' || response.Message === null) {
                     response.Message = 'Some Error Occoured!, But not Identified.';
                  }
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
               }
            });
         }
   }


   CustomerSampleApproveWithLine() {
      if (this.CustomerApprove.valid) {
         this.CustomerService.CustomerSample_Approve(this.CustomerApprove.getRawValue()).subscribe(response => {
            if (response.Status) {
               this.modalReference.hide();
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Sample Approved Successfully' });
               this.Service_Loader();
            } else {
               if (response.Message === undefined || response.Message === '' || response.Message === null) {
                  response.Message = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
            }
         });
      }
}

   CustomerSample_Reject(index: any) {
      const initialState = {
         Icon : 'block',
         ColorCode : 'danger',
         TextOne : 'Do You Want',
         TextTwo : 'Reject Sample',
         TextThree : 'for this Customer ?',
      };
      this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with'} ));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            const CustomerId = this.CustomerDetails[index]._id;
            this.CustomerService.CustomerSample_Reject({CustomerId, Customer_Status: 'Sample_Rejected', User: this.UserInfo._id}).subscribe(responseNew => {
               // this.CustomerDetails[index].Customer_Status = 'Hold';
               if (responseNew.Status) {
                  this.Service_Loader();
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Sample has been Rejected Successfully' });
               }
            });
         }
      });
   }


   DeactivateCustomer() {
      this.CustomerService.Customer_DeActivate(this.CustomerDeactivate.getRawValue()).subscribe(responseNew => {
         this.modalReference.hide();
         if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer has been DeActivated Successfully' });
         }
      });
   }

   CustomerInActives(index: any,  template: TemplateRef<any>) {
      const CustomerId = this.CustomerDetails[index]._id;
      this.CustomerDeactivate.get('CustomerId').setValue(CustomerId);
      this.CustomerDeactivate.get('Deactivation_Reason').setValue('');
      this.modalReference = this.ModalService.show(template, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'} );
   }

   ReactivateCustomer(index: any) {
      const initialState = {
         Icon : 'block',
         ColorCode : 'success',
         TextOne : 'Do You Want',
         TextTwo : 'Activated ',
         TextThree : 'for this Customer ?',
      };
      this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with'} ));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            const CustomerId = this.CustomerDetails[index]._id;
            this.CustomerService.Customer_ReActivate({CustomerId, User: this.UserInfo._id}).subscribe(responseNew => {
               if (responseNew.Status) {
                  this.Service_Loader();
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer has been Activated Successfully' });
               }
            });
         }
      });
   }


   CustomerDisplayName(Customer: any) {
      return (Customer && Customer !== null && Customer !== '') ? Customer.Customer_Name : null;
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
      // this.modalReference.hide();
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
      this.modalReference = this.ModalService.show(template, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'} );
   }


   CustomValidation(Condition: any): ValidatorFn {
      if (Condition === 'AlphaNumeric') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.AlphaNumeric.test(control.value)) {
               return { AlphaNumericError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphaNumericSpaceHyphen') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.AlphaNumericSpaceHyphen.test(control.value)) {
               return { AlphaNumericSpaceHyphenError: true };
            }
            return null;
         };
      }
      if (Condition === 'Alphabets') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.Alphabets.test(control.value)) {
               return { AlphabetsError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphabetsSpaceHyphen') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphen.test(control.value)) {
               return { AlphabetsSpaceHyphenError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphabetsSpaceHyphenDot') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphenDot.test(control.value)) {
               return { AlphabetsSpaceHyphenDotError: true };
            }
            return null;
         };
      }
      if (Condition === 'Numerics') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
               return { NumericsError: true };
            }
            return null;
         };
      }
      if (Condition === 'NumericDecimal') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.NumericDecimal.test(control.value)) {
               return { NumericDecimalError: true };
            }
            return null;
         };
      }
      if (Condition === 'MobileNumeric') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.MobileNumeric.test(control.value)) {
               return { MobileNumericError: true };
            }
            return null;
         };
      }
   }
   GetFormControlErrorMessage(KeyName: any) {
      const FControl = this.FilterFGroup.get(KeyName) as FormControl;
      if (FControl.invalid && FControl.touched) {
         const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
         if (ErrorKeys.length > 0) {
            let returnText = '';
            if (ErrorKeys.indexOf('required') > -1) {
               returnText = 'This field is required';
            } else if (ErrorKeys.indexOf('min') > -1) {
               returnText = 'Enter the value should be more than ' + FControl.errors.min.min;
            } else if (ErrorKeys.indexOf('max') > -1) {
               returnText = 'Enter the value should be less than or equal ' + FControl.errors.max.max;
            } else if (ErrorKeys.indexOf('minlength') > -1) {
               returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
            } else if (ErrorKeys.indexOf('maxlength') > -1) {
               returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
            } else if (ErrorKeys.indexOf('AlphaNumericError') > -1) {
               returnText = 'Please Enter Only Alphabets and Numerics!';
            } else if (ErrorKeys.indexOf('AlphaNumericSpaceHyphen') > -1) {
               returnText = 'Please Enter Only Alphabets, Numerics, Space and Hyphen!';
            } else if (ErrorKeys.indexOf('AlphabetsError') > -1) {
               returnText = 'Please Enter Only Alphabets!';
            } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenError') > -1) {
               returnText = 'Please Enter Only Alphabets, Space and Hyphen!';
            } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenDotError') > -1) {
               returnText = 'Please Enter Only Alphabets, Space, Dot and Hyphen!';
            } else if (ErrorKeys.indexOf('email') > -1) {
               returnText = 'Please Enter Valid Email!';
            } else if (ErrorKeys.indexOf('NumericsError') > -1) {
               returnText = 'Please Enter Only Numerics!';
            } else if (ErrorKeys.indexOf('NumericDecimalError') > -1) {
               returnText = 'Please Enter Only Numeric and Decimals!';
            } else if (ErrorKeys.indexOf('MobileNumericError') > -1) {
               returnText = 'Please Enter Only Numeric, Spaces and +!';
            } else {
               returnText = 'Undefined error detected!';
            }
            return returnText;
         } else {
            return '';
         }
      }
   }

	GetExportFormControlErrorMessage(KeyName: any) {
      const FControl = this.ExportFilterFGroup.get(KeyName) as FormControl;
      if (FControl.invalid && FControl.touched) {
         const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
         if (ErrorKeys.length > 0) {
            let returnText = '';
            if (ErrorKeys.indexOf('required') > -1) {
               returnText = 'This field is required';
            } else if (ErrorKeys.indexOf('min') > -1) {
               returnText = 'Enter the value should be more than ' + FControl.errors.min.min;
            } else if (ErrorKeys.indexOf('max') > -1) {
               returnText = 'Enter the value should be less than or equal ' + FControl.errors.max.max;
            } else if (ErrorKeys.indexOf('minlength') > -1) {
               returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
            } else if (ErrorKeys.indexOf('maxlength') > -1) {
               returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
            } else if (ErrorKeys.indexOf('AlphaNumericError') > -1) {
               returnText = 'Please Enter Only Alphabets and Numerics!';
            } else if (ErrorKeys.indexOf('AlphaNumericSpaceHyphen') > -1) {
               returnText = 'Please Enter Only Alphabets, Numerics, Space and Hyphen!';
            } else if (ErrorKeys.indexOf('AlphabetsError') > -1) {
               returnText = 'Please Enter Only Alphabets!';
            } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenError') > -1) {
               returnText = 'Please Enter Only Alphabets, Space and Hyphen!';
            } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenDotError') > -1) {
               returnText = 'Please Enter Only Alphabets, Space, Dot and Hyphen!';
            } else if (ErrorKeys.indexOf('email') > -1) {
               returnText = 'Please Enter Valid Email!';
            } else if (ErrorKeys.indexOf('NumericsError') > -1) {
               returnText = 'Please Enter Only Numerics!';
            } else if (ErrorKeys.indexOf('NumericDecimalError') > -1) {
               returnText = 'Please Enter Only Numeric and Decimals!';
            } else if (ErrorKeys.indexOf('MobileNumericError') > -1) {
               returnText = 'Please Enter Only Numeric, Spaces and +!';
            } else {
               returnText = 'Undefined error detected!';
            }
            return returnText;
         } else {
            return '';
         }
      }
   }


   Export() {
      this.ExportRunning = true;
      const FilteredValues = this.ExportFilterFGroup.value;
      this.ExportFiltersArray.map(obj => {
         obj.Active = false;
         obj.Value = obj.Type === 'String' ? '' : null;
         obj.Value = obj.Type === 'Object' ? '' : null;
      });
      Object.keys(FilteredValues).map(obj => {
         const value = this.ExportFilterFGroup.controls[obj].value;
         if (value !== undefined && value !== null && value !== '') {
            const index = this.ExportFiltersArray.findIndex(objNew => objNew.Key === obj);
            this.ExportFiltersArray[index].Active = true;
            this.ExportFiltersArray[index].Value = value;
         }
      });
      const NewFilters = this.ExportFiltersArray.filter(obj => obj.Active === true);
      const Data = {
         User: this.UserInfo._id,
         FilterQuery: NewFilters
      };
      this.CustomerService.All_Customers_Export(Data).subscribe(response => {
         if (response.Status && response.Status === true) {
            let AllOrderCustomerDetails = response.Response;
            const CustomersArr = [];
            AllOrderCustomerDetails.map((Obj, idx) => {
               const DeliveryLine = Obj.Delivery_Line && Obj.Delivery_Line !== null && Obj.Delivery_Line.Deliveryline_Name ?  Obj.Delivery_Line.Deliveryline_Name : '';
               const CustomerStatus = this.Customer_Status.filter(ObjNew => ObjNew.Key === Obj.Customer_Status);
               const CusStatus = CustomerStatus.length > 0 ? CustomerStatus[0].Name : '' ;
               const NewObj = {
                  SNo: CustomersArr.length + 1,
                  Name: Obj.Customer_Name,
                  Mobile: Obj.Mobile_Number,
                  Email: Obj.Email,
                  Address: Obj.Address,
                  Pin_Code: Obj.Pincode,
                  Delivery_Line: DeliveryLine,
                  Delivery_Line_Queue: Obj.Delivery_Line_Queue,
                  Customer_Status: CusStatus,
                  Wallet_Amount: Obj.VilfreshMoney_Limit,
                  Credit_Assigned: Obj.VilfreshCredit_Limit,
                  Credit_Used: Obj.VilfreshCredit_Limit - Obj.AvailableCredit_Limit,
                  Registered_Date:  new DatePipe('en-US').transform(new Date(Obj.createdAt), 'd-MMM-y')
               };
               CustomersArr.push(NewObj);
            });
      
            const Header = ['S.No', 'Name', 'Mobile', 'Email', 'Address', 'Pin Code', 'Delivery Line', 'Delivery Line Queue', 'Customer Status', 'Wallet Amount (Rs.)', 'Credit Assigned (Rs.)', 'Credit Used (Rs.)', 'Registered Date' ];
            const Today = new DatePipe('en-US').transform(new Date(), 'd-MMM-y');
            const WorkSheetName = 'Customers-Report';
            const WorkbookName = 'Customers' + Today;
      
            let FromDate = '-';
            let ToDate = '-';
				let MoneyFrom = '-';
            let MoneyTo = '-';
				let UsedCreditFrom = '-';
            let UsedCreditTo = '-';
            let Line = 'All';
            let PinCode = 'All';
            let Status = 'All';

            const Filters = this.ExportFiltersArray.filter(obj => obj.Active === true);
            if (Filters.length > 0) {
               Filters.map(obj => {
                  if (obj.Key === 'Pincode') {
                     PinCode = this.ExportFilterFGroup.value.Pincode;
                  }
                  if (obj.Key === 'Customer_Status') {
                     const CustomerStatus = this.Customer_Status.filter(ObjNew => ObjNew.Key === this.ExportFilterFGroup.value.Customer_Status);
                     Status = CustomerStatus.length > 0 ? CustomerStatus[0].Name : '' ;
                  }
                  if (obj.Key === 'Added_From') {
                     FromDate = new DatePipe('en-US').transform(new Date(this.ExportFilterFGroup.value.Added_From), 'd-MMM-y');
                  }
                  if (obj.Key === 'Added_To') {
                     ToDate = new DatePipe('en-US').transform(new Date(this.ExportFilterFGroup.value.Added_To), 'd-MMM-y');
                  }
						if (obj.Key === 'Money_Limit_From') {
                     MoneyFrom = 'Rs. ' + this.ExportFilterFGroup.value.Money_Limit_From;
                  }
						if (obj.Key === 'Money_Limit_To') {
                     MoneyTo = 'Rs. ' + this.ExportFilterFGroup.value.Money_Limit_To;
                  }
						if (obj.Key === 'Used_Credit_From') {
                     UsedCreditFrom = 'Rs. ' + this.ExportFilterFGroup.value.Used_Credit_From;
                  }
						if (obj.Key === 'Used_Credit_To') {
                     UsedCreditTo = 'Rs. ' + this.ExportFilterFGroup.value.Used_Credit_To;
                  }
                  if (obj.Key === 'Delivery_Line') {
                     Line = this.ExportFilterFGroup.value.Delivery_Line.Deliveryline_Name;
                  }
               });
            }
      
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet([]);
            XLSX.utils.sheet_add_aoa(worksheet, [
					['Delivery Line : ', Line],
					['Pin Code : ', PinCode],
					['From Date : ', FromDate],
					['To Date : ', ToDate],
					['Vilfresh Money From : ', MoneyFrom],
					['Vilfresh Money To : ', MoneyTo],
					['Used Credit From : ', UsedCreditFrom],
					['Used Credit To : ', UsedCreditTo],
					['Customer Status : ', Status]], {origin: 'A2'});
            XLSX.utils.sheet_add_aoa(worksheet, [Header], {origin: 'A12'});
            XLSX.utils.sheet_add_json(worksheet, CustomersArr, {origin: 'A13', skipHeader: true });
            XLSX.utils.book_append_sheet(workbook, worksheet, WorkSheetName);
            XLSX.writeFile(workbook, (WorkbookName + '.csv'));
            this.ExportRunning = false;
            this.modalReference.hide();
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
            this.ExportRunning = false;
            this.modalReference.hide();
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
            this.ExportRunning = false;
            this.modalReference.hide();
         }
      });
   }
}

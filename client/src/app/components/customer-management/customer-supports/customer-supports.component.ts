import { Component, OnInit, ViewChild, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalApprovedComponent } from '../../Modals/modal-approved/modal-approved.component';
import { CustomerSupportService } from '../../../services/customer-management/customer-support.service';
import { Subject } from 'rxjs';
import { ModalCustomerSupportComponent } from '../../../components/Modals/modal-customer-support/modal-customer-support.component';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';

export interface Customers { _id: string; Customer_Name: string; }
@Component({
  selector: 'app-customer-supports',
  templateUrl: './customer-supports.component.html',
  styleUrls: ['./customer-supports.component.css']
})
export class CustomerSupportsComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserInfo: any;
  CustomerSupportDetails: any[] = [];
  SupportDetails: any[] = [];
  PageLoader = true;
  FormUploading = false;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  PageAccess = 'Protected';
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  onClose: Subject<any>;
  CustomersList: Customers[] = [];
  filteredCustomersList: Observable<Customers[]>;
  LastSelectedCustomer = null;
  modalReference: BsModalRef;
  UserList: any[] = [];
  SupportTitles : any[] = [];
  THeaders: any[] = [{
    Key: 'Customer_Name', ShortKey: 'Customer_Name',
    Name: 'Customer Name', If_Short: false, Condition: ''
  },
  { Key: 'Mobile_Number', ShortKey: 'Mobile_Number', Name: 'Mobile Number', If_Short: false, Condition: '' },
  { Key: 'Support_Title', ShortKey: 'Support_Title', Name: 'Support Title', If_Short: false, Condition: '' },
  { Key: 'Support_key', ShortKey: 'Support_key', Name: 'Support  key', If_Short: false, Condition: '' },
  { Key: 'Support_Details', ShortKey: 'Support_Details', Name: 'Chat Total', If_Short: false, Condition: '' },
  { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' }
  ];

  FilterFGroup: FormGroup;
  FiltersArray: any[] = [
    {Active: false, Key: 'CustomerId', Value: null, DisplayName: 'Customer Name', DBName: 'CustomerId', Type: 'Object', Option: ''},
    { Active: false, Key: 'Mobile_Number', Value: '', DisplayName: 'Mobile Number', DBName: 'Mobile_Number', Type: 'String', Option: '' },
    { Active: false, Key: 'Support_Title', Value: '', DisplayName: 'Support Title', DBName: 'Support_Title', Type: 'Object', Option: '' },
    { Active: false, Key: 'Support_key', Value: '', DisplayName: 'Support key', DBName: 'Support_key', Type: 'String', Option: '' },

  ];
  FilterFGroupStatus = false;
  ModalRef: any;

  constructor(private Toastr: ToastrService,
              private renderer: Renderer2,
              public ModalService: BsModalService,
              private CustomerService: CustomerDetailsService,
              private CustomerSupportservice: CustomerSupportService,
              private LoginService: LoginManageService,
              public router: Router) {
                this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
                this.CustomerService.SimpleCustomer_List({ User: this.UserInfo._id }).subscribe(response => {
                  if (response.Status && response.Status === true) {
                    this.CustomersList = response.Response;
                  } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
                    if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
                      response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
                    }
                    this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
                  } else {
                    this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer List Getting Error!, But not Identify!' });
                  }
                });
                this.CustomerSupportservice.SimpleSupportTitle_List({ User: this.UserInfo._id }).subscribe(response => {
                  if (response.Status && response.Status === true) {
                    this.SupportTitles = response.Response;
                  } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
                    if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
                      response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
                    }
                    this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
                  } else {
                    this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Support Title List Getting Error!, But not Identify!' });
                  }
                });
                this.Service_Loader();
  }

  ngOnInit() {
    this.FilterFGroup = new FormGroup({
      CustomerId: new FormControl(''),
      Support_Title: new FormControl(''),
      Mobile_Number: new FormControl(''),
      Support_key: new FormControl(''),
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });
    this.filteredCustomersList = this.FilterFGroup.controls.CustomerId.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedCustomer === null || this.LastSelectedCustomer !== value._id) {
              this.LastSelectedCustomer = value._id;
            }
            value = value.Customer_Name;
          }
          return this.CustomersList.filter(option => option.Customer_Name.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedCustomer = null;
          return this.CustomersList;
        }
      })
    );
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
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters,
      User: this.UserInfo._id
    };
    this.TableLoader();
    this.CustomerSupportservice.All_CustomerSupport_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.CustomerSupportDetails = response.Response;
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



  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
    }
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
    const value = this.FilterFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.FilterFGroup.controls[key].setValue(null);
    }
  }

  CustomerSupportClosed(index: any) {
    const initialState = {
       Icon : 'block',
       ColorCode : 'danger',
       TextOne : 'You Want to',
       TextTwo : 'Closed',
       TextThree : 'for this Customer Support?',
    };
    this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with'} ));
    this.modalReference.content.onClose.subscribe(response => {
       if (response.Status) {
          const CustomerId = this.CustomerSupportDetails[index].Customer._id;
          const SupportId = this.CustomerSupportDetails[index]._id;
          this.CustomerSupportservice.CustomerSupport_Closed({CustomerId, SupportId}).subscribe(responseNew => {
             if (responseNew.Status) {
                this.Service_Loader();
                this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Support Ticket Closed Successfully' });
              }
          });
       }
    });
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


  EditCustomer_Support(index: any) {
    const initialState = {
      Type: 'Edit',
      CustomerSupportDetails: this.CustomerSupportDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalCustomerSupportComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CustomerSupportDetails[index] = response.Response;
        this.Service_Loader();

      }
    });
  }

  ViewCustomer_Support(index: any) {
    const initialState = {
      Type: 'View',
      CustomerSupportDetails: this.CustomerSupportDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalCustomerSupportComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CustomerSupportDetails[index] = response.Response;
      }
    });
  }

  openFilterModal(template: TemplateRef<any>) {
    this.FiltersArray.map(obj => {
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    const Info = this.FilterFGroup.value;
    this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
  }


  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.FilterFGroup.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
       const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
       if (ErrorKeys.length > 0) {
          let returnText = '';
          if (ErrorKeys.indexOf('required') > -1) {
             returnText = 'This field is required';
          } else {
             returnText = 'Undefined error detected!';
          }
          return returnText;
       } else {
          return '';
       }
    }
 }

  CustomerDisplayName(Customer: any) {
    return (Customer && Customer !== null && Customer !== '') ? Customer.Customer_Name : null;
 }



  OnSubmit() {
    let FormValid = true;
    Object.keys(this.FilterFGroup.controls).map(obj => {
      const FControl = this.FilterFGroup.controls[obj] as FormControl;
      if (FControl.status === 'INVALID') {
        FormValid = false;
      }
    });
    this.FormUploading = true;
    this.CustomerSupportservice.SupportTitle_Create(this.FilterFGroup.getRawValue()).subscribe(response => {

      this.FormUploading = false;
      if (response.Status) {
        if (this.PageAccess === 'Protected') {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Support Title Successfully Added!' });
          this.router.navigate(['/customer-management/customer-support']);
        }
      } else {
        if (response.Message === undefined || response.Message === '' || response.Message === null) {
          response.Message = 'Some Error Occoured!, But not Identified.';
        }
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
      }
    });

  }

  Success() {
    this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Success Message! Everything is working Good' });
  }

  Info() {
    this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Info Message! This is just for Information' });
  }

  Warning() {
    this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Warning Message! Don`t do this again' });
  }

  Error() {
    this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Error Message! Some error occured' });
  }


}

import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { ToastrService } from '../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalCreditManagementComponent } from '../Modals/Modal-CreditHistory/modal-credit-management/modal-credit-management.component';
import { CreditDetailsService } from '../../services/credit-details.service';
import { CustomerDetailsService } from '../../services/customer-management/customer-details/customer-details.service';
import { FormGroup, FormControl, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { WalletRecordsComponent } from '../../components/Modals/Modal-WalletHistory/wallet-records/wallet-records.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
export interface Customers { _id: string; Customer_Name: string; Mobile_Number: Number }

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserInfo: any;
  CustomerDetails: any[] = [];
  PageLoader = true;
  panelOpenState = false;
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

  modalReference: BsModalRef;
  UserList: any[] = [];

  CustomersList: Customers[] = [];
  CustomersNo: Customers[] = [];
  filteredCustomersList: Observable<Customers[]>;
  filteredCustomersNo: Observable<Customers[]>;
  LastSelectedCustomer = null;
  LastSelectedCustomerNo = null;
  MobileNumeric = new RegExp('^[0-9 +]+$');


  THeaders: any[] = [{ Key: 'Customer_Name', ShortKey: 'Customer_Name', Name: 'Customer Name', If_Short: false, Condition: '' },
  { Key: 'DeliverylineNameSort', ShortKey: 'DeliverylineNameSort', Name: 'Delivery Line', If_Short: false, Condition: '' },
  { Key: 'VilfreshMoney_Limit ', ShortKey: 'VilfreshMoney_Limit', Name: 'Wallet Money', If_Short: false, Condition: '' },
  { Key: 'VilfreshCredit_Limit', ShortKey: 'VilfreshCredit_Limit', Name: 'Assigned Credit', If_Short: false, Condition: '' },
  { Key: 'AvailableCredit_Limit', ShortKey: 'AvailableCredit_Limit', Name: 'Available Credit', If_Short: false, Condition: '' },
  ];

  FiltersArray: any[] = [
    { Active: false, Key: 'Customer_Name', Value: '', DisplayName: 'Customer Name', DBName: 'Customer_Name', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile_Number', Value: '', DisplayName: 'Mobile Number', DBName: 'Mobile_Number', Type: 'String', Option: '' },
    { Active: false, Key: 'startOfVilfreshMoney', Value: null, DisplayName: 'Vilfresh Start Amount', DBName: 'VilfreshMoney_Limit', Type: 'Number', Option: 'GTE' },
    { Active: false, Key: 'endOfVilfreshMoney', Value: null, DisplayName: 'Vilfresh End Amount', DBName: 'VilfreshMoney_Limit', Type: 'Number', Option: 'LTE' },
    { Active: false, Key: 'startOfVilfreshCredit', Value: null, DisplayName: 'Vilfresh Start Credit Amount', DBName: 'VilfreshCredit_Limit', Type: 'Number', Option: 'GTE' },
    { Active: false, Key: 'endOfVilfreshCredit', Value: null, DisplayName: 'Vilfresh End Credit Amount', DBName: 'VilfreshCredit_Limit', Type: 'Number', Option: 'LTE' },
    { Active: false, Key: 'startOfAvailableCredit', Value: null, DisplayName: 'Vilfresh Start Available Amount', DBName: 'AvailableCredit_Limit', Type: 'Number', Option: 'GTE' },
    { Active: false, Key: 'endOfAvailableCredit', Value: null, DisplayName: 'Vilfresh End Available Amount', DBName: 'AvailableCredit_Limit', Type: 'Number', Option: 'LTE' }
  ];

  FilterFGroupStatus = false;
  FilterFGroup: FormGroup;


 


  constructor(private CreditService: CreditDetailsService,
              private CustomerService: CustomerDetailsService,
              private renderer: Renderer2,
              private routes:Router,
              private http:HttpClient,
              private Toastr: ToastrService,
              private loginService: LoginManageService,
              public ModalService: BsModalService) {
    this.UserInfo = JSON.parse(this.loginService.LoginUser_Info());
    this.CustomerService.SimpleCustomer_List({ User: this.UserInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.CustomersList = response.Response;
        this.CustomersNo = response.Response;
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer List Getting Error!, But not Identify!' });
      }
    });
  }

  ngOnInit() {
    this.Service_Loader();
    this.FilterFGroup = new FormGroup({
      Mobile_Number: new FormControl('', [this.CustomValidation('MobileNumeric')]),
      Customer_Name: new FormControl(''),
      startOfVilfreshMoney: new FormControl(''),
      endOfVilfreshMoney: new FormControl(''),
      startOfVilfreshCredit: new FormControl(''),
      endOfVilfreshCredit: new FormControl(''),
      startOfAvailableCredit: new FormControl(''),
      endOfAvailableCredit: new FormControl(''),
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });

  }

  

  CustomerDisplayName(Customer: any) {
    return (Customer && Customer !== null && Customer !== '') ? Customer.Customer_Name : null;
  }

  CustomerDisplayNo(Customer: any) {
    return (Customer && Customer !== null && Customer !== Number) ? Customer.Mobile_Number : null;
  }

  AutocompleteBlur(key: any) {
    setTimeout(() => {
      const value = this.FilterFGroup.controls[key].value;
      if (!value || value === null || value === '' || typeof value !== 'object') {
        this.FilterFGroup.controls[key].setValue(null);
      }
    }, 200);
  }

  ResetFilters() {
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type !== 'Number' ? '' : null;
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.Pagination_Action(1);
    this.modalReference.hide();
  }

  popup(){
    alert('in progress')
    const initialState = { Type: 'View' };
    this.modalReference = this.ModalService.show(ModalCreditManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  FilterFormChanges() {
    const FilteredValues = this.FilterFGroup.value;
    this.FilterFGroupStatus = false;
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        if (FilteredValues === 'Customer') {
          if (typeof value === 'object') {
            this.FilterFGroupStatus = true;
          }
        } else {
          this.FilterFGroupStatus = true;
        }
      }
    });
  }

  NotAllow(): boolean { return false; }


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
      User: this.UserInfo._id,
    };

    this.TableLoader();
    this.CustomerService.All_Transaction_History(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
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

  CreateCredit() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(ModalCreditManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }


  event(){
    console.log(this.CustomerDetails);
    this.routes.navigate(['/payment-history/payment-detailed-view, customer?._id'])
  }
  
  ViewCredit(index: any) {
    const initialState = {
      Type: 'View',
      CustomerDetails: this.CustomerDetails[index]
    };
    // this.modalReference = this.ModalService.show(ModalCreditManagementComponent,
    //   Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
   //  this.modalReference.content.onClose.subscribe(response => {
   //    if (response.Status) {
   //      this.CustomerDetails[index] = response.Response;
   //    }
   //  });
   this.routes.navigate(['/payment-history/payment-detailed-view'])
  }

  Viewcredit(index:any){

  }

  ViewWallet(index: any) {
    const initialState = {
      Type: 'View',
      CustomerDetails: this.CustomerDetails[index]
    };
    this.modalReference = this.ModalService.show(WalletRecordsComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
   //  this.modalReference.content.onClose.subscribe(response => {
   //    if (response.Status) {
   //      this.CustomerDetails[index] = response.Response;
   //    }
   //  });
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

  CommonInputReset(control: any, value: any) {

  }


  CommonValidatorsSet(control: any) {
    const FormControlValidation = null;
    this.FilterFGroup.controls[control].setValidators(FormControlValidation);
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
    this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
  }


  AddVilfreshMoney(index) {
    const initialState = { Type: 'Create', CustomerDetails: this.CustomerDetails[index] };
    this.modalReference = this.ModalService.show(WalletRecordsComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  AddCreditMoney(index) {
    const initialState = { Type: 'Create', CustomerDetails: this.CustomerDetails[index] };
    this.modalReference = this.ModalService.show(ModalCreditManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  CustomValidation(Condition: any): ValidatorFn {
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

}

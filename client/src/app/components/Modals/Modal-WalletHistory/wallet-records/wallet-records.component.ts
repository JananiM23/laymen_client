import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { ToastrService } from '../../../../services/common-services/toastr.service';
import { Subject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalWalletManagementComponent } from '../../../Modals/Modal-WalletHistory/modal-wallet-management/modal-wallet-management.component';
import { WalletDetailsService } from '../../../../services/wallet-details/wallet-details.service';
import { CustomerDetailsService } from '../../../../services/customer-management/customer-details/customer-details.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { LoginManageService } from '../../../../services/login-management/login-manage.service';
export interface Customers { _id: string; Customer_Name: string; }


@Component({
  selector: 'app-wallet-records',
  templateUrl: './wallet-records.component.html',
  styleUrls: ['./wallet-records.component.css']
})
export class WalletRecordsComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  WalletForm: FormGroup;
  Type: string;
  UserInfo: any;
  Uploading = false;
  filteredCustomer_List: Observable<Customers[]>;
  WalletDetails: any[] = [];
  PageLoader = true;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  CustomerDetails: any;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  CustomerList: any[] = [];
  onClose: Subject<any>;
  modalReference: BsModalRef;
  UserList: any[] = [];

  CustomersList: Customers[] = [];
  filteredCustomersList: Observable<Customers[]>;
  LastSelectedCustomer = null;
  Numerics = new RegExp('^[0-9]+$');
  NumericsAndFloat = new RegExp('^[0-9.]+$');


  THeaders: any[] = [
  { Key: 'Added_or_Reduced', ShortKey: 'Added_or_Reduced', Name: 'Type', If_Short: false, Condition: '' },
  { Key: 'Previous_Limit', ShortKey: 'Previous_Limit', Name: 'Previous Amount', If_Short: false, Condition: '' },
  { Key: 'Amount', ShortKey: 'Amount', Name: 'Amount', If_Short: false, Condition: '' },
  { Key: 'Available_Limit', ShortKey: 'Available_Limit', Name: 'Available Amount', If_Short: false, Condition: '' },
  { Key: 'Date', ShortKey: 'Date', Name: 'Date', If_Short: false, Condition: '' },
  ];

  FiltersArray: any[] = [
    { Active: false, Key: 'Customer', Value: '', DisplayName: 'Customer', DBName: 'Customer', Type: 'Object', Option: '' },
    { Active: false, Key: 'Added_Type', Value: '', DisplayName: 'Payment Type', DBName: 'Added_or_Reduced', Type: 'String', Option: '' },
    { Active: false, Key: 'Added_From', Value: null, DisplayName: 'From Date', DBName: 'Date', Type: 'Date', Option: 'GTE' },
    { Active: false, Key: 'Added_To', Value: null, DisplayName: 'To Date', DBName: 'Date', Type: 'Date', Option: 'LTE' }
  ];

  FilterFGroupStatus = false;
  FilterFGroup: FormGroup;


  // tslint:disable-next-line:variable-name
  Added_Type: any[] = [{ Name: 'Added', Key: 'Added' },
  { Name: 'Reduced', Key: 'Reduced' }];

  constructor(private WalletService: WalletDetailsService,
              private CustomerService: CustomerDetailsService,
              private renderer: Renderer2,
              private LoginService: LoginManageService,
              private Toastr: ToastrService,
              public ModalService: BsModalService,
              public modalRef: BsModalRef) {
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
  }

  ngOnInit() {
    this.onClose = new Subject();
    
    if (this.Type === 'View') {
      this.Service_Loader();
    } 
    
    if (this.Type === 'Create') {
      this.WalletForm = new FormGroup({
        Customer_Name: new FormControl(this.CustomerDetails._id, Validators.required),
        Payment_Type: new FormControl('Cash'),
        Paid_Amount: new FormControl(this.CustomerDetails.VilfreshMoney_Limit, [this.CustomValidation('NumericsAndFloat'), Validators.min(0), Validators.minLength(1), Validators.maxLength(6), Validators.required]),
        ReferenceId: new FormControl(''),
        User: new FormControl(this.UserInfo._id),

      });

      this.filteredCustomersList = this.WalletForm.controls.Customer_Name.valueChanges.pipe(
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
      CustomerId: this.CustomerDetails._id,
    };

    this.TableLoader();
    this.WalletService.All_Wallet_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        console.log(this.WalletDetails);
        this.WalletDetails = response.Response;
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
    this.ShowingText = 'Showing <span>' + (this.SkipCount + 1) + '</span> to <span>' +
      ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
  }

  CreateWallet() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(ModalWalletManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  ViewWallet(index: any) {
    const initialState = {
      Type: 'View',
      Wallet: this.WalletDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalWalletManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.WalletDetails[index] = response.Response;
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

  CommonInputReset(control: any, value: any) { }


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


  CustomerDisplayName(Customer: any) {
    return (Customer && Customer !== null && Customer !== '') ? Customer.Customer_Name : null;
 }


onSubmit() {
    if (this.Type === 'Create') {
       this.Submit();
    }
 }

Submit() {
    if (this.WalletForm.valid && !this.Uploading) {
       this.Uploading = true;
       const Info = this.WalletForm.value;
       this.WalletService.Wallet_Create(Info).subscribe(response => {
          this.Uploading = false;
          if (response.Status) {
             this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Wallet Updated Successfully' });
             this.onClose.next({ Status: true, Response: response.Response });
             this.modalRef.hide();
          } else {
             if (response.Message === undefined || response.Message === '' || response.Message === null) {
                response.Message = 'Some Error Occoured!, But not Identified.';
             }
             this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
             this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
             this.modalRef.hide();
          }
       });
    } else {
       Object.keys(this.WalletForm.controls).map(obj => {
          const FControl = this.WalletForm.controls[obj] as FormControl;
          if (FControl.invalid) {
             FControl.markAsTouched();
             FControl.markAsDirty();
          }
       });
    }
 }
 
 CustomValidation(Condition: any): ValidatorFn {
  if (Condition === 'Numerics') {
     return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
           return { NumericsError: true };
        }
        return null;
     };
  } else if ('NumericsAndFloat') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
         if (control.value !== '' && control.value !== null && !this.NumericsAndFloat.test(control.value)) {
            return { NumericsAndFloatError: true };
         }
         return null;
      };
  }
}


GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.WalletForm.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
       const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
       if (ErrorKeys.length > 0) {
          let returnText = '';
          if (ErrorKeys.indexOf('required') > -1) {
             returnText = 'This field is required';
          } else if (ErrorKeys.indexOf('min') > -1) {
             returnText = 'Enter the value should be more than ' + FControl.errors.min.min;
          } else if (ErrorKeys.indexOf('NumericsError') > -1) {
             returnText = 'Please Enter Only Numerics!';
         } else if (ErrorKeys.indexOf('NumericsAndFloatError') > -1) {
            returnText = 'Please Enter Valid Amount!';
          } else if (ErrorKeys.indexOf('minlength') > -1) {
             returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
          } else if (ErrorKeys.indexOf('maxlength') > -1) {
             returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
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

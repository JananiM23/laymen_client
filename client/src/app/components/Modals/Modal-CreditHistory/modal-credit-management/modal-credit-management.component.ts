import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormArray, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from '../../../../services/common-services/toastr.service';
import { UserManagementService } from '../../../../services/user-management/user-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoginManageService } from '../../../../services/login-management/login-manage.service';
import { CreditDetailsService } from '../../../../services/credit-details.service';
import { CustomerDetailsService } from 'src/app/services/customer-management/customer-details/customer-details.service';
import { map, startWith } from 'rxjs/operators';
import { ModalCreditManagementViewComponent } from '../../Modal-CreditHistory/modal-credit-management-view/modal-credit-management-view.component';

import { MatRadioChange } from '@angular/material';

export interface Customers { _id: string; Customer_Name: string; }
@Component({
  selector: 'app-modal-credit-management',
  templateUrl: './modal-credit-management.component.html',
  styleUrls: ['./modal-credit-management.component.css']
})
export class ModalCreditManagementComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  CreditForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;

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

  modalReference: BsModalRef;


  CustomerDetails: any;
  CustomerCreditHistory: any[] = [];

  filteredCustomersList: Observable<Customers[]>;
  LastSelectedCustomer = null;
  AddedOrReduce = null;
  User: any;
  UserInfo: any;
  id: string;
  _ID: any;

  Payment_Type = [{ 'Name': 'Direct Cash', ID: 'Cash' }];
  chosenItem = this.Payment_Type[0].Name;
  Numerics = new RegExp('^[0-9]+$');


  LastSelectedDeliveryline = null;
  CustomersList: Customers[] = [];
  Assigned: Number;
  THeaders: any[] = [
    { Key: 'Added_or_Reduced', ShortKey: 'Added_or_Reduced', Name: 'Type', If_Short: false, Condition: '' },
    { Key: 'Credit_Limit', ShortKey: 'Credit_Limit', Name: 'Credit Limit', If_Short: false, Condition: '' },
    { Key: 'Amount', ShortKey: 'Amount', Name: 'Amount', If_Short: false, Condition: '' },
    { Key: 'Available_Limit', ShortKey: 'Available_Limit', Name: 'Available Limit', If_Short: false, Condition: '' },
    { Key: 'Date', ShortKey: 'Date', Name: 'Date', If_Short: false, Condition: '' },
  ];



  constructor(public Toastr: ToastrService,
    private UserService: UserManagementService,
    private CustomerService: CustomerDetailsService,
    private CreditService: CreditDetailsService,
    public modalRef: BsModalRef,
    public ModalService: BsModalService,
    public LoginService: LoginManageService,
    private renderer: Renderer2,
  ) {
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
      this.Assigned = this.CustomerDetails.VilfreshCredit_Limit;
      this.CreditForm = new FormGroup({
        Customer_Name: new FormControl(this.CustomerDetails._id, Validators.required),
        Payment_Type: new FormControl('Cash'),
        Credit_Amount: new FormControl('', [this.CustomValidation('Numerics'), Validators.minLength(1), Validators.maxLength(6), Validators.required]),
        AvailableCredit_Limit: new FormControl(this.CustomerDetails.AvailableCredit_Limit),
        CreditType: new FormControl('Added', Validators.required),
        User: new FormControl(this.UserInfo._id),
      }, [this.CreditAmountChange()]);
      // this.CreditForm.get('Credit_Amount').setValidators([this.CreditAmountChange()]);
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

  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });

    const Data = {
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      User: this.UserInfo._id,
      CustomerId: this.CustomerDetails._id
    };

    this.TableLoader();
    this.CreditService.All_Credit_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.CustomerCreditHistory = response.Response;
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


  ViewCreditHistory(index: any) {
    const initialState = {
      Type: 'View',
      CreditHistoryView: this.CustomerCreditHistory[index]
    };
    this.modalReference = this.ModalService.show(ModalCreditManagementViewComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CustomerDetails[index] = response.Response;
      }
    });
  }



  CustomValidation(Condition: any): ValidatorFn {
    if (Condition === 'Numerics') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
         if (control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
            return { NumericsError: true };
         }
         return null;
      };
    }
  }


  onSubmit() {
    if (this.Type === 'Create') {
      this.Submit();
    }
  }

  Submit() {
    if (this.CreditForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.CreditForm.value;
      this.CreditService.Credit_Create(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: response.Message });
          this.onClose.next({ Status: true,  Message: 'Successfully Updated' });
          this.modalRef.hide();
        } else {
          // if (response.Message === undefined || response.Message === '' || response.Message === null) {
          //   response.Message = 'Some Error Occoured!, But not Identified.';
          // }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.CreditForm.controls).map(obj => {
        const FControl = this.CreditForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.CreditForm.get(KeyName) as FormControl;
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
        } else if (ErrorKeys.indexOf('BLSMaximum') > -1) {
          returnText = 'Enter the value should be less than or equal ' + this.CustomerDetails.AvailableCredit_Limit;
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

  CreditAmountChange(): ValidatorFn {
    return (control): { [key: string]: boolean } | null => {
      const FGroup = control as FormGroup;
      const CreditType = control.value.CreditType;
      if (control.value.Credit_Amount !== '' && control.value.Credit_Amount !== null) {
        const value = !isNaN(control.value.Credit_Amount) ? Number(control.value.Credit_Amount) : 0;
        if ((control.value.AvailableCredit_Limit <= 0 ||  control.value.AvailableCredit_Limit < value ) && CreditType === 'Reduced') {
          FGroup.controls.Credit_Amount.setErrors({BLSMaximum: true});
          return { BLSMaximum: true };
        } else {
           return null;
         }
      } else {
         return null;
      }
    };
  }

  AddedOrReduced() {
    if (this.CreditForm.value.CreditType === 'Added') {
      this.CreditForm.patchValue({
        Credit_Amount: null
      });
    } else {
      this.CreditForm.patchValue({
        Credit_Amount: this.CustomerDetails.VilfreshCredit_Limit
      });
    }
  }

  changeCount(event) {
    if (this.CreditForm.value.CreditType === 'Added') {
      this.Assigned = Number(this.CustomerDetails.VilfreshCredit_Limit) + Number(event);
    } else {
      this.Assigned = this.CustomerDetails.VilfreshCredit_Limit;
    }
  }

}



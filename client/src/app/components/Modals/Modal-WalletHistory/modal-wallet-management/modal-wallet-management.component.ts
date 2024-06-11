import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormArray, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from '../../../../services/common-services/toastr.service';
import { UserManagementService } from '../../../../services/user-management/user-management.service';
import { BsModalRef } from 'ngx-bootstrap';
import { DeliveryService } from '../../../../services/deliveryline/delivery.service';
import { LoginManageService } from '../../../../services/login-management/login-manage.service';
import { WalletDetailsService } from '../../../../services/wallet-details/wallet-details.service';
import { CustomerDetailsService } from 'src/app/services/customer-management/customer-details/customer-details.service';
import {map, startWith} from 'rxjs/operators';


import { MatRadioChange } from '@angular/material';

export interface Customers { _id: string; Customer_Name: string; }
export interface Delivery_Line {  _id: string;  Deliveryline_Name: string; }  


@Component({
  selector: 'app-modal-wallet-management',
  templateUrl: './modal-wallet-management.component.html',
  styleUrls: ['./modal-wallet-management.component.css']
})
export class ModalWalletManagementComponent implements OnInit {

   WalletForm: FormGroup;
   onClose: Subject<any>;
   Type: string;
   Uploading = false;
   // DeliveryPerson: any;
   Wallet: any;
   DeliveryList: any[] = [];
   CustomerList: any[] = [];
   LastSelectedDeliveryList = null;

   filteredCustomer_List: Observable<Customers[]>;
   LastSelectedCustomer = null;

   User: any;
   UserInfo: any;
   id: string;
   _ID: any;

  Payment_Type = [{ 'Name': 'Direct Cash', ID: 'Cash'} ];
  chosenItem = this.Payment_Type[0].Name;
  Numerics = new RegExp('^[0-9]+$');


  filteredDeliveryList: Observable<Delivery_Line[]>;
  LastSelectedDeliveryline = null;


   constructor(public Toastr: ToastrService,
               private UserService: UserManagementService,
               private CustomerService: CustomerDetailsService,
               private WalletService: WalletDetailsService,
               public modalRef: BsModalRef,
               private DeliveryService: DeliveryService,
               public LoginService: LoginManageService) {
   this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
   this.DeliveryService.AllDeliveryLine_List({User: this.UserInfo._id}).subscribe(response => {
      this.DeliveryList = response.Response;
      if (response.Status && response.Status === true) {
         this.DeliveryList = response.Response;
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
         if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
         }
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'DeliveryLine Records Getting Error!, But not Identify!' });
      }
   });
}

   ngOnInit() {
      this.onClose = new Subject();
  
   }

   AutocompleteBlur(key: any) {
      setTimeout(() => {
         const value = this.WalletForm.controls[key].value;
         if (!value || value === null || value === '' || typeof value !== 'object') {
            this.WalletForm.controls[key].setValue(null);
         }
      }, 500);
   }

   DeliveryLine(event) {
      if (event) {

      } else {

      }
   }
   CustomerDisplayName(Customer: any) {
      return (Customer && Customer !== null && Customer !== '') ? Customer.Customer_Name : null;
   }

   DeliverylineDisplayName(Delivery_Line: any) {
      return (Delivery_Line && Delivery_Line !== null && Delivery_Line !== '') ? Delivery_Line.Deliveryline_Name : null;
   }


   CommonInputReset(arg0: string, arg1: string) {

   }
   CommonValidatorsSet(arg0: string, arg1: boolean, arg2: string) {

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
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Wallet Created Successfully' });
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

}

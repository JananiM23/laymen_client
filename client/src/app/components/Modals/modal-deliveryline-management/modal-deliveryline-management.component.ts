import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { UserManagementService } from '../../../services/user-management/user-management.service';
import { BsModalRef } from 'ngx-bootstrap';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { map } from 'rxjs/operators';

@Component({
   selector: 'app-modal-deliveryline-management',
   templateUrl: './modal-deliveryline-management.component.html',
   styleUrls: ['./modal-deliveryline-management.component.css']
})
export class ModalDeliverylineManagementComponent implements OnInit {
   DeliveryForm: FormGroup;
   onClose: Subject<any>;
   Type: string;
   Uploading = false;
   Info: any;
   DynamicFGroup: FormGroup;
   FilterForm: FormGroup;
   DeliverylineId: any;
   UserInfo: any;
   MobileNumeric = new RegExp('^[0-9 +]+$');
   AlphaNumericUnderscoreHyphenDot = new RegExp('^[A-Za-z0-9_.-]+$');
   AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
   AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
   Numeric = new RegExp('^[0-9]+$');
   constructor(
               public Toastr: ToastrService,
               private UserService: UserManagementService,
               public modalRef: BsModalRef,
               private DeliveryService: DeliveryService,
               public LoginService: LoginManageService) {
               this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());}

   ngOnInit() {

      this.onClose = new Subject();
      if (this.Type === 'Create') {
         this.DeliveryForm = new FormGroup({
            Deliveryline_Name: new FormControl('', { validators : [Validators.required, this.CustomValidation('AlphaNumericSpaceHyphen')],
            asyncValidators: [this.User_AsyncValidate.bind(this)],
            updateOn: 'blur' }),
            User: new FormControl(this.UserInfo._id),
            // Morning: new FormControl(null),
            Session: new FormControl('', Validators.required)
            // Morning: new FormControl(null),
            // Evening: new FormControl(null)
         });
      }
      if (this.Type === 'Edit') {
         this.DeliveryForm = new FormGroup({
            Deliveryline_Name: new FormControl(this.Info.Deliveryline_Name, { validators : [Validators.required, this.CustomValidation('AlphaNumericSpaceHyphen')],
            asyncValidators: [this.User_AsyncValidate.bind(this)],
            updateOn: 'blur' }),
            DeliverylineId: new FormControl(this.Info._id),
            User: new FormControl(this.UserInfo._id),
            Session: new FormControl({value: this.Info.Session, disabled: true}),
            // Morning: new FormControl(this.Info.Morning),
            // Evening: new FormControl(this.Info.Evening)
         });
      }
   }

   onSubmit() {
      if (this.Type === 'Create') {
         this.Submit();
      }
      if (this.Type === 'Edit') {
         this.Update();
      }
   }

   Submit() {
      // if (this.DeliveryForm.controls.Morning.value === true) {
         if (this.DeliveryForm.valid && !this.Uploading) {
            const Info = this.DeliveryForm.value;
            this.Uploading = true;
            this.DeliveryService.DeliveryLine_Create(Info).subscribe(response => {
               this.Uploading = false;
               if (response.Status === true) {
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'New Deliveryline Successfully Created' });
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
            Object.keys(this.DeliveryForm.controls).map(obj => {
            const FControl = this.DeliveryForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
      }
   }

   Update() {
      if (this.DeliveryForm.valid && !this.Uploading) {
         this.Uploading = true;
         const Info = this.DeliveryForm.value;
         this.DeliveryService.DeliveryLine_Update(Info).subscribe(response => {
            this.Uploading = false;
            if (response.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Deliveryline Successfully Updated' });
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
         Object.keys(this.DeliveryForm.controls).map(obj => {
            const FControl = this.DeliveryForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
      }
   }

   User_AsyncValidate( control: AbstractControl ) {
      const Data = { Deliveryline_Name: control.value };
      return this.DeliveryService.DeliveryBoy_AsyncValidate(Data).pipe(map( response => {
         if (this.Type === 'Edit' && (control.value).toLowerCase() === (this.Info.Deliveryline_Name).toLowerCase()) {
            return null;
         } else {
            if (response.Status && response.Available) {
               return null;
            } else {
               return { Deliveryline_Name_NotAvailable: true };
            }
         }
      }));
   }

   CustomValidation(Condition: any): ValidatorFn {
      if (Condition === 'AlphabetsSpaceHyphen') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphen.test(control.value)) {
               return { AlphabetsSpaceHyphenError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphaNumericUnderscoreHyphenDot') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.AlphaNumericUnderscoreHyphenDot.test(control.value)) {
               return { AlphaNumericUnderscoreHyphenDotError: true };
            }
            return null;
         };
      }
      if (Condition === 'Numeric') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.Numeric.test(control.value)) {
               return { NumericError: true };
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
      if (Condition === 'MobileNumeric') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if ( control.value !== '' && control.value !== null && !this.MobileNumeric.test(control.value)) {
               return { MobileNumericError: true };
            }
            return null;
         };
      }
      // if (Condition === 'Morning') {
      //    return (control: AbstractControl): { [key: string]: boolean } | null => {
      //       if ( control.value !== '' && control.value !== null ) {
      //          return { Morning: true };
      //       }
      //       return null;
      //    };
      // }
   }

   GetFormControlErrorMessage(KeyName: any) {
      const FControl = this.DeliveryForm.get(KeyName) as FormControl;
      if (FControl.invalid && FControl.touched) {
         const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
         if (ErrorKeys.length > 0) {
            let returnText = '';
            if (ErrorKeys.indexOf('required') > -1) {
               returnText = 'This field is required';
            } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenError') > -1) {
               returnText = 'Please Enter Only Alphabets, Space and Hyphen!';
            } else if (ErrorKeys.indexOf('AlphaNumericUnderscoreHyphenDotError') > -1) {
               returnText = 'Please Enter Only Alphabets, Numerics, Space, Hyphen and Dot!';
            } else if (ErrorKeys.indexOf('MobileNumericError') > -1) {
               returnText = 'Please Enter Only Numeric, Spaces and +!';
            } else if (ErrorKeys.indexOf('NumericError') > -1) {
               returnText = 'Please Enter Only Numbers!';
            } else if (ErrorKeys.indexOf('minlength') > -1) {
               returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength;
            } else if (ErrorKeys.indexOf('maxlength') > -1) {
               returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength;
            } else if (ErrorKeys.indexOf('email') > -1) {
               returnText = 'Please Enter Valid Email!';
            } else if (ErrorKeys.indexOf('AlphaNumericSpaceHyphenError') > -1) {
               returnText = 'Please Enter Only Alphabets, Numerics, Space and Hyphen!';
            } else {
               returnText = 'Undefined error detected!';
            }
            return returnText;
         } else {
            return '';
         }
      } else {
         return '';
      }
   }


}

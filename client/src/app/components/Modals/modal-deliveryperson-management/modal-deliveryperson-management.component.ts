import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormArray, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { UserManagementService } from '../../../services/user-management/user-management.service';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';
import { BsModalRef } from 'ngx-bootstrap';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { DeliveryPersonDetailsService } from '../../../services/Deliveryboy-Management/delivery-person-details.service';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';


export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: any): string {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
   }
}
@Component({
   selector: 'app-modal-deliveryperson-management',
   templateUrl: './modal-deliveryperson-management.component.html',
   styleUrls: ['./modal-deliveryperson-management.component.css'],
   providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class ModalDeliverypersonManagementComponent implements OnInit {
   DeliveryPersonForm: FormGroup;
   onClose: Subject<any>;
   Type: string;
   Uploading = false;
   DeliveryPerson: any;
   DeliveryList: any[] = [];
   LastSelectedDeliveryList = null;

   User: any;
   UserInfo: any;
   GenderTypes: any[] = [{ Name: 'Male', Key: 'Male' },
   { Name: 'Female', Key: 'Female' }];
   Marital_Statuses: any[] = [{ Name: 'Married', Key: true },
   { Name: 'Single', Key: false }];
   id: String;
   Numerics = new RegExp('^[0-9]+$');
   constructor(public Toastr: ToastrService,
               private UserService: UserManagementService,
               private DeliverypersonService: DeliveryPersonDetailsService,
               public modalRef: BsModalRef,
               private CustomerService: CustomerDetailsService,
               private DeliveryService: DeliveryService,
               public LoginService: LoginManageService) {
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
      this.DeliverypersonService.DeliveryLines_List({User: this.UserInfo._id}).subscribe(response => {
         if (response.Status && response.Status === true) {
            this.DeliveryList = this.DeliveryList.concat(response.Response);
            if (this.DeliveryPerson.DeliveryLine !== null) {
               if (this.DeliveryPerson.Session === 'Both') {
                  const MorLine = Object.assign({}, this.DeliveryPerson.DeliveryLine);
                  const EveLine = Object.assign({}, this.DeliveryPerson.DeliveryLine);
                  MorLine.Session = 'Morning';
                  EveLine.Session = 'Evening';
                  this.DeliveryList.push(MorLine);
                  this.DeliveryList.push(EveLine);
               } else if (this.DeliveryPerson.Session === 'Morning' || this.DeliveryPerson.Session === 'Evening') {
                  const Arr = this.DeliveryList.filter(obj => obj._id === this.DeliveryPerson.DeliveryLine._id);
                  if (Arr.length === 2) {
                     const BothLine = Object.assign({}, this.DeliveryPerson.DeliveryLine);
                     BothLine.Session = 'Both';
                     this.DeliveryList.push(BothLine);
                  }
               }
            }
            this.DeliveryList.sort((a, b) => a.Deliveryline_Name.localeCompare(b.Deliveryline_Name));
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
      if (this.Type === 'Create') {
         this.DeliveryPersonForm = new FormGroup({
            DeliveryPerson_Name: new FormControl('', Validators.required),
            Mobile_Number: new FormControl('', [Validators.required, this.CustomValidation('Numerics'), Validators.minLength(9), Validators.maxLength(10)]),
            Address: new FormControl('', Validators.required),
            Gender: new FormControl('', Validators.required),
            Email: new FormControl('', Validators.required),
            Area: new FormControl(''),
            User: new FormControl(this.UserInfo._id, Validators.required),
            DeliveryLine: new FormControl(null, Validators.required),
            DateOf_Birth: new FormControl('', Validators.required),
            Alternate_Mobile_No: new FormControl(''),
            Marital_Status: new FormControl(''),
            Driving_License_No: new FormControl('', Validators.required),
            Driving_License_ExpiryDate: new FormControl('', Validators.required),
         });
         this.DeliveryPersonForm.get('DateOf_Birth').setValidators([this.DateOf_BirthChange()]);
         this.DeliveryPersonForm.get('Driving_License_ExpiryDate').setValidators([this.DriverLicenseExpiryDate()]);
      }

      if (this.Type === 'Edit') {
         let _ID = null;
         if (this.DeliveryPerson.DeliveryLine && this.DeliveryPerson.DeliveryLine !== null) {
            this.DeliveryPerson.DeliveryLine.Session = this.DeliveryPerson.Session;
            this.DeliveryList.push(this.DeliveryPerson.DeliveryLine);
            _ID = this.DeliveryPerson.DeliveryLine;
         }
         this.DeliveryPersonForm = new FormGroup({
            DeliveryPersonId: new FormControl(this.DeliveryPerson._id),
            DeliveryPerson_Name: new FormControl(this.DeliveryPerson.DeliveryPerson_Name, Validators.required),
            Mobile_Number: new FormControl(this.DeliveryPerson.Mobile_Number, [Validators.required, this.CustomValidation('Numerics'), Validators.minLength(9), Validators.maxLength(10)]),
            Email: new FormControl(this.DeliveryPerson.Email, Validators.required),
            Address: new FormControl(this.DeliveryPerson.Address, Validators.required),
            Gender: new FormControl(this.DeliveryPerson.Gender, Validators.required),
            Area: new FormControl(this.DeliveryPerson.Area),
            User: new FormControl(this.UserInfo._id, Validators.required),
            DeliveryLine: new FormControl(_ID, Validators.required),
            Marital_Status: new FormControl(this.DeliveryPerson.Marital_Status),
            DateOf_Birth: new FormControl(this.DeliveryPerson.DateOf_Birth, Validators.required),
            Alternate_Mobile_No: new FormControl(this.DeliveryPerson.Alternate_Mobile_No),
            Driving_License_No: new FormControl(this.DeliveryPerson.Driving_License_No, Validators.required),
            Driving_License_ExpiryDate: new FormControl(this.DeliveryPerson.Driving_License_ExpiryDate, Validators.required),
         });
      }
   }



   AutocompleteBlur(key: any) {
      setTimeout(() => {
         const value = this.DeliveryPersonForm.controls[key].value;
         if (!value || value === null || value === '' || typeof value !== 'object') {
            this.DeliveryPersonForm.controls[key].setValue(null);
         }
      }, 500);
   }

   NotAllow(): boolean { return false; }
   ClearInput(event: KeyboardEvent): boolean {
      const Events = event.composedPath() as EventTarget[];
      const Input = Events[0] as HTMLInputElement;
      const FControl = Input.attributes as NamedNodeMap;
      const FControlName = FControl.getNamedItem('formcontrolname').textContent;
      this.DeliveryPersonForm.controls[FControlName].setValue(null);
      return false;
   }

   NotAllow1(): boolean { return false; }
   ClearInput1(event: KeyboardEvent): boolean {
      const Events = event.composedPath() as EventTarget[];
      const Input = Events[0] as HTMLInputElement;
      const FControl = Input.attributes as NamedNodeMap;
      const FControlName = FControl.getNamedItem('formcontrolname').textContent;
      this.DeliveryPersonForm.controls[FControlName].setValue(null);
      return false;
   }

   DateOf_BirthChange(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const CreditType = this.DeliveryPersonForm.get('DateOf_Birth').value;
        if (control.value !== '' && control.value !== null) {
          const value = !isNaN(control.value) ? new Date(control.value) : new Date();
          const CurrentDate = new Date();
          if (CurrentDate < value || CurrentDate.valueOf() === value.valueOf()) {
            return { DateOf_Birth: true };
          } else {
             return null;
           }
        } else {
           return null;
        }
      };
    }


    DriverLicenseExpiryDate(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const CreditType = this.DeliveryPersonForm.get('Driving_License_ExpiryDate').value;
        if (control.value !== '' && control.value !== null) {
          const value = !isNaN(control.value) ? new Date(control.value) : new Date();
          const CurrentDate = new Date();
          if (CurrentDate > value ||  CurrentDate.valueOf() === value.valueOf()) {
            return { DriverLicenseExpiryDate: true };
          } else {
             return null;
           }
        } else {
           return null;
        }
      };
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
      if (this.DeliveryPersonForm.valid && !this.Uploading) {
         this.Uploading = true;
         const Info = this.DeliveryPersonForm.value;
         this.DeliverypersonService.DeliveryPerson_Create(Info).subscribe(response => {
				console.log(response);
            this.Uploading = false;
            if (response.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'New Delivery Person Successfully Created' });
               this.onClose.next({ Status: true, Response: response.Response });
               this.modalRef.hide();
            } else {
               if (response.Message === undefined || response.Message === '' || response.Message === null) {
                  response.Message = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
               // this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
               // this.modalRef.hide();
            }
         });
      } else {
         Object.keys(this.DeliveryPersonForm.controls).map(obj => {
            const FControl = this.DeliveryPersonForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
      }
   }

   Update() {
      if (this.DeliveryPersonForm.valid && !this.Uploading) {
         this.Uploading = true;
         const Info = this.DeliveryPersonForm.value;
         this.DeliverypersonService.DeliveryPerson_Update(Info).subscribe(response => {
            this.Uploading = false;
            if (response.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Delivery Person details Successfully Updated' });
               this.onClose.next({ Status: true, Response: response.Response });
               this.modalRef.hide();
            } else {
               if (response.Message === undefined || response.Message === '' || response.Message === null) {
                  response.Message = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
               // this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
               // this.modalRef.hide();
            }
         });
      } else {
         Object.keys(this.DeliveryPersonForm.controls).map(obj => {
            const FControl = this.DeliveryPersonForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
      }
   }

   GetFormControlErrorMessage(KeyName: any) {
      const FControl = this.DeliveryPersonForm.get(KeyName) as FormControl;
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
            } else if (ErrorKeys.indexOf('DateOf_Birth') > -1) {
               returnText = 'Date of birth cannot be a future date';
            }  else if (ErrorKeys.indexOf('DriverLicenseExpiryDate') > -1) {
               returnText = 'Driver License Expiry Date cannot be a Past date';
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

import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormArray, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef } from 'ngx-bootstrap';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { VilfreshBasketService } from 'src/app/services/vilfresh-basket/vilfresh-basket.service';

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
  selector: 'app-modal-extra-product-configuration',
  templateUrl: './modal-extra-product-configuration.component.html',
  styleUrls: ['./modal-extra-product-configuration.component.css'],
  providers: [{ provide: DateAdapter, useClass: MyDateAdapter }],
})
export class ModalExtraProductConfigurationComponent implements OnInit {
  ExtraProductForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  DeliveryPerson: any;
  ProductList: any[] = [];
  Info: any;
  User: any;
  UserInfo: any;
  constructor(public Toastr: ToastrService,
              private vilfreshBasketService: VilfreshBasketService,
              public modalRef: BsModalRef,
              public LoginService: LoginManageService) {
              this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
  }

  ngOnInit() {
    this.onClose = new Subject();
    if (this.Type === 'Extra') {
      this.vilfreshBasketService.ExtraConfig_ProductList({Config_Date: this.Info.Config_Date, User: this.UserInfo._id}).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.ProductList = response.Response;
        } else {
           this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message});
           this.ProductList = [];
        }
     });
      this.ExtraProductForm = new FormGroup({
        User: new FormControl(this.UserInfo._id, Validators.required),
        ConfigDate: new FormControl({value: this.Info.Config_Date, disabled: true, }, Validators.required),
        Product: new FormControl('', Validators.required),
        Price_From: new FormControl('', Validators.required),
        Price_To: new FormControl('', Validators.required),
      });
    }
  }

  onSubmit() {
    if (this.Type === 'Extra') {
       this.Submit();
    }
 }

 GetFormControlErrorMessage(KeyName: any) {
  const FControl = this.ExtraProductForm.get(KeyName) as FormControl;
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

 Submit() {
    if (this.ExtraProductForm.valid && !this.Uploading) {
       this.Uploading = true;

       const Data = {
          User : this.ExtraProductForm.get('User').value,
         ConfigDate: this.ExtraProductForm.get('ConfigDate').value,
         Product: this.ExtraProductForm.get('Product').value,
         Price_From: this.ExtraProductForm.get('Price_From').value,
         Price_To: this.ExtraProductForm.get('Price_To').value,
       };
       this.vilfreshBasketService.ExtraConfig_ProductAdd(Data).subscribe(response => {
          this.Uploading = false;
          if (response.Status) {
             this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully Created' });
             this.onClose.next({ Status: true, Response: response.Response });
             this.modalRef.hide();
          } else {
             if (response.error.Message === undefined || response.error.Message === '' || response.error.Message === null) {
                response.error.Message = 'Some Error Occoured!, But not Identified.';
             }
             this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.error.Message });
             // this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
             // this.modalRef.hide();
          }
       });
    } else {
       Object.keys(this.ExtraProductForm.controls).map(obj => {
          const FControl = this.ExtraProductForm.controls[obj] as FormControl;
          if (FControl.invalid) {
             FControl.markAsTouched();
             FControl.markAsDirty();
          }
       });
    }
 }
}

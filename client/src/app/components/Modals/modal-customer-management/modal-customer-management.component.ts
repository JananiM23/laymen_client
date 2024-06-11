import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';  
import { BsModalRef } from 'ngx-bootstrap';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import {LoginManageService} from '../../../services/login-management/login-manage.service';

export interface DeliveryList { Deliveryline_Code: string; Deliveryline_Name: string; _id: Object }

@Component({
  selector: 'app-modal-customer-management',
  templateUrl: './modal-customer-management.component.html',
  styleUrls: ['./modal-customer-management.component.css']
})
export class ModalCustomerManagementComponent implements OnInit {
  CustomerForm: FormGroup; 
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  Info: any;
  DynamicFGroup: FormGroup;
  SpecialArrayFields = ['Special_Day','Special_Date'];
  SpecialArray: FormArray;
  SpecialDayData = [];
  DeliveryList: any[] = [];
  Family_Members: any[] = [];
  filteredDeliveryList: Observable<DeliveryList[]>;
  LastSelectedDeliveryList = null;
  FilterForm: FormGroup;
  User: any;
  UserInfo: any;

  constructor(public Toastr: ToastrService,
              public modalRef: BsModalRef,
              private CustomerService: CustomerDetailsService,
              private DeliveryService: DeliveryService,
              public LoginService: LoginManageService) {
         this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
         this.DeliveryService.AllDeliveryLine_List({User: this.UserInfo._id}).subscribe(response => {
         this.DeliveryList = response.Response;
         if (response.Status && response.Status === true ) {
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
   //  this.UserInfo = JSON.stringify(this.LoginService.LoginUser_Info());
    if (this.Type === 'Create') {
      this.CustomerForm = new FormGroup({
         Customer_Name: new FormControl(''),
         Mobile_Number: new FormControl(''),
         Address: new FormControl(''),
         Gender: new FormControl(''),
         Email: new FormControl(''),
         Family_Members: new FormGroup({
            Male_Count: new FormControl(''),
            Female_Count: new FormControl(''),
            Children_Count: new FormControl(''),
            Infants_Count: new FormControl(''),
            Senior_Citizen: new FormControl('')
           }),
         What_You_Like: new FormControl(''),
         Choose_The_Session: new FormControl(''),
         Special_Date: new FormControl(''),
         Special_Day: new FormControl(''),
         Choose_The_Sample_Date: new FormControl(''),
         Delivery_Line: new FormControl(''),
         // User: this.UserInfo._id,
      });
   }

    if (this.Type === 'Edit') {
        this.CustomerForm = new FormGroup({
          CustomerId: new FormControl(this.Info._id),
          Customer_Name: new FormControl(this.Info.Customer_Name),
          Mobile_Number: new FormControl(this.Info.Mobile_Number),
          Email: new FormControl(this.Info.Email),
          Address: new FormControl(this.Info.Address),
          Gender: new FormControl(this.Info.Gender),
          Family_Members: new FormGroup({
            Male_Count: new FormControl(this.Info.Family_Members.Male_Count),
            Female_Count: new FormControl(this.Info.Family_Members.Female_Count),
            Children_Count: new FormControl(this.Info.Family_Members.Children_Count),
            Infants_Count: new FormControl(this.Info.Family_Members.Infants_Count),
            Senior_Citizen: new FormControl(this.Info.Family_Members.Senior_Citizen)
           }),
          What_You_Like: new FormControl(this.Info.What_You_Like),
          Choose_The_Session: new FormControl(this.Info.Choose_The_Session),
          Delivery_Line: new FormControl(this.Info.Delivery_Line),
          Choose_The_Sample_Date: new FormControl(this.Info.Choose_The_Sample_Date)
        });
      }
  }


  AutocompleteBlur(key: any) {
    setTimeout(() => {
       const value =  this.CustomerForm.controls[key].value;
       if (!value || value === null || value === '' || typeof value !== 'object') {
          this.CustomerForm.controls[key].setValue(null);
      }
    }, 500);
 }

 DeliveryLine(event: any) {
   if (event) {
      this.CommonValidatorsSet('Delivery_Line', false, '');
   } else {
      this.CommonInputReset('Delivery_Line', '');
   }
   }
   CommonInputReset(control: any, value: any) {
      // throw new Error("Method not implemented.");
      this.DynamicFGroup.controls[control].setValue(value);
      this.DynamicFGroup.controls[control].clearValidators();
      this.DynamicFGroup.controls[control].setErrors(null);
      this.DynamicFGroup.controls[control].markAsPristine();
      this.DynamicFGroup.controls[control].markAsUntouched();
      this.DynamicFGroup.controls[control].updateValueAndValidity();
   }
   CommonValidatorsSet(control: any, IsTime: boolean, DateControl: any ) {
      // throw new Error("Method not implemented.");
      let FormControlValidation = null;
      this.DynamicFGroup.get(control).setValidators(FormControlValidation);
      this.DynamicFGroup.controls[control].updateValueAndValidity({ onlySelf: true, emitEvent: true });
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
   if (this.CustomerForm.valid && !this.Uploading) {
     this.Uploading = true;
     const Info = this.CustomerForm.value;
     this.CustomerService.Customer_Create(Info).subscribe( response => {
        this.Uploading = false;
        if (response.Status) {
           this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New User Successfully Created' } );
           this.onClose.next({Status: true, Response: response.Response});
           this.modalRef.hide();
        } else {
           if (response.Message === undefined || response.Message === '' || response.Message === null) {
              response.Message = 'Some Error Occoured!, But not Identified.';
           }
           this.Toastr.NewToastrMessage( { Type: 'Error', Message: response.Message } );
           this.onClose.next({Status: false, Message: 'UnExpected Error!'});
           this.modalRef.hide();
        }
     });
  } else {
     Object.keys(this.CustomerForm.controls).map(obj => {
       const FControl = this.CustomerForm.controls[obj] as FormControl;
       if (FControl.invalid) {
           FControl.markAsTouched();
           FControl.markAsDirty();
       }
     });
  }
 }

 Update() {
  if (this.CustomerForm.valid && !this.Uploading) {
    this.Uploading = true;
    const Info = this.CustomerForm.value;
    this.CustomerService.CustomerDetails_Update(Info).subscribe( response => {
       this.Uploading = false;
       if (response.Status) {
          this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'User Successfully Updated' } );
          this.onClose.next({Status: true, Response: response.Response});
          this.modalRef.hide();
       } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage( { Type: 'Error', Message: response.Message } );
          this.onClose.next({Status: false, Message: 'UnExpected Error!'});
          this.modalRef.hide();
       }
    });
 } else {
    Object.keys(this.CustomerForm.controls).map(obj => {
      const FControl = this.CustomerForm.controls[obj] as FormControl;
      if (FControl.invalid) {
         FControl.markAsTouched();
         FControl.markAsDirty();
      }
    });
 }
}

}

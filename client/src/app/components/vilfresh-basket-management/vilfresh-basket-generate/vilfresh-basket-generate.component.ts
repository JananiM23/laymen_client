import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { ToastrService } from './../../../services/common-services/toastr.service';
import { ModalBasketViewComponent } from '../../Modals/modal-basket-view/modal-basket-view.component';
import { VilfreshBasketService } from '../../../services/vilfresh-basket/vilfresh-basket.service';
import { ModalPurchaseAlertComponent } from '../../Modals/modal-purchase-alert/modal-purchase-alert.component';


@Component({
   selector: 'app-vilfresh-basket-generate',
   templateUrl: './vilfresh-basket-generate.component.html',
   styleUrls: ['./vilfresh-basket-generate.component.css']
})
export class VilfreshBasketGenerateComponent implements OnInit {

   modalReference: BsModalRef;
   BasketFGroup: FormGroup;
	FilterFGroup: FormGroup;
   Products: FormArray;
   FromDate: any;
   ToDate: any;
   subscribe: any;
   UserInfo: any;
   BasketDetails: any[] = [];
   WalletCustomers: any[] = [];
   CreditCustomers: any[] = [];
   NoLimitCustomers: any[] = [];
   LowCustomers: any[] = [];

   PageLoader = true;
   FormUploading = false;

   THeaders: any[] = [{ Key: 'Product', ShortKey: 'Product', Name: 'Product Name', If_Short: false, Condition: '' },
   { Key: 'TotalQuantity', ShortKey: 'TotalQuantity', Name: 'Total Quantity', If_Short: false, Condition: '' },
   { Key: 'TotalCustomers', ShortKey: 'TotalCustomers', Name: 'Total Customers', If_Short: false, Condition: '' },
   { Key: 'Price_From', ShortKey: 'Price_From', Name: 'Price Range From', If_Short: false, Condition: '' },
   { Key: 'Price_To', ShortKey: 'Price_To', Name: 'Price Range To', If_Short: false, Condition: '' },
   { Key: 'UnitPrice', ShortKey: 'UnitPrice', Name: 'Unit Price', If_Short: false, Condition: '' }];

   minDate = new Date();
	maxDate = new Date();
   values = '';
   AssignDate = new Date();
   Numerics = new RegExp('^[0-9]+$');
	UpcomingDays = true;
	DateList: any[] = [];
	DummyAlert = false;

   constructor(private Service: VilfreshBasketService,
               public router: Router,
               private Toastr: ToastrService,
               private LoginService: LoginManageService,
               public ModalService: BsModalService) {
               this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
               this.AssignDate = new Date(this.AssignDate.setHours(0, 0, 0, 0));
					this.minDate = new Date(this.minDate.setHours(0, 0, 0, 0));
               this.AssignDate.setDate(new Date().getDate() + 1);
					this.minDate.setDate(new Date().getDate() + 1);
					if (new Date().getHours() >= 11) {
						this.UpcomingDays = false;
					} else {
						this.DummyAlert = true;
					}
   }
   ngOnInit() {
      this.BasketFGroup = new FormGroup({
         User: new FormControl(this.UserInfo._id, Validators.required),
         Date: new FormControl(this.AssignDate, Validators.required),
         Products: new FormArray([])
      });
		this.FilterFGroup = new FormGroup({
         dateControl: new FormControl(this.AssignDate, Validators.required),
      });

		this.FilterFGroup.controls.dateControl.valueChanges.subscribe(value => {
			if (this.AssignDate.valueOf() !== new Date(value).valueOf()) {
				this.AssignDate = new Date(value);
				if (this.AssignDate.valueOf() === this.minDate.valueOf()) {
					this.UpcomingDays = false;
				} else {
					this.UpcomingDays = true;
				}
				this.service();
			}
		});
		this.service();
   }

	service() {
		const Data = {
         User: this.UserInfo._id,
         Date: this.AssignDate
      };
      this.Service.Vilfresh_BasketList(Data).subscribe(response => {
         this.PageLoader = false;
         if (response.Status && response.Status === true) {
				const FArray = this.BasketFGroup.get('Products') as FormArray;
				FArray.clear();
				FArray.reset();
            this.BasketDetails = response.Response;
            this.BasketDetails.map(obj => {
               const NewFGroup = new FormGroup({
                  ProductId: new FormControl(obj.Product._id, Validators.required),
                  ProductName: new FormControl(obj.Product.Product_Name, Validators.required),
                  TotalQuantity: new FormControl(obj.TotalQuantity, Validators.required),
                  Unit: new FormControl(obj.Product.Unit, Validators.required),
                  BasicUnitQuantity: new FormControl(obj.Product.BasicUnitQuantity, Validators.required),
                  TotalCustomers: new FormControl(obj.TotalCustomers, Validators.required),
                  Price_From: new FormControl(obj.Price_From, Validators.required),
                  Price_To: new FormControl(obj.Price_To, Validators.required),
                  UnitPrice: new FormControl(null, [Validators.minLength(1), Validators.maxLength(6), Validators.required, Validators.min(obj.Price_From), Validators.max(obj.Price_To)])
               });
               FArray.push(NewFGroup);
            });
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
            // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Basket Details Getting Error!, But not Identify!' });
         }
      });
		
		this.Service.Config_Dates({ User: this.UserInfo._id }).subscribe(response => {
			if (response.Status && response.Status === true) {
				this.DateList = response.Response;
				if (this.DateList.length !== 0) {	
					this.maxDate = new Date(this.DateList[0].Config_Date);
				}
			}
		});
	}

   NotAllow(): boolean { return false; }

   getFArray(): FormArray {
      return this.BasketFGroup.get('Products') as FormArray;
   }

   ViewDetails(idx: any) {
      const initialState = {
         Type: 'View',
         Data: this.BasketDetails[idx]
      };
      this.modalReference = this.ModalService.show(ModalBasketViewComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
   }


   onSubmit() {
      this.BasketFGroup.updateValueAndValidity();
      const firstElementWithError = document.querySelector('.YesOrNoButton.ng-invalid, .mat-form-field.ng-invalid, .mat-select-invalid.ng-invalid .mat-checkbox.ng-invalid');
      if (firstElementWithError) {
         window.scrollTo({ top: firstElementWithError.parentElement.getBoundingClientRect().top + window.scrollY - 60, left: 0, behavior: 'smooth' });
      }
      let FormValid = true;
      Object.keys(this.BasketFGroup.controls).map(obj => {
         const FControl = this.BasketFGroup.controls[obj] as FormControl;
         if (FControl.status === 'INVALID') {
            FormValid = false;
         }
      });
      if (FormValid && !this.FormUploading) {
         this.FormUploading = true;

         this.Service.Vilfresh_Basket_Create(this.BasketFGroup.getRawValue()).subscribe(response => {
            this.FormUploading = false;
            this.LowCustomers = response.Response;
            this.WalletCustomers = response.Response.WalletCustomers;
            this.CreditCustomers = response.Response.CreditCustomers;
            this.NoLimitCustomers = response.Response.NoLimitCustomers;

            // if (this.LowCustomers.length > 0 ) {

            if (this.WalletCustomers.length > 0 || this.CreditCustomers.length > 0 || this.NoLimitCustomers.length > 0 ) {
            const initialState = {
                  Icon: 'block',
                  Type: 'Order Approval',
                  ColorCode: 'danger',
                  TextOne: 'Do You Want to',
                  TextTwo: 'Approve ',
                  TextThree: 'the Orders?',
                  LowCustomers: this.LowCustomers,
                  WalletCustomers: this.WalletCustomers,
                  CreditCustomers: this.CreditCustomers,
                  NoLimitCustomers: this.NoLimitCustomers,
                  Data: this.BasketFGroup.getRawValue()
            };
            this.modalReference = this.ModalService.show(ModalPurchaseAlertComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with' }));
            this.modalReference.content.onClose.subscribe(response => {} );
            } else {
               if (response.Status) {
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Purchase Request Successfully Submitted!' });
                  // this.router.navigate(['/wallet-management/wallet-records']);
               } else {
                  if (response.Message === undefined || response.Message === '' || response.Message === null) {
                     response.Message = 'Some Error Occoured!, But not Identified.';
                  }
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
               }
            }

         });
      } else {
         Object.keys(this.BasketFGroup.controls).map(obj => {
            const FControl = this.BasketFGroup.controls[obj] as FormControl;
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
      }
    }

   Purchase_Api(date: any, index: any) {
      this.values = date.target.value;
      const product = this.BasketDetails[index];
      const Data = {
         ProductId: product.ProductId,
         PurchaseDate: this.values,
         User: this.UserInfo,
         Date: this.AssignDate
      };
      this.Service.PurchaseDate_Validation({ Data }).subscribe(responseNew => {
         if (responseNew.Status) {
            // code Here
         }
      });
   }

   // PriceRange(): ValidatorFn {
   //    return (control: AbstractControl): { [key: string]: boolean } | null => {
   //       let UnitPrice = BasketFGroup.get('UnitPrice').value;
   //       // tslint:disable-next-line: variable-name
   //       const Price_From = BasketFGroup.get('Price_From').value;
   //       // tslint:disable-next-line: variable-name
   //       const Price_To = BasketFGroup.get('Price_To').value;
   //       UnitPrice = !isNaN(UnitPrice) ? Number(UnitPrice) : 0;
   //       if (control.value !== '' && control.value !== null) {
   //          const value = !isNaN(control.value) ? Number(control.value) : 0;
   //          if (value >  Price_From && value < Price_To) {
   //             return { BLSMaximum: true };
   //          } else  {
   //             return null;
   //          }
   //       }
   //       return null;
   //    };
   // }

   GetFormControlErrorMessage(KeyName: any) {
      const FControl = this.BasketFGroup.get(KeyName) as FormControl;
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
            } else if (ErrorKeys.indexOf('BLSMaximum') > -1) {
               returnText = 'Enter the value should be between Price Range From to Price Range To ' + this.BasketFGroup.get('UnitPrice').value;
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
      } else {
         return '';
      }
   }

}

import { Component, OnInit } from '@angular/core';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { FormGroup, FormControl, Validators, FormArray, FormArrayName, FormControlName, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject, from } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { VilfreshBasketService } from '../../../services/vilfresh-basket/vilfresh-basket.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
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
  selector: 'app-modal-product-configuration',
  templateUrl: './modal-product-configuration.component.html',
  styleUrls: ['./modal-product-configuration.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class ModalProductConfigurationComponent implements OnInit {

  ConfigForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  Info: any;
  UserInfo: any;
  MaximumDate: any;
  DateRanges: any[] = [ {Name: 'Next 1 Day', Key: '1'},
                        {Name: 'Next 2 Days', Key: '2'},
                        {Name: 'Next 3 Days', Key: '3'},
                        {Name: 'Next 4 Days', Key: '4'},
                        {Name: 'Next 5 Days', Key: '5'},
                        {Name: 'Next 6 Days', Key: '6'}];

  DatesArray: FormArray;
  ProductsArray: FormArray;

  Productlist: any[] = [];
  Datelist: any[] = [];

  RangeFGroup: FormGroup;

  FormStage = 'Stage1';

  Date: any;
  RangeForm: FormGroup;
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  LargeDate: any;
  constructor(
    public LoginService: LoginManageService,
    private BasketService: VilfreshBasketService,
    public Toastr: ToastrService,
    public modalRef: BsModalRef) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());

    this.BasketService.Vilfresh_Product({User: this.UserInfo._id}).subscribe(response => {
      if (response.Status && response.Status === true) {
         this.Productlist = response.Response;
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
         if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
         }
         // this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
         // this.Toastr.NewToastrMessage({ Typvalue: this.MaximumDatee: 'Error', Message: 'Config List Getting Error!, But not Identify!' });
      }
   });

    // this.BasketService.Config_Dates({ User: this.UserInfo._id }).subscribe(response => {
    //   if (response.Status && response.Status === true) {
    //     this.Datelist = response.Response;
    //     const MaxDate = new Date(this.Datelist[0].Config_Date);
    //     this.LargeDate = MaxDate;
    //     console.log(this.LargeDate);
    //     return this.LargeDate;
    //   } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
    //     if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
    //       response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
    //     }
    //     // this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
    //   } else {
    //     // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Config List Getting Error!, But not Identify!' });
    //   }
    // });
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.ConfigForm = new FormGroup({
      Next_Date: new FormControl({value: this.MaximumDate, disabled: true, }, Validators.required ),
      Date_Range: new FormControl(''),
      DatesArray: new FormArray([]),
      User: new FormControl(this.UserInfo._id)
    });

}

   GetDatesArray() {
      const FArray = this.ConfigForm.get('DatesArray') as FormArray;
      return FArray.controls;
   }

  ProceedOne() {
    const NextDate = this.ConfigForm.get('Next_Date').value;
    let DateRange = this.ConfigForm.get('Date_Range').value;
    DateRange = parseInt(DateRange, 10);
    const DatesArr = [];
    DatesArr.push(new Date(NextDate));
    if (DateRange > 0) {
      for (let index = 1; index <= DateRange; index++) {
        const TempDate = new Date(NextDate);
        DatesArr.push(new Date(TempDate.setDate(TempDate.getDate() + index)));
      }
    }
    const FArray = this.ConfigForm.get('DatesArray') as FormArray;
    DatesArr.map(obj => {
      const FGroup = new FormGroup({
        Date: new FormControl({value: obj, disabled: true},  Validators.required),
        Products: new FormControl(null, Validators.required),
        ProductsArray: new FormArray([])
      });
      FArray.push(FGroup);
    });
    this.FormStage = 'Stage2';
  }

  ProceedTwo() {
    const FArray = this.ConfigForm.get('DatesArray') as FormArray;
    FArray.controls.map(obj => {
      const FGroup = obj as FormGroup;
      const ProArray = FGroup.get('Products').value;
      const NewFArray = FGroup.get('ProductsArray') as FormArray;
      if (ProArray.length > 0) {
        ProArray.map(obj1 => {
          const NewFGroup = new FormGroup({
            Product: new FormControl({value: obj1, disabled: true}, Validators.required),
            Price_From: new FormControl(null, Validators.required),
            Price_To: new FormControl(null, Validators.required),
          });
			 NewFGroup.get('Price_From').valueChanges.subscribe(x => {
				NewFGroup.get('Price_To').updateValueAndValidity()
			 });
          NewFGroup.get('Price_To').setValidators([this.PriceValidation(NewFGroup)]);
          NewFArray.push(NewFGroup);
        });
      }
    });

    this.FormStage = 'Stage3';
  }

  getFArray(): FormArray {
    return this.RangeFGroup.get('Date_Range') as FormArray;
  }

  onSubmit() {
    if (this.Type === 'Create') {
      this.Submit();
    }
  }

  Submit() {
      if (this.ConfigForm.valid && !this.Uploading) {
          const Info = this.ConfigForm.getRawValue();
          this.Uploading = true;
          this.modalRef.hide();
          this.BasketService.Config_Create(Info).subscribe(response => {
             this.Uploading = false;
             if (response.Status === true) {
                this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Product Configuration Successfully Created' });
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
          Object.keys(this.ConfigForm.controls).map(obj => {
          const FControl = this.ConfigForm.controls[obj] as FormControl;
          if (FControl.invalid) {
            FControl.markAsTouched();
            FControl.markAsDirty();
          }
      });
    }
  }


  PriceValidation(FGroup): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
       let PriceFrom = FGroup.get('Price_From').value;
       PriceFrom = !isNaN(PriceFrom) ? Number(PriceFrom) : 0;
       if (control.value !== '' && control.value !== null) {
          const value = !isNaN(control.value) ? Number(control.value) : 0;
          if (PriceFrom > 0 && PriceFrom <= value) {
				return null;
          } else  {
				return { LessValueError: true };
          }
       }
       return null;
    };
 }

 checkPriceToValidation(i, j): boolean {
	const DatesArray = this.ConfigForm.get('DatesArray') as FormArray;
	const ProductsArray = DatesArray.controls[i].get('ProductsArray') as FormArray;
	return ProductsArray.controls[j].get('Price_To').hasError('LessValueError');
 }


}

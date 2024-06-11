import { Component, OnInit, Renderer2, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { CustomerDetailsService } from 'src/app/services/customer-management/customer-details/customer-details.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { LoginManageService } from 'src/app/services/login-management/login-manage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ModalCollectionApproveComponent } from '../../Modals/modal-collection-approve/modal-collection-approve.component';
import { ModalCollectionComponent } from '../../Modals/modal-collection/modal-collection.component';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface Customers { _id: string; Customer_Name: string; Mobile_Number: Number }
export interface Delivery_Line {  _id: string;  Deliveryline_Name: string; }

@Component({
  selector: 'app-daily-collections',
  templateUrl: './daily-collections.component.html',
  styleUrls: ['./daily-collections.component.css']
})
export class DailyCollectionsComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserInfo: any;
  CollectionDetails: any[] = [];
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
  MobileNumeric = new RegExp('^[0-9 +]+$');

  filteredDeliveryList: Observable<Delivery_Line[]>;
  LastSelectedDeliveryline = null;

  CustomersList: Customers[] = [];
  CustomersNo: Customers[] = [];
  DeliveryList: any[] = [];

  THeaders: any[] = [
  { Key: 'Customer_Name', ShortKey: 'Customer_Name', Name: 'Customer', If_Short: false, Condition: '' },
  { Key: 'Mobile_Number', ShortKey: 'Mobile_Number', Name: 'Mobile Number', If_Short: false, Condition: '' },
  { Key: 'DeliveryPerson_NameSort', ShortKey: 'DeliveryPerson_NameSort', Name: 'Delivery Person', If_Short: false, Condition: '' },
  { Key: 'DeliverylineNameSort', ShortKey: 'DeliverylineNameSort', Name: 'Delivery Line', If_Short: false, Condition: '' },
  { Key: 'Collection_AmountSort ', ShortKey: 'Collection_AmountSort', Name: 'Collection Amount', If_Short: false, Condition: '' },
  { Key: 'Collection_StatusSort ', ShortKey: 'Collection_StatusSort', Name: 'Collection Status', If_Short: false, Condition: '' },

  { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Date', If_Short: false, Condition: '' }
  ];

  FiltersArray: any[] = [ { Active: false, Key: 'Customer_Name', Value: '', DisplayName: 'Customer Name', DBName: 'Customer_Name', Type: 'String', Option: '' }];

  FilterFGroupStatus = false;
  FilterFGroup: FormGroup;

  Collection_Status: any[] = [{Name: 'Pending', Key: 'Pending'},
                              {Name: 'OnHold', Key: 'OnHold'},
                              {Name: 'Approved', Key: 'Approved'}];

  constructor(
    private CustomerService: CustomerDetailsService,
    private renderer: Renderer2,
    public DeliverylineService: DeliveryService,
    private Toastr: ToastrService,
    private loginService: LoginManageService,
    public ModalService: BsModalService 
  ) {
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

    this.DeliverylineService.AllDeliveryLine_List({User: this.UserInfo._id}).subscribe(response => {
      this.DeliveryList = response.Response;
      if (response.Status && response.Status === true) {
         this.DeliveryList = response.Response;
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
         if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
         }
         // this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
         // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'DeliveryLine Records Getting Error!, But not Identify!' });
      }
   });

   }

  ngOnInit() {
    this.Service_Loader();
    this.FilterFGroup = new FormGroup({
      Customer_Name: new FormControl(''),
      Mobile_Number: new FormControl('', [this.CustomValidation('MobileNumeric')]),
      Collection_Status: new FormControl(''),
      Delivery_Line: new FormControl(''),
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });
    this.filteredDeliveryList = this.FilterFGroup.controls.Delivery_Line.valueChanges.pipe(
      startWith(''), map(value => {
         if (value && value !== null && value !== '') {
            if ( typeof value === 'object') {
               if (this.LastSelectedDeliveryline === null || this.LastSelectedDeliveryline !== value._id) {
                  this.LastSelectedDeliveryline = value._id;
               }
               value = value.Deliveryline_Name;
            }
            return this.DeliveryList.filter(option => option.Deliveryline_Name.toLowerCase().includes(value.toLowerCase()));
         } else {
            return this.DeliveryList;
         }
      })
   );
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
    this.CustomerService.All_Collection_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.CollectionDetails = response.Response;
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
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Collection Records Getting Error!, But not Identify!' });
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

  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
    }
  }

  RemoveFilter(index: any) {
   const KeyName = this.FiltersArray[index].Key;
   const EmptyValue = this.FiltersArray[index].Type === 'String' ? '' : null;
   this.FilterFGroup.controls[KeyName].setValue(EmptyValue);
   this.SubmitFilters();
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

  Collection_OnHold(index: any) {
    const initialState = {
      Icon: 'block',
      ColorCode: 'danger',
      TextOne: 'Do You Want to',
      TextTwo: 'OnHold',
      TextThree: 'this Collection Amount due to delay?',
    };
    this.modalReference = this.ModalService.show(ModalCollectionApproveComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const CollectionId = this.CollectionDetails[index]._id;
        this.CustomerService.Collection_OnHold({
          CollectionId,
          Collection_Status: 'OnHold', User: this.UserInfo._id
        }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Amount to be Holded to Add into wallet' });
          }
        });
      }
    });
  }

  CollectionApprove(index: any) {
    const initialState = {
      Icon: 'verified_user',
      ColorCode: 'success',
      TextOne: 'Do You Want to',
      TextTwo: 'Approved',
      TextThree: 'this Collection Amount ?',
    };
    this.modalReference = this.ModalService.show(ModalCollectionApproveComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const CollectionId = this.CollectionDetails[index]._id;
        const Collection_Amount = this.CollectionDetails[index].Collection_Amount;
        const DeliveryPersonId = this.CollectionDetails[index].DeliveryPersonInfo._id;
        const CustomerId = this.CollectionDetails[index].CustomerID;
        this.CustomerService.CollectionApprove({
          CollectionId, Collection_Status: 'Approved', Collection_Amount, DeliveryPersonId, CustomerId,
          User: this.UserInfo._id
        }).subscribe(responseNew => {
          this.Service_Loader();
          console.log(responseNew.error);
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Collection Amount has been Approved' });
          } else if (!responseNew.error.Status){
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: responseNew.error.Message });
          }
        });
      }
    });
  }


  ViewCollection(index: any) {
    const initialState = {
      Type: 'View',
      CollectionDetails: this.CollectionDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalCollectionComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CollectionDetails[index] = response.Response;
      }
    });
  }

  openFilterModal(template: TemplateRef<any>) {
    this.FiltersArray.map(obj => {
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
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

  AutocompleteBlur(key: any) {
    setTimeout(() => {
      const value = this.FilterFGroup.controls[key].value;
      if (!value || value === null || value === '' || typeof value !== 'object') {
        this.FilterFGroup.controls[key].setValue(null);
      }
    }, 200);
  }

  CustomerDisplayName(Customer: any) {
    return (Customer && Customer !== null && Customer !== '') ? Customer.Customer_Name : null;
  }

  DeliverylineDisplayName(Delivery_Line: any) {
    return (Delivery_Line && Delivery_Line !== null && Delivery_Line !== '') ? Delivery_Line.Deliveryline_Name : null;
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

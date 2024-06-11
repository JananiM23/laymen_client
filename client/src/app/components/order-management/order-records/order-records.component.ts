import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { OrderManagementService } from '../../../services/order-management/order-details/order-management.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalUpcomingorderViewComponent } from '../../Modals/modal-upcomingorder-view/modal-upcomingorder-view.component';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';

@Component({
  selector: 'app-order-records',
  templateUrl: './order-records.component.html',
  styleUrls: ['./order-records.component.css']
})
export class OrderRecordsComponent implements OnInit {
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', {static: false}) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserInfo: any;

  UpcomingOrderDetails: any[] = [];
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

  THeaders: any[] = [{Key: 'Customer_NameSort', ShortKey: 'Customer_NameSort', Name: 'Customer', If_Short: false, Condition: ''},
  { Key: 'Customer_Mobile', ShortKey: 'Customer_Mobile', Name: 'Mobile', If_Short: false, Condition: '' },
  { Key: 'OrdersLength', ShortKey: 'OrdersLength', Name: 'Orders Count', If_Short: false, Condition: '' },
  { Key: 'TotalPayment', ShortKey: 'TotalPayment', Name: ' Total Orders Cost', If_Short: false, Condition: '' },
  { Key: 'Deliveryline_NameSort', ShortKey: 'Deliveryline_NameSort', Name: 'Deliveryline Name', If_Short: false, Condition: '' },
  { Key: 'DeliveryDate', ShortKey: 'DeliveryDate', Name: 'Delivery Date', If_Short: false, Condition: '' } ];

  FiltersArray: any[] = [
    {Active: false, Key: 'Customer_Name', Value: null, DisplayName: 'Customer Name', DBName: 'Customer_Name', Type: 'Object', Option: ''},
    {Active: false, Key: 'Mobile_Number', Value: null, DisplayName: 'Mobile Number', DBName: 'Mobile_Number', Type: 'String', Option: ''},
    {Active: false, Key: 'Delivery_Line', Value: null, DisplayName: 'Delivery Line', DBName: 'Delivery_Line', Type: 'Object', Option: '' },
    {Active: false, Key: 'OrderStatus', Value: null, DisplayName: 'Order Status', DBName: 'OrderStatus', Type: 'Select', Option: '' },
    {Active: false, Key: 'DeliveryFrom', Value: null, DisplayName: 'Delivery From', DBName: 'DeliveryDate', Type: 'Date', Option: 'GTE' },
    {Active: false, Key: 'DeliveryTo', Value: null, DisplayName: 'Delivery To', DBName: 'DeliveryDate', Type: 'Date', Option: 'LTE' },
    {Active: false, Key: 'OrderFrom', Value: null, DisplayName: 'Order From', DBName: 'createdAt', Type: 'Date', Option: 'GTE' },
    {Active: false, Key: 'OrderTo', Value: null, DisplayName: 'Order To', DBName: 'createdAt', Type: 'Date', Option: 'LTE' },
	 {Active: false, Key: 'CheckArchive', Value: null, DisplayName: 'Check Archive', DBName: 'CheckArchive', Type: 'Boolean', Option: '' }];

  FilterFGroupStatus = false;
  FilterFGroup: FormGroup;
  modalReference: BsModalRef;

  OrderStatusList = ['Generated', 'Non-Generated', 'Delivered', 'Un-Delivered'];
 
  DeliveryList: any[] = [];
  CustomersList: any[] = [];

  isVisible = false;

   constructor(   private OrderService: OrderManagementService,
                  private renderer: Renderer2,
                  private CustomerService: CustomerDetailsService,
                  private Toastr: ToastrService,
                  public ModalService: BsModalService,
                  private LoginService: LoginManageService,
                  private Delivery_Service: DeliveryService
   ) {
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
      this.Delivery_Service.AllDeliveryLine_List({User: this.UserInfo._id}).subscribe(response => {
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
      this.CustomerService.SimpleCustomer_List({User: this.UserInfo._id}).subscribe(response => {
         if (response.Status && response.Status === true ) {
            this.CustomersList = response.Response;
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

   ngOnInit() {
      this.FilterFGroup = new FormGroup({
         Customer_Name: new FormControl(''),
         Mobile_Number: new FormControl(''),
         Delivery_Line: new FormControl(''),
         OrderFrom: new FormControl(''),
         OrderTo: new FormControl(''),
         DeliveryFrom: new FormControl(''),
         DeliveryTo: new FormControl(''),
         OrderStatus: new FormControl(''),
			CheckArchive: new FormControl(''),
      });

      console.log(`FilterGroupFilterGroupFilterGroup`, this.FilterFGroup);
      

      const FilterControls = this.FilterFGroup.controls;
      Object.keys(FilterControls).map(obj => {
         this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
            this.FilterFormChanges();
         });
      });
      this.FilterFGroup.controls.DeliveryFrom.setValue(new Date(new Date().setDate(new Date().getDate() - 2 )));
      this.FilterFGroup.controls.DeliveryFrom.updateValueAndValidity();
      this.SubmitFilters('noModel');
   }
  NotAllow(): boolean {return false; }


  FilterFormChanges() {
    const FilteredValues = this.FilterFGroup.value;
    this.FilterFGroupStatus = false;
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        this.FilterFGroupStatus = true;
      }
    });
  }

  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);
    const Data = {
      User: this.UserInfo._id,
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters
    };
    this.TableLoader();
    this.OrderService.Order_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.UpcomingOrderDetails = response.Response;
        this.UpcomingOrderDetails = this.UpcomingOrderDetails.map(obj => {
           obj.ExpandClass = false;
           return obj;
        });
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

  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
    }
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

  DeliveryLine(event: any) {
    if (event && event === 'Delivery_Line') {
       this.CommonValidatorsSet('Delivery_Line');
    } else {
       this.CommonInputReset('Delivery_Line', '');
    }
 }
 CommonInputReset(control: any, value: any) {

}

ExpandThis(idx: number) {
   this.UpcomingOrderDetails = this.UpcomingOrderDetails.map( obj => {
      obj.ExpandClass = false;
      return obj;
   });
   this.UpcomingOrderDetails[idx].ExpandClass = true;
}

CollapseThis(idx: number) {
   this.UpcomingOrderDetails[idx].ExpandClass = false;
}

 CommonValidatorsSet(control: any) {
  const FormControlValidation = null;
  this.FilterFGroup.controls[control].setValidators(FormControlValidation);
}


  SubmitFilters(opt?) {
    const FilteredValues = this.FilterFGroup.value;
    console.log(`FilteredValues`, FilteredValues);
    
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
      obj.Value = obj.Type === 'Object' ? '' : null;
    });
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      console.log(`valueewewee`, value);
      
      if (value !== undefined && value !== null && value !== '') {
        const index = this.FiltersArray.findIndex(objNew => objNew.Key === obj);
        this.FiltersArray[index].Active = true;
        this.FiltersArray[index].Value = value;
        console.log(`index`, index);
      }
      
      
    });
    this.Pagination_Action(1);
	 if (!opt) {
		this.modalReference.hide();
	 }
  }

  AutocompleteBlur(key: any) {
    const value =  this.FilterFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
       this.FilterFGroup.controls[key].setValue(null);
    }
  }

  ResetFilters() {
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.FilterFGroupStatus = false;
    this.Pagination_Action(1);
    this.modalReference.hide();
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
    this.modalReference = this.ModalService.show(template,
      { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
  }

  ViewUpcomingOrders(index: any, order: any) {
    const initialState = {
       Info: this.UpcomingOrderDetails[index],
       OrderInfo: this.UpcomingOrderDetails[index].Orders[order]
    };
    this.modalReference = this.ModalService.show(ModalUpcomingorderViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
       if (response.Status) {
          this.UpcomingOrderDetails[index] = response.Response;
       }
    });
 }

 OrderExpand(index: any) {
  this.isVisible = true;
  const Info = this.UpcomingOrderDetails[index];
 }

  Success() {
    this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Success Message! Everything is working Good' });
  }

  Info() {
    this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Info Message! This is just for Information' });
  }

  Warning() {
    this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Warning Message! Don`t do this again' });
  }

  Error() {
    this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Error Message! Some error occured' });
  }

}

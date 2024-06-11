import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { OrderManagementService } from '../../../services/order-management/order-details/order-management.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalUpcomingorderViewComponent } from '../../Modals/modal-upcomingorder-view/modal-upcomingorder-view.component';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { DatePipe } from '@angular/common';

import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-products',
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.css']
})
export class OrderProductsComponent implements OnInit {

   @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
   @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
   @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

   @ViewChild('TableHeaderSectionOne', { static: false }) TableHeaderSectionOne: ElementRef;
   @ViewChild('TableBodySectionOne', { static: false }) TableBodySectionOne: ElementRef;
   @ViewChild('TableLoaderSectionOne', { static: false }) TableLoaderSectionOne: ElementRef;


   UserInfo: any;

   TabSection = 'Orders'; // Orders, Subscriptions
   SubscriptionProducts: any[] = [];

   OrderProductDetails: any[] = [];
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

   THeaders: any[] = [  { Key: 'Product_NameSort', ShortKey: 'Product_NameSort', Name: 'Product', If_Short: false, Condition: ''},
                        { Key: 'TotalOrdersQuantity', ShortKey: 'TotalOrdersQuantity', Name: 'Ordered Quantity', If_Short: false, Condition: '' },
                        { Key: 'TotalOrdersAmount', ShortKey: 'TotalOrdersAmount', Name: ' Total Orders Cost', If_Short: false, Condition: '' },
                        { Key: 'OrdersLength', ShortKey: 'OrdersLength', Name: 'No.Of Orders', If_Short: false, Condition: '' }];

   FiltersArray: any[] = [ {Active: false, Key: 'Delivery_Line', Value: null, DisplayName: 'Delivery Line', DBName: 'Delivery_Line', Type: 'Object', Option: '' },
                           {Active: false, Key: 'DeliveryFrom', Value: null, DisplayName: 'From Date', DBName: 'DeliveryDate', Type: 'Date', Option: 'GTE' },
                           {Active: false, Key: 'DeliveryTo', Value: null, DisplayName: 'To Date', DBName: 'DeliveryDate', Type: 'Date', Option: 'LTE' }];

   FilterFGroupStatus = false;
   FilterFGroup: FormGroup;
   modalReference: BsModalRef;

   OrderStatusList = ['Generated', 'Non-Generated', 'Delivered', 'Un-Delivered'];

   DeliveryList: any[] = [];
   CustomersList: any[] = [];
   minDate = new Date(new Date().setHours(0, 0, 0, 0));

   isVisible = false;

   exportInProgress = false;

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
      this.Service_Loader();
      this.FilterFGroup = new FormGroup({
         Delivery_Line: new FormControl(''),
         DeliveryFrom: new FormControl(''),
         DeliveryTo: new FormControl(''),
      });

      const FilterControls = this.FilterFGroup.controls;
      Object.keys(FilterControls).map(obj => {
         this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
         this.FilterFormChanges();
         });
      });
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
      this.TableLoaderOne();
      this.OrderService.OrderedProduct_List(Data).subscribe(response => {
        this.PageLoader = false;
        this.SerialNoAddOn = this.SkipCount;
        if (response.Status && response.Status === true) {
          this.OrderProductDetails = response.Response;
          this.OrderProductDetails = this.OrderProductDetails.map(obj => {
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
      // Subscription data
      const NewData = {
         User: this.UserInfo._id,
         FromDate: this.minDate,
         ToDate: this.minDate,
         DeliveryLine: null
      };
      if (Filters.length > 0) {
         Filters.map(Obj => {
            if (Obj.Key === 'Delivery_Line') {
               NewData.DeliveryLine = Obj.Value;
            }
            if (Obj.Key === 'DeliveryFrom') {
               NewData.FromDate = Obj.Value;
               const ToDateAvail = Filters.filter(obj => obj.Key === 'DeliveryTo');
               if (ToDateAvail.length === 0) {
                  NewData.ToDate = Obj.Value;
               }
            }
            if (Obj.Key === 'DeliveryTo') {
               NewData.ToDate = Obj.Value;
            }
         });
      }
      this.OrderService.Subscription_Orders(NewData).subscribe(response => {
         if (response.Status && response.Status === true) {
           this.SubscriptionProducts = response.Response;
           this.SubscriptionProducts = this.SubscriptionProducts.map(obj => {
              obj.ExpandClass = false;
              return obj;
           });
           setTimeout(() => {
               this.renderer.setStyle(this.TableLoaderSectionOne.nativeElement, 'display', 'none');
            }, 10);
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
   TableLoaderOne() {
      setTimeout(() => {
         const Top = this.TableHeaderSectionOne.nativeElement.offsetHeight - 2;
         const Height = this.TableBodySectionOne.nativeElement.offsetHeight + 4;
         this.renderer.setStyle(this.TableLoaderSectionOne.nativeElement, 'display', 'flex');
         this.renderer.setStyle(this.TableLoaderSectionOne.nativeElement, 'height', Height + 'px');
         this.renderer.setStyle(this.TableLoaderSectionOne.nativeElement, 'line-height', Height + 'px');
         this.renderer.setStyle(this.TableLoaderSectionOne.nativeElement, 'top', Top + 'px');
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
      this.OrderProductDetails = this.OrderProductDetails.map( obj => {
         obj.ExpandClass = false;
         return obj;
      });
      this.OrderProductDetails[idx].ExpandClass = true;
   }

   CollapseThis(idx: number) {
      this.OrderProductDetails[idx].ExpandClass = false;
   }

   ExpandSubThis(idx: number) {
      this.SubscriptionProducts = this.SubscriptionProducts.map( obj => {
         obj.ExpandClass = false;
         return obj;
      });
      this.SubscriptionProducts[idx].ExpandClass = true;
   }

   CollapseSubThis(idx: number) {
      this.SubscriptionProducts[idx].ExpandClass = false;
   }

   CommonValidatorsSet(control: any) {
      const FormControlValidation = null;
      this.FilterFGroup.controls[control].setValidators(FormControlValidation);
   }

   SubmitFilters() {
      const FilteredValues = this.FilterFGroup.value;
      this.FiltersArray.map(obj => {
        obj.Active = false;
        obj.Value = obj.Type === 'String' ? '' : null;
        obj.Value = obj.Type === 'Object' ? '' : null;
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
         Info: this.OrderProductDetails[index],
         OrderInfo: this.OrderProductDetails[index].Orders[order]
      };
      this.modalReference = this.ModalService.show(ModalUpcomingorderViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.OrderProductDetails[index] = response.Response;
         }
      });
   }

   OrderExpand(index: any) {
    this.isVisible = true;
    const Info = this.OrderProductDetails[index];
   }

   TabSectionChange(text: any) {
      if (this.TabSection !== text) {
         this.TabSection = text;
      }
   }


   export() {
      this.exportInProgress = true;
      let ShortOrderKey = '';
      let ShortOrderCondition = '';
      this.THeaders.map(obj => {
         if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
      });
      const NewFilters = this.FiltersArray.filter(obj => obj.Active === true);
      const Data = {
         User: this.UserInfo._id,
         ShortKey: ShortOrderKey,
         ShortCondition: ShortOrderCondition,
         FilterQuery: NewFilters
      };
      forkJoin(
         this.OrderService.AllOrderedProduct_List(Data),
         this.OrderService.AllCustomersOrder_List(Data)
      ).subscribe( ([Res1, Res2]) => {
         if (Res1.Status && Res1.Status === true && Res2.Status && Res2.Status === true) {
            let AllOrderProductDetails = Res1.Response;
            let AllCustomerOrderDetails = Res2.Response;
            const ProductsArr = [];
            const CustomersArr = [];
            this.SubscriptionProducts.map((Obj, idx) => {
               const NewObj = {
                  SNo: idx + 1,
                  Product: Obj.Product.Product_Name,
                  Quantity: Obj.TotalQuantity + ' ' + Obj.Product.Unit,
               };
               ProductsArr.push(NewObj);
            });
            AllOrderProductDetails.map((Obj, idx) => {
               const NewObj = {
                  SNo: ProductsArr.length + 1,
                  Product: Obj.Product.Product_Name,
                  Quantity: Obj.TotalOrdersQuantity + ' ' + Obj.Product.Unit,
               };
               ProductsArr.push(NewObj);
            });
            AllCustomerOrderDetails.map(Obj => {
               const NewObj = {
                  SNo: CustomersArr.length + 1,
                  Customer: Obj.CustomerInfo.Customer_Name,
                  Mobile: Obj.CustomerInfo.Mobile_Number,
                  DeliverLine: Obj.DeliveryInfo.Deliveryline_Name,
                  Product: Obj.Product.Product_Name,
                  Quantity: Obj.Order_Quantity + ' ' + Obj.Product.Unit,
                  Amount: 'Rs.' + Obj.Total_Amount,
                  Order_Ref: Obj.Order_Reference,
                  OrderedDate: new DatePipe('en-US').transform(new Date(Obj.Ordered_Date), 'd-MMM-y'),
                  DeliverDate: new DatePipe('en-US').transform(new Date(Obj.DeliveryDate), 'd-MMM-y'),

               };
               CustomersArr.push(NewObj);
            });
      
            const Header = ['S.No', 'Product', 'Quantity'];
            const HeaderOne = ['S.No', 'Customer', 'Mobile', 'Delivery Line', 'Product', 'Quantity', 'Amount', 'Order Reference', 'Ordered Date', 'Delivery Date' ];

            const Today = new DatePipe('en-US').transform(new Date(), 'd-MMM-y');
            const WorkSheetName = 'Products';
            const WorkSheetNameOne = 'Customers';
            const WorkbookName = 'Orders_Report_For_Customers_and_Products' + Today;
      
            let FromDate = new DatePipe('en-US').transform(new Date(this.minDate), 'd-MMM-y');
            let ToDate = '-';
            let Line = 'All';
            const Filters = this.FiltersArray.filter(obj => obj.Active === true);
            if (Filters.length > 0) {
               Filters.map(obj => {
                  if (obj.Key === 'DeliveryFrom') {
                     FromDate = new DatePipe('en-US').transform(new Date(this.FilterFGroup.value.DeliveryFrom), 'd-MMM-y');
                  }
                  if (obj.Key === 'DeliveryTo') {
                     ToDate = new DatePipe('en-US').transform(new Date(this.FilterFGroup.value.DeliveryTo), 'd-MMM-y');
                  }
                  if (obj.Key === 'Delivery_Line') {
                     let NewLine = '';
                     this.FilterFGroup.value.Delivery_Line.map(objNew => {
                        if (NewLine === '') {
                           NewLine = objNew.Deliveryline_Name;
                        } else {
                           NewLine = NewLine + ', ' + objNew.Deliveryline_Name;
                        }
                     });
                     Line = NewLine;
                  }
               });
            }
      
            const worksheet = XLSX.utils.aoa_to_sheet([]);
            XLSX.utils.sheet_add_aoa(worksheet, [['From Date : ', FromDate], ['To Date : ', ToDate], ['Delivery Line : ', Line]], {origin: 'A2'});
            XLSX.utils.sheet_add_aoa(worksheet, [Header], {origin: 'A8'});
            XLSX.utils.sheet_add_json(worksheet, ProductsArr, {origin: 'A9', skipHeader: true });

            const worksheetOne = XLSX.utils.aoa_to_sheet([]);
            XLSX.utils.sheet_add_aoa(worksheetOne, [['From Date : ', FromDate], ['To Date : ', ToDate], ['Delivery Line : ', Line]], {origin: 'A2'});
            XLSX.utils.sheet_add_aoa(worksheetOne, [HeaderOne], {origin: 'A8'});
            XLSX.utils.sheet_add_json(worksheetOne, CustomersArr, {origin: 'A9', skipHeader: true });

            const workbook = XLSX.utils.book_new();
            workbook.SheetNames.push('Products');
            workbook.SheetNames.push('Customers');
            workbook.Sheets['Products'] = worksheet;
            workbook.Sheets['Customers'] = worksheetOne;
            XLSX.writeFile(workbook, WorkbookName + '.xlsx', {bookType:'xlsx',  type: 'binary'});
            this.exportInProgress = false;
         } else if (!Res1.Status && Res1.ErrorCode === 400 || Res1.ErrorCode === 401 || Res1.ErrorCode === 417) {
            if (Res1.ErrorMessage === undefined || Res1.ErrorMessage === '' || Res1.ErrorMessage === null) {
               Res1.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: Res1.ErrorMessage });
            this.exportInProgress = false;
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Orders Details Getting Error!, But not Identify!' });
            this.exportInProgress = false;
         }
      });
   }


}

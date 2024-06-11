import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { OrderManagementService } from '../../services/order-management/order-details/order-management.service';
import { ToastrService } from './../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalApprovedComponent } from '../Modals/modal-approved/modal-approved.component';
import { ModalCurrentorderViewComponent } from '../Modals/modal-currentorder-view/modal-currentorder-view.component';
import { DeliveryService } from '../../services/deliveryline/delivery.service';
import { AttendanceDetailsService } from '../../services/attendance-management/attendance-details.service';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { Router } from '@angular/router';
import { NotificationManagementService } from '../../services/notification-management/notification-management.service';
import { CustomerDetailsService } from '../../services/customer-management/customer-details/customer-details.service';
import { ModalUpcomingorderViewComponent } from '../Modals/modal-upcomingorder-view/modal-upcomingorder-view.component';
import { Key } from 'protractor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.css']
})
export class NotificationManagementComponent implements OnInit {
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', {static: false}) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserInfo: any;
  selectedRows: boolean[] = [];
  payloadMobileNumbers: string[] = [];
  // isHeaderChecked: boolean = false;

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

  THeaders: any[] = [
  {Key: 'Customer_NameSort', ShortKey: 'Customer_NameSort', Name: 'Customer', If_Short: false, Condition: ''},
  { Key: 'Customer_Mobile', ShortKey: 'Customer_Mobile', Name: 'Mobile', If_Short: false, Condition: '' },
  { Key: 'Deliveryline_NameSort', ShortKey: 'Deliveryline_NameSort', Name: 'Deliveryline Name', If_Short: false, Condition: '' },
  { Key: 'Delivery_Person', ShortKey: 'Delivery_Person', Name: 'Delivery Person', If_Short: false, Condition: '' },
  { Key: 'Customer_Status', ShortKey: 'Customer_Status', Name: ' Customer Status', If_Short: false, Condition: '' },
  { Key: 'DeliveryDate', ShortKey: 'DeliveryDate', Name: 'DeliveryDate', If_Short: false, Condition: '' },
];

  FiltersArray: any[] = [
    {Active: false, Key: 'DeliveryPerson', Value: null, DisplayName: 'DeliveryPerson', DBName: 'DeliveryPerson', Type: 'Object', Option: '' },
    {Active: false, Key: 'Customer_Name', Value: null, DisplayName: 'Customer Name', DBName: 'Customer_Name', Type: 'String', Option: ''},
    {Active: false, Key: 'Mobile_Number', Value: null, DisplayName: 'Mobile Number', DBName: 'Mobile_Number', Type: 'String', Option: ''},
    {Active: false, Key: 'Deliveryline_Name', Value: null, DisplayName: 'Deliveryline Name', DBName: 'Deliveryline_Name', Type: 'String', Option: '' },
];

DropdownOptions = [
  { label: 'Order Message', value: 1, message: 'Dear Customer, Your order is confirmed expected to delivery by tomorrow' },
  { label: 'Offer Message', value: 2, message: 'Dear Customer, checkout for existing offers!' },
  { label: 'Information Message', value: 3, message: 'Dear Customer, an important notification' }
];

selectedOption: any;
selectedMobileNumber: string = '';


  loadCard(event: any) {
    const selectedValue = event.value;
    this.selectedOption = this.DropdownOptions.find(option => option.value === selectedValue);
  }

  FilterFGroupStatus = false;
  FilterFGroup: FormGroup;
  CronJobGroup: FormGroup;
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
                  private Delivery_Service: DeliveryService,
                  private NotificationManagementService: NotificationManagementService) {
                    this.initializeSelectedRows();
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
      this.Service_Loader();
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
    this.initializeSelectedRows();
      this.FilterFGroup = new FormGroup({
         Customer_Name: new FormControl(''),
         Mobile_Number: new FormControl(''),
         Deliveryline_Name: new FormControl(''),
         DeliveryPerson: new FormControl(''),
      });

      const FilterControls = this.FilterFGroup.controls;
      Object.keys(FilterControls).map(obj => {
         this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
            this.FilterFormChanges();
         });
      });
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
    console.log(`FiltersArray`, this.FiltersArray);
    
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
    this.NotificationManagementService.NotificationManagement_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.UpcomingOrderDetails = response.Response;
        console.log(`UpcomingOrderDetails`, this.UpcomingOrderDetails);
        
        this.UpcomingOrderDetails = this.UpcomingOrderDetails.map(obj => {
           obj.ExpandClass = false;
           return obj;
        });
        setTimeout(() => {
         this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
       }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      }
        else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
          if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
        }
    });
  }

//  CheckBox--------------------
initializeSelectedRows() {
  this.selectedRows = new Array(this.UpcomingOrderDetails.length).fill(false);
}

// Method to select/deselect all checkboxes
selectAll(checked: boolean) {
  this.selectedRows.fill(checked);
  this.updateSelectedMobileNumbers(); // Update selected mobile numbers
}

// Method to handle individual checkbox selection/deselection
toggleCheckbox(index: number) {
  this.selectedRows[index] = !this.selectedRows[index];
  this.updateSelectedMobileNumbers(); // Update selected mobile numbers
}

trackByIndex(index: number, obj: any): any {
  return index;
}
// Update selected mobile numbers array
updateSelectedMobileNumbers() {
  this.payloadMobileNumbers = [];
  for (let i = 0; i < this.selectedRows.length; i++) {
    console.log(`this.selectedRows.length`, this.selectedRows.length);
    if (this.selectedRows[i]) {
      this.payloadMobileNumbers.push(this.UpcomingOrderDetails[i].Mobile_Number);
    }
    console.log(`payloadMobileNumbers`, this.payloadMobileNumbers);
    
  }
}
//  SMS Message------------------
sendSMSMessageAPI(selectedMobileNumber: string) {
  console.log(`sendSMSMessageAPI mobile number`, this.selectedMobileNumber);
  if (this.selectedOption) {
    let data = {
      MobileNumbers: `+91${this.selectedMobileNumber}` // Creating JSON object with mobile number
    };
    switch (this.selectedOption.value) {
      case 1:
        this.sendSMSOrderMessageAPI(data);
        break;
      case 2:
        this.sendSMSOfferMessageAPI(data);
        break;
      case 3:
        this.sendSMSInformationMessageAPI(data);
        break;
      default:
        break;
    }

  }
}

sendSMSOrderMessageAPI(data: any) {
  console.log(`sendSMSOrderMessageAPI data`, data);
  this.NotificationManagementService.twilioSMS(data).subscribe(response => {
    if (response.Status && response.Status === true) {
    this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully sended the SMS' });
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Something went wrong!' });
    }
  });
  this.modalReference.hide();
}

sendSMSOfferMessageAPI(data: any) {
  this.NotificationManagementService.BulkSMSNotification(data).subscribe(response => {
    if (response.Status && response.Status === true) {
    this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully sended the Message' });
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Something went wrong!' });
    }
  });
}

sendSMSInformationMessageAPI(data: any) {
  this.NotificationManagementService.BulkSMSNotification(data).subscribe(response => {
    if (response.Status && response.Status === true) {
    this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully sended the Message' });
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Something went wrong!' });
    }
  });
}

// Whatsapp Message----------------------
sendWhatsappMessageAPI(payloadMobileNumbers: any) {
  console.log(`sendSMSMessageAPI mobile number`, this.payloadMobileNumbers);
  if (this.selectedOption) {
    let data = {
      MobileNumbers: this.payloadMobileNumbers // Creating JSON object with mobile number
    };
    switch (this.selectedOption.value) {
      case 1: 
        this.sendWhatsappOrderMessageAPI(data);
        break;
        case 2: 
          this.sendWhatsappOfferMessageAPI(data);
          break;
        case 3: 
          this.sendWhatsappInformationMessageAPI(data);
          break;
    }
  }
  this.modalReference.hide();
}

sendWhatsappOrderMessageAPI(data: any) {
  this.NotificationManagementService.BulkWhatsappNotification(data).subscribe(response => {
    if (response.Status && response.Status === true) {
      this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully sended WhatsAPP Message'});
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Something went wrong!'});
    }
  });
}

sendWhatsappOfferMessageAPI(data: any) {
  this.NotificationManagementService.BulkWhatsappNotification(data).subscribe(response => {
    if (response.Status && response.Status === true) {
      this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully sended WhatsAPP Message'});
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Something went wrong!'});
    }
  })
}

sendWhatsappInformationMessageAPI(data: any) {
  this.NotificationManagementService.BulkWhatsappNotification(data).subscribe(response => {
    if (response.Status && response.Status === true) {
      this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully sended WhatsAPP Message'});
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Something went wrong!'});
    }
  })
}

// Push Notification Message------------
sendPushNotificationMessageAPI(mobileNumber: string) {

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
    if (event && event === 'Deliveryline_Name') {
       this.CommonValidatorsSet('Deliveryline_Name');
    } else {
       this.CommonInputReset('Deliveryline_Name', '');
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
  
  let arrayData = this.FiltersArray;
  arrayData.map(obj => {
    obj.Active = false;

  })
  const modifiedFilteredValues = { ...FilteredValues };
  let payloadValue = arrayData;
  
  payloadValue.forEach(item  => {
      if (modifiedFilteredValues.hasOwnProperty(item.DBName)) {
        item.Active = true;
        item.Value = modifiedFilteredValues[item.DBName];
      }
    })
    
    payloadValue.forEach(obj => {
      if (obj.Value !== "") {
        obj.Active = true;
      } else {
        obj.Active = false;
      }
    });
    const Data = {
      User: this.UserInfo._id,
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      FilterQuery: payloadValue
    };

  this.NotificationManagementService.NotificationManagement_List(Data).subscribe(res =>{
     if (res.Status && res.Status === true) {
      this.UpcomingOrderDetails = res.Response;
      this.UpcomingOrderDetails = this.UpcomingOrderDetails.map(obj => {
         return obj;
      });
    }
  })
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

  ResetMessageFilter() {
    this.THeaders.map(obj => {
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

// functionality for sending message click event 
  openSMSMessageModel(SMS: TemplateRef<any>, Mobile_Number: any) {
    this.selectedMobileNumber = Mobile_Number;
      this.modalReference = this.ModalService.show(SMS, 
        { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
    }

  openWhatsappMessageModel(WHATSAPP: TemplateRef<any>, Mobile_Number: any) {
    this.selectedMobileNumber = Mobile_Number;
    this.modalReference = this.ModalService.show(WHATSAPP,
      { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
  }

  openPushNotificationModel(PushNotification: TemplateRef<any>) {
    this.modalReference = this.ModalService.show(PushNotification,
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

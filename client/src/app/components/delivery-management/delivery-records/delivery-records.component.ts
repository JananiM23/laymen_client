import { Component, OnInit, ViewChild, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { DeliveryService} from '../../../services/deliveryline/delivery.service';
import { ModalDeliverylineManagementComponent } from '../../Modals/modal-deliveryline-management/modal-deliveryline-management.component';
import { ModalDeliverylineViewComponent } from '../../Modals/modal-deliveryline-view/modal-deliveryline-view.component';
import { Subject } from 'rxjs';
import { ModalDeleteComponent } from '../../Modals/modal-delete/modal-delete.component';
import { LoginManageService } from '../../../services/login-management/login-manage.service';

@Component({
  selector: 'app-delivery-records',
  templateUrl: './delivery-records.component.html',
  styleUrls: ['./delivery-records.component.css']
})
export class DeliveryRecordsComponent implements OnInit {
  @ViewChild('TableHeaderSection', {static: false}) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', {static: false}) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', {static: false}) TableLoaderSection: ElementRef;
  @ViewChild('templateOne', {static: false}) elementView: ElementRef;

  UserInfo: any;
  DeliveryDetails: any[] = [];
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
  onClose: Subject<any>;
  modalReference: BsModalRef;
  UserList: any[] = [];
  AlertContent = "";

  THeaders: any[] = [ { Key: 'Deliveryline_Name', ShortKey: 'Deliveryline_Name', Name: 'Deliveryline Name', If_Short: false, Condition: '' },
  { Key: 'Session', ShortKey: 'Session', Name: 'Deliveryline Session', If_Short: false, Condition: '' },
  { Key: 'NoOfCustomers', ShortKey: 'numberOfCustomers',   Name: 'Customers Count', If_Short: false, Condition: ''},
  { Key: 'updatedAt', ShortKey: 'updatedAt', Name: 'Date & Time', If_Short: false, Condition: '' }];

  Session: any[] = [ {Name: 'Morning', Key: 'Morning'},
  {Name: 'Evening', Key: 'Evening'},
  {Name: 'Both', Key: 'Both'}];

  FilterFGroup: FormGroup;
  FiltersArray: any[] = [
   {Active: false, Key: 'Deliveryline_Name', Value: null, DisplayName: 'Deliveryline Name', DBName: 'Deliveryline_Name', Type: 'String', Option: '' },
   {Active: false, Key: 'Session', Value: null, DisplayName: 'Session', DBName: 'Session', Type: 'String' },
   {Active: false, Key: 'Added_From', Value: null, DisplayName: 'From Date', DBName: 'updatedAt', Type: 'Date', Option: 'GTE' },
   {Active: false, Key: 'Added_To', Value: null, DisplayName: 'To Date', DBName: 'updatedAt', Type: 'Date', Option: 'LTE' }];
   FilterFGroupStatus = false;
   ModalRef: any;
   constructor( private Toastr: ToastrService,
                private renderer: Renderer2,
                public ModalService: BsModalService,
                private LoginService: LoginManageService,
                private DeliveryService: DeliveryService) {
               this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
               this.Service_Loader();
            }
  ngOnInit() {
   this.FilterFGroup = new FormGroup({
    Deliveryline_Name: new FormControl(''),
    Added_From: new FormControl(''),
    Added_To: new FormControl(''),
    Session: new FormControl('')
 });

   const FilterControls = this.FilterFGroup.controls;
   Object.keys(FilterControls).map(obj => {
        this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
           this.FilterFormChanges();
        });
     });

  }

  Cancel() {
   this.onClose.next({Status: false});
   this.ModalRef.hide();
   }
   Proceed() {
      this.onClose.next({Status: true});
      this.ModalRef.hide();
   }

  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
       if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition;  }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);
    const Data = { Skip_Count: this.SkipCount,
                   User: this.UserInfo._id,
                   Limit_Count: this.LimitCount,
                   ShortKey: ShortOrderKey,
                   ShortCondition: ShortOrderCondition,
                   FilterQuery: Filters
          };
    this.TableLoader();
    this.DeliveryService.DeliveryLine_List(Data).subscribe(response => {
       this.PageLoader = false;
       this.SerialNoAddOn = this.SkipCount;
       if (response.Status && response.Status === true ) {
          this.DeliveryDetails = response.Response;
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
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery Line Records Getting Error!' });
       }
    });
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


   DeliverylineDisplayName(Deliveryline_Name: any) {
      return (Deliveryline_Name && Location !== null && Deliveryline_Name !== '') ? Deliveryline_Name.Deliveryline_Name : null;
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

   SubmitFilters() {
      const FilteredValues = this.FilterFGroup.value;
      console.log(`FilteredValues`, FilteredValues);
      
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
      this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' });
   }

   NotAllow() { }

   Short_Change(index: any) {
      if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
         this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Ascending';
         this.Pagination_Action(1);
      } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Descending';
         this.Pagination_Action(1);
      } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
         this.THeaders[index].If_Short = true;
         this.THeaders[index].Condition = 'Ascending';
         this.Pagination_Action(1);
      } else {
         this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
         this.Pagination_Action(1);
      }
   }

   AutocompleteBlur(key: any) {
      const value = this.FilterFGroup.controls[key].value;
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
   }

   Pagination_Action(index: any) {
      const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
      if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
         this.CurrentIndex = index;
         this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
         this.Service_Loader();
      }
   }

   CreateDeliveryLine() {
      const initialState = { Type: 'Create' };
      this.modalReference = this.ModalService.show(ModalDeliverylineManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.Pagination_Action(1);
         }
      });
   }

   EditDeliveryline(index: any) {
      const initialState = {
         Type: 'Edit',
         Info: this.DeliveryDetails[index]
      };
      this.modalReference = this.ModalService.show(ModalDeliverylineManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.DeliveryDetails[index] = response.Response;
         }
      });
   }

   ViewDeliveryline(index: any) {
      const initialState = {
         Info: this.DeliveryDetails[index]
      };
      this.modalReference = this.ModalService.show(ModalDeliverylineViewComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.DeliveryDetails[index] = response.Response;
         }
      });
   }

   DeliverylineDelete(index: any) {
      const initialState = {
         Icon: 'delete_forever',
         ColorCode: 'danger',
         TextOne: 'You Want to',
         TextTwo: 'Delete',
         TextThree: 'this Deliveryline ?',
      };
      this.modalReference = this.ModalService.show(ModalDeleteComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            const DeliverylineId = this.DeliveryDetails[index]._id;
            this.DeliveryService.DeliveryLine_Delete({DeliverylineId: DeliverylineId}).subscribe(newResponse => {
					if (newResponse.Alert) {
						this.AlertContent = newResponse.Message;
						this.modalReference = this.ModalService.show(this.elementView, { ignoreBackdropClick: false, class: 'modal-dialog-centered animated zoomIn modal-small-with' });
					} else {
						this.Pagination_Action(1);
					}
            });
         }
      });
   }


}

import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { DeliveryPersonDetailsService } from '../../../services/Deliveryboy-Management/delivery-person-details.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DeliveryApprovedComponent } from '../../Modals/delivery-approved/delivery-approved.component';
import { ModalDeliverypersonManagementComponent } from '../../Modals/modal-deliveryperson-management/modal-deliveryperson-management.component';

import { FormGroup, FormControl } from '@angular/forms';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
@Component({
  selector: 'app-deliveryboy-records',
  templateUrl: './deliveryboy-records.component.html',
  styleUrls: ['./deliveryboy-records.component.css']
})
export class DeliveryboyRecordsComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;
  @ViewChild('templateOne', {static: false}) elementView: ElementRef;

  UserInfo: any;
  DeliveryPersonDetails: any[] = [];
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
  UserList: any[] = [];

  THeaders: any[] = [{
    Key: 'DeliveryPerson_Name', ShortKey: 'DeliveryPerson_Name',
    Name: 'DeliveryPerson Name', If_Short: false, Condition: ''
  },
  { Key: 'Mobile_Number', ShortKey: 'Mobile_Number', Name: 'Mobile Number', If_Short: false, Condition: '' },
  { Key: 'Email', ShortKey: 'Email', Name: 'Email', If_Short: false, Condition: '' },
  { Key: 'DeliveryLine', ShortKey: 'DeliveryLine', Name: 'Delivery Line', If_Short: false, Condition: '' },
  { Key: 'DeliveryPerson_Status', ShortKey: 'DeliveryPerson_Status', Name: 'DeliveryPerson Status', If_Short: false, Condition: '' },
  { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' }
  ];


  FilterFGroup: FormGroup;
  FiltersArray: any[] = [
    {Active: false, Key: 'DeliveryPerson_Name', Value: '', DisplayName: 'Name', DBName: 'DeliveryPerson_Name', Type: 'String', Option: ''},
    { Active: false, Key: 'Mobile_Number', Value: null, DisplayName: 'Mobile Number', DBName: 'Mobile_Number', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: null, DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' },
    { Active: false, Key: 'DeliveryPerson_Status', Value: null, DisplayName: 'Status', DBName: 'DeliveryPerson_Status', Type: 'String', Option: ''}
  ];
  FilterFGroupStatus = false;

  AlertContent = '';

  constructor(private DeliveryboyService: DeliveryPersonDetailsService,
              private renderer: Renderer2,
              private Toastr: ToastrService,
              private LoginService: LoginManageService,
              public ModalService: BsModalService) {
          this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
        }

  ngOnInit() {
    this.Service_Loader();
    this.FilterFGroup = new FormGroup({
      DeliveryPerson_Name: new FormControl(''),
      Gender: new FormControl(''),
      Mobile_Number: new FormControl(''),
      Email: new FormControl(''),
      DeliveryPerson_Status: new FormControl('')
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
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
    this.DeliveryboyService.All_DeliveryPerson_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.DeliveryPersonDetails = response.Response;
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

  DeliveryBoyCreate() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(ModalDeliverypersonManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  EditDeliveryPerson(index: any) {
    const initialState = {
      Type: 'Edit',
      DeliveryPerson: this.DeliveryPersonDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalDeliverypersonManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.DeliveryPersonDetails[index] = response.Response;
        this.Service_Loader();

      }
    });
  }

  ViewDeliveryPerson(index: any) {
    const initialState = {
      Type: 'View',
      DeliveryPerson: this.DeliveryPersonDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalDeliverypersonManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.DeliveryPersonDetails[index] = response.Response;
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

  DeliveryBoyInActive(index: any) {
    const initialState = {
      Icon: 'block',
      ColorCode: 'danger',
      TextOne: 'You Want to',
      TextTwo: 'Hold',
      TextThree: 'this Delivery Boy ?',
    };
    this.modalReference = this.ModalService.show(DeliveryApprovedComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const DeliveryPersonId = this.DeliveryPersonDetails[index]._id;
        this.DeliveryboyService.DeliveryPersonInActive_Status({
          DeliveryPersonId,
          DeliveryPerson_Status: 'Hold', User: this.UserInfo._id
        }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Delivery Person Account Inactivated' });
          }
        });
      }
    });
  }



  DeliveryBoyDelete(index: any) {
	const initialState = {
	  Icon: 'trash',
	  ColorCode: 'danger',
	  TextOne: 'You Want to',
	  TextTwo: 'Delete',
	  TextThree: 'this Delivery Boy?',
	  TextDescription: '<b>Note: </b>Once delete this account unable to reactivate from your-end'
	};
	this.modalReference = this.ModalService.show(DeliveryApprovedComponent,
	  Object.assign({ initialState }, {
		 ignoreBackdropClick: true,
		 class: 'modal-dialog-centered animated zoomIn modal-small-with'
	  }));
	this.modalReference.content.onClose.subscribe(response => {
	  if (response.Status) {
		 const DeliveryPersonId = this.DeliveryPersonDetails[index]._id;
		 this.DeliveryboyService.DeliveryBoy_Delete({
			DeliveryPersonId,
			DeliveryPerson_Status: 'Deleted', User: this.UserInfo._id
		 }).subscribe(responseNew => {
			if (responseNew.Alert) {
				this.AlertContent = responseNew.Message;
				this.modalReference = this.ModalService.show(this.elementView, { ignoreBackdropClick: false, class: 'modal-dialog-centered animated zoomIn modal-small-with' });
			} else {
				this.Pagination_Action(1);
				this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Delivery Person Account Deleted' });
			}
		 });
	  }
	});
 }

  DeliveryBoyActive(index: any) {
		const initialState = {
			Icon: 'verified_user',
			ColorCode: 'success',
			TextOne: 'You Want to',
			TextTwo: 'Approved',
			TextThree: 'this Delivery Boy ?',
		};
		this.modalReference = this.ModalService.show(DeliveryApprovedComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with' }));
		this.modalReference.content.onClose.subscribe(response => {
			if (response.Status) {
				const DeliveryPersonId = this.DeliveryPersonDetails[index]._id;
				if (this.DeliveryPersonDetails[index].DeliveryLine && this.DeliveryPersonDetails[index].DeliveryLine !== null ) {
					this.DeliveryboyService.DeliveryPersonActive_Status({ DeliveryPersonId, DeliveryPerson_Status: 'Approval', User: this.UserInfo._id }).subscribe(responseNew => {
						if (responseNew.Status) {
						this.Service_Loader();
						this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Delivery Person Account has been Activated' });
						} else if (!responseNew.error.Status){
							this.Toastr.NewToastrMessage({ Type: 'Success', Message: responseNew.error.Message });
						}
					});
				} else {
					this.AlertContent = '<b class="color: red">Unable to proceed</b> <br> The Delivery Line not assigned, please assign the delivery line after submit to Approval.';
					this.modalReference = this.ModalService.show(this.elementView, { ignoreBackdropClick: false, class: 'modal-dialog-centered animated zoomIn modal-small-with' });
				}
			}
		});
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
    // this.modalReference.hide();
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

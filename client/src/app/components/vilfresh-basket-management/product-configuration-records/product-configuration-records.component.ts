import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Renderer2, } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { Subject } from 'rxjs';
import { ModalProductConfigurationComponent } from '../../Modals/modal-product-configuration/modal-product-configuration.component';
import { VilfreshBasketService } from '../../../services/vilfresh-basket/vilfresh-basket.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { ModalConfigViewComponent } from '../../Modals/modal-config-view/modal-config-view.component';
import { ModalExtraProductConfigurationComponent } from '../../Modals/modal-extra-product-configuration/modal-extra-product-configuration.component';

@Component({
  selector: 'app-product-configuration-records',
  templateUrl: './product-configuration-records.component.html',
  styleUrls: ['./product-configuration-records.component.css']
})
export class ProductConfigurationRecordsComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserInfo: any;
  modalReference: BsModalRef;
  ConfigDetails: any[] = [];
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
    { Key: 'Config_Date', ShortKey: 'Config_Date', Name: 'Config Date', If_Short: false, Condition: '' },
    { Key: 'ProductsLength', ShortKey: 'ProductsLength', Name: 'No.Of Product', If_Short: false, Condition: '' },
    { Key: 'PO_Requested', ShortKey: 'PO_Requested', Name: 'PO Generated', If_Short: false, Condition: '' },
    { Key: 'Confirmed_Date', ShortKey: 'Confirmed_Date', Name: 'PO Generated Date', If_Short: false, Condition: '' },
    { Key: 'updatedAt', ShortKey: 'updatedAt', Name: 'Updated Date', If_Short: false, Condition: '' }];

  FilterFGroup: FormGroup;
  FiltersArray: any[] = [
    { Active: false, Key: 'Config_Date_From', Value: null, DisplayName: 'Config Date From', DBName: 'Config_Date', Type: 'Date', Option: 'GTE' },
    { Active: false, Key: 'Config_Date_To', Value: null, DisplayName: 'Config Date To', DBName: 'Config_Date', Type: 'Date', Option: 'LTE' },
    { Active: false, Key: 'Confirmed_Date_From', Value: null, DisplayName: 'Purchase Date From', DBName: 'Confirmed_Date', Type: 'Date', Option: 'GTE' },
    { Active: false, Key: 'Confirmed_Date_To', Value: null, DisplayName: 'Purchase Date To', DBName: 'Confirmed_Date', Type: 'Date', Option: 'LTE' },
    { Active: false, Key: 'PO_Requested', Value: null, DisplayName: 'PO Generate', DBName: 'PO_Requested', Type: 'Boolean' },
  ];

  FilterFGroupStatus = false;

  PO_Request: any[] = [{ Name: 'Yes', Key: 'true' },
  { Name: 'No', Key: 'false' }];

  Datelist: any[] = [];
  LargeDate: any;
  FutureDate: any;
  MinDate: any;
  CurrentDate = new Date();
  constructor(
    public ModalService: BsModalService,
    private Toastr: ToastrService,
    private renderer: Renderer2,
    private BasketService: VilfreshBasketService,
    private LoginService: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.Service_Loader();
  }

  ngOnInit() {
    this.FilterFGroup = new FormGroup({
      Config_Date_From: new FormControl(''),
      Config_Date_To: new FormControl(''),
      Confirmed_Date_From: new FormControl(''),
      Confirmed_Date_To: new FormControl(''),
      PO_Requested: new FormControl('')
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
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
      Skip_Count: this.SkipCount,
      User: this.UserInfo._id,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters
    };
    this.TableLoader();
    this.BasketService.Config_Product_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.ConfigDetails = response.Response;
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
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Product Config Records Getting Error!' });
      }
    });

    this.BasketService.Config_Dates({ User: this.UserInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.Datelist = response.Response;
        if (this.Datelist.length !== 0) {
          this.MinDate = new Date();

          const MaxDate = new Date(this.Datelist[0].Config_Date);
          this.LargeDate = MaxDate;
          this.FutureDate = new Date(new Date(this.MinDate.setDate(this.MinDate.getDate() + 1)).setHours(0, 0, 0, 0));

          if (this.FutureDate.valueOf() <= this.LargeDate.valueOf()) {
            this.LargeDate.setDate(this.LargeDate.getDate() + 1);
          } else {
            const TmrwDate = new Date();
            this.LargeDate = TmrwDate;
            this.LargeDate.setDate(this.LargeDate.getDate() + 2);
          }

         } else {
          const MaxDate = new Date();
          this.LargeDate = MaxDate;
          this.LargeDate.setDate(this.LargeDate.getDate() + 2);
        }
        // const MaxDate = new Date(this.Datelist[0].Config_Date);
        // this.LargeDates = MaxDate;
        // this.LargeDates.setDate(this.LargeDate.getDate() + 1 );
        // console.log(MaxDate);
        return this.LargeDate;
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        // this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Config List Getting Error!, But not Identify!' });
      }
    });

  }

  Generate_Config() {
    const initialState = {
      Type: 'Create',
      MaximumDate: this.LargeDate
    };
    this.modalReference = this.ModalService.show(ModalProductConfigurationComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
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
        this.PagesArray.push({ Text: NoOfArrays.toString(), Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index) });
      }
    }
    let ToCount = this.SkipCount + this.LimitCount;
    if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
    const AddCount = this.TotalRows > 0 ? 1 : 0;
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
    this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
  }

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

  ViewProducts(index: any) {
    const initialState = {
      Info: this.ConfigDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalConfigViewComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.ConfigDetails[index] = response.Response;
      }
    });
  }

  AddProducts(index: any) {
    const initialState = {
      Type: 'Extra',
      Info: this.ConfigDetails[index]
    };
    this.BasketService.ExtraConfig_ProductList({ Config_Date: this.ConfigDetails[index].Config_Date, User: this.UserInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.modalReference = this.ModalService.show(ModalExtraProductConfigurationComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
        this.modalReference.content.onClose.subscribe(response1 => {
          if (response1.Status) {
            this.ConfigDetails[index] = response1.Response;
          }
        });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
      }
    });
  }

}

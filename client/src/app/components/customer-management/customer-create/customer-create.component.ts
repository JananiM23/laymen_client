import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from '../../../services/common-services/toastr.service';

import { MapsAPILoader } from '@agm/core';
declare var google: any; // @types/googlemaps;

import { CommonService } from '../../../services/common-services/common.service';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';
// import { LocationService } from '../../../../services/location-manageme nt/location.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';

import { DeliveryService } from '../../../services/deliveryline/delivery.service';

import { Observable, Subscription } from 'rxjs';
// import {map, startWith} from 'rxjs/operators';fVeg
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
export interface Countries { _id: string; Country_Name: string; }
export interface States { _id: string; State_Name: string; }
export interface Cities { _id: string; City_Name: string; }
export interface Locations { _id: string; Location_Name: string; }
import { DataPassingService } from '../../../services/common-services/data-passing.service';
import { ModalApprovedComponent } from '../../Modals/modal-approved/modal-approved.component';

@Component({
   selector: 'app-customer-create',
   templateUrl: './customer-create.component.html',
   styleUrls: ['./customer-create.component.css'],
   providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class CustomerCreateComponent implements OnInit {

   private dataSubscription: Subscription = new Subscription();
   PageType = 'Creat';
   PageLoaded = false;
   modalReference: BsModalRef;
   latitude = 11.0553283;
   longitude = 76.9960562;
   zoom = 10;
   @ViewChild('search', { static: false }) searchElementRef: ElementRef;
   @ViewChild('AgmMap', { static: false }) AgmMap: any;

   GenderTypes: any[] = [{ Name: 'Male', Key: 'Male' },
   { Name: 'Female', Key: 'Female' }];

   CustomerManageForm: FormGroup;
   What_You_Like: any[] = [{ Name: 'Veg', Key: 'Veg' },
   { Name: 'Non-veg', Key: 'Non-veg' }];

   Liter: any[] = [{ Name: '0L', Key: 0 },
   { Name: '0.5L', Key: 0.5 },
   { Name: '1L', Key: 1 },
   { Name: '1.5L', Key: 1.5 },
   { Name: '2L', Key: 2 },
   { Name: '2.5L', Key: 2.5 },
   { Name: '3L', Key: 3 },
   { Name: '3.5L', Key: 3.5 },
   { Name: '4L', Key: 4 },
   { Name: '4.5L', Key: 4.5 },
   { Name: '5L', Key: 5 }];


   CountriesList: Countries[] = [];

   Choose_The_Session: any[] = [{ Name: 'Morning', Key: 'Morning' },
   { Name: 'Evening', Key: 'Evening' }];

   Type_of_MilkMorning: any[] = [];
   Type_of_MilkEvening: any[] = [];

   Unit: any[] = [{ Name: 'ltr', Key: 'ltr' },
   { Name: 'ml', Key: 'ml' }];

   filteredCountriesList: Observable<Countries[]>;
   LastSelectedCountry = null;
   StatesList: States[] = [];
   filteredStatesList: Observable<States[]>;
   LastSelectedState = null;
   CitiesList: Cities[] = [];
   filteredCitiesList: Observable<Cities[]>;
   LastSelectedCity = null;

   filteredLocationsList: Observable<Locations[]>;
   LocationsList: Locations[] = [];
   LastSelectedLocation = null;

   PageAccess = 'Protected';
   DeliveryList: any[] = [];
   MilkPriceList: any[] = [];

   public searchControl: FormControl;
   RouteName: string;
   FormUploading = false;
   id: string;
   CustomerDetails: any;
   DynamicFGroup: FormGroup;

   AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
   AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
   Alphabets = new RegExp('^[A-Za-z]+$');
   AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
   AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
   Numerics = new RegExp('^[0-9]+$');
   NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
   MobileNumeric = new RegExp('^[0-9 +]+$');
   UrlParams = null;
   CustomerInfo: any[] = [];

   MilkTypeFields: any[] = ['Type_of_Milk', 'Liter', 'Unit', 'Price'];

   AllFieldsValues: any[] = [];
   activatedRoute: any;
   AllFields: any[] = [];

   FArrays: any[] = ['Special_Date', 'Morning', 'Evening'];
   Special_Date: FormArray;
   Morning: FormArray;
   Evening: FormArray;
   UserInfo: any;
   Family_Members: any[] = [];
   _ID: any;
   User: any;
   Data: any[] = [];
   CurrDate: Date;
   Session: any;
   CityList = ['Andra Pradesh', 'Andaman and Nicobar Islands', 'Arunachal Pradesh', 'Assam', 'Bihar','Chandigarh', 'Chhattisgarh', 'Dadar and Nagar Haveli', 'Daman and Diu',
   'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadeep', 'Madya Pradesh', 'Maharashtra', 'Manipur',
   'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Pondicherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telagana', 'Tripura', 'Uttaranchal', 'Uttar Pradesh', 'West Bengal'];

   constructor(public MapsAPI: MapsAPILoader,
               public ModalService: BsModalService,
               public ngZone: NgZone,
               public commonService: CommonService,
               private CustomerService: CustomerDetailsService,
               private deliveryService: DeliveryService,
               public ActiveRoute: ActivatedRoute,
               private dataPassingService: DataPassingService,
               private LoginService: LoginManageService,
               public Toastr: ToastrService,
               public router: Router) {
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
      this.CurrDate = new Date();
      this.Session = new Date().getHours() >= 12 ? 'Evening' : 'Morning';
      this.UrlParams = this.ActiveRoute.snapshot.params;
      const ParamsArr = Object.keys(this.UrlParams);
      if (this.UrlParams.id) {
         this.dataSubscription.add(
            this.dataPassingService.AllFields.subscribe(response => {
               const DataObj = { CustomerId: this.UrlParams.id, User: this.UserInfo._id };
               this.CustomerService.Customer_view(DataObj).subscribe(CustomerRes => {
                  if (CustomerRes.Status) {
                     this.CustomerDetails = CustomerRes.Response;
                     this.latitude = this.CustomerDetails.Latitude;
                     this.longitude = this.CustomerDetails.Longitude;
                     this.PageType = 'Edit';
                     this.UpdateDetails();
                     this.DeliveryLineUpdate();
                  }
               });
            })
         );
      } else {
         this.PageType = 'Create';
      }

      this.deliveryService.AllDeliveryLine_List({ User: this.UserInfo._id }).subscribe(response => {
         this.DeliveryList = response.Response;
         if (response.Status && response.Status === true) {
            this.DeliveryList = response.Response;
            if (this.PageType === 'Edit') {
               this.DeliveryLineUpdate();
            }
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'DeliveryLine Records Getting Error!, But not Identify!' });
         }
      });

      this.CustomerService.MilkProduct({User: this.UserInfo._id}).subscribe(response => {
         this.MilkPriceList = response;
         if (response.Status && response.Status === true) {
            this.Type_of_MilkMorning = response.Morning;
            this.Type_of_MilkEvening = response.Evening;
            if (this.PageType === 'Edit') {
               this.editMorningItem();
               this.editEveningItem();
            }
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
         } else {
         }
      });
      this.User = localStorage.getItem('User');
   }

   ngOnInit() {
      this.searchControl = new FormControl();
      this.MapsAPI.load().then(() => {
         const autocomplete = new google.maps.places.Autocomplete();
         autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
               const place: google.maps.places.PlaceResult = autocomplete.getPlace();
               if (place.geometry === undefined || place.geometry === null) {
                  return;
               }
               this.AutocompleteData(place);
               this.latitude = place.geometry.location.lat();
               this.longitude = place.geometry.location.lng();
               this.zoom = 14;
               setTimeout(() => {
                  this.CustomerManageForm.controls.Latitude.setValue(this.latitude);
                  this.CustomerManageForm.controls.Longitude.setValue(this.longitude);
               }, 10);
            });
         });
      });
      this.CustomerManageForm = new FormGroup({
         Customer_Name: new FormControl('', [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
         Email: new FormControl('', [Validators.required, Validators.email]),
         Address: new FormControl('', Validators.required),
         Pincode: new FormControl('', [this.CustomValidation('Numerics'), Validators.minLength(6), Validators.maxLength(6), Validators.required]),
         City: new FormControl('', Validators.required),
         Latitude: new FormControl('', Validators.required),
         Longitude: new FormControl('', Validators.required),
         Mobile_Number: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
         What_You_Like: new FormControl(''),
         Gender: new FormControl('', Validators.required),
         Choose_The_Session: new FormControl('', Validators.required),
         Choose_The_Sample_Date: new FormControl('', Validators.required),
         Sample: new FormControl('', Validators.required),
         Morning_Subscription: new FormControl('', Validators.required),
         Evening_Subscription: new FormControl('', Validators.required),
         Male_Count: new FormControl(''),
         Female_Count: new FormControl(''),
         Children_Count: new FormControl(''),
         Infants_Count: new FormControl(''),
         Senior_Citizen: new FormControl(''),
         Delivery_Line: new FormControl('', Validators.required),
         Delivery_Line_Queue: new FormControl('', [this.CustomValidation('Numerics'), Validators.min(1), Validators.required]),
         Special_Date: new FormArray([]),
         Morning: new FormArray([]),
         Evening: new FormArray([]),
         User: new FormControl(this.UserInfo._id),
      });
      this.AutocompleteFilters();
      this.PageLoaded = true;

      this.CustomerManageForm.controls.Delivery_Line.valueChanges.subscribe( value => {
         if (value && value !== null && value !== '') {
            const DetailedValue = this.DeliveryList.filter(obj => obj._id === value)[0];
            let ExistLine = null;
            if (this.PageType === 'Edit' && this.CustomerDetails.Delivery_Line !== undefined && this.CustomerDetails.Delivery_Line !== null && this.CustomerDetails.Delivery_Line !== '') {
               ExistLine = this.CustomerDetails.Delivery_Line;
            }
            let ExistQueue = null;
            if (this.PageType === 'Edit' && this.CustomerDetails.Delivery_Line_Queue !== undefined && this.CustomerDetails.Delivery_Line_Queue !== null && this.CustomerDetails.Delivery_Line_Queue !== '') {
               ExistQueue = this.CustomerDetails.Delivery_Line_Queue;
            }
            const QueueLength = DetailedValue.QueueLength !== undefined && DetailedValue.QueueLength >= 0 ? DetailedValue.QueueLength : 0;
            const ExistLineQueueLength = ExistLine !== null && ExistLine.QueueLength !== undefined && ExistLine.QueueLength >= 0 ? ExistLine.QueueLength : 0;

            if (ExistLine !== null && ExistLine._id === DetailedValue._id) {
               if (ExistQueue !== null) {
                  this.CustomerManageForm.controls.Delivery_Line_Queue.setValue(ExistQueue);
                  this.CustomerManageForm.controls.Delivery_Line_Queue.setValidators([this.CustomValidation('Numerics'), Validators.max(ExistLineQueueLength), Validators.min(1), Validators.required]);
                  this.CustomerManageForm.controls.Delivery_Line_Queue.updateValueAndValidity();
               } else {
                  this.CustomerManageForm.controls.Delivery_Line_Queue.setValue(ExistLineQueueLength + 1);
                  this.CustomerManageForm.controls.Delivery_Line_Queue.setValidators([this.CustomValidation('Numerics'), Validators.max(ExistLineQueueLength + 1), Validators.min(1), Validators.required]);
                  this.CustomerManageForm.controls.Delivery_Line_Queue.updateValueAndValidity();
               }
            } else {
               this.CustomerManageForm.controls.Delivery_Line_Queue.setValue(QueueLength + 1);
               this.CustomerManageForm.controls.Delivery_Line_Queue.setValidators([this.CustomValidation('Numerics'), Validators.max(QueueLength + 1), Validators.min(1), Validators.required]);
               this.CustomerManageForm.controls.Delivery_Line_Queue.updateValueAndValidity();
            }
         } else {
            this.CustomerManageForm.controls.Delivery_Line_Queue.setValue('');
            this.CustomerManageForm.controls.Delivery_Line_Queue.setValidators([this.CustomValidation('Numerics'), Validators.min(1), Validators.required]);
            this.CustomerManageForm.controls.Delivery_Line_Queue.updateValueAndValidity();
         }
      });

      this.CustomerManageForm.controls.Delivery_Line_Queue.valueChanges.subscribe( value => {
         if (value && value !== '' && value > 0) {
            value = Number(value);
            let ExistQueue = null;
            if (this.PageType === 'Edit' && this.CustomerDetails.Delivery_Line_Queue !== undefined && this.CustomerDetails.Delivery_Line_Queue !== null && this.CustomerDetails.Delivery_Line_Queue !== '') {
               ExistQueue = this.CustomerDetails.Delivery_Line_Queue;
            }
            let ExistLine = null;
            if (this.PageType === 'Edit' && this.CustomerDetails.Delivery_Line !== undefined && this.CustomerDetails.Delivery_Line !== null && this.CustomerDetails.Delivery_Line !== '') {
               ExistLine = this.CustomerDetails.Delivery_Line;
            }
            const DeliveryLine  = this.CustomerManageForm.controls.Delivery_Line.value;
            const DetailedValue = this.DeliveryList.filter(obj => obj._id === DeliveryLine)[0];
            const QueueLength = DetailedValue.QueueLength !== undefined && DetailedValue.QueueLength >= 0 ? DetailedValue.QueueLength : 0;

            let Alert = false;
            if (ExistLine !== null && ExistLine._id === DetailedValue._id) {
               if ((ExistQueue !== null && ExistQueue !== value) || (ExistQueue === null && ExistLine.QueueLength >= value)) {;
                  Alert = true;
               }
            } else {
               if (DetailedValue.QueueLength >= value) {
                  Alert = true;
               }
            }

            const Err = this.CustomerManageForm.controls.Delivery_Line_Queue.errors;
            if (Alert === true && Err === null) {
               const initialState = {
                  Icon : 'alert',
                  ColorCode : 'warning',
                  Text: 'Delivery queue number already assigned.Do you want to replace?',
                  TextOne : '',
                  TextTwo : '',
                  TextThree : '',
               };
               this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated bounceInRight modal-content-padding'} ));
               this.modalReference.content.onClose.subscribe(response => {
                  if (!response.Status) {
                     if (ExistLine !== null && ExistLine._id === DetailedValue._id && ExistQueue !== null) {
                        this.CustomerManageForm.controls.Delivery_Line_Queue.setValue(ExistQueue);
                     } else {
                         if ((ExistLine !== null && ExistLine._id !== DetailedValue._id) || ExistLine === null) {
                           this.CustomerManageForm.controls.Delivery_Line_Queue.setValue(QueueLength + 1);
                         }
                     }
                  }
               });
            }
         }
      });
   }

   SampleChange() {
      const SampleControlName = 'Sample';
      const ChooseTheSession = 'Choose_The_Session';
      const ChooseTheSampleDate = 'Choose_The_Sample_Date';
      if (this.CustomerManageForm.controls[SampleControlName].value === 'No') {
         this.CustomerManageForm.controls[ChooseTheSession].setValue(this.Session);
         this.CustomerManageForm.controls[ChooseTheSampleDate].setValue(this.CurrDate);
      } else {
         this.CustomerManageForm.controls[ChooseTheSession].setValue('');
         this.CustomerManageForm.controls[ChooseTheSampleDate].setValue('');
      }
   }

   setCurrentPosition() {
      if ('geolocation' in navigator) {
         navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 14;
            setTimeout(() => {
               this.CustomerManageForm.controls.Latitude.setValue(this.latitude);
               this.CustomerManageForm.controls.Longitude.setValue(this.longitude);
            }, 10);
         });
      }
   }

   markerDragEvent(event: any) {
      const latlng = { lat: event.coords.lat, lng: event.coords.lng };
      this.MapsAPI.load().then(() => {
         const geocoder = new google.maps.Geocoder();
         geocoder.geocode({ location: latlng }, (results: any) => {
            if (results[0] !== undefined) {
               this.AutocompleteData(results[0]);
               setTimeout(() => {
                  this.CustomerManageForm.controls.Latitude.setValue(latlng.lat);
                  this.CustomerManageForm.controls.Longitude.setValue(latlng.lng);
               }, 10);
            }
         });
      });
   }



   editMorningItem() {
      if (this.CustomerDetails !== undefined && this.Type_of_MilkMorning.length > 0) {
         this.Morning = this.CustomerManageForm.controls.Morning as FormArray;
         if (this.Morning.length > 0) { this.Morning.removeAt(0); this.Morning.removeAt(0); }
         this.Type_of_MilkMorning.map(obj => {
            const DataArr = this.CustomerDetails.Morning.filter(objOne => obj.ProductId === objOne.ProductId._id );
            let Litter = 0;
            if (DataArr.length > 0) {
               Litter = DataArr[0].Liter;
            }
            const FGroup = new FormGroup({
               ProductId: new FormControl({value: obj.ProductId, disabled: true}, Validators.required),
               Liter: new FormControl(Litter, [Validators.required, Validators.min(0)]),
            });
            this.Morning.push(FGroup);
         });
      }
   }

   SetMorningYesOrNo(value: string) {
      const MorningArr = this.CustomerManageForm.controls.Morning as FormArray;
      if (value === 'No') {
         MorningArr.controls.map(obj => {
            const FGroup = obj as FormGroup;
            FGroup.controls.Liter.setValue(0);
         });
      } else {
         if (this.PageType === 'Edit') {
            this.editMorningItem();
         } else {
            if (this.Type_of_MilkMorning.length > 0 && MorningArr.length === 0) {
               this.Type_of_MilkMorning.map(obj => {
                  const Litter = 0;
                  const FGroup = new FormGroup({
                     ProductId: new FormControl({value: obj.ProductId, disabled: true}, Validators.required),
                     Liter: new FormControl(Litter, [Validators.required, Validators.min(0)]),
                  });
                  MorningArr.push(FGroup);
               });
            }
         }
      }
   }


   editEveningItem() {
      if (this.CustomerDetails !== undefined && this.Type_of_MilkEvening.length > 0) {
         this.Evening = this.CustomerManageForm.controls.Evening as FormArray;
         if (this.Evening.length > 0) { this.Evening.removeAt(0); this.Evening.removeAt(0); }
         this.Type_of_MilkEvening.map(obj => {
            const DataArr = this.CustomerDetails.Evening.filter(objOne => obj.ProductId === objOne.ProductId._id );
            let Litter = 0;
            if (DataArr.length > 0) {
               Litter = DataArr[0].Liter;
            }
            const FGroup = new FormGroup({
               ProductId: new FormControl({value: obj.ProductId, disabled: true}, Validators.required),
               Liter: new FormControl(Litter, [Validators.required, Validators.min(0)]),
            });
            this.Evening.push(FGroup);
         });
      }
   }

   SetEveningYesOrNo(value: string) {
      const EveningArr = this.CustomerManageForm.controls.Evening as FormArray;
      if (value === 'No') {
         EveningArr.controls.map(obj => {
            const FGroup = obj as FormGroup;
            FGroup.controls.Liter.setValue(0);
         });
      } else {
         if (this.PageType === 'Edit') {
            this.editEveningItem();
         } else {
            if (this.Type_of_MilkEvening.length > 0 && EveningArr.length === 0) {
               this.Type_of_MilkEvening.map(obj => {
                  const Litter = 0;
                  const FGroup = new FormGroup({
                     ProductId: new FormControl({value: obj.ProductId, disabled: true}, Validators.required),
                     Liter: new FormControl(Litter, [Validators.required, Validators.min(0)]),
                  });
                  EveningArr.push(FGroup);
               });
            }
         }
      }
   }

   createSpecialItem(): FormGroup {
      return new FormGroup({
         Name: new FormControl('', Validators.required),
         Special_Date: new FormControl('', Validators.required)
      });
   }

   addSpecialItem(): void {
      this.Special_Date = this.CustomerManageForm.get('Special_Date') as FormArray;
      this.Special_Date.push(this.createSpecialItem());
   }


   removeSpecialItem(index: any) {
		const FArray = this.CustomerManageForm.controls.Special_Date as FormArray;
		FArray.removeAt(index);
   }

   editSpecialItem(array: any[]) {
      const FArray = this.CustomerManageForm.controls.Special_Date as FormArray;
      if (array.length > 0) { FArray.removeAt(0); }
      array.map(obj => {
         const FGroup = new FormGroup({
            Name: new FormControl(obj.Name),
            Special_Date: new FormControl(obj.Special_Date)
         });
         FArray.push(FGroup);
      });
   }


   GetFormArray(ControlName: any): any[] {
      const FArray = this.CustomerManageForm.get(ControlName) as FormArray;
      return FArray.controls;
   }

   AutocompleteFilters() { }


   AutocompleteData(data: any) {
      const Address = (data.formatted_address !== undefined && data.formatted_address !== null) ? data.formatted_address : this.CustomerManageForm.controls.Address.value;
      this.CustomerManageForm.controls.Address.setValue(Address);
   }

   AutocompleteBlur(key: any) {
      setTimeout(() => {
         const value = this.CustomerManageForm.controls[key].value;
         if (!value || value === null || value === '' || typeof value !== 'object') {
            this.CustomerManageForm.controls[key].setValue(null);
         }
      }, 500);
   }

   DeliveryLineUpdate() {
      if (this.DeliveryList.length > 0 && this.CustomerDetails !== null && this.CustomerDetails !== undefined) {
         this.CustomerManageForm.controls.Delivery_Line.setValue(this.CustomerDetails.Delivery_Line._id);
         this.CustomerManageForm.controls.Delivery_Line_Queue.setValue(this.CustomerDetails.Delivery_Line_Queue);
      }
   }

   CommonInputReset(control: any, value: any) {
      this.CustomerManageForm.controls[control].setValue(value);
      this.CustomerManageForm.controls[control].clearValidators();
      this.CustomerManageForm.controls[control].setErrors(null);
      this.CustomerManageForm.controls[control].markAsPristine();
      this.CustomerManageForm.controls[control].markAsUntouched();
      this.CustomerManageForm.controls[control].updateValueAndValidity();
   }
   CommonInputUpdate(controls: any[]) {
      controls.map(obj => {
         this.CustomerManageForm.get(obj).updateValueAndValidity();
      });
   }

   CommonValidatorsSet(control: any) {
      const FormControlValidation = null;
      this.CustomerManageForm.controls[control].setValidators(FormControlValidation);
   }


   NotAllow(): boolean { return false; }
   ClearInput(event: KeyboardEvent): boolean {
      const Events = event.composedPath() as EventTarget[];
      const Input = Events[0] as HTMLInputElement;
      const FControl = Input.attributes as NamedNodeMap;
      const FControlName = FControl.getNamedItem('formcontrolname').textContent;
      this.CustomerManageForm.controls[FControlName].setValue(null);
      return false;
   }


   onSubmit() {
      this.CustomerManageForm.updateValueAndValidity();
      let FormValid = true;
      Object.keys(this.CustomerManageForm.controls).map(obj => {
         const FControl = this.CustomerManageForm.controls[obj] as FormControl;
         if (FControl.status === 'INVALID') {
            FormValid = false;
         }
      });
      if (FormValid && !this.FormUploading) {
         this.FormUploading = true;
         this.CustomerService.Customer_Create(this.CustomerManageForm.getRawValue()).subscribe(response => {
            this.FormUploading = false;
            if (response.Status) {
               if (this.PageAccess === 'Protected') {
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Details Successfully Submited!' });
                  this.router.navigate(['/customer-management/customer-records']);
               }
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
            }
         });
      } else {
         Object.keys(this.CustomerManageForm.controls).map(obj => {
            const FControl = this.CustomerManageForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
         const FormArrKeys = ['Special_Date', 'Morning', 'Evening'];
         FormArrKeys.map(Obj => {
            const FArray = this.CustomerManageForm.controls[Obj] as FormArray;
            FArray.controls.map(ObjOne => {
               const FGroup = ObjOne as FormGroup;
               Object.keys(FGroup.controls).map(obj => {
                  const FControl = FGroup.controls[obj];
                  if (FControl.invalid) {
                     FControl.markAsTouched();
                     FControl.markAsDirty();
                  }
               });
            });
         });
         const firstElementWithError = document.querySelector('.YesOrNoButton.ng-invalid, .mat-form-field.ng-invalid, .mat-select-invalid.ng-invalid .mat-checkbox.ng-invalid');
         if (firstElementWithError) {
            window.scrollTo({ top: firstElementWithError.parentElement.getBoundingClientRect().top + window.scrollY - 60, left: 0, behavior: 'smooth' });
         }
      }
   }

   UpdateDetails() {

      if (this.CustomerDetails.Latitude && this.CustomerDetails.Latitude !== '' && this.CustomerDetails.Latitude !== null &&
         this.CustomerDetails.Longitude && this.CustomerDetails.Longitude !== '' && this.CustomerDetails.Longitude !== null) {
         this.CustomerManageForm.controls.Latitude.setValue(this.CustomerDetails.Latitude);
         this.CustomerManageForm.controls.Longitude.setValue(this.CustomerDetails.Longitude);
      } else {
         // this.setCurrentPosition();
      }

      if (this.CustomerDetails.Sample === 'No') {
         this.CustomerDetails.Choose_The_Session = new Date().getHours() < 12 ? 'Morning' : 'Evening';
         this.CustomerDetails.Choose_The_Sample_Date = new Date();
      }
      this.CustomerManageForm.addControl('User', new FormControl(this.UserInfo._id));
      this.CustomerManageForm.addControl('CustomerId', new FormControl(this.CustomerDetails._id));
      this.CustomerManageForm.controls.Customer_Name.setValue(this.CustomerDetails.Customer_Name, Validators.required);
      this.CustomerManageForm.controls.Mobile_Number.setValue(this.CustomerDetails.Mobile_Number, Validators.required);
      this.CustomerManageForm.controls.Email.setValue(this.CustomerDetails.Email, Validators.required);
      this.CustomerManageForm.controls.Address.setValue(this.CustomerDetails.Address);
      this.CustomerManageForm.controls.Pincode.setValue(this.CustomerDetails.Pincode || '');
      this.CustomerManageForm.controls.City.setValue(this.CustomerDetails.City, Validators.required);
      this.CustomerManageForm.controls.What_You_Like.setValue(this.CustomerDetails.What_You_Like);
      this.CustomerManageForm.controls.Gender.setValue(this.CustomerDetails.Gender);
      this.CustomerManageForm.controls.Choose_The_Session.setValue(this.CustomerDetails.Choose_The_Session);
      this.CustomerManageForm.controls.Choose_The_Sample_Date.setValue(this.CustomerDetails.Choose_The_Sample_Date);
      this.CustomerManageForm.controls.Sample.setValue(this.CustomerDetails.Sample);
      this.CustomerManageForm.controls.Morning_Subscription.setValue(this.CustomerDetails.Morning_Subscription);
      this.CustomerManageForm.controls.Evening_Subscription.setValue(this.CustomerDetails.Evening_Subscription);
      this.CustomerManageForm.controls.Male_Count.setValue(this.CustomerDetails.Family_Members.Male_Count),
         this.CustomerManageForm.controls.Female_Count.setValue(this.CustomerDetails.Family_Members.Female_Count),
         this.CustomerManageForm.controls.Children_Count.setValue(this.CustomerDetails.Family_Members.Children_Count),
         this.CustomerManageForm.controls.Infants_Count.setValue(this.CustomerDetails.Family_Members.Infants_Count),
         this.CustomerManageForm.controls.Senior_Citizen.setValue(this.CustomerDetails.Family_Members.Senior_Citizen),
         this.CustomerManageForm.controls.Latitude.setValue(this.CustomerDetails.Latitude);
      this.CustomerManageForm.controls.Longitude.setValue(this.CustomerDetails.Longitude);
      this.editSpecialItem(this.CustomerDetails.Special_Date);
      this.editMorningItem();
      this.editEveningItem();
      this.CustomerManageForm.updateValueAndValidity();
      if (this.CustomerDetails.SubscriptionPaused !== undefined && this.CustomerDetails.SubscriptionPaused === true) {
         this.CustomerManageForm.controls.Morning_Subscription.disable();
         this.CustomerManageForm.controls.Evening_Subscription.disable();
      }
   }


   onUpdate() {
      this.CustomerManageForm.updateValueAndValidity();
      let FormValid = true;
      Object.keys(this.CustomerManageForm.controls).map(obj => {
         const FControl = this.CustomerManageForm.controls[obj] as FormControl;
         if (FControl.status === 'INVALID') {
            FormValid = false;
         }
      });
      this.FormUploading = true;
      if (FormValid) {
         this.CustomerService.CustomerDetails_Update(this.CustomerManageForm.getRawValue()).subscribe(response => {
            this.FormUploading = false;
            if (response.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Details Successfully Updated!' });
               this.router.navigate(['/customer-management/customer-records']);
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
            }
         });
      } else {
         Object.keys(this.CustomerManageForm.controls).map(obj => {
            const FControl = this.CustomerManageForm.controls[obj];
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
         const FormArrKeys = ['Special_Date', 'Morning', 'Evening'];
         FormArrKeys.map(Obj => {
            const FArray = this.CustomerManageForm.controls[Obj] as FormArray;
            FArray.controls.map(ObjOne => {
               const FGroup = ObjOne as FormGroup;
               Object.keys(FGroup.controls).map(obj => {
                  const FControl = FGroup.controls[obj];
                  if (FControl.invalid) {
                     FControl.markAsTouched();
                     FControl.markAsDirty();
                  }
               });
            });
         });
         const firstElementWithError = document.querySelector('.YesOrNoButton.ng-invalid, .mat-form-field.ng-invalid, .mat-select-invalid.ng-invalid ');
         if (firstElementWithError) {
            window.scrollTo({ top: firstElementWithError.parentElement.getBoundingClientRect().top + window.scrollY - 60, left: 0, behavior: 'smooth' });
         }
      }
   }

   //  validation

   CustomValidation(Condition: any): ValidatorFn {
      if (Condition === 'AlphaNumeric') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.AlphaNumeric.test(control.value)) {
               return { AlphaNumericError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphaNumericSpaceHyphen') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.AlphaNumericSpaceHyphen.test(control.value)) {
               return { AlphaNumericSpaceHyphenError: true };
            }
            return null;
         };
      }
      if (Condition === 'Alphabets') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.Alphabets.test(control.value)) {
               return { AlphabetsError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphabetsSpaceHyphen') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphen.test(control.value)) {
               return { AlphabetsSpaceHyphenError: true };
            }
            return null;
         };
      }
      if (Condition === 'AlphabetsSpaceHyphenDot') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphenDot.test(control.value)) {
               return { AlphabetsSpaceHyphenDotError: true };
            }
            return null;
         };
      }
      if (Condition === 'Numerics') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
               return { NumericsError: true };
            }
            return null;
         };
      }
      if (Condition === 'NumericDecimal') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.NumericDecimal.test(control.value)) {
               return { NumericDecimalError: true };
            }
            return null;
         };
      }
      if (Condition === 'MobileNumeric') {
         return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== '' && control.value !== null && !this.MobileNumeric.test(control.value)) {
               return { MobileNumericError: true };
            }
            return null;
         };
      }
   }

   GetFormControlErrorMessage(KeyName: any) {
      const FControl = this.CustomerManageForm.get(KeyName) as FormControl;
      if (FControl.invalid && FControl.touched) {
         const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
         if (ErrorKeys.length > 0) {
            let returnText = '';
            if (ErrorKeys.indexOf('required') > -1) {
               returnText = 'This field is required';
            } else if (ErrorKeys.indexOf('min') > -1) {
               returnText = 'Enter the value should be more than or equal' + FControl.errors.min.min;
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

   GetFormControlArrayErrorMessage(ArrName: any, idx: any, KeyName: any) {
      const FArray = this.CustomerManageForm.controls[ArrName] as FormArray;
      const FGroup = FArray.controls[idx] as FormGroup;
      const FControl = FGroup.get(KeyName) as FormControl;
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

import { Component, OnInit, ViewChild, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { OrderManagementService } from '../../../services/order-management/order-details/order-management.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalApprovedComponent } from '../../Modals/modal-approved/modal-approved.component';
import { ModalCurrentorderViewComponent } from '../../Modals/modal-currentorder-view/modal-currentorder-view.component';
import { DeliveryService } from '../../../services/deliveryline/delivery.service';
import { AttendanceDetailsService } from '../../../services/attendance-management/attendance-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-order-records',
  templateUrl: './current-order-records.component.html',
  styleUrls: ['./current-order-records.component.css']
})
export class CurrentOrderRecordsComponent implements OnInit {
   @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
   @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
   @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;
   UserInfo: any;

   UpcomingOrderDetails: any[] = [];
   SampleDetails: any[] = [];
   PageLoader = true;
   CurrentIndex = 1;

   THeaders: any[] = [{Key: 'Customer_Name', ShortKey: 'Customer_Name', Name: 'Customer', If_Short: false, Condition: ''},
                        { Key: 'Mobile_Number', ShortKey: 'Mobile_Number', Name: 'Mobile', If_Short: false, Condition: '' },
                        { Key: 'Address', ShortKey: 'Address', Name: 'Address', If_Short: false, Condition: '' },
                        { Key: 'Orders', ShortKey: 'Orders', Name: 'Total Orders', If_Short: false, Condition: '' },
                        { Key: 'ValidSubscription', ShortKey: 'ValidSubscription', Name: 'Subscription', If_Short: false, Condition: '' } ];

   modalReference: BsModalRef;
   UnProcessableOrders = 0;
   DeliveryList: any[] = [];
   PresentedPersons: any[] = [];
   AssignedPersons: any[] = [];
   ActiveDeliverLine: any;
   ActiveDeliverPerson: any;
   AssignedActivePerson: any;
   OrderAssignFGroup: FormGroup;
   AssignedArray: FormArray;
   isVisible = false;
   OrderAssignStage = 'StageOne';
   ActivePresentDeliverPerson: any;
   Uploading = false;
   ValidAndUnValid: any[] = [{Name: 'All', Key: 'All' },
                             {Name: 'Valid', Key: 'Valid' },
                             { Name: 'InValid', Key: 'UnValid' }];
   VerifiedOrder = true;

   OrderGenerateInProgress = false;

   constructor(   private OrderService: OrderManagementService,
                  private renderer: Renderer2,
                  private Toastr: ToastrService,
                  public ModalService: BsModalService,
                  private LoginService: LoginManageService,
                  private Delivery_Service: DeliveryService,
                  private AttendanceService: AttendanceDetailsService,
                  public router: Router
               ) {
                  this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
                  this.DeliveryLine_Loader();
               }

   ngOnInit() {
      this.OrderAssignFGroup = new FormGroup({
         DeliveryLine: new FormControl('', Validators.required),
         User: new FormControl(this.UserInfo._id, Validators.required),
         DeliverPersons: new FormControl(null, Validators.required),
         SelectAll: new FormControl(false),
         AssignedArray: new FormArray([])
      });

      console.log(`OrderAssignFGroupOrderAssignFGroupOrderAssignFGroup`, this.OrderAssignFGroup);
      
      this.AttendanceService.TodayPresent_DeliveryPersons({ User: this.UserInfo._id }).subscribe(responseNew => {
         if (responseNew.Status) {
            this.PresentedPersons = responseNew.Response;
         }
      });
   }

   DeliveryLine_Loader() {
      this.Delivery_Service.SessionBased_DeliveryLines({User: this.UserInfo._id}).subscribe(response => {
         if (response.Status && response.Status === true ) {
               this.DeliveryList = response.Response;
               if (this.DeliveryList.length > 0) {
                  this.ActiveDeliverLine = this.DeliveryList[0];
                  this.Service_Loader();
               } else {
                  this.router.navigate(['/order-management/order-records']);
               }
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
               if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery Line Records Getting Error!, But not Identify!' });
         }
      });
   }

   Service_Loader() {
      if (this.ActiveDeliverLine !== undefined) {
         const Data = {
            User: this.UserInfo._id,
            DeliveryLine: this.ActiveDeliverLine._id,
         };
         this.TableLoader();
         this.UnProcessableOrders = 0;
         this.OrderService.Today_Orders(Data).subscribe(response => {
            this.PageLoader = false;
            if (response.Status && response.Status === true) {
               this.SampleDetails = response.SampleOrders;
               this.UpcomingOrderDetails = response.Response;
               this.ActiveDeliverPerson = response.DeliveryPerson;
               this.UpcomingOrderDetails = this.UpcomingOrderDetails.map(obj => {
                  obj.ExpandClass = false;
                  if (!obj.ValidSubscription) {
                     this.UnProcessableOrders = this.UnProcessableOrders + 1;
                  }
                  return obj;
               });

               setTimeout(() => {
                  this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
               }, 10);
            } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
               if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
                  response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Today Orders Getting Error!, But not Identify!' });
            }
         });
      }
   }

   CheckOrderGenerate() {
      if (this.UpcomingOrderDetails.length > 0 || this.SampleDetails.length > 0) {
         const CurSession = new Date().getHours() < 12 ? 'Morning' : 'Evening';
         if (this.ActiveDeliverPerson !== undefined
            && this.ActiveDeliverPerson !== null
            && this.ActiveDeliverPerson.DeliveryPersonAttendance !== undefined
            && this.ActiveDeliverPerson.DeliveryPersonAttendance !== null
            && this.ActiveDeliverPerson.DeliveryPersonAttendance[CurSession] === true) {
               return 'Continue';
         } else {
            return 'AssignAndContinue';
         }
      } else {
         return 'Invalid';
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

   ChangeDeliveryLine(idx: any) {
      this.ActiveDeliverLine = this.DeliveryList[idx];
      this.Service_Loader();
   }

   ChangeValidORUnValid(CheckValidOrUnValid) {
      if (CheckValidOrUnValid === 'Valid') {
         if (this.ActiveDeliverLine !== undefined) {
            this.VerifiedOrder = false;
            const Data = {
               User: this.UserInfo._id,
               DeliveryLine: this.ActiveDeliverLine._id,
            };
            this.TableLoader();
            this.UnProcessableOrders = 0;
            this.OrderService.Today_Orders(Data).subscribe(response => {
               this.PageLoader = false;
               if (response.Status && response.Status === true) {
                  const ValidArr = [];
                  response.Response.map(Obj => {
                     if (Obj.ValidSubscription === true) {
                        const validOrder = Obj.VilfreshMoney_Limit;
                        Obj.Orders.map(obj => {
                           if (validOrder > obj.Payable_Amount) {
                              return obj;
                           }
                        });
                        ValidArr.push(Obj);
                     }
                  });

                  this.UpcomingOrderDetails = ValidArr;

                  setTimeout(() => {
                     this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
                  }, 10);
               } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
                  if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
                     response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
                  }
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Today Orders Getting Error!, But not Identify!' });
               }
            });
         }
      } else if (CheckValidOrUnValid === 'UnValid') {
         if (this.ActiveDeliverLine !== undefined) {
            this.VerifiedOrder = false;
            const Data = {
               User: this.UserInfo._id,
               DeliveryLine: this.ActiveDeliverLine._id,
            };
            this.TableLoader();
            this.UnProcessableOrders = 0;
            this.OrderService.Today_Orders(Data).subscribe(response => {
               this.PageLoader = false;
               if (response.Status && response.Status === true) {
                  const ValidArr = [];
                  response.Response.map(Obj => {
                     if (Obj.ValidSubscription === false) {
                        const validOrder = Obj.VilfreshMoney_Limit;
                        Obj.Orders.map(obj => {
                           if (validOrder < obj.Payable_Amount) {
                              return obj;
                           }
                        });
                        ValidArr.push(Obj);
                     }
                  });
                  this.UpcomingOrderDetails = ValidArr;
                  setTimeout(() => {
                     this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
                  }, 10);
               } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
                  if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
                     response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
                  }
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Today Orders Getting Error!, But not Identify!' });
               }
            });
         }
      } else {
         if (this.ActiveDeliverLine !== undefined) {
            this.VerifiedOrder = true;
            const Data = {
               User: this.UserInfo._id,
               DeliveryLine: this.ActiveDeliverLine._id,
            };
            this.TableLoader();
            this.UnProcessableOrders = 0;
            this.OrderService.Today_Orders(Data).subscribe(response => {
               this.PageLoader = false;
               if (response.Status && response.Status === true) {
                  this.UpcomingOrderDetails = response.Response;
                  setTimeout(() => {
                     this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
                  }, 10);
               } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
                  if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
                     response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
                  }
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Today Orders Getting Error!, But not Identify!' });
               }
            });
         }
      }
   }

   openSampleModal(template: TemplateRef<any>) {
      this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
   }

   ViewUpcomingOrders(index: any, order: any) {
      const initialState = {
         Info: this.UpcomingOrderDetails[index],
         OrderInfo: this.UpcomingOrderDetails[index].Orders[order]
      };
      this.modalReference = this.ModalService.show(ModalCurrentorderViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
         if (response.Status) {
            this.UpcomingOrderDetails[index] = response.Response;
         }
      });
   }


   OrderGenerate() {
      if (this.OrderGenerateInProgress === false) {
         this.OrderGenerateInProgress = true;
         const DeliveryPerson = this.ActiveDeliverPerson !== null && this.ActiveDeliverPerson !== undefined ? this.ActiveDeliverPerson.DeliveryPerson_Name : '';
         const initialState = {
            Icon : 'verified_user',
            ColorCode : 'success',
            TextOne : 'You Want to',
            TextTwo : '',
            TextThree : 'Confirm the Orders, <br> This Orders are Assigned to the Delivery Person: <b>' + DeliveryPerson + '</b>',
         };
         this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn'} ));
         this.modalReference.content.onClose.subscribe(response => {
            if (this.OrderGenerateInProgress === true ) {
               if (response.Status) {
                  const Data = {
                     User: this.UserInfo._id,
                     DeliveryLine: this.ActiveDeliverLine._id,
                  };
                  this.OrderService.Confirm_TodayOrders(Data).subscribe(responseNew => {
                     if (responseNew.Status) {
                        this.DeliveryLine_Loader();
                        this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Orders Confirmed Successfully' });
                      }
							 this.OrderGenerateInProgress = false;
                  });
               } else {
						this.OrderGenerateInProgress = false;
					}
            }
         });
      }
   }


   OrderAssign(template: TemplateRef<any>) {
      this.OrderAssignFGroup.controls.DeliveryLine.setValue(this.ActiveDeliverLine._id);
      this.OrderAssignFGroup.controls.DeliverPersons.setValue(null);
      this.OrderAssignFGroup.controls.SelectAll.setValue(false);
      const FArray = this.OrderAssignFGroup.get('AssignedArray') as FormArray;
      while (0 !== FArray.length) { FArray.removeAt(0); }
      this.OrderAssignStage = 'StageOne';
      const OrdersList = [];
      this.UpcomingOrderDetails.map(obj => {
         if (!(obj.ValidSubscription === false && obj.Orders.length === 1)) {
            OrdersList.push({
               _id: obj._id,
               Customer_Name: obj.Customer_Name,
               Address: obj.Address,
               Mobile_Number: obj.Mobile_Number
            });
         }
      });
      this.SampleDetails.map(obj => {
         OrdersList.push({
            _id: obj._id,
            Customer_Name: obj.Customer_Name,
            Address: obj.Address,
            Mobile_Number: obj.Mobile_Number
         });
      });
      OrdersList.map(obj => {
         const NewFGroup = new FormGroup({
            _id: new FormControl(obj._id, Validators.required),
            Customer_Name: new FormControl(obj.Customer_Name),
            Address: new FormControl(obj.Address),
            Mobile_Number: new FormControl(obj.Mobile_Number),
            DeliverPersonCheck: new FormControl(false),
            DeliverPerson: new FormControl(null)
         });
         FArray.push(NewFGroup);
      });
      this.modalReference = this.ModalService.show(template, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
   }

   GetAssignedArray() {
      const FArray = this.OrderAssignFGroup.get('AssignedArray') as FormArray;
      return FArray.controls;
   }


   MoveStageTwo() {
      const Value =  this.OrderAssignFGroup.controls.DeliverPersons.value;
      this.AssignedPersons = [];
      this.AssignedActivePerson = undefined;
      if (typeof Value === 'object' && Value.length > 0) {
         this.OrderAssignStage = 'StageTwo';
         this.AssignedPersons = Value;
         this.AssignedActivePerson = this.AssignedPersons[0];
         const FArray = this.OrderAssignFGroup.get('AssignedArray') as FormArray;
         FArray.controls.map(Obj => {
            const FGroup = Obj as FormGroup;
            FGroup.controls.DeliverPersonCheck.setValidators(Validators.required);
            FGroup.controls.DeliverPersonCheck.markAsDirty();
            FGroup.controls.DeliverPersonCheck.markAsTouched();
            FGroup.controls.DeliverPersonCheck.updateValueAndValidity();

            FGroup.controls.DeliverPerson.setValidators(Validators.required);
            FGroup.controls.DeliverPerson.markAsDirty();
            FGroup.controls.DeliverPerson.markAsTouched();
            FGroup.controls.DeliverPerson.updateValueAndValidity();
         });
      }
   }

   ChangeAssignedActivePerson(idx: any) {
      this.AssignedActivePerson = this.AssignedPersons[idx];
   }

   AllSelect() {
      if (this.OrderAssignFGroup.get('SelectAll').value === true) {
         const FArray = this.OrderAssignFGroup.get('AssignedArray') as FormArray;
         FArray.controls.map((Obj, idx)=> {
            const FGroup = Obj as FormGroup;
            FGroup.controls.DeliverPersonCheck.setValue(true);
            this.SetActivePersonToCustomer(idx);
         })
      }
   }

   SetActivePersonToCustomer(idx: any) {
      const FArray = this.OrderAssignFGroup.get('AssignedArray') as FormArray;
      const FGroup = FArray.controls[idx] as FormGroup;
      if (FGroup.controls.DeliverPersonCheck.value === true) {
         FGroup.controls.DeliverPerson.setValue(this.AssignedActivePerson);
      } else {
         FGroup.controls.DeliverPerson.setValue(null);
         this.OrderAssignFGroup.get('SelectAll').setValue(null);
      }
   }

   SubmitAndAssign() {
      this.OrderGenerateInProgress = true;
      this.Uploading = true;
      const Data = {
         User: this.UserInfo._id,
         DeliveryLine: this.ActiveDeliverLine._id,
         DeliverPersons: this.OrderAssignFGroup.getRawValue().DeliverPersons,
         AssignedArray: this.OrderAssignFGroup.getRawValue().AssignedArray
      };
      this.OrderService.Confirm_TodayOrders_WithAssign(Data).subscribe(responseNew => {
         if (responseNew.Status) {
            this.DeliveryLine_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Orders Confirmed Successfully' });
            this.modalReference.hide();
          }
          this.Uploading = false;
          this.OrderGenerateInProgress = false;
      });
   }



}

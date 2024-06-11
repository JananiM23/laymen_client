import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { DeliveryPersonDetailsService } from '../../../services/Deliveryboy-Management/delivery-person-details.service';
import { ToastrService } from '../../../services/common-services/toastr.service';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { AttendanceDetailsService } from '../../../services/attendance-management/attendance-details.service';
import { DeliveryService } from 'src/app/services/deliveryline/delivery.service';

@Component({
  selector: 'app-modal-attendance',
  templateUrl: './modal-attendance.component.html',
  styleUrls: ['./modal-attendance.component.css']
})
export class ModalAttendanceComponent implements OnInit {

  AttendanceForm: FormGroup;
  UserInfo: any;
  DeliveryBoyList: any[] = [];
  CurrDate: Date;
  Session: any;
  AttendanceDetails: FormArray;
  LaterDeliveryBoyList: any[] = [];
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  AttendanceDetailsCancel: FormArray;
  LaterIndex: any;
  ActiveLaterDeliveryPerson: any;
  DeliveryLine_List: any;
  constructor(private DeliveryboyService: DeliveryPersonDetailsService,
    private LoginService: LoginManageService,
    public modalRef: BsModalRef,
    private AttendanceService: AttendanceDetailsService,
    private Delivery_Service: DeliveryService,
    public Toastr: ToastrService) {
    this.CurrDate = new Date();
    this.Session = new Date().getHours() >= 12 ? 'Evening' : 'Morning';
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());

  }

  ngOnInit() {
    this.onClose = new Subject();

    this.AttendanceForm = new FormGroup({
      User: new FormControl(this.UserInfo._id),
      AttendanceDetails: new FormArray([]),
      AttendanceDetailsCancel: new FormArray([])
    });
    this.DeliveryboyService.Deliveryboy_List({ Region: this.UserInfo.Region, Session: this.Session}).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.DeliveryBoyList = response.Response;
        this.DeliveryBoyList.map(obj => {
          const NewFGroup = new FormGroup({
            DeliveryPersonId: new FormControl(obj.DeliveryPersonId, Validators.required),
            DeliveryLineId: new FormControl(obj.DeliveryLineId, Validators.required),
            DeliveryLine_Name: new FormControl(obj.DeliveryLine_Name, Validators.required),
            DeliveryPerson_Name: new FormControl(obj.DeliveryPerson_Name),
            DeliveryLine_Session: new FormControl(obj.DeliveryLine_Session),
            DeliveryPersonOdooId: new FormControl(obj.DeliveryPersonOdooId),
            Session: new FormControl(this.Session),
            Present: new FormControl(true),
          });
          const FArray = this.AttendanceForm.get('AttendanceDetails') as FormArray;
          FArray.push(NewFGroup);
        });
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery boy Records Getting Error!, But not Identify!' });
      }
    });
  }

  getFArray(): FormArray {
    return this.AttendanceForm.get('AttendanceDetails') as FormArray;
  }

  getAttendanceFArray(): FormArray {
    return this.AttendanceForm.get('AttendanceDetailsCancel') as FormArray;
  }



  DeliveryAttendanceCancel(LaterPerson: any, i) {
    this.AttendanceDetailsCancel = this.AttendanceForm.get('AttendanceDetailsCancel') as FormArray;
    this.AttendanceDetails = this.AttendanceForm.get('AttendanceDetails') as FormArray;
    this.AttendanceDetails.removeAt(i);
    const NewFGroup = new FormGroup({
      DeliveryPersonId: new FormControl(LaterPerson.value.DeliveryPersonId, Validators.required),
      DeliveryLineId: new FormControl(LaterPerson.value.DeliveryLineId, Validators.required),
      DeliveryLine_Name: new FormControl(LaterPerson.value.DeliveryLine_Name, Validators.required),
      DeliveryPerson_Name: new FormControl(LaterPerson.value.DeliveryPerson_Name),
      DeliveryLine_Session: new FormControl(LaterPerson.value.DeliveryLine_Session),
      DeliveryPersonOdooId: new FormControl(LaterPerson.value.DeliveryPersonOdooId),
      Present: new FormControl(true),
    });
    this.AttendanceDetailsCancel.push(NewFGroup);
  }


  onSubmit() {
    if (this.Type === 'Create') {
      this.Submit();
    }
  }



  LateDeliveryPersonAdd(Attendance: any, i) {
      this.AttendanceDetails = this.AttendanceForm.get('AttendanceDetails') as FormArray;
      this.AttendanceDetailsCancel = this.AttendanceForm.get('AttendanceDetailsCancel') as FormArray;
      const NewFGroup = new FormGroup({
        DeliveryPersonId: new FormControl(Attendance.value.DeliveryPersonId, Validators.required),
        DeliveryLineId: new FormControl(Attendance.value.DeliveryLineId, Validators.required),
        DeliveryLine_Name: new FormControl(Attendance.value.DeliveryLine_Name, Validators.required),
        DeliveryPerson_Name: new FormControl(Attendance.value.DeliveryPerson_Name),
        DeliveryLine_Session: new FormControl(Attendance.value.DeliveryLine_Session),
        DeliveryPersonOdooId: new FormControl(Attendance.value.DeliveryPersonOdooId),
        Present: new FormControl(true),
      });
      this.AttendanceDetailsCancel.removeAt(i);
      this.AttendanceDetails.push(NewFGroup);
  }


  Submit() {
    this.AttendanceForm.updateValueAndValidity();
    const firstElementWithError = document.querySelector('.YesOrNoButton.ng-invalid, .mat-form-field.ng-invalid, .mat-select-invalid.ng-invalid .mat-checkbox.ng-invalid');
    if (firstElementWithError) {
      window.scrollTo({ top: firstElementWithError.parentElement.getBoundingClientRect().top + window.scrollY - 60, left: 0, behavior: 'smooth' });
    }
    let FormValid = true;
    Object.keys(this.AttendanceForm.controls).map(obj => {
      const FControl = this.AttendanceForm.controls[obj] as FormControl;
      if (FControl.status === 'INVALID') {
        FormValid = false;
      }
    });
    const Data = this.AttendanceForm.getRawValue();
    Data.AttendanceDetails = Data.AttendanceDetails.map(obj => {
      delete obj.DeliveryLine_Name;
      delete obj.DeliveryPerson_Name;
      return obj;
    });
    if (FormValid) {
      this.AttendanceService.Deliveryboy_Attendance(Data).subscribe(response => {
        if (response.Status) {
          this.onClose.next({ Status: true });
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Attendance Generated Successfully!' });
        }
        this.modalRef.hide();

      });
    } else {
      Object.keys(this.AttendanceForm.controls).map(obj => {
        const FControl = this.AttendanceForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }


}

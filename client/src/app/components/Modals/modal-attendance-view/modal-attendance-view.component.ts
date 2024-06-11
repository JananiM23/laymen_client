import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { MatDatepickerInputEvent } from '@angular/material';
import { AttendanceDetailsService } from '../../../services/attendance-management/attendance-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
// import { FormControl } from '@angular/forms';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';


import {NativeDateAdapter} from '@angular/material';
import {DateAdapter} from '@angular/material/core';
export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
       const month = date.toLocaleString('en-us', { month: 'short' });
       const year = date.getFullYear();
       return `${month} ${year}`;
   }
}
import {MatDatepicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-modal-attendance-view',
  templateUrl: './modal-attendance-view.component.html',
  styleUrls: ['./modal-attendance-view.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
  encapsulation: ViewEncapsulation.None
})
export class ModalAttendanceViewComponent implements OnInit {
  events: string[] = [];

  onClose: Subject<any>;
  Info: any;
  Type: any;
  Date: any;
  UserInfo: any;
  DeliveryPersonId: any;
  Attendance_List: any[] = [];
  MonthFor: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  maxDate: Date = new Date();
  From: Date;
  To: Date;
  Valid = false;

  constructor(public modalRef: BsModalRef,
              private LoginService: LoginManageService,
              private AttendanceService: AttendanceDetailsService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
   }

  ngOnInit() {
    this.From = new Date(this.MonthFor.getFullYear(), this.MonthFor.getMonth(), 1);
    this.To = new Date(this.MonthFor.getFullYear(), this.MonthFor.getMonth() + 1, 1);
    this.Monthfilter();
  }

  MonthChange() {
    this.From = new Date(this.MonthFor.getFullYear(), this.MonthFor.getMonth(), 1);
    this.To = new Date(this.MonthFor.getFullYear(), this.MonthFor.getMonth() + 1, 1);
    this.Monthfilter();
 }

 chosenMonthHandler(event, datepicker: MatDatepicker<any>) {
  this.MonthFor = event;
  datepicker.close();
}

  Monthfilter() {
      // this.DeliveryPersonId = this.CollectionDetails;

      this.AttendanceService.Attendance_List({ DeliveryPersonId: this.DeliveryPersonId, From: this.From, To: this.To }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.Attendance_List = response.Response;
        } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
          if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
          }
        } else {
          console.log('err');
          // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery boy Records Getting Error!, But not Identify!' });
        }
      });
  }

}

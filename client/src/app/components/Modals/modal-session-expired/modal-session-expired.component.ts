import { Component, OnInit } from '@angular/core';
// import { SocketManagementService } from './../../../services/socket-management/socket-management.service';
import { LoginManageService } from './../../../services/login-management/login-manage.service';
import { BsModalRef } from 'ngx-bootstrap';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from '../../../services/common-services/toastr.service';


import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
@Component({
  selector: 'app-modal-session-expired',
  templateUrl: './modal-session-expired.component.html',
  styleUrls: ['./modal-session-expired.component.css']
})
export class ModalSessionExpiredComponent implements OnInit {


  onClose: Subject<any>;

  LoginForm: FormGroup;

  UserData = CryptoJS.AES.decrypt(localStorage.getItem('Session'), localStorage.getItem('SessionKey').slice(3, 10)).toString(CryptoJS.enc.Utf8);
  constructor(public LoginService: LoginManageService,
            //   public Socket: SocketManagementService,
              public ModalRef: BsModalRef,
              public Toastr: ToastrService) { }

  ngOnInit() {
    this.UserData = JSON.parse(this.UserData);
    this.onClose = new Subject();
    this.LoginForm = new FormGroup({
       UpdateKey: new FormControl(localStorage.getItem('SessionKey'), Validators.required),
       User_Name: new FormControl(this.UserData.User_Name, Validators.required),
       User_Password: new FormControl('', Validators.required),
    });
 }

 GoToLogin() {
    this.onClose.next({Status: false});
    this.ModalRef.hide();
 }

 Login() {
    if (this.LoginForm.valid) {
       this.LoginService.User_login(this.LoginForm.getRawValue()).subscribe(response => {
          if (response.Status) {
             const UserData  = CryptoJS.AES.decrypt(response.Response, response.Key.slice(3, 10)).toString(CryptoJS.enc.Utf8);
             localStorage.setItem('Session', response.Response);
             localStorage.setItem('SessionKey', response.Key);
             localStorage.setItem('SessionVerify', btoa(Date()));
            //  this.Socket.Handling('Register');
             this.onClose.next({Status: true});
             this.ModalRef.hide();
             this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Session Renewed Successfully!' });
          } else {
				localStorage.clear();
             if (response.Message === undefined || response.Message === '' || response.Message === null) {
                response.Message = 'Some Error Occoured!, But not Identified.';
             }
             this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
             this.onClose.next({Status: false});
             this.ModalRef.hide();
          }
       });
    } else {
       this.LoginForm.controls.User_Name.markAsTouched();
       this.LoginForm.controls.User_Name.markAsDirty();
       this.LoginForm.controls.User_Password.markAsTouched();
       this.LoginForm.controls.User_Password.markAsDirty();
    }
 }
}


